import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SolutionPage } from "@/components/solutions/SolutionPage";
import { getSolution, solutionSlugs } from "@/content/solutions";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

/** Only the ten known services exist; anything else is a 404 (dynamicParams=false + notFound()). */
export const dynamicParams = false;

export function generateStaticParams() {
  return solutionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return buildMetadata({ title: s.seo.title, description: s.seo.description, path: `/solutions/${s.slug}` });
}

export default async function SolutionDetailPage({ params }: Props) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();
  return <SolutionPage s={s} />;
}
