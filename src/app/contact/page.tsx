import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactAside } from "@/components/conversion/ContactAside";
import { QuoteForm } from "@/components/conversion/QuoteForm";
import { isServiceId } from "@/components/conversion/quote-schema";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import { contacts } from "@/content/site";
import { JsonLd } from "@/lib/JsonLd";
import { absoluteUrl, buildMetadata } from "@/lib/seo";
import { submitQuoteRequest } from "./actions";

export const metadata: Metadata = buildMetadata({
  title: "Contact Mango Teleservices | Request a Quote",
  absoluteTitle: true,
  description:
    "Tell us what you need to connect, host or secure. Request a quote for IP transit, circuits, data centre, Mango Cloud or digital signatures and a specialist will reply within one business day.",
  path: "/contact",
});

/** Solutions send `?intent=quote&service=<slug>`; the hub may send a comma list. */
function parseServices(raw: string | string[] | undefined) {
  const list = (Array.isArray(raw) ? raw : raw ? [raw] : []).flatMap((s) => s.split(","));
  return Array.from(new Set(list.map((s) => s.trim()).filter(isServiceId)));
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const intent = sp.intent === "quote" ? "quote" : "contact";
  const services = parseServices(sp.service);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Mango Teleservices",
          url: absoluteUrl("/contact"),
          mainEntity: {
            "@type": "Organization",
            name: "Mango Teleservices Limited",
            telephone: "+8801730068810",
            email: contacts.emails.general,
            address: { "@type": "PostalAddress", streetAddress: contacts.address.full, addressLocality: "Dhaka", postalCode: "1212", addressCountry: "BD" },
          },
        }}
      />
      <header data-tone="ink" className="bg-ink pb-28 pt-8 text-paper md:pb-36 md:pt-12 lg:pb-40 lg:pt-16">
        <Container>
          <Reveal y={16} className="mb-5" enter={0}>
            <Overline tone="dark">{intent === "quote" ? "REQUEST A QUOTE" : "CONTACT"}</Overline>
          </Reveal>
          <SplitHeading as="h1" className="text-h1 max-w-[20ch] text-balance" enter={0.05}>
            Let&rsquo;s talk about what you need to connect, host or secure.
          </SplitHeading>
          <Reveal y={24} delay={0.2} className="mt-6 max-w-[56ch] text-body-l text-mist" enter={0.12}>
            <p>
              Tell us a little about your requirement. <Verify note="reply SLA">The right specialist will reply within one business day.</Verify>
            </p>
          </Reveal>
        </Container>
      </header>
      {/* contentVisibility off: the form card is pulled up over the hero (negative margin) and must not be clipped. */}
      <Section tone="paper" padding="none" className="pb-20 md:pb-28 xl:pb-32" ariaLabelledby="quote-form-heading" contentVisibility={false}>
        <h2 id="quote-form-heading" className="sr-only">
          Request a quote
        </h2>
        <Container className="-mt-20 md:-mt-24 lg:-mt-28">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
            <div className="lg:col-span-8">
              <QuoteForm action={submitQuoteRequest} initialServices={services} intent={intent} />
            </div>
            <aside className="lg:col-span-4" aria-label="Contact details">
              {/* Own hydration task (see app/page.tsx). */}
              <Suspense>
                <ContactAside />
              </Suspense>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
