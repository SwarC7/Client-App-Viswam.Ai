import React from "react";
import { useEffect, useState } from "react";
import { me, getCategories } from "../lib/api";

const maskPhone = (p="") => p.replace(/.(?=.{3}$)/g,"•");
const maskEmail = (e="") => { const [u,d]=e.split("@"); if(!u||!d) return e; const s=u.slice(0,2); return `${s}${u.length>2?"…":""}@${d}`; };
const fmt = (ts) => ts ? new Date(ts).toLocaleString() : "—";

export default function Profile(){
  const [user, setUser] = useState(null);
  const [cats, setCats] = useState([]);
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(()=>{ (async()=>{
    const u = await me(); setUser(u);
    try{ setCats(await getCategories()); }catch{}
  })(); },[]);

  if(!user) return (
    <div className="container"><h1 className="section-title">Profile</h1><div className="card">Loading…</div></div>
  );

  const initials = (user.name||"U").split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();

  return (
    <div className="container">
      <h1 className="section-title">Profile</h1>

      <div className="card">
        <div className="row" style={{alignItems:"flex-start"}}>
          <div style={{width:56,height:56,borderRadius:"999px",display:"grid",placeItems:"center",
            background:"linear-gradient(135deg,#60a5fa,#34d399)",color:"#fff",fontWeight:800}}>{initials}</div>
          <div className="stack" style={{flex:1}}>
            <h2 style={{margin:0}}>{user.name}</h2>
            <div className="row">
              <span className="chip">{maskEmail(user.email || "")}</span>
              <span className="chip">{maskPhone(user.phone || user.phone_number || "")}</span>
              <span className="chip ok">Consent: {user.has_given_consent ? "Yes" : "No"}</span>
            </div>
            <div className="muted">Last login: {fmt(user.last_login_at)}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Quick links</h2>
        <div className="row">
          <a className="btn btn-light" href="/upload">Upload a record</a>
          <a className="btn btn-light" href="/contributions">My contributions</a>
        </div>
      </div>

      <div className="card">
        <h2>Categories</h2>
        {cats.length===0 ? <div className="muted">No categories visible.</div> : (
          <div className="row" style={{gap:10}}>
            {cats.slice(0,8).map(c => <span className="chip" key={c.id}>{c.title || c.name}</span>)}
          </div>
        )}
      </div>

      {/* <details className="card" open={rawOpen} onToggle={e=>setRawOpen(e.target.open)}>
        <summary style={{cursor:"pointer"}}>Developer • show raw <span className="kbd">/auth/me</span> JSON</summary>
        <pre style={{marginTop:12, background:"#0f172a", color:"#e5e7eb", padding:12, borderRadius:12, overflowX:"auto"}}>
{JSON.stringify(user, null, 2)}
        </pre>
      </details> */}
    </div>
  );
}
