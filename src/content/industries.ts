import { Banknote, Building2, GraduationCap, Landmark, RadioTower, Rocket, type LucideIcon } from "lucide-react";

/**
 * Industries content (Website Content/04-Industries-Resources-Careers-Contact.md, Template B).
 * Every number here is from the verified fact register; anything else is flagged with `verify`.
 */

export type StackLayer = "CONNECT" | "HOST" | "SECURE" | "MANAGE" | "BUILD";

export type IndustryStackRow = {
  title: string;
  line: string;
  layer: StackLayer;
  /** Solution page (owned by the solutions agent). */
  href: string;
};

export type IndustryProof = {
  k: string;
  v: string;
  /** Wraps the figure in <Verify note> when set. */
  verify?: string;
};

export type IndustryCaseTeaser = {
  kicker: string;
  title: string;
  body: string;
  note?: string;
  /** Title/body are placeholders awaiting client approval. */
  placeholder: boolean;
  href: string;
  cta: string;
  /** Optional image for a real (published) story. */
  image?: { src: string; alt: string };
};

export type Industry = {
  slug: string;
  /** Menu / card name. */
  name: string;
  /** Long name used in breadcrumbs and overlines. */
  longName: string;
  icon: LucideIcon;
  /** Hub card copy. */
  card: { line: string; tags: string[] };
  hero: {
    title: string;
    sub: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
  proof: [IndustryProof, IndustryProof, IndustryProof];
  challenges: { title: string; body: string }[];
  stack: IndustryStackRow[];
  /** Regulatory/legal note shown under the stack (wrapped in <Verify>). */
  compliance?: { text: string; verify: string };
  caseStudy: IndustryCaseTeaser;
  cta: { title: string; body?: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } };
  seo: { title: string; description: string };
};

export const industriesHub = {
  overline: "INDUSTRIES",
  title: "Built for organizations that can't afford downtime.",
  sub: "The same licensed infrastructure, shaped around the realities of your sector.",
  gridLabel: "SIX SECTORS · ONE BACKBONE",
  cta: {
    title: "Don't see your sector? Tell us what you run.",
    body: "Every engagement starts with an engineer mapping what you have to what you need. No sector is too specific.",
    primary: { label: "Talk to an engineer", href: "/contact" },
  },
  seo: {
    title: "Industries We Serve: ISPs, Banks, Government & Enterprise",
    description:
      "Licensed connectivity, hosting and digital trust shaped for ISPs and operators, banks, government, enterprises, education and digital businesses in Bangladesh.",
  },
};

const placeholderCase = (note: string, href = "/resources/case-studies"): IndustryCaseTeaser => ({
  kicker: "CASE STUDY · COMING SOON",
  title: "[Client name]: [measurable outcome]",
  body: "Challenge → what Mango delivered → architecture → measured outcome.",
  note,
  placeholder: true,
  href,
  cta: "See all case studies",
});

export const industries: Industry[] = [
  {
    slug: "isps-operators",
    name: "ISPs & Operators",
    longName: "ISPs & Operators",
    icon: RadioTower,
    card: { line: "Wholesale capacity and international routes.", tags: ["IP Transit", "Circuits", "Colocation"] },
    hero: {
      title: "Capacity your subscribers never have to think about.",
      sub: "Wholesale bandwidth, international routes and 24/7 escalation for nationwide and zonal ISPs, NTTNs and mobile operators.",
      primary: { label: "Request capacity quote", href: "/contact?intent=quote" },
      secondary: { label: "See case studies", href: "/resources/case-studies" },
    },
    proof: [
      { k: "2008", v: "First private IIG licence" },
      { k: "SMW-4 · SMW-5", v: "Subsea rights of use" },
      { k: "7+", v: "Direct content interconnects" },
    ],
    challenges: [
      { title: "Peak-hour congestion", body: "Subscriber complaints spike when upstream capacity runs tight in the evening." },
      { title: "Cable-cut outages", body: "A single international route turns a sea-bed incident into a national outage." },
      { title: "Slow content", body: "Too many hops to the platforms your subscribers use most, and slow escalation when it breaks." },
    ],
    stack: [
      { title: "IP Transit & Bandwidth", line: "Committed capacity through Bangladesh's first private IIG.", layer: "CONNECT", href: "/solutions/ip-transit" },
      { title: "International Circuits", line: "Diverse international paths via ITC and subsea.", layer: "CONNECT", href: "/solutions/international-circuits" },
      { title: "Data Centre colocation", line: "Host caches and core equipment next to the gateway.", layer: "HOST", href: "/solutions/data-centre" },
      { title: "Managed Services", line: "24/7 monitoring with structured escalation.", layer: "MANAGE", href: "/solutions/managed-services" },
    ],
    caseStudy: placeholderCase("Content interconnects with Google, Meta, Amazon, Akamai, Equinix, DE-CIX and Zenlayer."),
    cta: {
      title: "Plan your next capacity upgrade.",
      body: "Tell us your licence type, the capacity you need and where you want the handoff. An engineer replies, not a call centre.",
      primary: { label: "Request capacity quote", href: "/contact?intent=quote" },
      secondary: { label: "See our network", href: "/network" },
    },
    seo: {
      title: "IP Transit & Bandwidth for ISPs and Operators in Bangladesh",
      description:
        "Wholesale IP transit, international circuits and colocation for ISPs, NTTNs and mobile operators, from Bangladesh's first private IIG with SMW-4 and SMW-5 rights of use.",
    },
  },
  {
    slug: "banking-finance",
    name: "Banking & Finance",
    longName: "Banking & Financial Services",
    icon: Banknote,
    card: { line: "Local hosting, private circuits, digital signatures.", tags: ["Cloud", "IPLC", "Mango CA"] },
    hero: {
      title: "Infrastructure a regulator would approve of.",
      sub: "In-country hosting, private circuits and legally valid digital signatures for banks, NBFIs, insurers and fintechs.",
      primary: { label: "Book a consultation", href: "/contact" },
      secondary: { label: "See case studies", href: "/resources/case-studies" },
    },
    proof: [
      { k: "IN-COUNTRY", v: "Data stays in Bangladesh" },
      { k: "2011", v: "Licensed Certifying Authority" },
      { k: "24/7", v: "Monitoring & support" },
    ],
    challenges: [
      { title: "Data residency & audit", body: "Regulators expect sensitive data and systems to stay in Bangladesh, with evidence." },
      { title: "Disaster recovery", body: "Core banking needs reliable replication between sites, on links you control." },
      { title: "Transaction trust", body: "Approvals and online banking require strong, legally recognised authentication." },
    ],
    stack: [
      { title: "Mango Cloud & Data Centre", line: "In-country hosting for core and DR workloads.", layer: "HOST", href: "/solutions/cloud" },
      { title: "International Circuits (IPLC)", line: "Private links for DR sites and international hubs.", layer: "CONNECT", href: "/solutions/international-circuits" },
      { title: "Digital signatures & PKI", line: "Transaction signing and authentication via Mango CA.", layer: "SECURE", href: "/solutions/digital-trust" },
      { title: "Data Connectivity", line: "Private branch networks back to core banking.", layer: "CONNECT", href: "/solutions/data-connectivity" },
    ],
    compliance: {
      text: "Aligns with local data-residency expectations for financial institutions.",
      verify: "Legal review: cite Bangladesh Bank ICT guideline version",
    },
    caseStudy: placeholderCase("Bank connectivity and digital signature rollout: story in capture."),
    cta: {
      title: "Build infrastructure your auditors trust.",
      body: "A consultation with a Mango engineer covers residency, DR paths and signing in one conversation.",
      primary: { label: "Book a consultation", href: "/contact" },
      secondary: { label: "Explore Digital Trust", href: "/solutions/digital-trust" },
    },
    seo: {
      title: "Banking & Financial Services Infrastructure in Bangladesh",
      description:
        "In-country cloud and data centre, IPLC for disaster recovery and licensed digital signatures for banks, NBFIs, insurers and fintechs in Bangladesh.",
    },
  },
  {
    slug: "government",
    name: "Government",
    longName: "Government & Public Sector",
    icon: Landmark,
    card: { line: "Licensed trust services and in-country hosting.", tags: ["Data Centre", "Mango CA", "Training"] },
    hero: {
      title: "Trusted infrastructure for public services.",
      sub: "In-country hosting, licensed trust services and hands-on training for ministries, agencies and public platforms.",
      primary: { label: "Request a proposal", href: "/contact" },
      secondary: { label: "See case studies", href: "/resources/case-studies" },
    },
    proof: [
      { k: "GOVT", v: "Has hosted the Government portal, NBR, RJSC, a2i and CCA resources", verify: "permission to name" },
      { k: "18", v: "NBR officials trained (2023)" },
      { k: "2011", v: "CCA-licensed Certifying Authority" },
    ],
    challenges: [
      { title: "National data at home", body: "Citizen and government data must be hosted inside Bangladesh." },
      { title: "Legally valid e-services", body: "e-Procurement and e-services need licensed digital signatures to hold up." },
      { title: "Vendor dependence", body: "Agencies need in-house capability, not another contract to manage." },
    ],
    stack: [
      { title: "Data Centre & Mango Cloud", line: "Hosting for portals, applications and records.", layer: "HOST", href: "/solutions/data-centre" },
      { title: "Mango CA certificates & PKI", line: "Officer signing, e-GP and e-services.", layer: "SECURE", href: "/solutions/digital-trust" },
      { title: "Training", line: "Multi-month programmes for technical self-sufficiency.", layer: "BUILD", href: "/solutions/training" },
      { title: "Managed Services", line: "24/7 operations support for public platforms.", layer: "MANAGE", href: "/solutions/managed-services" },
    ],
    caseStudy: {
      kicker: "CASE STUDY · NATIONAL BOARD OF REVENUE · DEC 2023",
      title: "18 NBR officials. 5 advanced technology courses.",
      body: "Java, databases, network administration, systems security and QA, part of NBR's drive for technical self-sufficiency.",
      note: "Reference use of government names requires permission.",
      placeholder: false,
      href: "/resources/case-studies/nbr-training",
      cta: "Read the case study",
      image: { src: "/images/nbr_training.jpg", alt: "National Board of Revenue officials at a Mango-delivered technical training session in Dhaka" },
    },
    cta: {
      title: "Deliver public services on trusted infrastructure.",
      body: "Send us the scope. We'll return a proposal that covers hosting, certificates and the training to run it yourselves.",
      primary: { label: "Request a proposal", href: "/contact" },
      secondary: { label: "Explore Training", href: "/solutions/training" },
    },
    seo: {
      title: "Government & Public Sector Hosting, PKI and Training",
      description:
        "In-country data centre and cloud, CCA-licensed digital certificates and hands-on technical training for ministries, agencies and public platforms in Bangladesh.",
    },
  },
  {
    slug: "enterprise",
    name: "Enterprise & MNCs",
    longName: "Enterprise & Multinationals",
    icon: Building2,
    card: { line: "One partner for every site and system.", tags: ["Internet", "Data Connectivity", "Managed"] },
    hero: {
      title: "One accountable partner for every site and system.",
      sub: "Dedicated internet, private circuits, branch networks and managed infrastructure for manufacturers, conglomerates and multinationals.",
      primary: { label: "Talk to an engineer", href: "/contact" },
      secondary: { label: "See case studies", href: "/resources/case-studies" },
    },
    proof: [
      { k: "1", v: "Contract for every layer" },
      { k: "IIG + ISP", v: "Gateway and access provider" },
      { k: "24/7", v: "Single support line" },
    ],
    challenges: [
      { title: "Too many vendors", body: "Separate ISPs, hosts and IT contractors, with no single owner when things break." },
      { title: "Sites that drift apart", body: "Factories, branches and HQ run on inconsistent networks and policies." },
      { title: "Global connections", body: "Regional headquarters need reliable private links abroad, not best-effort internet." },
    ],
    stack: [
      { title: "Enterprise Internet", line: "Dedicated access with backup options.", layer: "CONNECT", href: "/solutions/enterprise-internet" },
      { title: "Data Connectivity", line: "Private networks across every site.", layer: "CONNECT", href: "/solutions/data-connectivity" },
      { title: "International Circuits", line: "IPLC to regional and global offices.", layer: "CONNECT", href: "/solutions/international-circuits" },
      { title: "Managed Services", line: "24/7 operations for your network and infrastructure.", layer: "MANAGE", href: "/solutions/managed-services" },
      { title: "Cloud Backup", line: "Protected off-site copies inside Bangladesh.", layer: "HOST", href: "/solutions/cloud#backup" },
    ],
    caseStudy: placeholderCase("Suitable for garments, pharma, FMCG, logistics and MNC country offices."),
    cta: {
      title: "Simplify your technology partners.",
      body: "One engineer walks through your sites, links and systems and shows what one contract would look like.",
      primary: { label: "Talk to an engineer", href: "/contact" },
      secondary: { label: "Explore Managed Services", href: "/solutions/managed-services" },
    },
    seo: {
      title: "Enterprise Connectivity & Managed Infrastructure in Bangladesh",
      description:
        "Dedicated business internet, private data connectivity, IPLC and managed services for manufacturers, conglomerates and multinationals, under one accountable partner.",
    },
  },
  {
    slug: "education",
    name: "Education",
    longName: "Education",
    icon: GraduationCap,
    card: { line: "Connected campuses, classroom to cloud.", tags: ["Internet", "Cloud", "SSL"] },
    hero: {
      title: "Connected campuses, from classroom to cloud.",
      sub: "Reliable connectivity, local cloud hosting, SSL and training for universities, schools and learning platforms.",
      primary: { label: "Talk to an engineer", href: "/contact" },
      secondary: { label: "See case studies", href: "/resources/case-studies" },
    },
    proof: [
      { k: "LOCAL", v: "Cloud hosted in Dhaka" },
      { k: "SSL", v: "From a licensed CA" },
      { k: "2012", v: "Education investment via Playpen", verify: "group education status" },
    ],
    challenges: [
      { title: "Exam-day traffic", body: "Portals and LMS platforms collapse under peak load on the days that matter." },
      { title: "Campus connectivity", body: "Thousands of students share limited bandwidth across halls and labs." },
      { title: "Limited IT staff", body: "Small teams run large, complex environments without time to train." },
    ],
    stack: [
      { title: "Enterprise Internet", line: "Dedicated campus connectivity.", layer: "CONNECT", href: "/solutions/enterprise-internet" },
      { title: "Mango Cloud", line: "LMS, admissions and result portals hosted locally.", layer: "HOST", href: "/solutions/cloud" },
      { title: "SSL/TLS certificates", line: "Secure student and staff portals.", layer: "SECURE", href: "/solutions/digital-trust#ssl" },
      { title: "Training", line: "Upskill campus IT teams.", layer: "BUILD", href: "/solutions/training" },
    ],
    caseStudy: placeholderCase("Group commitment to education: Playpen School and Baira College."),
    cta: {
      title: "Keep learning online, even at peak.",
      body: "Tell us your student numbers and the platforms you run. We'll size the connectivity and hosting together.",
      primary: { label: "Talk to an engineer", href: "/contact" },
      secondary: { label: "Explore Mango Cloud", href: "/solutions/cloud" },
    },
    seo: {
      title: "Connectivity & Cloud for Universities and Schools in Bangladesh",
      description:
        "Dedicated campus internet, locally hosted LMS and portals, SSL certificates and IT training for universities, schools and learning platforms in Bangladesh.",
    },
  },
  {
    slug: "digital-business",
    name: "Digital Businesses",
    longName: "Digital Businesses",
    icon: Rocket,
    card: { line: "Local infrastructure that scales with users.", tags: ["Cloud", "Bandwidth", "Backup"] },
    hero: {
      title: "Local infrastructure that scales with your users.",
      sub: "Cloud servers, bandwidth, SSL and backup for SaaS, e-commerce, fintech and media companies serving Bangladesh.",
      primary: { label: "Estimate cloud cost", href: "/solutions/cloud#pricing" },
      secondary: { label: "See case studies", href: "/resources/case-studies" },
    },
    proof: [
      { k: "1 vCPU", v: "Start small, scale on demand" },
      { k: "LOCAL", v: "Hosted near your users" },
      { k: "24/7", v: "Phone · WhatsApp · Viber" },
    ],
    challenges: [
      { title: "Latency to local users", body: "Hosting abroad adds delay for every Bangladeshi customer, on every request." },
      { title: "Card & FX friction", body: "Global clouds bill in dollars on international cards, with no local invoice." },
      { title: "No one to call", body: "Ticket queues during a production incident, in someone else's time zone." },
    ],
    stack: [
      { title: "Mango Cloud servers", line: "Scale from 1 vCPU as your users grow.", layer: "HOST", href: "/solutions/cloud" },
      { title: "Bandwidth", line: "Capacity close to the international gateway.", layer: "CONNECT", href: "/solutions/enterprise-internet" },
      { title: "SSL/TLS", line: "Encrypt checkout, apps and APIs.", layer: "SECURE", href: "/solutions/digital-trust#ssl" },
      { title: "Backup-as-a-Service", line: "Protect production data with off-site copies.", layer: "HOST", href: "/solutions/cloud#backup" },
    ],
    compliance: { text: "Pay in BDT, host close to Bangladeshi users, talk to a real engineer.", verify: "billing model" },
    caseStudy: placeholderCase("Digital business story in capture: SaaS or e-commerce scale-up on Mango Cloud."),
    cta: {
      title: "Launch closer to your customers.",
      body: "Size a server, add bandwidth and backup, and see what it costs in taka before you talk to anyone.",
      primary: { label: "Estimate cloud cost", href: "/solutions/cloud#pricing" },
      secondary: { label: "Talk to an engineer", href: "/contact" },
    },
    seo: {
      title: "Cloud Hosting & Bandwidth for Digital Businesses in Bangladesh",
      description:
        "Local cloud servers from 1 vCPU, bandwidth near the gateway, SSL and Backup-as-a-Service for SaaS, e-commerce, fintech and media companies serving Bangladesh.",
    },
  },
];

export const industrySlugs = industries.map((i) => i.slug);

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}

/** Layer pill → short description used as tooltip / sr text. */
export const layerMeta: Record<StackLayer, { label: string; desc: string }> = {
  CONNECT: { label: "Connect", desc: "Reach the world reliably" },
  HOST: { label: "Host", desc: "Run critical workloads at home" },
  SECURE: { label: "Secure", desc: "Trust every digital transaction" },
  MANAGE: { label: "Manage", desc: "Extend your team" },
  BUILD: { label: "Build", desc: "Build capability in-house" },
};
