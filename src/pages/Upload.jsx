import React from "react";
import { useEffect, useMemo, useState } from "react";
import { getCategories, uploadChunk, finalizeUpload, me } from "../lib/api";
import { getUserCache } from "../lib/auth";

const CHUNK_SIZE = 512 * 1024; // 512KB

export default function Upload(){
  const [cats, setCats] = useState([]);
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [language, setLanguage] = useState("telugu");
  const [releaseRights, setReleaseRights] = useState("creator");
  const [mediaType, setMediaType] = useState("audio");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState("");

  const totalChunks = useMemo(()=> file ? Math.ceil(file.size / CHUNK_SIZE) : 0, [file]);

  useEffect(()=>{ (async()=>{
    const [c,u] = await Promise.all([getCategories(), me()]);
    setCats(c); setUser(u); if(c?.[0]?.id) setCategoryId(c[0].id);
  })(); },[]);

  const onPick = (e) => setFile(e.target.files?.[0] || null);

  const startUpload = async () => {
    if(!file || !user || !categoryId) return;
    setBusy(true); setMsg(""); setProgress(0);
    const upload_uuid = crypto?.randomUUID ? crypto.randomUUID() : String(Date.now());
    try{
      const filename = file.name;
      const chunkCount = Math.ceil(file.size / CHUNK_SIZE);

      // 1) upload all chunks
      for(let i=0;i<chunkCount;i++){
        const start = i * CHUNK_SIZE, end = Math.min(start + CHUNK_SIZE, file.size);
        const blob = file.slice(start, end);
        await uploadChunk({ file: blob, filename, chunk_index: i, total_chunks: chunkCount, upload_uuid });
        setProgress(Math.round(((i+1)/chunkCount)*100));
      }

      // 2) finalize upload → create record
      const record = await finalizeUpload({
        title, description: desc, category_id: categoryId, user_id: user.id,
        media_type: mediaType, upload_uuid, filename: file.name, total_chunks: chunkCount,
        latitude: null, longitude: null, release_rights: releaseRights, language,
        use_uid_filename: false
      });
      setMsg(`✅ Uploaded! Record UID: ${record?.uid || record?.id || "created"}`);
      setFile(null); setProgress(0);
    }catch(e){
      setMsg("❌ " + (e?.response?.data?.detail || e.message));
    }finally{ setBusy(false); }
  };

  return (
    <div className="container">
      <h1 className="section-title">Upload</h1>
      <div className="card">
        <div className="stack">
          <div className="field">
            <label className="label">Title</label>
            <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Short title" />
          </div>

          <div className="field">
            <label className="label">Description (optional)</label>
            <textarea className="textarea" value={desc} onChange={e=>setDesc(e.target.value)}/>
          </div>

          <div className="row">
            <div className="field" style={{minWidth:220,flex:1}}>
              <label className="label">Category</label>
              <select className="select" value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
                {cats.map(c => <option key={c.id} value={c.id}>{c.title || c.name}</option>)}
              </select>
            </div>

            <div className="field" style={{minWidth:180}}>
              <label className="label">Language</label>
              <select className="select" value={language} onChange={e=>setLanguage(e.target.value)}>
                {["assamese","bengali","bodo","dogri","gujarati","hindi","kannada","kashmiri","konkani","maithili","malayalam","marathi","meitei","nepali","odia","punjabi","sanskrit","santali","sindhi","tamil","telugu","urdu"].map(l =>
                  <option key={l} value={l}>{l}</option>
                )}
              </select>
            </div>

            <div className="field" style={{minWidth:180}}>
              <label className="label">Media Type</label>
              <select className="select" value={mediaType} onChange={e=>setMediaType(e.target.value)}>
                {["text","audio","video","image","document"].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="field" style={{minWidth:200}}>
              <label className="label">Release Rights</label>
              <select className="select" value={releaseRights} onChange={e=>setReleaseRights(e.target.value)}>
                {["creator","family_or_friend","downloaded","NA"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="label">Choose file</label>
            <input className="input" type="file" onChange={onPick} />
          </div>

          <div className="row">
            <button className="btn btn-primary" onClick={startUpload} disabled={busy || !file || !title || !categoryId}>
              {busy ? "Uploading..." : "Upload"}
            </button>
            {progress>0 && <span className="chip">Progress: {progress}%</span>}
            {msg && <span className="chip">{msg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
