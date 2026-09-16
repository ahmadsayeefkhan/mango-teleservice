import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Overline } from "@/components/ui/Overline";
import { Section } from "@/components/ui/Section";
import { Verify } from "@/components/ui/Verify";
import type { Capability } from "@/content/solutions";
import { CapabilitiesMotion } from "./CapabilitiesMotion";

export type CapabilitiesGridProps = {
  title: string;
  items: Capability[];
  /** Section id (the Training hero's "View courses" link targets it). */
  id?: string;
};

/**
 * Capabilities: Stone section, 3-column card grid. Server-rendered (icons stay on the server);
 * `CapabilitiesMotion` adds the staggered clip-reveal and the pointer spotlight.
 */
export function CapabilitiesGrid({ title, items, id = "capabilities" }: CapabilitiesGridProps) {
  return (
    <Section tone="stone" id={id} ariaLabelledby="capabilities-title" className="scroll-mt-24">
      <Container>
        <Reveal y={16} className="mb-4">
          <Overline>CAPABILITIES</Overline>
        </Reveal>
        <SplitHeading as="h2" id="capabilities-title" className="text-h2 max-w-[20ch] text-balance">
          {title}
        </SplitHeading>

        <CapabilitiesMotion className="mt-12 md:mt-14">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <li
                key={c.title}
                data-cap
                className={`js-hide sol-spot group relative flex min-h-[176px] flex-col rounded-2xl border border-stone bg-paper p-6 transition-[border-color,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-ink/20 md:p-7`}
              >
                <span className="relative inline-flex size-10 items-center justify-center rounded-lg border border-stone bg-white text-ink transition-colors duration-300 group-hover:border-mango group-hover:bg-mango">
                  <Icon icon={c.icon} size={19} />
                </span>
                <h3 className="relative mt-6 font-display text-[1.0625rem] font-semibold leading-snug">{c.title}</h3>
                <p className="relative mt-2 text-[14.5px] leading-relaxed text-slate">{c.verify ? <Verify note={c.verify}>{c.body}</Verify> : c.body}</p>
              </li>
            ))}
          </ul>
        </CapabilitiesMotion>
      </Container>
    </Section>
  );
}
