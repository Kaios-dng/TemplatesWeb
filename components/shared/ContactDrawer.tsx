"use client";

import {
  FormEvent,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { X } from "lucide-react";
import { useContact } from "@/components/shared/ContactContext";
import { createInquiry, getPublishedTemplates } from "@/lib/firestore";
import { Messages } from "@/lib/i18n";
import { seedTemplates } from "@/lib/seed";
import { Locale, TemplateRecord } from "@/lib/types";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  templateId: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  templateId: "",
  message: "",
};

export function ContactDrawer({
  locale,
  messages,
}: {
  locale: Locale;
  messages: Messages;
}) {
  const { isOpen, selectedTemplate, closeContact } = useContact();
  const [templates, setTemplates] = useState<TemplateRecord[]>(seedTemplates);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getPublishedTemplates().then(setTemplates).catch(() => setTemplates(seedTemplates));
  }, []);

  useEffect(() => {
    if (!selectedTemplate) return;
    const updateTimer = window.setTimeout(() => {
      setValues((current) => ({
        ...current,
        templateId: selectedTemplate.id,
      }));
    }, 0);
    return () => window.clearTimeout(updateTimer);
  }, [selectedTemplate]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => nameRef.current?.focus(), 20);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeContact();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [closeContact, isOpen]);

  function validate() {
    const next: FormErrors = {};
    if (values.name.trim().length < 2) next.name = messages.contact.nameError;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = messages.contact.emailError;
    }
    if (values.message.trim().length < 10) {
      next.message = messages.contact.messageError;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    const template =
      templates.find((item) => item.id === values.templateId) ?? null;
    try {
      await createInquiry({
        templateId: template?.id ?? null,
        templateSlug: template?.slug ?? null,
        templateName: template?.name ?? null,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        message: values.message.trim(),
        locale,
      });
      setStatus("success");
      setValues(initialValues);
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  function dismissOnBackdrop(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") closeContact();
  }

  if (!isOpen) return null;

  return (
    <div className="drawer-layer">
      <div
        className="drawer-scrim"
        role="button"
        tabIndex={-1}
        aria-label={messages.contact.close}
        onClick={closeContact}
        onKeyDown={dismissOnBackdrop}
      />
      <div
        className="contact-drawer"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
      >
        <div className="drawer-head">
          <div>
            <h2 id="contact-title">{messages.contact.title}</h2>
            <p>{messages.contact.body}</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={closeContact}
            aria-label={messages.contact.close}
          >
            <X aria-hidden="true" />
          </button>
        </div>

        {status === "success" ? (
          <div className="form-success" role="status">
            <span className="success-mark" aria-hidden="true">
              ✓
            </span>
            <p>{messages.contact.success}</p>
            <button type="button" className="button primary" onClick={closeContact}>
              {messages.contact.close}
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <Field
              label={messages.contact.name}
              error={errors.name}
              input={
                <input
                  ref={nameRef}
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(event) =>
                    setValues({ ...values, name: event.target.value })
                  }
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              }
              errorId="name-error"
            />
            <Field
              label={messages.contact.email}
              error={errors.email}
              input={
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) =>
                    setValues({ ...values, email: event.target.value })
                  }
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              }
              errorId="email-error"
            />
            <Field
              label={messages.contact.phone}
              input={
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(event) =>
                    setValues({ ...values, phone: event.target.value })
                  }
                />
              }
            />
            <Field
              label={messages.contact.template}
              input={
                <select
                  name="templateId"
                  value={values.templateId}
                  onChange={(event) =>
                    setValues({ ...values, templateId: event.target.value })
                  }
                >
                  <option value="">{messages.contact.generalOption}</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              }
            />
            <Field
              label={messages.contact.message}
              error={errors.message}
              input={
                <textarea
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={(event) =>
                    setValues({ ...values, message: event.target.value })
                  }
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "message-error" : undefined}
                />
              }
              errorId="message-error"
            />
            {status === "error" ? (
              <p className="form-status error" role="alert">
                {messages.contact.error}
              </p>
            ) : null}
            <button
              className="button primary drawer-submit"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? messages.contact.sending
                : messages.contact.send}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  input,
  error,
  errorId,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
  errorId?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {input}
      {error ? (
        <small id={errorId} className="field-error">
          {error}
        </small>
      ) : null}
    </label>
  );
}
