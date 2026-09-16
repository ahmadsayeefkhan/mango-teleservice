/**
 * Solutions hub + ten service pages. Copy is taken verbatim from
 * `Website Content/02-Solutions.md` (SEO titles from the sheet in 04-…md).
 * Anything the content marks [VERIFY] carries a `verify` note here and is rendered
 * inside <Verify> (neutral placeholder wording, never an invented number).
 */
import {
  Activity,
  Archive,
  ArrowUpDown,
  Braces,
  Cable,
  ClipboardCheck,
  Cloud,
  Code,
  Database,
  FileKey,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  GraduationCap,
  HardDrive,
  KeyRound,
  Landmark,
  Layers,
  LifeBuoy,
  Link2,
  Lock,
  Mail,
  MapPin,
  Network,
  Phone,
  Route,
  Server,
  Share2,
  Shield,
  ShieldCheck,
  Signature,
  Terminal,
  TrendingUp,
  Waypoints,
  Wifi,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type LayerCode = "connect" | "host" | "secure" | "manage";

export type SolutionSlug =
  | "ip-transit"
  | "international-circuits"
  | "enterprise-internet"
  | "data-connectivity"
  | "data-centre"
  | "cloud"
  | "digital-trust"
  | "managed-services"
  | "software"
  | "training";

export type Link = { label: string; href: string };

/** Mono key/value row used in spec panels and aside cards. `verify` = unverified value. */
export type SpecRow = { k: string; v: string; verify?: string };

export type SelectField = { name: string; label: string; options: string[] };

/** The hero aside card, which varies by page. */
export type SolutionAside =
  | { kind: "form"; title: string; fields: SelectField[]; submit: string }
  | { kind: "stats"; title: string; headline: string; rows: SpecRow[]; cta: Link; verify?: string }
  | { kind: "steps"; title: string; steps: string[]; cta: Link; verify?: string }
  | { kind: "estimator"; title: string; submit: string; note: string; verify: string };

export type Problem = { title: string; body: string };
export type Capability = { icon: LucideIcon; title: string; body: string; verify?: string };
export type Step = { title: string; body: string };
export type WhyCard = { figure: string; title: string; body: string; verify?: string };
export type ProofFigure = { k: string; v: string; verify?: string };
export type FaqEntry = { q: string; a: string; verify?: string };

export type Story = {
  kicker: string;
  kickerVerify?: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  link?: Link;
};

export type Solution = {
  slug: SolutionSlug;
  layer: LayerCode;
  /** Short name used in nav, crumbs and related cards. */
  name: string;
  /** One-liner used on the hub and related cards. */
  tagline: string;
  icon: LucideIcon;
  seo: { title: string; description: string };
  hero: { overline: string; title: string; sub: string; primary: Link; secondary: Link };
  aside: SolutionAside;
  proof: ProofFigure[];
  what: { title: string; body: string };
  problems: Problem[];
  capabilities: { title: string; items: Capability[] };
  how: { steps: Step[]; panel: { title: string; note?: string; noteVerify?: string; rows: SpecRow[] } };
  why: WhyCard[];
  story?: Story;
  faq: { title?: string; items: FaqEntry[] };
  cta: { title: string; primary: Link; secondary?: Link };
  /** Related solution slugs, or absolute routes for non-solution pages (e.g. "/network"). */
  related: (SolutionSlug | Link)[];
};

export type HubService = { title: string; line: string; href: string; icon: LucideIcon };

export type HubLayer = {
  code: LayerCode;
  num: string;
  label: string;
  title: string;
  body: string;
  services: HubService[];
};

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

export const LAYER_LABEL: Record<LayerCode, string> = {
  connect: "Connect",
  host: "Host",
  secure: "Secure",
  manage: "Manage & Build",
};

const SUPPORT_PHONE = "+880 1730 068810";

/** Where mock forms land (the contact page preselects the quote flow when intent=quote). */
export function quoteHref(slug: SolutionSlug) {
  return `/contact?intent=quote&service=${slug}`;
}

/* ------------------------------------------------------------------ */
/* Hub                                                                 */
/* ------------------------------------------------------------------ */

export const hub = {
  seo: {
    title: "Telecom, Cloud & Digital Trust Solutions",
    description:
      "IP transit, international circuits, enterprise internet, data centre, Mango Cloud, digital signatures and managed services, from one licensed Bangladeshi operator.",
  },
  hero: {
    overline: "SOLUTIONS",
    title: "Connect. Host. Secure. Manage.",
    sub: "Four layers of digital infrastructure, licensed, operated and supported in Bangladesh by one team.",
  },
  layers: [
    {
      code: "connect",
      num: "01",
      label: "Connect",
      title: "Reach the world, reliably.",
      body: "Internet capacity, private international circuits and business connectivity under our IIG, ITC and ISP licences.",
      services: [
        { title: "IP Transit & Bandwidth", line: "Wholesale capacity through our IIG.", href: "/solutions/ip-transit", icon: Globe },
        { title: "International Circuits", line: "ITC and IPLC private links abroad.", href: "/solutions/international-circuits", icon: Cable },
        { title: "Enterprise Internet", line: "Dedicated business connectivity.", href: "/solutions/enterprise-internet", icon: Wifi },
        { title: "Data Connectivity", line: "Link offices, branches and data centres.", href: "/solutions/data-connectivity", icon: Share2 },
      ],
    },
    {
      code: "host",
      num: "02",
      label: "Host",
      title: "Run critical systems at home.",
      body: "A Dhaka data centre operating since 2008 and a local hybrid cloud for data that must stay in Bangladesh.",
      services: [
        { title: "Data Centre & Colocation", line: "Host critical systems in Dhaka.", href: "/solutions/data-centre", icon: Server },
        { title: "Mango Cloud", line: "Local cloud servers and storage.", href: "/solutions/cloud", icon: Cloud },
        { title: "Backup-as-a-Service", line: "Off-site copies of what matters.", href: "/solutions/cloud#backup", icon: Archive },
      ],
    },
    {
      code: "secure",
      num: "03",
      label: "Secure",
      title: "Trust every digital transaction.",
      body: "Mango CA has been a licensed Certifying Authority since 2011.",
      services: [
        { title: "Digital Signature Certificates", line: "Sign documents and e-GP tenders legally.", href: "/solutions/digital-trust#digital-signatures", icon: Signature },
        { title: "SSL/TLS Certificates", line: "Encrypt websites and portals.", href: "/solutions/digital-trust#ssl", icon: Lock },
        { title: "PKI & Security Consulting", line: "Trust infrastructure for institutions.", href: "/solutions/digital-trust#pki", icon: KeyRound },
      ],
    },
    {
      code: "manage",
      num: "04",
      label: "Manage & Build",
      title: "Extend your technical team.",
      body: "Operations, software and skills from the team that runs national infrastructure.",
      services: [
        { title: "Managed Services", line: "Your network, monitored and maintained.", href: "/solutions/managed-services", icon: Activity },
        { title: "Software & Integration", line: "Systems built around your processes.", href: "/solutions/software", icon: Code },
        { title: "Training", line: "Build technical capability in-house.", href: "/solutions/training", icon: GraduationCap },
      ],
    },
  ] satisfies HubLayer[],
  band: {
    overline: "NEED MORE THAN ONE LAYER?",
    title: "One contract. One support line. One accountable team.",
    body: "Most customers combine connectivity and hosting, or hosting and certificates. We design the stack together, and answer for all of it.",
    cta: { label: "Talk to an engineer", href: "/contact" },
  },
};

/* ------------------------------------------------------------------ */
/* Service pages                                                       */
/* ------------------------------------------------------------------ */

export const solutions: Record<SolutionSlug, Solution> = {
  /* 1 ---------------------------------------------------------------- */
  "ip-transit": {
    slug: "ip-transit",
    layer: "connect",
    name: "IP Transit & Bandwidth",
    tagline: "Wholesale internet capacity through our IIG.",
    icon: Globe,
    seo: {
      title: "IP Transit & Wholesale Bandwidth in Bangladesh",
      description:
        "Wholesale IP transit and internet bandwidth from Bangladesh's first private IIG. Diverse subsea and terrestrial routes, direct content interconnects. Request a quote.",
    },
    hero: {
      overline: "CONNECT · INTERNATIONAL INTERNET GATEWAY",
      title: "Wholesale internet capacity, from the country's first private gateway.",
      sub: "IP transit and bandwidth for ISPs, operators and large networks, delivered through Mango's IIG since 2008.",
      primary: { label: "Request capacity quote", href: quoteHref("ip-transit") },
      secondary: { label: "Talk to a network engineer", href: "/contact" },
    },
    aside: {
      kind: "form",
      title: "QUICK CAPACITY QUOTE",
      fields: [
        { name: "licence", label: "Licence type", options: ["Nationwide ISP", "Zonal ISP", "Mobile operator", "Enterprise network", "Other"] },
        { name: "service", label: "Service", options: ["IP transit", "Wholesale bandwidth", "Content interconnect", "Not sure yet"] },
        { name: "capacity", label: "Capacity", options: ["Under 1 Gbps", "1–10 Gbps", "10–100 Gbps", "100 Gbps+"] },
        { name: "handoff", label: "Handoff", options: ["Dhaka PoP", "Your premises", "Data centre cross-connect", "Advise me"] },
      ],
      submit: "Continue",
    },
    proof: [
      { k: "2008", v: "First private IIG" },
      { k: "SMW-4 · SMW-5", v: "Subsea rights of use" },
      { k: "7+", v: "Direct content interconnects" },
      { k: "TATA · AIRTEL · SINGTEL", v: "Upstream carriers" },
    ],
    what: {
      title: "The licensed door between Bangladesh and the internet.",
      body: "An International Internet Gateway (IIG) is the licensed point where Bangladesh's internet traffic leaves for, and arrives from, the rest of the world. IP transit is the service that carries your network's traffic through that gateway to the global internet. Mango sells it by capacity to ISPs, operators and enterprises that run their own networks.",
    },
    problems: [
      { title: "Congestion at peak hours", body: "Subscribers feel it first. Capacity planned with you, with headroom for growth." },
      { title: "Single-route risk", body: "A cable cut shouldn't take you offline. Traffic can use subsea and terrestrial paths." },
      { title: "Slow content", body: "Direct interconnects with major content networks reduce hops to the services your users open most." },
    ],
    capabilities: {
      title: "Everything a growing network needs upstream.",
      items: [
        { icon: Globe, title: "IP transit", body: "Full or partial routes to the global internet.", verify: "BGP table options" },
        { icon: Gauge, title: "Wholesale bandwidth", body: "Committed capacity for nationwide and zonal ISPs." },
        { icon: Share2, title: "Content interconnects", body: "Direct paths to Google, Meta, Akamai, Amazon, Equinix, DE-CIX and Zenlayer." },
        { icon: Route, title: "Route diversity", body: "SEA-ME-WE 4, SEA-ME-WE 5 and ITC terrestrial capacity." },
        { icon: Network, title: "IPv4 & IPv6", body: "Dual-stack delivery for modern networks.", verify: "IPv6 availability" },
        { icon: TrendingUp, title: "Capacity on demand", body: "Scale up without re-contracting.", verify: "commercial model" },
      ],
    },
    how: {
      steps: [
        { title: "Scope", body: "We review your traffic profile, growth and handoff location." },
        { title: "Design", body: "Our engineers propose capacity, routing and redundancy." },
        { title: "Deliver", body: "Handoff at your chosen point of presence, then BGP session setup and testing." },
        { title: "Operate", body: "24/7 monitoring, usage reports and a named account engineer." },
      ],
      panel: {
        title: "SPECIFICATIONS",
        note: "VALUES PENDING ENGINEERING",
        noteVerify: "all specification values",
        rows: [
          { k: "Port options", v: "1G · 10G · 100G", verify: "port options" },
          { k: "Handoff", v: "Dhaka points of presence", verify: "handoff locations" },
          { k: "Routing", v: "BGP full, partial or default", verify: "routing options" },
          { k: "Protocols", v: "IPv4 / IPv6 dual stack", verify: "IPv6" },
          { k: "Availability", v: "Per contract", verify: "availability target" },
          { k: "Support", v: `24/7 · ${SUPPORT_PHONE}` },
        ],
      },
    },
    why: [
      { figure: "2008", title: "Pioneer experience", body: "We've operated an international gateway longer than any other private company in Bangladesh." },
      { figure: "2 PATHS", title: "Paths, not a pipe", body: "Subsea and terrestrial capacity under our own licences." },
      { figure: "2009", title: "Content closer to your users", body: "We hosted the country's first Google cache in 2009 and interconnect directly with major content networks today." },
    ],
    faq: {
      title: "Questions network teams ask us.",
      items: [
        {
          q: "What's the difference between IIG and ITC?",
          a: "IIG is the licensed internet gateway. ITC (International Terrestrial Cable) is licensed cross-border land cable capacity. Mango holds both licences.",
        },
        {
          q: "What happens if a submarine cable is cut?",
          a: "Traffic can be carried on alternative subsea or terrestrial routes. Ask us about the redundancy design for your contract.",
        },
        {
          q: "Who can buy IP transit from Mango?",
          a: "Licensed ISPs, operators and organizations that run their own networks. Enterprises that need simple internet access should see Enterprise Internet.",
        },
        {
          q: "How quickly can capacity be delivered?",
          a: "Lead time depends on the port, handoff location and any new cross-connects. Our engineers confirm a delivery date in the proposal.",
          verify: "typical lead time",
        },
      ],
    },
    cta: {
      title: "Plan your next capacity upgrade with us.",
      primary: { label: "Request capacity quote", href: quoteHref("ip-transit") },
      secondary: { label: "Talk to a network engineer", href: "/contact" },
    },
    related: ["international-circuits", "data-centre", { label: "Our Network", href: "/network" }],
  },

  /* 2 ---------------------------------------------------------------- */
  "international-circuits": {
    slug: "international-circuits",
    layer: "connect",
    name: "International Circuits",
    tagline: "ITC and IPLC private links abroad.",
    icon: Cable,
    seo: {
      title: "IPLC & International Private Circuits in Bangladesh",
      description:
        "Dedicated point-to-point international circuits for banks, enterprises and carriers. Licensed ITC operator with IPLC and IP transit services.",
    },
    hero: {
      overline: "CONNECT · INTERNATIONAL TERRESTRIAL CABLE",
      title: "A private line from Bangladesh to the world.",
      sub: "Dedicated international circuits connecting your offices, data centres and partners abroad, without sharing capacity with the public internet.",
      primary: { label: "Request a circuit quote", href: quoteHref("international-circuits") },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    aside: {
      kind: "form",
      title: "CIRCUIT QUOTE",
      fields: [
        { name: "from", label: "From", options: ["Dhaka, Gulshan", "Dhaka, other", "Chattogram", "Other location in Bangladesh"] },
        { name: "to", label: "To", options: ["Singapore", "Mumbai", "Hong Kong", "London", "Frankfurt", "Other destination"] },
        { name: "capacity", label: "Capacity", options: ["Under 100 Mbps", "100 Mbps – 1 Gbps", "1 Gbps", "10 Gbps", "Advise me"] },
        { name: "protection", label: "Protection", options: ["Diverse path", "Protected circuit", "Unprotected", "Advise me"] },
      ],
      submit: "Continue",
    },
    proof: [
      { k: "2012", v: "ITC licence from BTRC" },
      { k: "IPLC · IP TRANSIT", v: "Services under one licence" },
      { k: "TATA · AIRTEL · SINGTEL", v: "Carrier relationships" },
      { k: "24/7", v: "Circuit monitoring" },
    ],
    what: {
      title: "Reserved capacity, point to point.",
      body: "An International Private Leased Circuit (IPLC) is a dedicated point-to-point connection between a location in Bangladesh and a location abroad. Your traffic travels on reserved capacity with predictable performance. That matters for core banking replication, voice, trading and corporate WANs.",
    },
    problems: [
      { title: "Performance swings", body: "Public internet performance swings during peak hours; private circuits don't share the road." },
      { title: "Compliance pressure", body: "Regulators and auditors expect sensitive traffic to stay off shared networks." },
      { title: "Fragmented networks", body: "Head office, data centre and regional hub need to behave like one network." },
    ],
    capabilities: {
      title: "Private international connectivity, your way.",
      items: [
        { icon: Cable, title: "Point-to-point IPLC", body: "Dedicated circuits between Bangladesh and destinations abroad." },
        { icon: Waypoints, title: "Ethernet private lines", body: "Layer-2 international Ethernet for corporate WANs.", verify: "Ethernet private lines" },
        { icon: Route, title: "Path options", body: "Terrestrial and subsea routes to match your needs." },
        { icon: Shield, title: "Protected circuits", body: "Diverse or protected paths against route failure." },
        { icon: Server, title: "DC-to-DC links", body: "Connect data centres for replication and DR." },
        { icon: Wrench, title: "Managed CPE", body: "Customer-premises equipment managed by Mango.", verify: "managed CPE" },
      ],
    },
    how: {
      steps: [
        { title: "Map", body: "Locations, capacity and protocol requirements." },
        { title: "Route", body: "We design the path and protection with carrier partners." },
        { title: "Provision", body: "End-to-end circuit build, testing and acceptance." },
        { title: "Monitor", body: "24/7 monitoring with a single point of contact." },
      ],
      panel: {
        title: "USE CASES",
        note: "BY SECTOR",
        rows: [
          { k: "Banking", v: "DR replication · SWIFT hubs" },
          { k: "Multinationals", v: "Regional WAN" },
          { k: "BPO", v: "Voice and data to clients" },
          { k: "Carriers", v: "Backhaul capacity" },
          { k: "Cloud", v: "Private on-ramps" },
        ],
      },
    },
    why: [
      { figure: "IIG + ITC", title: "One team, both licences", body: "A licensed ITC operator and IIG together, so one team designs your international and internet paths." },
      { figure: "3", title: "Global carrier partners", body: "Carrier relationships with Tata Communications, Bharti Airtel and Singtel." },
      { figure: "24/7", title: "Single point of contact", body: "One number from order to incident." },
    ],
    faq: {
      items: [
        { q: "IPLC or IP transit, which do I need?", a: "Choose IPLC for private point-to-point links. Choose IP transit to reach the whole internet." },
        {
          q: "Which destinations can you reach?",
          a: "Major hubs in Asia, the Middle East and Europe through our carrier partners. Tell us the far-end city and we'll confirm the route and landing points.",
          verify: "key cities and landing points",
        },
        { q: "Can circuits be protected against route failure?", a: "Yes. Diverse-path options are available.", verify: "protection options" },
        {
          q: "How long does provisioning take?",
          a: "It depends on the destination and the far-end access. We confirm a delivery date once the route is designed.",
          verify: "provisioning lead time",
        },
      ],
    },
    cta: {
      title: "Connect your sites across borders.",
      primary: { label: "Request a circuit quote", href: quoteHref("international-circuits") },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    related: ["ip-transit", "data-connectivity", "enterprise-internet"],
  },

  /* 3 ---------------------------------------------------------------- */
  "enterprise-internet": {
    slug: "enterprise-internet",
    layer: "connect",
    name: "Enterprise Internet & ISP",
    tagline: "Dedicated business connectivity.",
    icon: Wifi,
    seo: {
      title: "Dedicated Business Internet in Dhaka & Bangladesh",
      description:
        "Dedicated, symmetrical business internet with 24/7 support from a licensed IIG and ISP. For offices, banks, factories and campuses.",
    },
    hero: {
      overline: "CONNECT · LICENSED ISP",
      title: "Business internet that doesn't share your peak hour.",
      sub: "Dedicated connectivity for offices, branches, factories and campuses, delivered by a company that also runs the gateway.",
      primary: { label: "Check availability", href: quoteHref("enterprise-internet") },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    aside: {
      kind: "form",
      title: "CHECK AVAILABILITY",
      fields: [
        { name: "area", label: "Business address", options: ["Gulshan-1, Dhaka", "Banani / Gulshan-2", "Motijheel", "Uttara", "Savar / Gazipur", "Chattogram", "Other"] },
        { name: "bandwidth", label: "Bandwidth needed", options: ["50 Mbps", "100 Mbps", "200 Mbps", "500 Mbps", "1 Gbps+"] },
        { name: "backup", label: "Backup link", options: ["Yes, dual path", "No, single link", "Advise me"] },
      ],
      submit: "Check my address",
    },
    proof: [
      { k: "2013", v: "ISP licence from BTRC" },
      { k: "IIG-BACKED", v: "Gateway and ISP, one company" },
      { k: "STATIC IP", v: "Included options" },
      { k: "24/7", v: "Support line" },
    ],
    what: {
      title: "Reserved capacity, a service level and a direct line.",
      body: "Dedicated internet access gives your organization reserved capacity, a service level and a direct support line. Mango has been a BTRC-licensed ISP since 2013, and also offers IP telephony and LAN setup.",
    },
    problems: [
      { title: "Slow at the worst time", body: "Shared connections slow down exactly when your team needs them." },
      { title: "No one to call", body: "Consumer ISPs route business outages to generic call centres." },
      { title: "Single point of failure", body: "One link down means the whole office is offline." },
    ],
    capabilities: {
      title: "Connectivity built for business operations.",
      items: [
        { icon: Wifi, title: "Dedicated internet access", body: "Reserved bandwidth with a service level.", verify: "SLA" },
        { icon: MapPin, title: "Static IP addresses", body: "For VPNs, servers and remote access." },
        { icon: ArrowUpDown, title: "Symmetrical speeds", body: "Upload as fast as download.", verify: "symmetrical speeds" },
        { icon: Phone, title: "IP telephony", body: "Business voice over your data connection." },
        { icon: Network, title: "LAN design & setup", body: "Office networks designed and installed." },
        { icon: GitBranch, title: "Backup links", body: "Dual-path options for continuity." },
      ],
    },
    how: {
      steps: [
        { title: "Survey", body: "We check coverage and last-mile options at your address." },
        { title: "Propose", body: "Bandwidth, backup and pricing in one proposal." },
        { title: "Install", body: "Link delivery, router setup and handover." },
        { title: "Support", body: "24/7 monitoring with one number to call." },
      ],
      panel: {
        title: "SERVICE DETAILS",
        note: "PENDING CONFIRMATION",
        noteVerify: "service details",
        rows: [
          { k: "Bandwidth", v: "From 10 Mbps to multi-Gbps", verify: "bandwidth range" },
          { k: "Contention", v: "Dedicated 1:1", verify: "contention" },
          { k: "IP addresses", v: "Static IPv4 / IPv6", verify: "IPv6" },
          { k: "Backup", v: "Optional second path" },
          { k: "Support", v: `24/7 · ${SUPPORT_PHONE}` },
        ],
      },
    },
    why: [
      { figure: "1", title: "Fewer handoffs", body: "Your ISP is also your international gateway." },
      { figure: "2013", title: "Licensed ISP", body: "BTRC ISP licence, on top of our 2008 IIG licence." },
      { figure: "24/7", title: "Real engineers", body: "One number to call at any hour." },
    ],
    faq: {
      items: [
        {
          q: "Which areas do you cover?",
          a: "Coverage depends on last-mile availability at your address. Send it to us and we'll confirm within one business day.",
          verify: "coverage",
        },
        { q: "Can I get a backup link?", a: "Yes, ask about dual-path options." },
        { q: "Do you offer a service level agreement?", a: "Yes, per contract.", verify: "SLA terms" },
        { q: "Do you provide internet for homes?", a: "Mango focuses on dedicated connectivity for organizations: offices, branches, factories and campuses." },
      ],
    },
    cta: {
      title: "Get business internet you can count on.",
      primary: { label: "Check availability", href: quoteHref("enterprise-internet") },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    related: ["data-connectivity", "cloud", "managed-services"],
  },

  /* 4 ---------------------------------------------------------------- */
  "data-connectivity": {
    slug: "data-connectivity",
    layer: "connect",
    name: "Data Connectivity",
    tagline: "Link offices, branches and data centres.",
    icon: Share2,
    seo: {
      title: "Corporate Data Connectivity & Branch Networks",
      description:
        "Private data connectivity between headquarters, branches, factories and data centres in Bangladesh. Secure, predictable links designed and monitored by Mango.",
    },
    hero: {
      overline: "CONNECT · PRIVATE NETWORKS",
      title: "Link every office like it's one building.",
      sub: "Private data connectivity between headquarters, branches, factories and data centres, secure and predictable.",
      primary: { label: "Design my network", href: quoteHref("data-connectivity") },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    aside: {
      kind: "stats",
      title: "NETWORK SNAPSHOT",
      headline: "HQ ⇄ 48 sites",
      verify: "illustrative topology",
      rows: [
        { k: "Topology", v: "Hub & spoke" },
        { k: "Data centre", v: "Mango DC, Dhaka" },
        { k: "Cloud link", v: "Mango Cloud" },
        { k: "Monitoring", v: "24/7" },
      ],
      cta: { label: "Design my network", href: quoteHref("data-connectivity") },
    },
    proof: [
      { k: "PRIVATE", v: "Off the public internet" },
      { k: "MULTI-SITE", v: "Branches, factories, DCs" },
      { k: "DC + CLOUD", v: "Direct links into Mango" },
      { k: "24/7", v: "Network monitoring" },
    ],
    what: {
      title: "Your locations, privately connected.",
      body: "Data connectivity connects your locations privately, so applications, voice and files move between sites without crossing the public internet. It is the foundation for branch banking, multi-site manufacturing and distributed operations.",
    },
    problems: [
      { title: "Branches on the public internet", body: "Sensitive traffic crossing shared networks is a security and audit risk." },
      { title: "Unpredictable apps", body: "Core systems stutter when links are shared." },
      { title: "Hard to manage", body: "Dozens of separate ISP contracts with no single view." },
    ],
    capabilities: {
      title: "Private links for distributed organizations.",
      items: [
        { icon: Cable, title: "Point-to-point links", body: "Dedicated connections between two sites." },
        { icon: Share2, title: "Multipoint networks", body: "Hub-and-spoke or mesh across many locations." },
        { icon: Server, title: "Data centre links", body: "Connect sites directly into Mango Data Centre." },
        { icon: Cloud, title: "Cloud connectivity", body: "Private paths into Mango Cloud." },
        { icon: Wrench, title: "Managed routers", body: "Configured and monitored by Mango.", verify: "managed routers" },
        { icon: Activity, title: "Performance reporting", body: "Visibility across every link.", verify: "reporting" },
      ],
    },
    how: {
      steps: [
        { title: "Discover", body: "Map sites, applications and traffic between them." },
        { title: "Design", body: "Topology, capacity and redundancy per site." },
        { title: "Deploy", body: "Phased rollout across locations." },
        { title: "Operate", body: "24/7 monitoring and a single support line." },
      ],
      panel: {
        title: "USE CASES",
        note: "BY SECTOR",
        rows: [
          { k: "Banks", v: "Branch network to core banking" },
          { k: "Garments", v: "Factory to head office" },
          { k: "Healthcare", v: "Hospital groups" },
          { k: "Distribution", v: "Warehouses and depots" },
          { k: "Government", v: "Multi-office agencies" },
        ],
      },
    },
    why: [
      { figure: "1", title: "Contract for all sites", body: "One partner, one bill, one support line." },
      { figure: "DC + CLOUD", title: "Direct integration", body: "Sites connect straight into Mango hosting." },
      { figure: "24/7", title: "Monitoring", body: "Issues spotted before branches call." },
    ],
    faq: {
      items: [
        {
          q: "How is this different from internet access?",
          a: "Data connectivity links your own sites privately; internet access connects you to the public internet. Many customers use both.",
        },
        { q: "How many sites can you connect?", a: "From two sites to nationwide branch networks. The design scales with your locations.", verify: "site limits" },
        { q: "Can links be encrypted?", a: "Yes. Private links can carry encrypted traffic, and we can design the encryption approach with your security team.", verify: "encryption options" },
        { q: "Can you connect sites outside Dhaka?", a: "Yes. Tell us the locations and we'll confirm the last-mile options for each.", verify: "coverage outside Dhaka" },
      ],
    },
    cta: {
      title: "Design a network that works like one office.",
      primary: { label: "Design my network", href: quoteHref("data-connectivity") },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    related: ["enterprise-internet", "data-centre", "cloud"],
  },

  /* 5 ---------------------------------------------------------------- */
  "data-centre": {
    slug: "data-centre",
    layer: "host",
    name: "Data Centre & Colocation",
    tagline: "Host critical systems in Dhaka.",
    icon: Server,
    seo: {
      title: "Data Centre & Colocation in Dhaka, Bangladesh",
      description:
        "Host servers and applications in Mango's Dhaka data centre. 24/7 monitoring, climate control, 12+ hours power backup, direct IIG connectivity.",
    },
    hero: {
      overline: "HOST · DATA CENTRE",
      title: "Your critical systems, safely at home in Bangladesh.",
      sub: "Colocation, application hosting and storage in a monitored Dhaka data centre, directly connected to Mango's international gateway.",
      primary: { label: "Book a site visit", href: "/contact?intent=visit&service=data-centre" },
      secondary: { label: "Request a quote", href: quoteHref("data-centre") },
    },
    aside: {
      kind: "stats",
      title: "FACILITY AT A GLANCE",
      headline: "Live since 2008",
      rows: [
        { k: "Monitoring", v: "24/7 · 365" },
        { k: "Power backup", v: "12+ hours" },
        { k: "Cooling", v: "Temp & humidity controlled" },
        { k: "Fire", v: "Dedicated sprinklers", verify: "suppression type" },
        { k: "Connectivity", v: "Direct IIG cross-connect" },
      ],
      cta: { label: "Book a site visit", href: "/contact?intent=visit&service=data-centre" },
    },
    proof: [
      { k: "2008", v: "Operating since" },
      { k: "24/7", v: "Monitoring" },
      { k: "12+ HRS", v: "Power backup" },
      { k: "NATIONAL", v: "Govt platforms hosted" },
    ],
    what: {
      title: "A secure home for your servers.",
      body: "A data centre is a secure, power-protected, climate-controlled facility where your servers run. Mango manages the building, power, cooling, security and connectivity. You manage your applications, or ask us to manage them too.",
    },
    problems: [
      { title: "Office server rooms fail", body: "They lose power, overheat and aren't physically secure." },
      { title: "Data must stay local", body: "Some regulated data has to remain inside Bangladesh." },
      { title: "Latency to users", body: "Hosting next to the gateway keeps performance high." },
    ],
    capabilities: {
      title: "Hosting services for critical workloads.",
      items: [
        { icon: Server, title: "Rack & server colocation", body: "Your hardware in our secured facility." },
        { icon: Layers, title: "Application hosting", body: "Run business applications on Mango infrastructure." },
        { icon: Mail, title: "Web & email hosting", body: "Reliable hosting for sites and mail." },
        { icon: HardDrive, title: "Server storage", body: "Capacity for data-heavy workloads." },
        { icon: LifeBuoy, title: "Remote hands", body: "On-site technical help when you need it.", verify: "remote hands" },
        { icon: Link2, title: "IIG cross-connect", body: "Direct connection to international capacity." },
      ],
    },
    how: {
      steps: [
        { title: "Visit", body: "Tour the facility and review your requirements." },
        { title: "Plan", body: "Rack space, power, connectivity and access." },
        { title: "Migrate", body: "Move-in planning with minimal downtime." },
        { title: "Operate", body: "24/7 monitoring, reporting and support." },
      ],
      panel: {
        title: "FACILITY SPECIFICATIONS",
        note: "DETAILS PENDING",
        noteVerify: "facility details",
        rows: [
          { k: "Monitoring", v: "24/7 year-round" },
          { k: "Power", v: "12+ hrs backup", verify: "UPS / generator configuration" },
          { k: "Cooling", v: "Precision, temp + humidity" },
          { k: "Fire protection", v: "Sprinkler system", verify: "suppression type" },
          { k: "Security", v: "Secured building, monitored", verify: "access control, CCTV" },
          { k: "Certifications", v: "Available on request", verify: "e.g. ISO 27001, Tier" },
        ],
      },
    },
    why: [
      { figure: "2008", title: "One of the earliest", body: "Among Bangladesh's earliest commercial data centres, live since 2008." },
      { figure: "GOVT", title: "Trusted nationally", body: "Has hosted platforms for the Bangladesh Government portal, NBR, RJSC, a2i and the CCA.", verify: "wording and permission" },
      { figure: "0 HOPS", title: "Next to the gateway", body: "Fewer hops between your servers and the world." },
    ],
    faq: {
      items: [
        { q: "Can I visit before signing?", a: "Yes, book a site visit and our team will walk you through the facility, power and security." },
        { q: "Do you offer managed hosting?", a: "Yes, see Managed Services. We can run the operating systems and applications on your behalf." },
        { q: "Is my data kept in Bangladesh?", a: "Yes. Colocated and hosted data stays in our Dhaka facility." },
        { q: "What are your power and cooling specifications?", a: "Backup power of 12+ hours and precision cooling with temperature and humidity control. Detailed configuration is shared during your visit.", verify: "UPS / generator configuration" },
      ],
    },
    cta: {
      title: "See the facility for yourself.",
      primary: { label: "Book a site visit", href: "/contact?intent=visit&service=data-centre" },
      secondary: { label: "Request a quote", href: quoteHref("data-centre") },
    },
    related: ["cloud", "managed-services", "ip-transit"],
  },

  /* 6 ---------------------------------------------------------------- */
  cloud: {
    slug: "cloud",
    layer: "host",
    name: "Mango Cloud",
    tagline: "Local cloud servers, storage and backup.",
    icon: Cloud,
    seo: {
      title: "Cloud Servers & Backup in Bangladesh",
      description:
        "Local cloud servers from 1 vCPU, SSD/SAS storage and Backup-as-a-Service, hosted in Bangladesh with 24/7 human support. Estimate your cost.",
    },
    hero: {
      overline: "HOST · MANGO CLOUD",
      title: "Cloud that stays in Bangladesh, and answers the phone.",
      sub: "Virtual servers, storage and backup, hosted locally for data residency and supported by real engineers 24/7.",
      primary: { label: "Estimate cloud cost", href: "#pricing" },
      secondary: { label: "Talk to a cloud specialist", href: "/contact?service=cloud" },
    },
    aside: {
      kind: "estimator",
      title: "CLOUD COST ESTIMATOR",
      submit: "Request this configuration",
      note: "Indicative monthly estimate in BDT. Our cloud team confirms pricing before you commit.",
      verify: "price table",
    },
    proof: [
      { k: "IN-COUNTRY", v: "Data residency" },
      { k: "1 vCPU / 1 GB", v: "Smallest server" },
      { k: "SSD · SAS", v: "Storage options" },
      { k: "24/7", v: "Phone · WhatsApp · Viber" },
    ],
    what: {
      title: "Hybrid cloud, operated from Dhaka.",
      body: "Mango Cloud is a hybrid cloud platform operated from Mango's Bangladesh data centre. You rent computing, storage and bandwidth as you need them, and scale up without buying hardware.",
    },
    problems: [
      { title: "Data leaving the country", body: "Foreign clouds make local compliance harder for banks and government." },
      { title: "Card & FX friction", body: "International billing needs cards and exposes you to exchange rates." },
      { title: "Ticket-only support", body: "Global providers rarely offer a local engineer on the phone." },
    ],
    capabilities: {
      title: "Everything you need to run workloads locally.",
      items: [
        { icon: Server, title: "Cloud servers (VPS)", body: "From 1 vCPU and 1 GB RAM, with bandwidth, storage and a public IP. OS of your choice.", verify: "OS list" },
        { icon: HardDrive, title: "Block storage", body: "Add SSD or SAS volumes to any server." },
        { icon: Archive, title: "Backup-as-a-Service", body: "Protect files, databases and full application workloads in a secure repository, safe from corruption, ransomware and accidental loss." },
        { icon: Layers, title: "Private & hybrid cloud", body: "Dedicated resources with secure access." },
        { icon: KeyRound, title: "Signature-secured access", body: "Access protected with digital signature certificates." },
        { icon: TrendingUp, title: "Scale on demand", body: "Add CPU, memory, storage or bandwidth anytime." },
      ],
    },
    how: {
      steps: [
        { title: "Estimate", body: "Size your servers with the cost estimator." },
        { title: "Provision", body: "We set up servers, storage and networking." },
        { title: "Migrate", body: "Our team helps move workloads from other hosts." },
        { title: "Support", body: "24/7 engineers on phone, email, WhatsApp and Viber." },
      ],
      panel: {
        title: "WHY LOCAL CLOUD",
        note: "MANGO CLOUD",
        rows: [
          { k: "Data residency", v: "Stored in Dhaka" },
          { k: "Scalability", v: "CPU · RAM · storage on demand" },
          { k: "Security", v: "Access control · regular audits" },
          { k: "Reliability", v: "Redundant infrastructure" },
          { k: "Billing", v: "Local currency", verify: "billing" },
          { k: "Contact", v: "cloud@mango.com.bd" },
        ],
      },
    },
    why: [
      { figure: "2008", title: "Hosting heritage", body: "Operating data centre and cloud services since 2008." },
      { figure: "BD", title: "Data stays home", body: "Helps financial and public institutions meet local compliance expectations." },
      { figure: "24/7", title: "Human support", body: "Real engineers, reachable on the apps you already use." },
    ],
    faq: {
      items: [
        { q: "Can I migrate from AWS or another host?", a: "Yes. Our cloud team plans and supports migrations from other providers, including testing and cut-over." },
        { q: "Is there a free trial?", a: "Ask our cloud team about trial options for your workload.", verify: "free trial" },
        { q: "How is billing done?", a: "Monthly, in local currency, for the resources you use.", verify: "billing" },
        { q: "Where is my data physically stored?", a: "In Mango's data centre in Dhaka." },
      ],
    },
    cta: {
      title: "Size your cloud in two minutes.",
      primary: { label: "Estimate cloud cost", href: "#pricing" },
      secondary: { label: "Email cloud@mango.com.bd", href: "mailto:cloud@mango.com.bd" },
    },
    related: ["data-centre", "digital-trust", "managed-services"],
  },

  /* 7 ---------------------------------------------------------------- */
  "digital-trust": {
    slug: "digital-trust",
    layer: "secure",
    name: "Digital Trust · Mango CA",
    tagline: "Digital signature and SSL certificates, PKI.",
    icon: ShieldCheck,
    seo: {
      title: "Digital Signature Certificate & SSL in Bangladesh",
      description:
        "Licensed Certifying Authority since 2011. Digital signature certificates for e-GP, e-filing and documents, SSL/TLS and PKI consulting.",
    },
    hero: {
      overline: "SECURE · LICENSED CERTIFYING AUTHORITY",
      title: "Sign, secure and prove it, legally.",
      sub: "Mango CA issues digital signature and SSL certificates and builds public key infrastructure for government, banks, businesses and individuals, licensed by the CCA since 2011.",
      primary: { label: "Get a certificate", href: "https://www.mangoca.com" },
      secondary: { label: "PKI consultation", href: "/contact?service=digital-trust" },
    },
    aside: {
      kind: "steps",
      title: "GET A CERTIFICATE · 4 STEPS",
      verify: "process",
      steps: ["Choose certificate type", "Submit documents", "Verify identity", "Receive token & sign"],
      cta: { label: "Start at mangoca.com", href: "https://www.mangoca.com" },
    },
    proof: [
      { k: "2011", v: "CCA licence" },
      { k: "ICT ACT 2006", v: "Legally recognized signatures" },
      { k: "FIRST IN BD", v: "Digital & SSL certificates" },
      { k: "GOVT · BANKS", v: "Trusted issuers" },
    ],
    what: {
      title: "An electronic identity the law recognizes.",
      body: "A digital signature certificate is an electronic identity, issued by a licensed Certifying Authority, that lets you sign documents and transactions in a way that is legally recognized under Bangladesh's ICT Act 2006 and ITCA Rules 2010.",
    },
    problems: [
      { title: "Paper slows everything", body: "Wet signatures delay tenders, approvals and filings." },
      { title: "Fraud and forgery", body: "Scanned signatures prove nothing about who signed." },
      { title: "Unencrypted portals", body: "Websites without SSL leak data and lose user trust." },
    ],
    capabilities: {
      title: "Trust services for every kind of signer.",
      items: [
        { icon: Signature, title: "Digital signature certificates", body: "For individuals and organizations.", verify: "classes and token types" },
        { icon: Lock, title: "SSL/TLS certificates", body: "Encrypt websites, portals and APIs." },
        { icon: KeyRound, title: "PKI development", body: "Certificate infrastructure for institutions." },
        { icon: Shield, title: "Security consulting", body: "Architecture and compliance guidance." },
        { icon: Code, title: "E-signature integration", body: "Signing built into your applications." },
        { icon: FileText, title: "e-GP & e-filing", body: "Certificates for tenders and official filings." },
      ],
    },
    how: {
      steps: [
        { title: "Choose", body: "Pick the certificate type for your use." },
        { title: "Apply", body: "Submit documents online or at our office." },
        { title: "Verify", body: "Identity verification as the law requires." },
        { title: "Sign", body: "Receive your token or credentials and start signing." },
      ],
      panel: {
        title: "WHO USES IT",
        note: "USE CASES",
        rows: [
          { k: "Individuals & SMEs", v: "e-GP tenders · e-filing" },
          { k: "Businesses", v: "e-commerce · approvals" },
          { k: "Banks", v: "Internet banking · signing" },
          { k: "Government", v: "e-procurement · e-services" },
          { k: "Developers", v: "SSL for sites & APIs" },
        ],
      },
    },
    why: [
      { figure: "2011", title: "Licensed since", body: "Certifying Authority licence from the CCA." },
      { figure: "1ST", title: "A national first", body: "First to introduce digital and SSL certificates in Bangladesh." },
      { figure: "IN-HOUSE", title: "PKI engineering", body: "Consulting and custom application development." },
    ],
    story: {
      kicker: "MANGO CA · TEAM TRAINING",
      kickerVerify: "session date",
      title: "Building PKI skills inside the team.",
      body: "Mango CA's training on eSign, soft documents and Private Key Infrastructure keeps our certificate team technically self-sufficient.",
      image: "/images/digital_sig_training.jpeg",
      alt: "Mango CA engineers in a digital signature and PKI training session around a conference table",
    },
    faq: {
      items: [
        {
          q: "Is a digital signature legally valid in Bangladesh?",
          a: "Yes. Signatures created with certificates from a CCA-licensed Certifying Authority are recognized under the ICT Act 2006.",
          verify: "legal review",
        },
        { q: "What documents do I need?", a: "Proof of identity and, for organizations, proof of registration and authorization. Mango CA confirms the exact list for your certificate type.", verify: "document list" },
        { q: "How long does issuance take?", a: "Issuance follows identity verification; Mango CA confirms the timeline when you apply.", verify: "issuance time" },
        { q: "Can I use it for e-GP tenders?", a: "Digital signature certificates are used for e-GP tendering in Bangladesh. Confirm the required certificate class with Mango CA before you apply.", verify: "e-GP eligibility" },
      ],
    },
    cta: {
      title: "Start signing digitally today.",
      primary: { label: "Get a certificate", href: "https://www.mangoca.com" },
      secondary: { label: "PKI consultation", href: "/contact?service=digital-trust" },
    },
    related: ["software", "cloud", "training"],
  },

  /* 8 ---------------------------------------------------------------- */
  "managed-services": {
    slug: "managed-services",
    layer: "manage",
    name: "Managed Services",
    tagline: "Your network, monitored and maintained.",
    icon: Activity,
    seo: {
      title: "Managed Network & IT Infrastructure Services",
      description:
        "24/7 monitoring, maintenance and support for networks, servers and cloud from the team that runs a national gateway and data centre in Dhaka.",
    },
    hero: {
      overline: "MANAGE · MANAGED SERVICES",
      title: "We run the infrastructure. You run the business.",
      sub: "24/7 monitoring, maintenance and support for networks, servers and cloud, as an extension of your IT team.",
      primary: { label: "Talk to an engineer", href: "/contact?service=managed-services" },
      secondary: { label: "Request a proposal", href: quoteHref("managed-services") },
    },
    aside: {
      kind: "stats",
      title: "SERVICE OVERVIEW",
      headline: "24/7 NOC coverage",
      rows: [
        { k: "Monitoring", v: "Networks · servers · cloud" },
        { k: "Reporting", v: "Monthly" },
        { k: "Escalation", v: "L1 → L2 → L3", verify: "escalation model" },
        { k: "Contract", v: "Per scope", verify: "contract terms" },
      ],
      cta: { label: "Request a proposal", href: quoteHref("managed-services") },
    },
    proof: [
      { k: "24/7", v: "Monitoring" },
      { k: "MACHINE DATA", v: "Logs & telemetry analysed" },
      { k: "MONTHLY", v: "Service reports" },
      { k: "1 TEAM", v: "Network + DC + cloud" },
    ],
    what: {
      title: "Specialists watching your systems, around the clock.",
      body: "Managed services hand day-to-day operation of your technology to specialists: watching it around the clock, fixing issues before users notice and keeping it current. Mango collects and analyses the machine data from your networks, servers, hypervisors and databases for continuous situational awareness.",
    },
    problems: [
      { title: "Small IT teams stretched", body: "Night and weekend coverage is impossible to staff in-house." },
      { title: "Problems found by users", body: "Outages are discovered when customers complain." },
      { title: "No visibility", body: "Logs across systems are never correlated." },
    ],
    capabilities: {
      title: "Operations coverage for your whole stack.",
      items: [
        { icon: Activity, title: "Network monitoring", body: "Links, routers and firewalls watched 24/7." },
        { icon: Server, title: "Server administration", body: "OS patching, performance and hardening." },
        { icon: Cloud, title: "Cloud & hypervisor ops", body: "Virtual infrastructure kept healthy." },
        { icon: FileText, title: "Log collection & analysis", body: "Machine data indexed for insight." },
        { icon: Archive, title: "Backup management", body: "Backups run, checked and restorable." },
        { icon: LifeBuoy, title: "Incident response", body: "Structured escalation and resolution.", verify: "vendor coordination scope" },
      ],
    },
    how: {
      steps: [
        { title: "Assess", body: "Audit your infrastructure and define scope." },
        { title: "Onboard", body: "Deploy monitoring and document runbooks." },
        { title: "Monitor", body: "24/7 watch with alerting and response." },
        { title: "Improve", body: "Monthly reports and recommendations." },
      ],
      panel: {
        title: "ESCALATION MODEL",
        note: "PENDING CONFIRMATION",
        noteVerify: "escalation windows",
        rows: [
          { k: "Level 1", v: "Operations desk · triage", verify: "L1 scope" },
          { k: "Level 2", v: "Senior engineer · diagnosis", verify: "L2 scope" },
          { k: "Level 3", v: "Head of network operations", verify: "L3 scope" },
          { k: "Reporting", v: "Monthly service review" },
          { k: "Contact", v: SUPPORT_PHONE },
        ],
      },
    },
    why: [
      { figure: "IIG + DC", title: "We run national infrastructure", body: "The same team operates a gateway and data centre." },
      { figure: "24/7", title: "Staffed, not automated", body: "Engineers on shift around the clock." },
      { figure: "1", title: "Accountable partner", body: "Network, hosting and cloud under one contract." },
    ],
    faq: {
      items: [
        { q: "Do you manage equipment not hosted at Mango?", a: "Yes. We can monitor and manage infrastructure at your premises or other data centres, subject to access and scope." },
        { q: "What does onboarding involve?", a: "An assessment of your environment, deployment of monitoring agents and collectors, and documented runbooks agreed with your team." },
        { q: "Can we keep some tasks in-house?", a: "Yes. Scope is defined per contract, so your team can keep the responsibilities it wants." },
        { q: "How are incidents reported?", a: "Through agreed alerting channels during the incident and in the monthly service report afterwards.", verify: "reporting channels" },
      ],
    },
    cta: {
      title: "Hand over the night shift.",
      primary: { label: "Request a proposal", href: quoteHref("managed-services") },
      secondary: { label: "Talk to an engineer", href: "/contact?service=managed-services" },
    },
    related: ["data-centre", "cloud", "enterprise-internet"],
  },

  /* 9 ---------------------------------------------------------------- */
  software: {
    slug: "software",
    layer: "manage",
    name: "Software & Integration",
    tagline: "Systems built around your processes.",
    icon: Code,
    seo: {
      title: "Custom Software & System Integration in Bangladesh",
      description:
        "Custom applications, e-signature integration and system integration for institutions and enterprises, built and hosted in Bangladesh by Mango.",
    },
    hero: {
      overline: "BUILD · SOFTWARE & INTEGRATION",
      title: "Software shaped around how you actually work.",
      sub: "Custom applications, e-signature integration and system integration for institutions and enterprises.",
      primary: { label: "Discuss a project", href: quoteHref("software") },
      secondary: { label: "See our process", href: "#how-it-works" },
    },
    aside: {
      kind: "form",
      title: "PROJECT BRIEF",
      fields: [
        { name: "type", label: "Project type", options: ["Workflow application", "Portal or e-service", "System integration", "Database solution", "Not sure yet"] },
        { name: "integrations", label: "Integrations", options: ["Core system + e-signature", "E-signature only", "APIs and data exchange", "None yet"] },
        { name: "hosting", label: "Hosting", options: ["Mango Cloud", "Mango Data Centre", "Your own infrastructure", "Advise me"] },
        { name: "timeline", label: "Timeline", options: ["Under 3 months", "3–6 months", "6–12 months", "Flexible"] },
      ],
      submit: "Send brief",
    },
    proof: [
      { k: "PKI-READY", v: "Signature integration built in" },
      { k: "API", v: "System integration" },
      { k: "CLOUD", v: "Hosted on Mango Cloud" },
      { k: "LOCAL", v: "Dhaka engineering team" },
    ],
    what: {
      title: "From paper process to working system.",
      body: "We design and build applications around your real operational processes, then host, secure and support them on Mango infrastructure. Our strength is software that needs to be trusted: signed approvals, secure portals and integrations with existing systems.",
    },
    problems: [
      { title: "Processes stuck on paper", body: "Approvals, filings and records still move by hand." },
      { title: "Systems that don't talk", body: "Core platforms hold data that other teams re-enter manually." },
      { title: "Vendors who disappear", body: "Software delivered without hosting, security or support." },
    ],
    capabilities: {
      title: "What we build.",
      items: [
        { icon: Workflow, title: "Business & workflow apps", body: "Digitize approvals, records and operations." },
        { icon: Signature, title: "E-signature & PKI integration", body: "Legally valid signing inside your apps." },
        { icon: Braces, title: "APIs & system integration", body: "Connect core platforms and data." },
        { icon: Globe, title: "Portals & e-services", body: "Citizen, customer and partner portals." },
        { icon: Database, title: "Database solutions", body: "Design, migration and optimization." },
        { icon: ShieldCheck, title: "Secure by design", body: "Built on Mango's trust infrastructure." },
      ],
    },
    how: {
      steps: [
        { title: "Discover", body: "Map the process, users and requirements." },
        { title: "Design", body: "Architecture, user journeys and technical approach." },
        { title: "Build", body: "Develop, integrate, test and document." },
        { title: "Operate", body: "Host on Mango Cloud, support and improve." },
      ],
      panel: {
        title: "PORTFOLIO",
        note: "DELIVERED PROJECTS",
        noteVerify: "portfolio: add 2–3 real delivered projects",
        rows: [
          { k: "Project 1", v: "Client · scope · outcome", verify: "portfolio" },
          { k: "Project 2", v: "Client · scope · outcome", verify: "portfolio" },
          { k: "Project 3", v: "Client · scope · outcome", verify: "portfolio" },
          { k: "Stack", v: "Shared on request", verify: "technologies" },
        ],
      },
    },
    why: [
      { figure: "BUILD + HOST", title: "End to end", body: "Software, hosting and security from one partner." },
      { figure: "PKI", title: "Trust built in", body: "Native digital signature integration from our CA." },
      { figure: "LOCAL", title: "Close to you", body: "Engineers in Dhaka, working your hours." },
    ],
    faq: {
      items: [
        { q: "Do you build mobile apps?", a: "We focus on web and enterprise applications; mobile scope can be discussed per project.", verify: "mobile scope" },
        { q: "Who owns the source code?", a: "Ownership and licensing are agreed in the contract before work starts.", verify: "IP terms" },
        { q: "Can you take over an existing system?", a: "Yes. We start with an assessment of the code, data and hosting, then agree a stabilization and improvement plan." },
        { q: "Do you provide ongoing support?", a: "Yes. Applications can be hosted on Mango Cloud and supported under a managed services agreement." },
      ],
    },
    cta: {
      title: "Tell us about the process you want to fix.",
      primary: { label: "Discuss a project", href: quoteHref("software") },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    related: ["digital-trust", "cloud", "managed-services"],
  },

  /* 10 --------------------------------------------------------------- */
  training: {
    slug: "training",
    layer: "manage",
    name: "Training & Capability",
    tagline: "Build technical capability in-house.",
    icon: GraduationCap,
    seo: {
      title: "IT, Network & Cybersecurity Training for Organizations",
      description:
        "Practical technical training for government and enterprise teams in Bangladesh: programming, databases, networks, security and QA, delivered by Mango engineers.",
    },
    hero: {
      overline: "BUILD · TRAINING",
      title: "Build the capability to run it yourself.",
      sub: "Practical technical training for government and enterprise teams, delivered by engineers who operate national infrastructure.",
      primary: { label: "Request a training programme", href: quoteHref("training") },
      secondary: { label: "View courses", href: "#capabilities" },
    },
    aside: {
      kind: "stats",
      title: "LATEST COHORT",
      headline: "18 officials · 5 courses",
      rows: [
        { k: "Client", v: "National Board of Revenue" },
        { k: "Duration", v: "6 months" },
        { k: "Graduated", v: "12 Dec 2023" },
        { k: "Goal", v: "Technical self-sufficiency" },
      ],
      cta: { label: "Request a programme", href: quoteHref("training") },
    },
    proof: [
      { k: "18", v: "NBR officials certified" },
      { k: "5", v: "Advanced courses" },
      { k: "6 MONTHS", v: "Cohort programme" },
      { k: "ON-SITE", v: "Or at Mango, Gulshan" },
    ],
    what: {
      title: "Training that reduces dependence on vendors.",
      body: "Technology only creates value when your people can run it. Mango designs multi-month, hands-on programmes in programming, databases, networks, security and QA, taught by the engineers who run our gateway, data centre and certificate authority.",
    },
    problems: [
      { title: "Vendor lock-in", body: "Every change needs an outside supplier." },
      { title: "Skills gaps", body: "Teams inherit systems they were never trained on." },
      { title: "Generic courses", body: "Classroom theory that doesn't match real infrastructure." },
    ],
    capabilities: {
      title: "Programmes we deliver.",
      items: [
        { icon: Terminal, title: "Programming (Java)", body: "Advanced application development." },
        { icon: Database, title: "Database systems", body: "Design, administration and tuning." },
        { icon: Network, title: "Network administration", body: "Routing, switching and operations." },
        { icon: Shield, title: "Systems security", body: "Hardening, monitoring and response." },
        { icon: ClipboardCheck, title: "Software QA", body: "Testing practice and quality assurance." },
        { icon: FileKey, title: "Digital signature & PKI", body: "Certificates, eSign and trust services.", verify: "current catalogue" },
      ],
    },
    how: {
      steps: [
        { title: "Assess", body: "Understand team skills and target capabilities." },
        { title: "Design", body: "Build a cohort curriculum and schedule." },
        { title: "Deliver", body: "Hands-on sessions on-site or at Mango." },
        { title: "Certify", body: "Assessment and certificates of achievement." },
      ],
      panel: {
        title: "FORMATS",
        note: "CATALOGUE PENDING",
        noteVerify: "current catalogue",
        rows: [
          { k: "On-site", v: "At your office" },
          { k: "Mango training room", v: "Gulshan, Dhaka" },
          { k: "Cohort length", v: "Multi-month programmes" },
          { k: "Certification", v: "Certificate of achievement" },
        ],
      },
    },
    why: [
      { figure: "OPERATORS", title: "Taught by practitioners", body: "Engineers who run live national infrastructure." },
      { figure: "NBR", title: "Proven with government", body: "Five advanced courses delivered to NBR officials." },
      { figure: "CUSTOM", title: "Built for your stack", body: "Curriculum mapped to your systems." },
    ],
    story: {
      kicker: "CASE STORY · NBR · 12 DEC 2023",
      title: "NBR officials graduate from five advanced technology courses.",
      body: "At a ceremony at the National Board of Revenue on 12 December 2023, Mr. AKM Badiul Alam, Member (Tax Information Management and Services), awarded certificates to 18 NBR officials. They had completed five advanced courses over six months: Java programming, database systems, network administration, systems security and software quality assurance.",
      image: "/images/nbr_training.jpg",
      alt: "NBR officials and Mango trainers holding certificates at the graduation ceremony in Dhaka",
      link: { label: "Read the case study", href: "/resources/case-studies/nbr-training" },
    },
    faq: {
      items: [
        { q: "Can training be delivered at our office?", a: "Yes. Programmes run on-site at your premises or in Mango's training room in Gulshan." },
        { q: "How many participants per cohort?", a: "Cohorts are sized to keep sessions hands-on; the NBR programme certified 18 officials. We agree the number with you when designing the programme.", verify: "cohort size" },
        { q: "Do participants receive certificates?", a: "Yes. Participants who complete the assessment receive a certificate of achievement." },
        { q: "Can you customize the curriculum?", a: "Yes. Every programme is mapped to the systems and skills your team actually needs." },
      ],
    },
    cta: {
      title: "Build a stronger technical team.",
      primary: { label: "Request a programme", href: quoteHref("training") },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    related: ["software", "digital-trust", "managed-services"],
  },
};

export const solutionSlugs = Object.keys(solutions) as SolutionSlug[];

export function getSolution(slug: string): Solution | undefined {
  return (solutions as Record<string, Solution>)[slug];
}

/** Resolve `related` entries to card data. */
export function relatedCards(s: Solution): { title: string; line: string; href: string; icon: LucideIcon; layer: string }[] {
  return s.related.map((r) => {
    if (typeof r === "string") {
      const t = solutions[r];
      return { title: t.name, line: t.tagline, href: `/solutions/${t.slug}`, icon: t.icon, layer: LAYER_LABEL[t.layer] };
    }
    return { title: r.label, line: "Subsea, terrestrial and content interconnects.", href: r.href, icon: Landmark, layer: "Company" };
  });
}
