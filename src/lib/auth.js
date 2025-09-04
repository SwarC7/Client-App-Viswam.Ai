const KEY = "corpus.token";
const USER_KEY = "corpus.user";

export function saveToken(tokenResponse){
  // tokenResponse = { access_token, user_id?, phone_number? ...}
  if(tokenResponse?.access_token){
    localStorage.setItem(KEY, tokenResponse.access_token);
  }
  // Keep a tiny user cache for quick access (user_id etc.)
  const u = { user_id: tokenResponse?.user_id, phone_number: tokenResponse?.phone_number };
  localStorage.setItem(USER_KEY, JSON.stringify(u));
}

export function getToken(){ return localStorage.getItem(KEY) || null; }
export function clearToken(){ localStorage.removeItem(KEY); localStorage.removeItem(USER_KEY); }
export function isAuthed(){ return !!getToken(); }
export function getUserCache(){
  try{ return JSON.parse(localStorage.getItem(USER_KEY) || "{}"); }catch{ return {}; }
}
