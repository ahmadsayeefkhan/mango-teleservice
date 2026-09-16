/**
 * Global site content: navigation, mega-menu, footer, contacts.
 * Routes follow BUILD_BRIEF.md §7 exactly. Other agents build the target pages.
 */

export type NavLink = { label: string; href: string; desc?: string; external?: boolean };
export type MegaColumn = { title: string; items: NavLink[] };
export type NavItem =
  | { label: string; href: string; kind: "link" }
  | { label: string; href: string; kind: "mega"; columns: MegaColumn[]; footer: { prompt: string; cta: NavLink } }
  | { label: string; href: string; kind: "menu"; items: NavLink[] };

export const site = {
  name: "Mango Teleservices",
  legalName: "Mango Teleservices Limited",
  tagline: "The backbone behind Bangladesh's digital life.",
  footerBlurb: "The backbone behind Bangladesh's digital life. Licensed International Internet Gateway since 2008.",
  url: "https://www.mango.com.bd",
  foundingYear: 2007,
  copyrightYear: 2026,
} as const;

export const contacts = {
  address: {
    lines: ["Police Plaza Concord, Tower-02 (7th Floor)", "Plot 02, Road 144, Gulshan-1, Dhaka-1212"],
    full: "Police Plaza Concord, Tower-02 (7th Floor), Plot 02, Road 144, Gulshan-1, Dhaka-1212",
    mapQuery: "Police Plaza Concord, Gulshan-1, Dhaka",
  },
  phones: ["+880 1730 068810", "+880 1730 068811"],
  supportPhone: "+880 1730 068810",
  emails: { general: "contact@mango.com.bd", cloud: "cloud@mango.com.bd" },
} as const;

export const utilityBar = {
  status: "ALL SYSTEMS OPERATIONAL",
  supportLabel: "24/7 Support",
  links: [
    // NOTE: the public Mango CA and Mango Cloud portals have no confirmed URLs ([VERIFY URL] in content).
    // They point at the closest in-site destination until the real URLs are supplied.
    { label: "Mango CA", href: "/solutions/digital-trust", external: true },
    { label: "Cloud login", href: "/support", external: true },
  ] satisfies NavLink[],
  languages: [
    { code: "en", label: "EN", active: true },
    { code: "bn", label: "বাংলা", active: false },
  ],
} as const;

export const solutionsMenu: MegaColumn[] = [
  {
    title: "Connect",
    items: [
      { label: "IP Transit & Bandwidth", href: "/solutions/ip-transit", desc: "Wholesale internet capacity through our IIG" },
      { label: "International Circuits", href: "/solutions/international-circuits", desc: "ITC and IPLC private links abroad" },
      { label: "Enterprise Internet & ISP", href: "/solutions/enterprise-internet", desc: "Dedicated business connectivity" },
      { label: "Data Connectivity", href: "/solutions/data-connectivity", desc: "Link offices, branches and data centres" },
    ],
  },
  {
    title: "Host",
    items: [
      { label: "Data Centre & Colocation", href: "/solutions/data-centre", desc: "Host critical systems in Dhaka" },
      { label: "Mango Cloud", href: "/solutions/cloud", desc: "Local cloud servers, storage and backup" },
      { label: "Backup-as-a-Service", href: "/solutions/cloud#backup", desc: "Off-site copies of what matters" },
    ],
  },
  {
    title: "Secure",
    items: [
      { label: "Digital Signature Certificates", href: "/solutions/digital-trust#digital-signatures", desc: "Sign documents and e-GP tenders legally" },
      { label: "SSL/TLS Certificates", href: "/solutions/digital-trust#ssl", desc: "Encrypt websites and portals" },
      { label: "PKI & Security Consulting", href: "/solutions/digital-trust#pki", desc: "Trust infrastructure for institutions" },
    ],
  },
  {
    title: "Manage & Build",
    items: [
      { label: "Managed Services", href: "/solutions/managed-services", desc: "Your network, monitored and maintained" },
      { label: "Software & Integration", href: "/solutions/software", desc: "Systems built around your processes" },
      { label: "Training", href: "/solutions/training", desc: "Build technical capability in-house" },
    ],
  },
];

export const industriesMenu: NavLink[] = [
  { label: "ISPs & Operators", href: "/industries/isps-operators", desc: "Wholesale capacity and international routes" },
  { label: "Banking & Finance", href: "/industries/banking-finance", desc: "Secure links, local hosting, digital signatures" },
  { label: "Government", href: "/industries/government", desc: "Licensed trust services and in-country hosting" },
  { label: "Enterprise & MNCs", href: "/industries/enterprise", desc: "Dedicated internet, private circuits, managed infra" },
  { label: "Education", href: "/industries/education", desc: "Connectivity and cloud for campuses" },
  { label: "Digital Businesses", href: "/industries/digital-business", desc: "Cloud and bandwidth that scale with users" },
];

export const companyMenu: NavLink[] = [
  { label: "About Mango", href: "/company/about", desc: "Who we are and how we work" },
  { label: "Leadership", href: "/company/leadership", desc: "Board and management" },
  { label: "Milestones", href: "/company/milestones", desc: "Eighteen years of firsts" },
  { label: "Partners & Clients", href: "/company/partners", desc: "Carriers, technology partners, clients" },
  { label: "Newsroom", href: "/company/newsroom", desc: "Announcements and press" },
];

export const primaryCta: NavLink = { label: "Talk to an engineer", href: "/contact" };
export const quoteCta: NavLink = { label: "Request capacity quote", href: "/contact?intent=quote" };

export const mainNav: NavItem[] = [
  {
    label: "Solutions",
    href: "/solutions",
    kind: "mega",
    columns: solutionsMenu,
    footer: { prompt: "Not sure where to start?", cta: primaryCta },
  },
  { label: "Industries", href: "/industries", kind: "menu", items: industriesMenu },
  { label: "Network", href: "/network", kind: "link" },
  { label: "Company", href: "/company/about", kind: "menu", items: companyMenu },
  { label: "Mango Group", href: "/group", kind: "link" },
  { label: "Careers", href: "/careers", kind: "link" },
];

export const footerNav = {
  solutions: [
    { label: "IP Transit", href: "/solutions/ip-transit" },
    { label: "International Circuits", href: "/solutions/international-circuits" },
    { label: "Enterprise Internet", href: "/solutions/enterprise-internet" },
    { label: "Data Centre", href: "/solutions/data-centre" },
    { label: "Mango Cloud", href: "/solutions/cloud" },
    { label: "Digital Trust", href: "/solutions/digital-trust" },
    { label: "Managed Services", href: "/solutions/managed-services" },
  ] satisfies NavLink[],
  company: [
    { label: "About", href: "/company/about" },
    { label: "Leadership", href: "/company/leadership" },
    { label: "Milestones", href: "/company/milestones" },
    { label: "Network", href: "/network" },
    { label: "Partners & Clients", href: "/company/partners" },
    { label: "Mango Group", href: "/group" },
    { label: "Careers", href: "/careers" },
    { label: "Newsroom", href: "/company/newsroom" },
  ] satisfies NavLink[],
  resources: [
    { label: "Insights", href: "/resources/insights" },
    { label: "Case studies", href: "/resources/case-studies" },
    { label: "FAQ", href: "/resources/faq" },
    { label: "Support", href: "/support" },
  ] satisfies NavLink[],
  legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/privacy#terms" },
    { label: "Cookies", href: "/legal/privacy#cookies" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ] satisfies NavLink[],
};

/** Licence strip (mono). Licence numbers are [VERIFY]. */
export const licences = ["BTRC · IIG LICENCE", "BTRC · ITC LICENCE", "BTRC · ISP LICENCE", "CCA · CERTIFYING AUTHORITY"];

/** Reusable CTA band copy (content doc "Standard CTA band"). */
export const standardCta = {
  title: "Tell us what you need to connect, host or secure.",
  body: "A Mango engineer, not a call centre, will reply within one business day.",
  primary: primaryCta,
  secondary: quoteCta,
};
