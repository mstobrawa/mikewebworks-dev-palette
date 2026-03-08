"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, Mail, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AuthButton() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (!supabase) {
      return;
    }

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
  }, [supabase]);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, loading]);

  function openModal() {
    setFeedback(null);
    setError(null);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (loading) return;
    setIsModalOpen(false);
  }

  async function signIn() {
    if (!supabase) return;
    if (!email) return;

    setLoading(true);
    setFeedback(null);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    setFeedback(`Magic link sent to ${email}. Check your inbox to continue.`);
    setEmail("");
  }

  async function signOut() {
    if (!supabase) return;

    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    window.location.reload();
  }

  if (!isConfigured) {
    return (
      <span className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted">
        Auth unavailable
      </span>
    );
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
          onClick={openModal}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-ink transition hover:border-white/20 hover:bg-white/10 disabled:opacity-60"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </button>
      )}

      {isModalOpen ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0b1222]/95 p-6 shadow-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/80">
                    Supabase Auth
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">
                    Sign in with a magic link
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted transition hover:border-white/20 hover:text-ink disabled:opacity-50"
                aria-label="Close sign-in modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-7 text-muted">
              Enter your email and we&apos;ll send you a secure sign-in link that opens your dashboard.
            </p>

            <form
              className="mt-6 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                void signIn();
              }}
            >
              <label className="block">
                <span className="mb-2 block text-sm text-ink">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  required
                  autoFocus
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-cyan-200/50 focus:bg-white/10"
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </p>
              ) : null}

              {feedback ? (
                <p className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
                  {feedback}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send magic link"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm text-muted transition hover:border-white/20 hover:text-ink disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
