// src/hooks/useUser.js
import { useEffect, useState } from "react";
import { getMe } from "../lib/api";
import { getUser, saveUser } from "../lib/auth";

export default function useUser() {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(!getUser());
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const me = await getMe();
        if (!mounted) return;
        setUser(me);
        saveUser(me);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (!user) load();
    return () => { mounted = false; };
  }, []); // run once

  return { user, loading, error, setUser };
}
