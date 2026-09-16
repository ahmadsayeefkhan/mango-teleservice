"use client";

import { Check, FileText, Upload, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { gsap, useGSAP, EASE } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Field, TextInput } from "./fields";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx";
const ACCEPT_TYPES = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);

type Values = { name: string; email: string; phone: string; linkedin: string };
type Errors = Partial<Record<keyof Values | "cv", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const LINKEDIN_RE = /^(https?:\/\/)?([a-z]{2,3}\.)?linkedin\.com\/.+/i;

function validate(v: Values, cv: File | null): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!PHONE_RE.test(v.phone.trim())) e.phone = "Enter a phone number we can reach you on.";
  if (v.linkedin.trim() && !LINKEDIN_RE.test(v.linkedin.trim())) e.linkedin = "Enter a linkedin.com profile URL.";
  if (!cv) e.cv = "Attach your CV as PDF, DOC or DOCX (max 5 MB).";
  return e;
}

function checkFile(f: File): string | null {
  const ext = f.name.toLowerCase().match(/\.(pdf|docx?)$/);
  if (!ext && !ACCEPT_TYPES.has(f.type)) return "That file type isn't supported. Upload a PDF, DOC or DOCX.";
  if (f.size > MAX_BYTES) return `File is ${(f.size / 1024 / 1024).toFixed(1)} MB. Keep it under 5 MB.`;
  return null;
}

/**
 * Job application form (sticky card on the job page). Client-validated: name, email, phone,
 * optional LinkedIn, CV upload with type/size checks. On submit shows an inline success state.
 * TODO(integration): post to the ATS / careers mailbox — nothing is transmitted yet.
 */
export function ApplyForm({ roleTitle, className }: { roleTitle: string; className?: string }) {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [values, setValues] = useState<Values>({ name: "", email: "", phone: "", linkedin: "" });
  const [cv, setCv] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);
  const [announce, setAnnounce] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof Values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const pick = (f: File | null) => {
    if (!f) return;
    const err = checkFile(f);
    if (err) {
      setCv(null);
      setErrors((e) => ({ ...e, cv: err }));
      setAnnounce(err);
      return;
    }
    setCv(f);
    setErrors((e) => ({ ...e, cv: undefined }));
    setAnnounce(`Attached ${f.name}.`);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate(values, cv);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const n = Object.keys(errs).length;
      setAnnounce(n === 1 ? "One field needs attention." : `${n} fields need attention.`);
      const first = (Object.keys(errs) as (keyof Errors)[])[0];
      const el = first === "cv" ? fileInput.current : (document.getElementById(id(first)) as HTMLElement | null);
      el?.focus();
      return;
    }
    // TODO(integration): send { ...values, cv } to the ATS / careers mailbox. Client-only for now.
    console.info("[job-application]", JSON.stringify({ role: roleTitle, ...values, cv: { name: cv?.name, size: cv?.size, type: cv?.type } }));
    setDone(true);
    setAnnounce(`Application for ${roleTitle} received. We will be in touch.`);
  };

  useGSAP(
    () => {
      const el = successRef.current;
      if (!el || !done || isStatic()) return;
      gsap.from(el, { opacity: 0, y: 16, duration: 0.7, ease: EASE.expo });
      gsap.from(el.querySelector("[data-check]"), { scale: 0.5, opacity: 0, duration: 0.7, ease: EASE.expo, delay: 0.1 });
      el.querySelector<HTMLElement>("[data-success-heading]")?.focus({ preventScroll: true });
    },
    { dependencies: [done], scope: card },
  );

  return (
    <div ref={card} className={cn("rounded-3xl border border-stone bg-white p-6 md:p-7", className)}>
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announce}
      </p>
      {done ? (
        <div ref={successRef} className="flex flex-col items-start gap-4">
          <span data-check className="inline-flex size-12 items-center justify-center rounded-full bg-mango text-ink">
            <Check size={22} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-mango-text">Application received</p>
            <h2 data-success-heading tabIndex={-1} className="mt-2 font-display text-[1.25rem] font-semibold tracking-[-0.01em] outline-none">
              Thanks, {values.name.split(/\s+/)[0]}. We have your application.
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-slate">
              For <strong className="text-ink">{roleTitle}</strong>. If your profile matches, the hiring team will contact you at {values.email}.
            </p>
          </div>
          <dl className="w-full divide-y divide-stone rounded-xl border border-stone bg-paper text-[13px]">
            <div className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-slate">CV</dt>
              <dd className="truncate font-medium">{cv?.name}</dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-2.5">
              <dt className="text-slate">Phone</dt>
              <dd className="font-medium">{values.phone}</dd>
            </div>
          </dl>
          <Button href="/careers" variant="secondary" size="sm" icon="none">
            Back to all roles
          </Button>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <h2 className="font-display text-[1.25rem] font-semibold tracking-[-0.01em]">Apply for this role</h2>
          <Field id={id("name")} label="Full name" error={errors.name}>
            {(a) => <TextInput {...a} autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} invalid={!!errors.name} required />}
          </Field>
          <Field id={id("email")} label="Email" error={errors.email}>
            {(a) => <TextInput {...a} type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} invalid={!!errors.email} required />}
          </Field>
          <Field id={id("phone")} label="Phone" error={errors.phone}>
            {(a) => <TextInput {...a} type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} invalid={!!errors.phone} required />}
          </Field>
          <Field id={id("linkedin")} label="LinkedIn profile" error={errors.linkedin} optional>
            {(a) => <TextInput {...a} type="url" inputMode="url" autoComplete="url" value={values.linkedin} onChange={(e) => set("linkedin", e.target.value)} invalid={!!errors.linkedin} placeholder="linkedin.com/in/…" />}
          </Field>

          {/* CV upload */}
          <div>
            <span id={id("cv-label")} className="mb-1.5 block text-[13px] font-medium text-ink">
              CV
            </span>
            <input
              ref={fileInput}
              id={id("cv")}
              type="file"
              accept={ACCEPT}
              aria-labelledby={id("cv-label")}
              aria-describedby={errors.cv ? id("cv-error") : id("cv-hint")}
              aria-invalid={errors.cv ? true : undefined}
              onChange={(e) => pick(e.target.files?.[0] ?? null)}
              className="sr-only"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pick(e.dataTransfer.files?.[0] ?? null);
              }}
              className={cn(
                "rounded-lg border border-dashed p-4 transition-colors duration-200",
                errors.cv ? "border-signal-red bg-signal-red/[0.03]" : dragging ? "border-ink bg-paper" : "border-stone bg-paper",
              )}
            >
              {cv ? (
                <div className="flex items-center gap-3">
                  <FileText size={20} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-mango-text" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium">{cv.name}</span>
                    <span className="block font-mono text-[10.5px] uppercase tracking-[0.1em] text-slate">{(cv.size / 1024).toFixed(0)} KB</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCv(null);
                      if (fileInput.current) fileInput.current.value = "";
                    }}
                    className="inline-flex size-8 items-center justify-center rounded-full text-slate transition-colors hover:bg-stone hover:text-ink"
                    aria-label={`Remove ${cv.name}`}
                  >
                    <X size={15} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInput.current?.click()} className="flex w-full flex-col items-center gap-2 py-2 text-center">
                  <Upload size={18} strokeWidth={1.5} aria-hidden="true" className="text-slate" />
                  <span className="text-[13.5px] font-medium text-ink">Upload CV</span>
                  <span id={id("cv-hint")} className="text-[12px] text-slate">
                    PDF, DOC or DOCX · max 5 MB
                  </span>
                </button>
              )}
            </div>
            {errors.cv && (
              <p id={id("cv-error")} role="alert" className="mt-1.5 flex items-start gap-1.5 text-[12.5px] font-medium text-signal-red">
                <span aria-hidden="true" className="mt-[5px] inline-block size-1.5 shrink-0 rounded-full bg-signal-red" />
                {errors.cv}
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" className="mt-2 w-full" magnetic>
            Submit application
          </Button>
          <p className="text-[12px] leading-snug text-slate">
            By applying you agree to our{" "}
            <a href="/legal/privacy" className="text-signal-blue underline-offset-2 hover:underline">
              privacy policy
            </a>
            .
          </p>
        </form>
      )}
    </div>
  );
}
