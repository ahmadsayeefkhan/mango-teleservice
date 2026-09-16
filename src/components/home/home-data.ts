import {
  Banknote,
  BadgeCheck,
  Building2,
  Globe,
  GraduationCap,
  Landmark,
  RadioTower,
  Rocket,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/** Home page copy (from Website Content/01-Global-and-Home.md). */

export const hero = {
  overline: "BANGLADESH'S FIRST PRIVATE IIG · SINCE 2008",
  title: "The backbone behind Bangladesh's digital life.",
  sub: "Since 2008, Mango has helped carry Bangladesh's internet to the world. Today we connect, host and secure the operators, banks, enterprises and institutions that can't afford to go offline.",
  primary: { label: "Request capacity quote", href: "/contact?intent=quote" },
  secondary: { label: "Explore solutions", href: "/solutions" },
  statusCard: {
    site: "DHAKA CORE",
    status: "OPERATIONAL",
    systems: "SMW-4 · SMW-5 · ITC",
    footer: "INTERNATIONAL CAPACITY · LIVE SINCE 2008",
  },
};

export const proof = [
  { k: "2008", v: "First private-sector IIG licence in Bangladesh" },
  { k: "4", v: "National licences: IIG, ITC, ISP and Certifying Authority" },
  { k: "7+", v: "Global content networks directly interconnected" },
  { k: "24/7", v: "Network and data centre monitoring" },
];

export type ServiceLayer = {
  code: string;
  label: string;
  title: string;
  body: string;
  icon: LucideIcon;
  links: { label: string; href: string }[];
};

export const services = {
  overline: "WHAT WE DO",
  title: "One partner for every layer of your infrastructure.",
  intro:
    "Most organizations stitch together a gateway, a data centre, a cloud provider and a certificate authority. Mango is all four, licensed and operated in Bangladesh.",
  layers: [
    {
      code: "01",
      label: "Connect",
      title: "Reach the world, reliably.",
      body: "IP transit and bandwidth through our International Internet Gateway, private international circuits, and dedicated enterprise connectivity.",
      icon: Globe,
      links: [
        { label: "IP Transit", href: "/solutions/ip-transit" },
        { label: "International Circuits", href: "/solutions/international-circuits" },
        { label: "Enterprise Internet", href: "/solutions/enterprise-internet" },
      ],
    },
    {
      code: "02",
      label: "Host",
      title: "Run critical systems at home.",
      body: "A Dhaka data centre with 24/7 monitoring and 12+ hours of power backup, plus Mango Cloud servers, storage and backup, all inside Bangladesh.",
      icon: Server,
      links: [
        { label: "Data Centre", href: "/solutions/data-centre" },
        { label: "Mango Cloud", href: "/solutions/cloud" },
        { label: "Backup-as-a-Service", href: "/solutions/cloud#backup" },
      ],
    },
    {
      code: "03",
      label: "Secure",
      title: "Trust every digital transaction.",
      body: "Mango CA has been a licensed Certifying Authority since 2011, issuing digital signature and SSL certificates and building PKI for government, banks and businesses.",
      icon: BadgeCheck,
      links: [
        { label: "Digital Signatures", href: "/solutions/digital-trust#digital-signatures" },
        { label: "SSL/TLS", href: "/solutions/digital-trust#ssl" },
        { label: "PKI", href: "/solutions/digital-trust#pki" },
      ],
    },
    {
      code: "04",
      label: "Manage & Build",
      title: "Extend your technical team.",
      body: "Managed network and infrastructure operations, custom software and integration, and hands-on technical training.",
      icon: Wrench,
      links: [
        { label: "Managed Services", href: "/solutions/managed-services" },
        { label: "Software", href: "/solutions/software" },
        { label: "Training", href: "/solutions/training" },
      ],
    },
  ] satisfies ServiceLayer[],
};

export const network = {
  overline: "THE NETWORK",
  title: "Connected to the networks the world runs on.",
  body: "Your traffic doesn't wait in line. Mango holds rights of use on the SEA-ME-WE 4 and SEA-ME-WE 5 submarine cables, runs terrestrial cross-border capacity through our ITC licence, and interconnects directly with the content networks Bangladeshis use every day.",
  columns: {
    yours: { title: "YOUR NETWORK", nodes: ["ISPs & operators", "Banks & enterprises", "Government platforms"] },
    core: { title: "MANGO CORE · DHAKA", big: "IIG + ITC", sub: "Licensed gateway since 2008" },
    paths: { title: "INTERNATIONAL PATHS", nodes: ["SEA-ME-WE 4 subsea", "SEA-ME-WE 5 subsea", "ITC terrestrial routes"] },
    global: { title: "GLOBAL NETWORKS", nodes: ["Google · Meta · Amazon", "Akamai · Zenlayer", "Equinix · DE-CIX"] },
  },
  upstreamLabel: "UPSTREAM & CARRIER PARTNERS",
  upstream: ["Tata Communications", "Bharti Airtel", "Singtel", "Equinix"],
  stats: [
    { k: "SMW-4 · SMW-5", v: "Subsea systems" },
    { k: "ITC", v: "Terrestrial routes" },
    { k: "IPv4 / IPv6", v: "Dual-stack transit", verify: "IPv6 availability" },
  ],
  cta: { label: "See how our network is built", href: "/network" },
};

export const industries = {
  overline: "WHO RELIES ON US",
  title: "Built for organizations that can't afford downtime.",
  body: "From nationwide ISPs to regulated banks and government platforms, our customers measure outages in lost trust, not minutes.",
  cta: { label: "Talk to an engineer", href: "/contact" },
  tiles: [
    { title: "ISPs & Operators", line: "Wholesale capacity and international routes for your subscribers.", href: "/industries/isps-operators", icon: RadioTower },
    { title: "Banking & Finance", line: "Secure links, local hosting and digital signatures for regulated operations.", href: "/industries/banking-finance", icon: Banknote },
    { title: "Government", line: "Licensed trust services and in-country hosting for public platforms.", href: "/industries/government", icon: Landmark },
    { title: "Enterprise & MNCs", line: "Dedicated internet, private circuits and managed infrastructure.", href: "/industries/enterprise", icon: Building2 },
    { title: "Education", line: "Connectivity and cloud for campuses and learning platforms.", href: "/industries/education", icon: GraduationCap },
    { title: "Digital Businesses", line: "Cloud servers and bandwidth that scale with your users.", href: "/industries/digital-business", icon: Rocket },
  ],
};

export const milestones = {
  overline: "OUR RECORD",
  title: "Eighteen years of Bangladeshi firsts.",
  cta: { label: "Our full story", href: "/company/milestones" },
  items: [
    { year: "2007", title: "Incorporated", body: "Mango Teleservices Limited is incorporated as a public limited company." },
    { year: "2008", title: "First private IIG", body: "Bangladesh's first private-sector IIG licence from BTRC. Data centre goes live." },
    { year: "2009", title: "Subsea & cache", body: "SEA-ME-WE 4 capacity acquired. First Google cache hosted in Bangladesh." },
    { year: "2011", title: "Mango CA", body: "Certifying Authority licence from the CCA." },
    { year: "2012", title: "ITC licence", body: "International Terrestrial Cable licence from BTRC." },
    { year: "2013", title: "ISP licence", body: "ISP licence from BTRC completes the connectivity stack." },
  ],
};

export const trust = {
  overline: "TRUSTED WHERE IT MATTERS",
  title: "Hosting national platforms since 2008.",
  body: "Our data centre has hosted digital resources for the Bangladesh Government portal, NBR, RJSC, a2i and the CCA.",
  bodyVerify: "current wording and permission",
  licensedBy: [
    { name: "BTRC", sub: "IIG · ITC · ISP", logo: "/logos/btrc.png" },
    { name: "CCA", sub: "Certifying Authority", logo: "/logos/cca.png" },
  ],
  story: {
    kicker: "CASE STORY · NATIONAL BOARD OF REVENUE · DEC 2023",
    title: "18 NBR officials. 5 advanced technology courses.",
    body: "Java, databases, network administration, systems security and QA, part of NBR's drive for technical self-sufficiency.",
    href: "/resources/case-studies/nbr-training",
    image: "/images/nbr_training.jpg",
    alt: "National Board of Revenue officials at a Mango-delivered technical training session in Dhaka",
  },
  logosLabel: "SERVING OPERATORS, BANKS, GOVERNMENT AND GLOBAL BRANDS",
  logosVerify: "logo permissions",
  logos: [
    { name: "Grameenphone", src: "/logos/Grameenphone_Logo.png" },
    { name: "Robi", src: "/logos/robi.png" },
    { name: "Banglalink", src: "/logos/banglalink-logo.png" },
    { name: "Teletalk", src: "/logos/teletalk.png" },
    { name: "Bangladesh Bank", src: "/logos/bangladesh-bank.png" },
    { name: "Eastern Bank", src: "/logos/ebl-logo.jpg" },
    { name: "DHL", src: "/logos/dhl.png" },
    { name: "UNDP", src: "/logos/undp.png" },
    { name: "Square", src: "/logos/square.png" },
    { name: "Chevron", src: "/logos/chevron.png" },
    { name: "H&M", src: "/logos/hnm.png" },
    { name: "Prime Bank", src: "/logos/prime-bank.jpeg" },
    { name: "a2i", src: "/logos/a2i.png" },
    { name: "RJSC", src: "/logos/rjsc.jpg" },
    { name: "BRACNet", src: "/logos/bracnet.jpg" },
    { name: "Dhaka WASA", src: "/logos/wasa.jpeg" },
  ],
};

export const group = {
  overline: "BEYOND THE BACKBONE",
  title: "Building Bangladesh's next industries.",
  body: "The founders of Mango have applied the same long-term thinking to voice telecom, clean mobility, energy, banking and education.",
  cta: { label: "Explore Mango Group", href: "/group" },
  also: "ALSO: MODHUMOTI BANK · PLAYPEN SCHOOL · BAIRA COLLEGE",
  cards: [
    { kicker: "TELECOM · ICX", title: "Purple Telecom", line: "Interconnection exchange for domestic and international voice.", image: "/images/venture-telecom-rack.png", alt: "Telecom equipment rack with fibre patching" },
    { kicker: "TELECOM · IGW", title: "Platinum Communications", line: "International voice gateway licensed by BTRC.", image: "/images/venture-fibre-light.png", alt: "Light travelling through optical fibre strands" },
    { kicker: "MOBILITY · EV", title: "Bangladesh Auto Industries", line: "Electric vehicle manufacturing in Chattogram.", image: "/images/venture-ev.png", alt: "Electric vehicle assembly line at night" },
    { kicker: "ENERGY", title: "Lithium Batteries & HKGE Solar", line: "Energy storage manufacturing and utility-scale solar in Sunamganj.", image: "/images/venture-solar.png", alt: "Solar farm at dusk", verify: "HKGE status" },
  ],
};

export const insights = {
  overline: "INSIGHTS",
  title: "Notes from the backbone.",
  cta: { label: "All insights", href: "/resources/insights" },
  articles: [
    { category: "Connectivity", read: "4 min", title: "What is an International Internet Gateway, and why does your ISP's choice matter?", href: "/resources/insights/what-is-an-international-internet-gateway" },
    { category: "Digital trust", read: "3 min", title: "Digital signature certificates for e-GP: a step-by-step guide", href: "/resources/insights/digital-signature-certificates-for-e-gp" },
    { category: "Cloud", read: "3 min", title: "Data centre or cloud? A buyer's guide for Bangladeshi organizations", href: "/resources/insights/data-centre-or-cloud-buyers-guide" },
  ],
};

export const homeCta = {
  overline: "LET'S BUILD YOUR BACKBONE",
  title: "Tell us what you need to connect, host or secure.",
  body: "Talk to a Mango engineer. We'll map the right mix of capacity, hosting and security for you.",
  primary: { label: "Talk to an engineer", href: "/contact" },
  secondary: { label: "Call +880 1730 068810", href: "tel:+8801730068810" },
};
