import React from "react";
import { useEffect, useState } from "react";
import { getUserContributions, me } from "../lib/api";

export default function Contributions(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(()=>{ (async()=>{
    try{
      const u = await me();
      const d = await getUserContributions(u.id);
      setData(d);
    }catch(e){ setErr(e?.response?.data?.detail || e.message); }
    finally{ setLoading(false); }
  })(); }, []);

  return (
    <div className="container">
      <h1 className="section-title">My Contributions</h1>
      <div className="card">
        {loading ? "Loading..." : err ? <div className="chip bad">{err}</div> : (
          <div className="stack">
            <div className="row">
              <span className="chip">Total: {data.total_contributions}</span>
              <span className="chip">Text: {data.contributions_by_media_type.text}</span>
              <span className="chip">Audio: {data.contributions_by_media_type.audio}</span>
              <span className="chip">Image: {data.contributions_by_media_type.image}</span>
              <span className="chip">Video: {data.contributions_by_media_type.video}</span>
              <span className="chip">Document: {data.contributions_by_media_type.document}</span>
            </div>
            {Array.isArray(data?.audio_contributions) && data.audio_contributions.length>0 && (
              <div>
                <h2>Recent items</h2>
                <ul>
                  {["audio_contributions","video_contributions","text_contributions","image_contributions","document_contributions"]
                    .flatMap(k => (data[k] || [])).slice(0,10)
                    .map(r => <li key={r.id}>{r.title} <span className="muted">({r.media_type || "item"})</span></li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
