"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observeAdmin } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { Messages } from "@/lib/i18n";

export function AdminAuthGuard({
  children,
  messages,
}: {
  children: React.ReactNode;
  messages: Messages;
}) {
  const router = useRouter();
  const [state, setState] = useState<"checking" | "allowed" | "missing">(
    "checking",
  );

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setState("missing");
      return;
    }
    return observeAdmin((user) => {
      if (user) setState("allowed");
      else router.replace("/login");
    });
  }, [router]);

  if (state === "missing") {
    return (
      <main className="admin-status-page">
        <div>
          <span className="wordmark">[KAIOS]</span>
          <h1>{messages.admin.firebaseMissing}</h1>
          <a className="button primary" href="/login">
            {messages.admin.backToLogin}
          </a>
        </div>
      </main>
    );
  }

  if (state !== "allowed") {
    return (
      <main className="admin-status-page" aria-busy="true">
        <div>
          <span className="admin-loader" aria-hidden="true" />
          <p>{messages.admin.loading}</p>
        </div>
      </main>
    );
  }

  return children;
}
