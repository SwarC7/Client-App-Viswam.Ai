import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { sendLoginOtp, verifyLoginOtp, resendLoginOtp, apiError } from "../lib/api";
import { saveToken } from "../lib/auth";

export default function Login(){
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const requestOtp = async () => {
    setBusy(true); setMsg("");
    try{ await sendLoginOtp(phone.trim()); setSent(true); setMsg("OTP sent!"); }
    catch(e){ setMsg(apiError(e)); }
    finally{ setBusy(false); }
  };

  const verify = async () => {
    setBusy(true); setMsg("");
    try{
      const token = await verifyLoginOtp(phone.trim(), otp.trim());
      saveToken(token);
      nav("/profile");
    }catch(e){ setMsg(apiError(e)); }
    finally{ setBusy(false); }
  };

  return (
    <div className="container">
      <h1 className="section-title">Login</h1>
      <div className="card stack">
        <div className="field">
          <label className="label">Phone number (with +country code)</label>
          <input className="input" placeholder="+91917..." value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>
        <div className="row">
          <button className="btn btn-primary" onClick={requestOtp} disabled={!phone || busy}>Request OTP</button>
          {sent && <button className="btn" onClick={()=>resendLoginOtp(phone.trim())} disabled={busy}>Resend</button>}
        </div>
        <div className="field">
          <label className="label">Enter OTP</label>
          <input className="input" value={otp} onChange={e=>setOtp(e.target.value)} />
        </div>
        <div className="row">
          <button className="btn btn-primary" onClick={verify} disabled={!otp || !phone || busy}>Verify & Login</button>
          {msg && <span className="chip">{msg}</span>}
        </div>
        <div className="muted">New here? <Link to="/signup">Create account</Link></div>
      </div>
    </div>
  );
}
