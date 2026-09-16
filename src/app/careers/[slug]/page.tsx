import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplyForm } from "@/components/conversion/ApplyForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { CTABand } from "@/components/sections/CTABand";
import { Container } from "@/components/ui/Container";
import { Verify } from "@/components/ui/Verify";
import { careersMisc, getRole, getTeam, roles } from "@/content/careers";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const dynamicParams = false;

const PILL = "inline-flex h-8 items-center rounded-full border border-white/15 bg-white/[0.04] px-3 text-[12.5px] font-medium text-paper";

export function generateStaticParams() {
  return roles.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) return {};
  const team = getTeam(role.teamId);
  return buildMetadata({
    title: `${role.title} | Careers`,
    description: `${role.summary} ${team?.name} · ${role.location} · ${role.type}. Apply to join Mango Teleservices in Dhaka.`,
    path: `/careers/${role.slug}`,
    image: "/images/careers-noc-team.png",
  });
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();
  const team = getTeam(role.teamId);
  const crumbs = [{ label: "Careers", href: "/careers" }, { label: team?.name ?? "Role" }];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Careers", href: "/careers" }, { label: role.title, href: `/careers/${role.slug}` }])} />

      <header data-tone="ink" className="bg-ink pb-14 pt-8 text-paper md:pb-20 md:pt-12 lg:pt-16">
        <Container>
          <Reveal y={12} className="mb-8">
            <Breadcrumbs items={crumbs} tone="dark" />
          </Reveal>
          <SplitHeading as="h1" className="text-h1 max-w-[18ch] text-balance">
            {role.title}
          </SplitHeading>
          <Reveal y={16} delay={0.25} className="mt-7 flex flex-wrap gap-2">
            {[`${role.location} · ${role.workplace}`, role.type, role.experience].map((t) => (
              <span key={t} className={PILL}>
                {t}
              </span>
            ))}
            <span className={PILL}>
              <Verify note="deadline (CMS)">Deadline: {role.deadline}</Verify>
            </span>
          </Reveal>
        </Container>
      </header>

      <section className="bg-paper py-16 md:py-20 lg:py-24" aria-label="Role description and application">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <article className="lg:col-span-7">
              <Reveal y={24}>
                <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.015em]">About the role</h2>
                <p className="mt-3 max-w-[62ch] text-[15.5px] leading-relaxed text-slate">{role.about}</p>
              </Reveal>
              <Reveal y={24} delay={0.05} className="mt-10">
                <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.015em]">Responsibilities</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {role.responsibilities.map((r) => (
                    <li key={r} className="flex gap-3 text-[15px] leading-relaxed text-slate">
                      <span aria-hidden="true" className="mt-[11px] inline-block h-0.5 w-3 shrink-0 bg-mango-deep" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal y={24} delay={0.05} className="mt-10">
                <h2 className="font-display text-[1.375rem] font-semibold tracking-[-0.015em]">Requirements</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {role.requirements.map((r) => (
                    <li key={r} className="flex gap-3 text-[15px] leading-relaxed text-slate">
                      <span aria-hidden="true" className="mt-[11px] inline-block h-0.5 w-3 shrink-0 bg-mango-deep" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal y={12} className="mt-10 border-t border-stone pt-5">
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-slate">
                  <Verify note="sample role; replace with a real vacancy from the CMS">{careersMisc.sampleNote}</Verify>
                </p>
              </Reveal>
            </article>

            <aside className="lg:col-span-5" aria-label="Apply">
              <Reveal y={32} delay={0.15} className="lg:sticky lg:top-28">
                <ApplyForm roleTitle={role.title} />
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>

      <CTABand overline="ALL OPENINGS" title="Not the right fit? See all openings." primary={{ label: "View open roles", href: "/careers#open-roles" }} tone="paper" className="pt-0 md:pt-0" />
    </>
  );
}
