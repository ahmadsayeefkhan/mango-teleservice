import type { Metadata } from "next";
import { HubBand } from "@/components/solutions/HubBand";
import { HubHero } from "@/components/solutions/HubHero";
import { LayerGroup } from "@/components/solutions/LayerGroup";
import { hub } from "@/content/solutions";
import { JsonLd } from "@/lib/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: hub.seo.title,
  description: hub.seo.description,
  path: "/solutions",
});

export default function SolutionsHubPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: "Solutions", href: "/solutions" }])} />
      <HubHero />
      {hub.layers.map((layer, i) => (
        <LayerGroup key={layer.code} layer={layer} index={i} />
      ))}
      <HubBand />
    </>
  );
}
