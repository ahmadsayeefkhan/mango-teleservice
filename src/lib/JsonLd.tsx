import { serializeJsonLd } from "@/lib/seo";

/** Render structured data. Server component; place anywhere in a page. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
