"use server";

import { redirect } from "next/navigation";
import { firstErrorStep, parseQuoteForm, teamForServices, validate, type QuoteErrors } from "@/components/conversion/quote-schema";

export type QuoteState = { ok: false; errors: QuoteErrors; step: number; message: string } | null;

/**
 * Request-a-Quote submission. Validates server-side (never trust the client), then redirects to
 * /contact/thank-you with the routing team and the requester's first name.
 *
 * TODO(integration): deliver the request. No transport is configured yet — wire this to the CRM
 * or an SMTP/Graph mailer (to sales@ / contact@mango.com.bd) and add rate limiting before launch.
 * Until then the sanitized payload is only written to the server log.
 */
export async function submitQuoteRequest(_prev: QuoteState, formData: FormData): Promise<QuoteState> {
  // Honeypot: bots fill every field. Humans never see "website".
  if (typeof formData.get("website") === "string" && (formData.get("website") as string).length > 0) {
    redirect("/contact/thank-you?team=solutions");
  }

  const values = parseQuoteForm(formData);
  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    const n = Object.keys(errors).length;
    return {
      ok: false,
      errors,
      step: Math.max(0, firstErrorStep(errors)),
      message: n === 1 ? "One field needs attention." : `${n} fields need attention.`,
    };
  }

  const team = teamForServices(values.services);
  console.info("[quote-request]", JSON.stringify({ ...values, team, receivedAt: new Date().toISOString() }));

  const firstName = values.name.split(/\s+/)[0]?.replace(/[^\p{L}\p{M}'’.-]/gu, "").slice(0, 40) ?? "";
  const q = new URLSearchParams({ team });
  if (firstName) q.set("name", firstName);
  redirect(`/contact/thank-you?${q.toString()}`);
}
