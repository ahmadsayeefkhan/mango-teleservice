import type { Metadata } from "next";

export const SITE_NAME = "Mango Teleservices";
export const SITE_LEGAL_NAME = "Mango Teleservices Limited";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.mango.com.bd";
export const DEFAULT_OG_IMAGE = "/images/hero-network-globe.png";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export type PageMeta = {
  /** Page title without the " | Mango Teleservices" suffix (the root layout adds it). */
  title: string;
  description: string;
  /** Route path, e.g. "/solutions/ip-transit" — used for canonical + og:url. */
  path: string;
  /** Site-relative OG image path. */
  image?: string;
  /** Pass true to render the title without the template suffix. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

/**
 * Build a Next.js Metadata object with canonical, Open Graph and Twitter cards.
 * Usage: `export const metadata = buildMetadata({ title, description, path })`.
 */
export function buildMetadata({ title, description, path, image, absoluteTitle, noIndex }: PageMeta): Metadata {
  const ogImage = absoluteUrl(image ?? DEFAULT_OG_IMAGE);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      locale: "en_BD",
      images: [{ url: ogImage, width: 1408, height: 768, alt: `${SITE_NAME} — ${title}` }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [ogImage] },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

/** Serialize JSON-LD safely for a <script type="application/ld+json"> tag. */
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** schema.org Organization for Mango Teleservices Limited (used on Home; reusable in other pages). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_LEGAL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/brand/mango-mark.png"),
    foundingDate: "2007",
    description:
      "Bangladesh's first private-sector International Internet Gateway (2008). IP transit, international circuits, data centre, Mango Cloud and licensed digital signatures.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Police Plaza Concord, Tower-02 (7th Floor), Plot 02, Road 144, Gulshan-1",
      addressLocality: "Dhaka",
      postalCode: "1212",
      addressCountry: "BD",
    },
    telephone: "+8801730068810",
    email: "contact@mango.com.bd",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+8801730068810",
        contactType: "customer support",
        availableLanguage: ["English", "Bengali"],
        hoursAvailable: "Mo-Su 00:00-24:00",
      },
      { "@type": "ContactPoint", email: "cloud@mango.com.bd", contactType: "sales", areaServed: "BD" },
    ],
    sameAs: [] as string[],
  };
}

/** schema.org BreadcrumbList from crumb items. */
export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}
