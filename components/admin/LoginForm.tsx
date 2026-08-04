"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observeAdmin, signInAdmin } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { Messages } from "@/lib/i18n";

export function LoginForm({ messages }: { messages: Messages }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return observeAdmin((user) => {
      if (user) router.replace("/admin");
    });
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFirebaseConfigured) return;
    setState("sending");
    try {
      await signInAdmin(email.trim(), password);
      router.replace("/admin");
    } catch {
      setState("error");
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <a className="wordmark" href="/vi">
          [KAIOS]
        </a>
        <div className="login-copy">
          <p>{messages.admin.brand}</p>
          <h1>{messages.admin.loginTitle}</h1>
          <span>{messages.admin.loginBody}</span>
        </div>
        {!isFirebaseConfigured ? (
          <div className="login-warning" role="alert">
            {messages.admin.firebaseMissing}
          </div>
        ) : null}
        <form onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={!isFirebaseConfigured}
            />
          </label>
          <label className="field">
            <span>{messages.admin.password}</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={!isFirebaseConfigured}
            />
          </label>
          {state === "error" ? (
            <p className="form-status error" role="alert">
              {messages.admin.invalidLogin}
            </p>
          ) : null}
          <button
            className="button primary"
            type="submit"
            disabled={!isFirebaseConfigured || state === "sending"}
          >
            {state === "sending"
              ? messages.admin.signingIn
              : messages.admin.signIn}
          </button>
        </form>
      </section>
      <aside className="login-aside" aria-hidden="true">
        <div>
          <span />
          <span />
          <span />
        </div>
      </aside>
    </main>
  );
}
