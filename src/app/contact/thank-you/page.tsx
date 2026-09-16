import type { Metadata } from "next";
import { ThankYouMark } from "@/components/conversion/ThankYouMark";
import { TEAMS } from "@/components/conversion/quote-schema";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { contacts } from "@/content/site";
import { buildMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Request received",
  description: "Thanks — your request is with the Mango team. Expect a reply within one business day.",
  path: "/contact/thank-you",
  noIndex: true,
});

export default async function ThankYouPage({ searchParams }: PageProps<"/contact/thank-you">) {
  const sp = await searchParams;
  const teamKey = typeof sp.team === "string" && sp.team in TEAMS ? sp.team : "solutions";
  const team = TEAMS[teamKey];
  const rawName = typeof sp.name === "string" ? sp.name : "";
  const name = rawName.replace(/[^\p{L}\p{M}'’.-]/gu, "").slice(0, 40);

  return (
    <Section tone="paper" className="flex min-h-[calc(100svh-120px)] items-center" ariaLabelledby="thanks-title">
      <Container size="narrow" className="text-center">
        <ThankYouMark className="mb-8" />
        <Reveal y={12} delay={0.6} className="mb-5 flex justify-center">
          <Overline tick={false}>Request received</Overline>
        </Reveal>
        <SplitHeading as="h1" id="thanks-title" className="text-h1 mx-auto max-w-[18ch] text-balance" delay={0.7}>
          {name ? `Thanks, ${name} — your request is with our ${team} team.` : `Thanks — your request is with our ${team} team.`}
        </SplitHeading>
        <Reveal y={20} delay={0.95} className="mx-auto mt-6 max-w-[48ch] text-body-l text-slate">
          <p>
            Expect a reply within one business day. For an urgent service issue, call{" "}
            <a href={telHref(contacts.supportPhone)} className="font-medium text-ink underline-offset-4 hover:underline">
              {contacts.supportPhone}
            </a>{" "}
            (24/7).
          </p>
        </Reveal>
        <Reveal y={20} delay={1.05} className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="primary" magnetic>
            Back to home
          </Button>
          <Button href="/resources/insights" variant="secondary" icon="none">
            Read our insights
          </Button>
        </Reveal>
      </Container>
    </Section>
  );
}
