import { useEffect, useState, useCallback, useRef } from "react";

export default function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("sf_token");
  });

  const hasExchanged = useRef(false);

  // Wrap in useCallback so the reference is stable
  const logout = useCallback(() => {
    localStorage.removeItem("sf_token");
    localStorage.removeItem("sf_instance");
    sessionStorage.removeItem("pkce_verifier");
    setToken(null);
    window.location.href = "/";
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    // 1. If no code, or already logged in, or ALREADY exchanging, STOP.
    if (!code || token || hasExchanged.current) return;

    const verifier = sessionStorage.getItem("pkce_verifier");

    // 2. Lock it immediately
    hasExchanged.current = true;

    fetch("http://localhost:4000/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, code_verifier: verifier })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.access_token) return;
        
        localStorage.setItem("sf_token", data.access_token);
        localStorage.setItem("sf_instance", data.instance_url);
        setToken(data.access_token);

        // Clean URL without triggering a full page reload
        window.history.replaceState({}, document.title, "/");
      })
      .catch(err => {
        console.error("OAuth Error:", err);
        // If it fails, unlock so user can try again, or logout
        hasExchanged.current = false;
        logout(); 
      });
  }, [token, logout]); // logout is a dependency here because it's used in the catch block

  return { token, logout };
}