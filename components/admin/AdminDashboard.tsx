"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOutAdmin } from "@/lib/auth";
import {
  removeTemplate,
  subscribeToInquiries,
  subscribeToTemplates,
  updateInquiryStatus,
} from "@/lib/firestore";
import { Messages } from "@/lib/i18n";
import { Inquiry, TemplateRecord } from "@/lib/types";

type Tab = "templates" | "inquiries";

export function AdminDashboard({ messages }: { messages: Messages }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("templates");
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribeTemplates = subscribeToTemplates(setTemplates, () =>
      setError(messages.admin.loadError),
    );
    const unsubscribeInquiries = subscribeToInquiries(setInquiries, () =>
      setError(messages.admin.loadError),
    );
    return () => {
      unsubscribeTemplates();
      unsubscribeInquiries();
    };
  }, [messages.admin.loadError]);

  async function handleSignOut() {
    await signOutAdmin();
    router.replace("/login");
  }

  async function handleDelete(template: TemplateRecord) {
    if (!window.confirm(messages.admin.deleteConfirm)) return;
    setError("");
    try {
      await removeTemplate(template.id);
    } catch {
      setError(messages.admin.actionError);
    }
  }

  async function handleStatus(
    inquiry: Inquiry,
    status: Inquiry["status"],
  ) {
    setError("");
    try {
      await updateInquiryStatus(inquiry.id, status);
    } catch {
      setError(messages.admin.actionError);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="wordmark" href="/admin">
          [KAIOS]
        </Link>
        <span>{messages.admin.brand}</span>
        <button type="button" onClick={handleSignOut}>
          {messages.admin.signOut}
        </button>
      </header>

      <div className="admin-workspace">
        <aside className="admin-sidebar">
          <div className="admin-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "templates"}
              onClick={() => setTab("templates")}
            >
              {messages.admin.templates}
              <span>{templates.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "inquiries"}
              onClick={() => setTab("inquiries")}
            >
              {messages.admin.inquiries}
              <span>{inquiries.length}</span>
            </button>
          </div>
          <Link className="button primary" href="/templates/new">
            {messages.admin.newTemplate}
          </Link>
          <Link className="admin-public-link" href="/vi">
            {messages.admin.viewSite}
          </Link>
        </aside>

        <section className="admin-content">
          <div className="admin-content-head">
            <div>
              <span>{messages.admin.brand}</span>
              <h1>
                {tab === "templates"
                  ? messages.admin.templates
                  : messages.admin.inquiries}
              </h1>
            </div>
            {tab === "templates" ? (
              <Link className="button primary" href="/templates/new">
                {messages.admin.newTemplate}
              </Link>
            ) : null}
          </div>

          {error ? (
            <p className="admin-error" role="alert">
              {error}
            </p>
          ) : null}

          {tab === "templates" ? (
            templates.length ? (
              <div className="admin-list">
                {templates.map((template) => (
                  <article className="admin-row" key={template.id}>
                    <div className="admin-row-main">
                      <span
                        className={`publish-state ${
                          template.published ? "is-published" : ""
                        }`}
                      >
                        {template.published
                          ? messages.admin.published
                          : messages.admin.draft}
                      </span>
                      <h2>{template.name}</h2>
                      <p>{template.categoryName.vi}</p>
                    </div>
                    <div className="admin-row-actions">
                      <Link href={`/templates/${template.id}/edit`}>
                        {messages.admin.edit}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(template)}
                      >
                        {messages.admin.delete}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="admin-empty">{messages.admin.emptyTemplates}</div>
            )
          ) : inquiries.length ? (
            <div className="admin-list">
              {inquiries.map((inquiry) => (
                <article className="admin-row inquiry-row" key={inquiry.id}>
                  <div className="admin-row-main">
                    <span>{inquiry.templateName ?? messages.contact.generalOption}</span>
                    <h2>{inquiry.name}</h2>
                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                    {inquiry.phone ? (
                      <a href={`tel:${inquiry.phone}`}>{inquiry.phone}</a>
                    ) : null}
                    <p>{inquiry.message}</p>
                  </div>
                  <label className="inquiry-status">
                    <span>{messages.admin.status}</span>
                    <select
                      value={inquiry.status}
                      onChange={(event) =>
                        handleStatus(
                          inquiry,
                          event.target.value as Inquiry["status"],
                        )
                      }
                    >
                      <option value="new">{messages.admin.statusNew}</option>
                      <option value="contacted">
                        {messages.admin.statusContacted}
                      </option>
                      <option value="closed">{messages.admin.statusClosed}</option>
                    </select>
                  </label>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty">{messages.admin.emptyInquiries}</div>
          )}
        </section>
      </div>
    </main>
  );
}
