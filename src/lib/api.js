import axios from "axios";
import { getToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://api.corpus.swecha.org/api/v1";

const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

api.interceptors.request.use((cfg) => {
  const t = getToken();
  if(t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

// tiny helpers
const ok = (r) => r.data;
export const apiError = (err) =>
  err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Request failed";

// ---------- AUTH (OTP) ----------
export const sendLoginOtp   = (phone_number) => api.post("/auth/login/send-otp",   { phone_number }).then(ok);
export const resendLoginOtp = (phone_number) => api.post("/auth/login/resend-otp", { phone_number }).then(ok);
export const verifyLoginOtp = (phone_number, otp_code) =>
  api.post("/auth/login/verify-otp", { phone_number, otp_code }).then(ok);

export const signupSendOtp   = (phone_number) => api.post("/auth/signup/send-otp",   { phone_number }).then(ok);
export const signupResendOtp = (phone_number) => api.post("/auth/signup/resend-otp", { phone_number }).then(ok);
export const signupVerifyOtp = (payload) => api.post("/auth/signup/verify-otp", payload).then(ok);

export const me = () => api.get("/auth/me").then(ok);

// ---------- USERS / CONTRIBUTIONS ----------
export const getUserContributions = (user_id) =>
  api.get(`/users/${user_id}/contributions`).then(ok);

// ---------- CATEGORIES ----------
export const getCategories = () => api.get("/categories/").then(ok);

// ---------- UPLOAD ----------
export async function uploadChunk({ file, upload_uuid, chunk_index, total_chunks, filename }){
  const fd = new FormData();
  fd.append("chunk", file);
  fd.append("filename", filename);
  fd.append("chunk_index", chunk_index);
  fd.append("total_chunks", total_chunks);
  fd.append("upload_uuid", upload_uuid);
  const res = await api.post("/records/upload/chunk", fd, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export async function finalizeUpload({
  title, description, category_id, user_id, media_type,
  upload_uuid, filename, total_chunks,
  latitude=null, longitude=null, release_rights, language, use_uid_filename=false
}){
  // endpoint requires x-www-form-urlencoded
  const body = new URLSearchParams({
    title, category_id, user_id, media_type, upload_uuid, filename,
    total_chunks: String(total_chunks),
    release_rights, language,
  });
  if(description) body.set("description", description);
  if(latitude !== null && latitude !== undefined) body.set("latitude", String(latitude));
  if(longitude !== null && longitude !== undefined) body.set("longitude", String(longitude));
  if(use_uid_filename) body.set("use_uid_filename", "true");

  const res = await api.post("/records/upload", body.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
  return res.data;
}
