import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupSendOtp, signupVerifyOtp, signupResendOtp, apiError } from "../lib/api";
import { saveToken } from "../lib/auth";

export default function Signup(){
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const requestOtp = async () => {
    setBusy(true); setMsg("");
    try{ await signupSendOtp(phone.trim()); setSent(true); setMsg("OTP sent!"); }
    catch(err){ setMsg(apiError(err)); }
    finally{ setBusy(false); }
  };

  const verify = async () => {
    setBusy(true); setMsg("");
    try{
      const token = await signupVerifyOtp({
        phone_number: phone.trim(), otp_code: otp.trim(),
        name: name.trim(), email: email.trim() || null, password,
        has_given_consent: consent
      });
      saveToken(token);
      nav("/profile");
    }catch(err){ setMsg(apiError(err)); }
    finally{ setBusy(false); }
  };

  return (
    <div className="container">
      <h1 className="section-title">Sign Up</h1>
      <div className="card stack">
        <div className="field"><label className="label">Full name</label><input className="input" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div className="field"><label className="label">Email (optional)</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div className="field"><label className="label">Phone number</label><input className="input" placeholder="+91917..." value={phone} onChange={e=>setPhone(e.target.value)} /></div>
        <div className="field"><label className="label">Password</label><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <div className="row">
          <button className="btn btn-primary" onClick={requestOtp} disabled={!phone || busy}>Request OTP</button>
          {sent && <button className="btn" onClick={()=>signupResendOtp(phone.trim())} disabled={busy}>Resend</button>}
        </div>
        <div className="field"><label className="label">Enter OTP</label><input className="input" value={otp} onChange={e=>setOtp(e.target.value)} /></div>
        <label className="row" style={{cursor:'pointer'}}>
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
          <span className="muted">I give consent to process my data for this project.</span>
        </label>
        <div className="row">
          <button className="btn btn-primary" onClick={verify} disabled={!otp || !consent || busy}>Verify & Create Account</button>
          {msg && <span className="chip">{msg}</span>}
        </div>
        <div className="muted">Already have an account? <Link to="/login">Log in</Link></div>
      </div>
    </div>
  );
}
