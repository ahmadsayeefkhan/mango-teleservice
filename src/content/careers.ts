/**
 * Careers content. Copy from `Website Content/04-…md` (verbatim). The three roles are SAMPLE
 * listings (the real list is CMS-driven); they are marked as such in the UI via <Verify>.
 */
import type { LucideIcon } from "lucide-react";
import { Award, Layers, Server, ShieldCheck } from "lucide-react";

export const careersHero = {
  overline: "CAREERS",
  title: "Build the network millions of people use without noticing.",
  sub: "Join engineers, security specialists, developers and sales professionals who keep Bangladesh connected.",
  primary: { label: "View open roles", href: "#open-roles" },
  secondary: { label: "Life at Mango", href: "#why-mango" },
  image: { src: "/images/careers-noc-team.png", alt: "Mango network operations engineers reviewing routes on the NOC wall in Dhaka" },
} as const;

export type WhyCard = { icon: LucideIcon; title: string; body: string };

export const whyMango = {
  overline: "WHY WORK HERE",
  title: "Real infrastructure. Real responsibility.",
  cards: [
    { icon: Server, title: "Work on real infrastructure", body: "Gateways, subsea capacity, data centres and a certificate authority, not slideware." },
    { icon: Award, title: "Learn from pioneers", body: "A leadership team that built national firsts." },
    { icon: Layers, title: "Grow across disciplines", body: "Networks, cloud, security, software and business." },
    { icon: ShieldCheck, title: "Stability with purpose", body: "An 18-year-old company still building what's next." },
  ] satisfies WhyCard[],
  /** [VERIFY: benefits — health, training budget, festival bonus, etc.] */
  benefits: ["Health coverage", "Training budget", "Festival bonuses", "Certification support"],
  benefitsVerify: "benefits — health, training budget, festival bonus, etc.",
} as const;

export type Team = { id: string; name: string; line: string };

export const teams: Team[] = [
  { id: "network-operations", name: "Network Operations", line: "Keep the gateway and routes running 24/7." },
  { id: "data-centre-cloud", name: "Data Centre & Cloud", line: "Operate hosting and Mango Cloud." },
  { id: "ca-security", name: "Mango CA & Security", line: "Run certificate and PKI services." },
  { id: "software", name: "Software", line: "Build integrations and applications." },
  { id: "sales", name: "Sales & Business Development", line: "Grow enterprise and carrier accounts nationwide." },
  { id: "finance-admin", name: "Finance & Administration", line: "Keep the company running smoothly." },
];

export type Role = {
  slug: string;
  title: string;
  teamId: Team["id"];
  location: string;
  workplace: "On-site" | "Hybrid" | "Remote";
  type: "Full-time" | "Contract" | "Internship";
  experience: string;
  /** [VERIFY] — CMS-driven in production. */
  deadline: string;
  summary: string;
  about: string;
  responsibilities: string[];
  requirements: string[];
};

export const roles: Role[] = [
  {
    slug: "senior-network-engineer-bgp-ip-core",
    title: "Senior Network Engineer (BGP/IP Core)",
    teamId: "network-operations",
    location: "Dhaka",
    workplace: "On-site",
    type: "Full-time",
    experience: "5+ years experience",
    deadline: "[date]",
    summary: "Keep Mango's international gateway and IP core running at carrier grade.",
    about:
      "Keep Mango's international gateway and IP core running at carrier grade, working with upstream carriers and ISP customers.",
    responsibilities: [
      "Design, configure and troubleshoot BGP routing across upstream and downstream peers",
      "Monitor capacity and performance on subsea and terrestrial routes",
      "Lead incident response and root-cause analysis",
      "Mentor junior NOC engineers",
    ],
    requirements: [
      "BSc in EEE, CSE or Telecommunication Engineering",
      "5+ years in ISP/IIG/carrier network operations",
      "Strong BGP, OSPF, MPLS knowledge; CCNP/JNCIP preferred",
      "Willingness to join on-call rotation",
    ],
  },
  {
    slug: "corporate-sales-executive",
    title: "Corporate Sales Executive",
    teamId: "sales",
    location: "Nationwide",
    workplace: "Hybrid",
    type: "Full-time",
    experience: "3+ years experience",
    deadline: "[date]",
    summary: "Grow enterprise, bank and carrier accounts across Bangladesh.",
    about:
      "Grow Mango's enterprise and carrier accounts: dedicated internet, private circuits, data centre and cloud, sold to organizations that cannot afford downtime.",
    responsibilities: [
      "Build a pipeline of enterprise, bank and ISP accounts across Bangladesh",
      "Scope requirements with our engineers and prepare proposals",
      "Own renewals and account growth for existing customers",
      "Report pipeline and forecasts weekly",
    ],
    requirements: [
      "Bachelor's degree in business, marketing or engineering",
      "3+ years of B2B sales in telecom, IT services or SaaS",
      "Comfortable explaining bandwidth, circuits and hosting to technical and non-technical buyers",
      "Fluent in Bangla and English; willing to travel",
    ],
  },
  {
    slug: "cloud-systems-administrator",
    title: "Cloud Systems Administrator",
    teamId: "data-centre-cloud",
    location: "Dhaka",
    workplace: "On-site",
    type: "Full-time",
    experience: "3+ years experience",
    deadline: "[date]",
    summary: "Run the platforms behind Mango Cloud and the Dhaka data centre.",
    about:
      "Run the virtualisation, storage and backup platforms behind Mango Cloud and our Dhaka data centre, and be the engineer customers reach when they call.",
    responsibilities: [
      "Operate the hypervisors, storage and backup platforms behind Mango Cloud",
      "Provision and support customer cloud servers and Backup-as-a-Service",
      "Monitor capacity, patching and security baselines",
      "Document runbooks and respond to cloud support tickets",
    ],
    requirements: [
      "BSc in CSE or a related discipline",
      "3+ years administering Linux and Windows servers",
      "Experience with virtualisation (VMware, Proxmox or KVM), storage and backup tools",
      "Scripting in Bash or Python; solid networking fundamentals",
    ],
  },
];

export function getRole(slug: string) {
  return roles.find((r) => r.slug === slug);
}

export function getTeam(id: string) {
  return teams.find((t) => t.id === id);
}

export function openRoleCount(teamId: string) {
  return roles.filter((r) => r.teamId === teamId).length;
}

export const careersMisc = {
  rolesOverline: "OPEN ROLES",
  rolesTitle: "Current openings",
  rolesNote: "CMS-DRIVEN · SAMPLE LISTINGS",
  cvLine: "No suitable role? Send your CV to",
  cvEmail: "career@mango.com.bd",
  cvVerify: "address",
  internship: {
    overline: "EARLY CAREERS",
    title: "Internships for EEE, CSE and telecom graduates.",
    body: "Structured placements across network operations, cloud, security and software. Tell us what you are studying and when you graduate.",
    cta: { label: "Apply for internship", href: "mailto:career@mango.com.bd?subject=Internship%20application" },
    verify: "internship programme",
  },
  sampleNote: "[SAMPLE CONTENT — REPLACE WITH REAL VACANCY]",
} as const;
