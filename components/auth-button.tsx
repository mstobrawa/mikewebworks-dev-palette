"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthButton() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setIsAuthenticated(Boolean(data.session));
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setIsAuthenticated(Boolean(session));
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  async function signIn() {
    const email = window.prompt("Email address");
    if (!email) return;

    setLoading(true);
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    setLoading(false);
    window.alert(`Magic link sent to ${email}. Replace this with your production auth form.`);
  }

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-2">
      {isAuthenticated ? (
        <button
          type="button"
          onClick={signOut}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-muted transition hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      ) : (
        <button
          type="button"
          onClick={signIn}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink transition hover:border-white/20 hover:bg-white/10 disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </button>
      )}
    </div>
  );
}
