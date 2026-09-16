"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { useActionState, useCallback, useEffect, useId, useRef, useState } from "react";
import { gsap, useGSAP, EASE } from "@/components/motion/gsap";
import { isStatic } from "@/components/motion/mode";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import type { QuoteState } from "@/app/contact/actions";
import { Field, GroupLabel, Select, TextArea, TextInput } from "./fields";
import {
  CAPACITIES,
  CONTACT_PREFS,
  EMPTY_VALUES,
  HANDOFFS,
  ORG_TYPES,
  SERVICES,
  STEPS,
  STEP_FIELDS,
  needsCapacity,
  validate,
  type QuoteErrors,
  type QuoteValues,
} from "./quote-schema";

export type QuoteFormProps = {
  action: (prev: QuoteState, formData: FormData) => Promise<QuoteState>;
  /** Preselected service ids (from `?service=<slug>`). */
  initialServices?: string[];
  /** `?intent=quote` → quote framing. */
  intent?: "quote" | "contact";
  className?: string;
};

/**
 * Signature interaction of the conversion area: a 3-step Request-a-Quote form.
 * Stepper with an animated Signal-Line progress rail, service chips (real checkboxes, keyboard
 * accessible), per-step validation with inline errors, focus management, aria-live announcements
 * and GSAP step transitions. All three panels stay mounted (inactive ones `hidden`) so a single
 * <form> holds every value for the Server Action and works without JS.
 */
export function QuoteForm({ action, initialServices = [], intent = "contact", className }: QuoteFormProps) {
  const uid = useId();
  const [values, setValues] = useState<QuoteValues>({ ...EMPTY_VALUES, services: initialServices });
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [step, setStep] = useState(0);
  const [announce, setAnnounce] = useState("");
  const [serverState, formAction, pending] = useActionState(action, null);

  const formRef = useRef<HTMLFormElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLFieldSetElement | null)[]>([]);
  const railFills = useRef<(HTMLSpanElement | null)[]>([]);
  const railDots = useRef<(HTMLSpanElement | null)[]>([]);
  const dir = useRef(1);
  const prevHeight = useRef<number | null>(null);
  const animating = useRef(false);

  const set = <K extends keyof QuoteValues>(key: K, v: QuoteValues[K]) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstInvalid = useCallback((errs: QuoteErrors) => {
    const key = STEP_FIELDS.flat().find((f) => errs[f]);
    if (!key) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${key}"] input, [data-field="${key}"] select, [data-field="${key}"] textarea`);
    el?.focus();
  }, []);

  /** Transition to another step (with a short exit tween unless static). */
  const go = useCallback(
    (next: number) => {
      if (next === step || animating.current) return;
      dir.current = next > step ? 1 : -1;
      prevHeight.current = wrapRef.current?.offsetHeight ?? null;
      const current = panelRefs.current[step];
      if (isStatic() || !current) {
        setStep(next);
        return;
      }
      animating.current = true;
      gsap.to(current, {
        opacity: 0,
        x: -dir.current * 20,
        duration: 0.26,
        ease: "power2.in",
        onComplete: () => {
          animating.current = false;
          setStep(next);
        },
      });
    },
    [step],
  );

  const validateStep = (i: number) => {
    const errs = validate(values, STEP_FIELDS[i]);
    if (Object.keys(errs).length) {
      setErrors((e) => ({ ...e, ...errs }));
      const n = Object.keys(errs).length;
      setAnnounce(n === 1 ? "One field needs attention." : `${n} fields need attention.`);
      focusFirstInvalid(errs);
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setAnnounce("");
    go(Math.min(step + 1, STEPS.length - 1));
  };
  const back = () => {
    setAnnounce("");
    go(Math.max(step - 1, 0));
  };

  // Server-side validation failed: adopt its errors (derived during render, not in an effect) and
  // jump to the first offending step; focus is the only side effect.
  const [handledServerState, setHandledServerState] = useState<QuoteState>(null);
  if (serverState !== handledServerState) {
    setHandledServerState(serverState);
    if (serverState && !serverState.ok) {
      setErrors(serverState.errors);
      setAnnounce(serverState.message);
      setStep(serverState.step);
    }
  }
  useEffect(() => {
    if (!serverState || serverState.ok) return;
    const t = setTimeout(() => focusFirstInvalid(serverState.errors), 80);
    return () => clearTimeout(t);
  }, [serverState, focusFirstInvalid]);

  // Step entered: animate the new panel + rail, tween the card height, move focus to the heading.
  useGSAP(
    () => {
      const panel = panelRefs.current[step];
      const wrap = wrapRef.current;
      if (!panel) return;
      // Rails: completed → full, active → fills (with the dot travelling), upcoming → empty.
      railFills.current.forEach((fill, i) => {
        const dot = railDots.current[i];
        if (!fill || !dot) return;
        if (i < step) {
          gsap.set(fill, { scaleX: 1 });
          gsap.set(dot, { autoAlpha: 0 });
        } else if (i > step) {
          gsap.set(fill, { scaleX: 0 });
          gsap.set(dot, { autoAlpha: 0 });
        }
      });
      const activeFill = railFills.current[step];
      const activeDot = railDots.current[step];
      const heading = panel.querySelector<HTMLElement>("[data-step-heading]");

      if (isStatic()) {
        if (activeFill) gsap.set(activeFill, { scaleX: 1 });
        if (activeDot) gsap.set(activeDot, { autoAlpha: 1, left: "100%" });
        panel.style.opacity = "";
        if (prevHeight.current !== null) heading?.focus({ preventScroll: true });
        prevHeight.current = null;
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE.expo } });
      if (activeFill && activeDot) {
        tl.fromTo(activeFill, { scaleX: 0 }, { scaleX: 1, duration: 0.9 }, 0);
        tl.fromTo(activeDot, { left: "0%", autoAlpha: 1 }, { left: "100%", duration: 0.9 }, 0);
      }
      if (wrap && prevHeight.current !== null) {
        const h1 = wrap.offsetHeight;
        tl.fromTo(wrap, { height: prevHeight.current }, { height: h1, duration: 0.55, clearProps: "height", ease: "power3.inOut" }, 0);
      }
      tl.fromTo(panel, { opacity: 0, x: dir.current * 28 }, { opacity: 1, x: 0, duration: 0.7, clearProps: "opacity,transform" }, prevHeight.current !== null ? 0.08 : 0);
      if (prevHeight.current !== null) {
        tl.call(() => heading?.focus({ preventScroll: true }), [], 0.15);
      }
      prevHeight.current = null;
    },
    { dependencies: [step], scope: wrapRef },
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (step < STEPS.length - 1) {
      e.preventDefault();
      next();
      return;
    }
    // Final step: validate everything client-side; the Server Action validates again.
    const errs = validate(values);
    if (Object.keys(errs).length) {
      e.preventDefault();
      setErrors(errs);
      const s = STEP_FIELDS.findIndex((fields) => fields.some((f) => errs[f]));
      setAnnounce(Object.keys(errs).length === 1 ? "One field needs attention." : `${Object.keys(errs).length} fields need attention.`);
      if (s !== step) go(s);
      else focusFirstInvalid(errs);
    }
  };

  const showCapacity = needsCapacity(values.services);
  const id = (k: string) => `${uid}-${k}`;
  const last = step === STEPS.length - 1;

  return (
    <div className={cn("rounded-3xl border border-stone bg-white", className)}>
      <form ref={formRef} action={formAction} onSubmit={onSubmit} noValidate className="p-6 md:p-8 lg:p-10" aria-describedby={id("live")}>
        {/* Stepper */}
        <ol className="grid grid-cols-3 gap-3 md:gap-4" aria-label="Form progress">
          {STEPS.map((s, i) => {
            const state = i < step ? "complete" : i === step ? "current" : "upcoming";
            return (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => (i < step ? go(i) : i === step ? undefined : validateStep(step) && go(i))}
                  aria-current={state === "current" ? "step" : undefined}
                  disabled={i > step + 1}
                  className="group block w-full text-left disabled:cursor-default"
                  aria-label={`Step ${i + 1} of ${STEPS.length}: ${s.short}${state === "complete" ? " (completed)" : ""}`}
                >
                  <span className="relative block h-0.5 w-full overflow-visible rounded-full bg-stone">
                    <span
                      ref={(el) => {
                        railFills.current[i] = el;
                      }}
                      className="absolute inset-0 origin-left rounded-full bg-mango"
                      style={{ transform: state === "complete" ? "scaleX(1)" : state === "current" ? "scaleX(1)" : "scaleX(0)" }}
                    />
                    <span
                      ref={(el) => {
                        railDots.current[i] = el;
                      }}
                      aria-hidden="true"
                      className="signal-dot absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-mango"
                      style={{ left: "100%", opacity: state === "current" ? 1 : 0, visibility: state === "current" ? "visible" : "hidden" }}
                    />
                  </span>
                  <span
                    className={cn(
                      "mt-3 flex items-center gap-2 truncate font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] transition-colors",
                      // full Slate (not /70): 10.5px mono on white needs ≥ 4.5:1 (WCAG AA, Lighthouse a11y)
                      state === "upcoming" ? "text-slate" : "text-ink",
                      state === "complete" && "group-hover:text-mango-text",
                    )}
                  >
                    {state === "complete" ? <Check size={11} strokeWidth={2.5} aria-hidden="true" className="text-mango-deep" /> : `0${i + 1}`}
                    <span className="truncate">{s.short}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <p id={id("live")} aria-live="polite" aria-atomic="true" className="sr-only">
          {announce || `Step ${step + 1} of ${STEPS.length}: ${STEPS[step].title}`}
        </p>

        {/* Honeypot (hidden from humans) */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={id("website")}>Website</label>
          <input id={id("website")} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>

        <div ref={wrapRef} className="relative mt-8 overflow-hidden">
          {/* Step 1 · About you */}
          <fieldset
            ref={(el) => {
              panelRefs.current[0] = el;
            }}
            hidden={step !== 0}
            className="m-0 min-w-0 border-0 p-0"
          >
            <StepHeading n={1} title={STEPS[0].title} intent={intent} />
            <div className="grid gap-5 sm:grid-cols-2">
              <div data-field="name">
                <Field id={id("name")} label="Full name" error={errors.name}>
                  {(a) => <TextInput {...a} name="name" autoComplete="name" value={values.name} onChange={(e) => set("name", e.target.value)} invalid={!!errors.name} placeholder="Your name" required />}
                </Field>
              </div>
              <div data-field="email">
                <Field id={id("email")} label="Work email" error={errors.email}>
                  {(a) => <TextInput {...a} name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} invalid={!!errors.email} placeholder="you@company.com" required />}
                </Field>
              </div>
              <div data-field="phone">
                <Field id={id("phone")} label="Phone" error={errors.phone}>
                  {(a) => <TextInput {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} invalid={!!errors.phone} placeholder="+880 1XXX XXXXXX" required />}
                </Field>
              </div>
              <div data-field="organization">
                <Field id={id("organization")} label="Organization" error={errors.organization}>
                  {(a) => <TextInput {...a} name="organization" autoComplete="organization" value={values.organization} onChange={(e) => set("organization", e.target.value)} invalid={!!errors.organization} placeholder="Company, bank, ministry, ISP…" required />}
                </Field>
              </div>
              <div data-field="orgType" className="sm:col-span-2">
                <Field id={id("orgType")} label="Organization type" error={errors.orgType}>
                  {(a) => (
                    <Select {...a} name="orgType" value={values.orgType} onChange={(e) => set("orgType", e.target.value)} invalid={!!errors.orgType} required>
                      <option value="">Select one…</option>
                      {ORG_TYPES.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>
            </div>
          </fieldset>

          {/* Step 2 · What you need */}
          <fieldset
            ref={(el) => {
              panelRefs.current[1] = el;
            }}
            hidden={step !== 1}
            className="m-0 min-w-0 border-0 p-0"
          >
            <StepHeading n={2} title={STEPS[1].title} intent={intent} />
            <div data-field="services" role="group" aria-labelledby={id("services-label")} aria-describedby={errors.services ? id("services-error") : undefined}>
              <GroupLabel id={id("services-label")}>Service of interest</GroupLabel>
              <p className="mt-1 text-[12.5px] text-slate">Select all that apply.</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SERVICES.map((s) => {
                  const on = values.services.includes(s.id);
                  return (
                    <li key={s.id}>
                      <label
                        className={cn(
                          "inline-flex h-10 cursor-pointer select-none items-center gap-2 rounded-full border px-4 text-[13.5px] font-medium transition-[background-color,border-color,color] duration-200",
                          "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-signal-blue",
                          on ? "border-ink bg-ink text-paper" : "border-stone bg-paper text-ink hover:border-ink/60",
                        )}
                      >
                        <input
                          type="checkbox"
                          name="services"
                          value={s.id}
                          checked={on}
                          onChange={(e) => set("services", e.target.checked ? [...values.services, s.id] : values.services.filter((x) => x !== s.id))}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={cn("inline-flex size-4 items-center justify-center rounded-full border transition-colors", on ? "border-mango bg-mango text-ink" : "border-stone bg-white")}
                        >
                          {on && <Check size={10} strokeWidth={3} />}
                        </span>
                        {s.label}
                      </label>
                    </li>
                  );
                })}
              </ul>
              {errors.services && (
                <p id={id("services-error")} role="alert" className="mt-2 flex items-start gap-1.5 text-[12.5px] font-medium text-signal-red">
                  <span aria-hidden="true" className="mt-[5px] inline-block size-1.5 rounded-full bg-signal-red" />
                  {errors.services}
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {showCapacity && (
                <div data-field="capacity">
                  <Field id={id("capacity")} label="Required capacity" error={errors.capacity}>
                    {(a) => (
                      <Select {...a} name="capacity" value={values.capacity} onChange={(e) => set("capacity", e.target.value)} invalid={!!errors.capacity}>
                        <option value="">Select…</option>
                        {CAPACITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </div>
              )}
              <div data-field="locations">
                <Field id={id("locations")} label="Location(s)" error={errors.locations} optional hint="Cities or sites to connect, host or secure.">
                  {(a) => <TextInput {...a} name="locations" value={values.locations} onChange={(e) => set("locations", e.target.value)} invalid={!!errors.locations} placeholder="Dhaka, Chattogram" />}
                </Field>
              </div>
              <div data-field="handoff" className={cn(!showCapacity && "sm:col-span-2")}>
                <Field id={id("handoff")} label="Preferred handoff" error={errors.handoff} optional>
                  {(a) => (
                    <Select {...a} name="handoff" value={values.handoff} onChange={(e) => set("handoff", e.target.value)} invalid={!!errors.handoff}>
                      <option value="">Select…</option>
                      {HANDOFFS.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </Select>
                  )}
                </Field>
              </div>
            </div>
          </fieldset>

          {/* Step 3 · Details */}
          <fieldset
            ref={(el) => {
              panelRefs.current[2] = el;
            }}
            hidden={step !== 2}
            className="m-0 min-w-0 border-0 p-0"
          >
            <StepHeading n={3} title={STEPS[2].title} intent={intent} />
            <div className="grid gap-5">
              <div data-field="message">
                <Field id={id("message")} label="Message" error={errors.message} optional hint="Timelines, current setup, anything that helps us scope it.">
                  {(a) => <TextArea {...a} name="message" value={values.message} onChange={(e) => set("message", e.target.value)} invalid={!!errors.message} placeholder="Tell us a little about the requirement…" />}
                </Field>
              </div>

              <div data-field="contactPref" role="radiogroup" aria-labelledby={id("pref-label")}>
                <GroupLabel id={id("pref-label")}>Preferred contact</GroupLabel>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CONTACT_PREFS.map((p) => {
                    const on = values.contactPref === p;
                    return (
                      <label
                        key={p}
                        className={cn(
                          "inline-flex h-10 cursor-pointer select-none items-center gap-2 rounded-full border px-4 text-[13.5px] font-medium transition-colors duration-200",
                          "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-signal-blue",
                          on ? "border-ink bg-ink text-paper" : "border-stone bg-paper text-ink hover:border-ink/60",
                        )}
                      >
                        <input type="radio" name="contactPref" value={p} checked={on} onChange={() => set("contactPref", p)} className="sr-only" />
                        <span aria-hidden="true" className={cn("inline-block size-2 rounded-full", on ? "bg-mango" : "bg-stone")} />
                        {p}
                      </label>
                    );
                  })}
                </div>
                {errors.contactPref && (
                  <p role="alert" className="mt-2 text-[12.5px] font-medium text-signal-red">
                    {errors.contactPref}
                  </p>
                )}
              </div>

              <div data-field="consent" className="rounded-xl border border-stone bg-paper p-4">
                <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={values.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    aria-invalid={errors.consent ? true : undefined}
                    aria-describedby={errors.consent ? id("consent-error") : undefined}
                    className="mt-1 size-4 shrink-0 accent-ink"
                  />
                  <span>
                    I agree that Mango may store and use these details to respond to my request, as described in the{" "}
                    <Link href="/legal/privacy" className="font-medium text-signal-blue underline-offset-2 hover:underline">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p id={id("consent-error")} role="alert" className="mt-2 pl-7 text-[12.5px] font-medium text-signal-red">
                    {errors.consent}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
        </div>

        {/* Footer: back / continue / send */}
        <div className="mt-8 flex flex-col-reverse items-stretch gap-3 border-t border-stone pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={back}
              disabled={step === 0 || pending}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-lg px-2 text-[14px] font-medium text-slate transition-colors hover:text-ink",
                step === 0 && "invisible",
              )}
            >
              <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
              Back
            </button>
            <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate sm:hidden">
              Step {step + 1} / {STEPS.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate sm:inline">
              Step {step + 1} / {STEPS.length}
            </span>
            {last ? (
              <Button type="submit" variant="primary" disabled={pending} magnetic>
                {pending ? "Sending…" : "Send request"}
              </Button>
            ) : (
              <Button type="submit" variant="primary" magnetic>
                {step === 0 ? "Continue to what you need" : "Continue to details"}
              </Button>
            )}
          </div>
        </div>
        {serverState && !serverState.ok && (
          <p role="alert" className="mt-4 text-[13px] font-medium text-signal-red">
            {serverState.message} Please review the highlighted fields.
          </p>
        )}
      </form>
    </div>
  );
}

function StepHeading({ n, title, intent }: { n: number; title: string; intent: "quote" | "contact" }) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <h2 data-step-heading tabIndex={-1} className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] outline-none md:text-[1.75rem]">
        <span className="sr-only">Step {n}: </span>
        {title}
      </h2>
      {intent === "quote" && n === 1 && <Tag variant="warn">Request a quote</Tag>}
    </div>
  );
}
