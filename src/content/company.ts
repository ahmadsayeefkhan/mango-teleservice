/**
 * Company-area copy: /network, /company/*, /group.
 * Source: Website Content/03-Company-and-Group.md (verbatim) + SEO sheet in 04-….md.
 * `verify` fields mark [VERIFY] items from the content doc; pages wrap them in <Verify>.
 */

export type Link = { label: string; href: string };

/* ------------------------------------------------------------------ */
/* NETWORK  /network                                                   */
/* ------------------------------------------------------------------ */

export type NetworkLayer = {
  code: string;
  key: "subsea" | "terrestrial" | "interconnects" | "operations";
  label: string;
  title: string;
  body: string;
  verify?: string;
};

export const network = {
  seo: {
    title: "Our Network: Subsea, Terrestrial & Interconnects | Mango",
    description:
      "Subsea capacity on SEA-ME-WE 4 and SEA-ME-WE 5, cross-border terrestrial routes and direct interconnects with Google, Meta, Amazon, Akamai, Equinix, DE-CIX and Zenlayer, operated under Mango's IIG and ITC licences.",
  },
  crumb: [{ label: "Network" }],
  overline: "THE NETWORK",
  title: "How Mango connects Bangladesh to the world.",
  sub: "Subsea capacity, cross-border terrestrial routes and direct content interconnects, operated under our IIG and ITC licences.",
  primary: { label: "Request capacity quote", href: "/contact?intent=quote" },
  secondary: { label: "Talk to an engineer", href: "/contact" },
  statusCard: { site: "DHAKA CORE", status: "OPERATIONAL", systems: "SMW-4 · SMW-5 · ITC", footer: "IIG 2008 · ITC 2012 · 24/7 MONITORED" },
  proof: [
    { k: "2", v: "Submarine cable systems: SEA-ME-WE 4 and SEA-ME-WE 5" },
    { k: "2012", v: "International Terrestrial Cable licence from BTRC" },
    { k: "7", v: "Content and exchange networks directly interconnected" },
    { k: "24/7", v: "Network and data centre monitoring" },
  ],
  architecture: {
    overline: "ARCHITECTURE",
    title: "From your network to the global internet, in three hops.",
    intro:
      "Traffic enters the Mango core in Dhaka, leaves the country over diverse subsea and terrestrial paths, and lands directly on the networks people actually use.",
    columns: {
      yours: { title: "YOUR NETWORK", nodes: ["ISPs & operators", "Banks & enterprises", "Government platforms"] },
      core: { title: "MANGO CORE · DHAKA", big: "IIG + ITC", sub: "Licensed gateway since 2008" },
      paths: { title: "INTERNATIONAL PATHS", nodes: ["SEA-ME-WE 4 subsea", "SEA-ME-WE 5 subsea", "ITC terrestrial routes"] },
      global: { title: "GLOBAL NETWORKS", nodes: ["Google · Meta · Amazon", "Akamai · Zenlayer", "Equinix · DE-CIX"] },
    },
    footnote: "ASN, PeeringDB record, PoP list and capacity per route to be confirmed before publishing.",
    footnoteVerify: "ASN · PeeringDB · PoP list · capacity per route",
  },
  layers: {
    overline: "FOUR LAYERS",
    title: "Built in layers, operated as one network.",
    intro: "Each layer removes a single point of failure: more than one cable, more than one border, more than one path to the content your users ask for.",
    items: [
      {
        code: "01",
        key: "subsea",
        label: "SUBSEA",
        title: "SEA-ME-WE 4 · SEA-ME-WE 5",
        body: "Mango holds rights of use on the SEA-ME-WE 4 and SEA-ME-WE 5 submarine cable systems. We first bought SMW-4 capacity in 2009.",
        verify: "current systems and capacity",
      },
      {
        code: "02",
        key: "terrestrial",
        label: "TERRESTRIAL",
        title: "ITC cross-border routes",
        body: "Our International Terrestrial Cable licence (2012) adds cross-border land routes, so international traffic isn't tied to a single path.",
        verify: "border points",
      },
      {
        code: "03",
        key: "interconnects",
        label: "INTERCONNECTS",
        title: "Google · Meta · Amazon · Akamai · Equinix · DE-CIX · Zenlayer",
        body: "Direct interconnection with Google, Meta, Amazon, Akamai, Equinix, DE-CIX and Zenlayer brings popular content closer to Bangladeshi users.",
      },
      {
        code: "04",
        key: "operations",
        label: "OPERATIONS",
        title: "24/7 network & data centre monitoring",
        body: "24/7 monitoring of network and data centre. Engineers watch routes, capacity and facilities around the clock.",
        verify: "NOC details",
      },
    ] satisfies NetworkLayer[],
  },
  partners: {
    overline: "CARRIERS & CONTENT NETWORKS",
    title: "Connected to the networks that matter.",
    permissionNote: "logo permission required",
    logos: [
      { name: "Tata Communications", role: "UPSTREAM", src: "/logos/tata_logo.png" },
      { name: "Singtel", role: "UPSTREAM", src: "/logos/singtel_logo.png" },
      { name: "Equinix", role: "INTERCONNECT", src: "/logos/equinix-logo.png" },
      { name: "Meta", role: "CONTENT", src: "/logos/facebook.png" },
    ],
    names: ["Bharti Airtel", "Google", "Amazon", "Akamai", "DE-CIX", "Zenlayer"],
    upstreamLabel: "UPSTREAM PARTNERS",
    upstream: ["Tata Communications", "Bharti Airtel", "Singtel", "Equinix"],
  },
  ops: {
    peering: {
      title: "PEERING",
      rows: [
        { k: "Peering policy", v: "Open / selective", verify: "peering policy" },
        { k: "ASN", v: "To be published", verify: "ASN" },
        { k: "PeeringDB", v: "Record to be linked", verify: "PeeringDB link" },
        { k: "Contact", v: "peering@mango.com.bd", verify: "peering contact" },
      ],
    },
    operations: {
      title: "OPERATIONS",
      rows: [
        { k: "Monitoring", v: "24/7 · 365" },
        { k: "Support hotline", v: "+880 1730 068810" },
        { k: "Status page", v: "Planned", verify: "status page" },
        { k: "Escalation", v: "L1 → L2 → L3" },
      ],
    },
  },
  cta: { title: "Need capacity on these routes?", body: "Tell us the route, the capacity and the timeline. A network engineer will reply with options.", primary: { label: "Request capacity quote", href: "/contact?intent=quote" }, secondary: { label: "Talk to an engineer", href: "/contact" } },
};

/* ------------------------------------------------------------------ */
/* ABOUT  /company/about                                               */
/* ------------------------------------------------------------------ */

export const about = {
  seo: {
    title: "About Mango | Bangladesh's First Private IIG",
    description: "Incorporated in 2007 and licensed as Bangladesh's first private International Internet Gateway in 2008. Our story, mission and CLIC philosophy.",
  },
  crumb: [{ label: "Company", href: "/company/about" }, { label: "About" }],
  overline: "ABOUT MANGO",
  title: "We built one of Bangladesh's first private roads to the internet. We still maintain it.",
  sub: "Mango Teleservices Limited is a Bangladeshi public limited company, incorporated in 2007. In 2008 we became the first private-sector company licensed by the government to operate an International Internet Gateway.",
  story: {
    overline: "OUR STORY",
    title: "Private investment, carrying a country online.",
    paragraphs: [
      "Mango Teleservices Limited is a Bangladeshi public limited company, incorporated in 2007. In 2008 we became the first private-sector company licensed by the government to operate an International Internet Gateway. Private investment began carrying the country's internet to the world.",
      "We kept building. A data centre in 2008. The country's first Google cache in 2009. A Certifying Authority licence in 2011, followed by international terrestrial cable (2012) and ISP (2013) licences. Today Mango connects, hosts and secures operators, enterprises, banks and public institutions from our head office in Gulshan, Dhaka.",
    ],
  },
  facts: {
    title: "COMPANY FACTS",
    rows: [
      { k: "INCORPORATED", v: "2007 · Public limited company" },
      { k: "HEADQUARTERS", v: "Gulshan-1, Dhaka" },
      { k: "LICENCES", v: "IIG (2008) · CA (2011) · ITC (2012) · ISP (2013)" },
      { k: "SERVICES", v: "Connectivity · Data centre · Cloud · Digital trust · Managed services" },
      { k: "TEAM", v: "Headcount to be confirmed", verify: "headcount" },
    ],
  },
  mission: { label: "MISSION", text: "To bring efficient, secure and sustainable technology to the people and institutions of Bangladesh." },
  vision: { label: "VISION", text: "A Bangladesh lifted to new heights by technology and innovation, for the wellbeing of all." },
  clic: {
    overline: "OUR PHILOSOPHY",
    title: "CLIC — in service of empowering customers.",
    intro: "Four verbs we hold ourselves to, all in service of one aim: empowering customers.",
    letters: [
      { letter: "C", word: "Connect", body: "People, businesses and institutions to what they need." },
      { letter: "L", word: "Learn", body: "From every network we build and every customer we serve." },
      { letter: "I", word: "Innovate", body: "Introduce what Bangladesh hasn't had before." },
      { letter: "C", word: "Collaborate", body: "With partners, regulators and customers, because infrastructure is a team effort." },
    ],
  },
  values: { overline: "VALUES", items: ["Reliability", "Trust", "Pioneering spirit", "Accountability", "Long-term thinking"] },
  leaders: {
    overline: "LEADERSHIP",
    title: "Founded and led by engineers.",
    cta: { label: "Board and management", href: "/company/leadership" },
  },
  cta: { title: "Work with a pioneer of Bangladeshi connectivity.", body: "Tell us what you need to connect, host or secure. A Mango engineer, not a call centre, will reply within one business day.", primary: { label: "Talk to us", href: "/contact" }, secondary: { label: "Explore solutions", href: "/solutions" } },
};

/* ------------------------------------------------------------------ */
/* LEADERSHIP  /company/leadership                                     */
/* ------------------------------------------------------------------ */

export type Leader = {
  id: string;
  name: string;
  role: string;
  org?: string;
  image: string;
  alt: string;
  lead: string;
  body?: string;
  tags?: string[];
  verify?: string;
};

export const leadership = {
  seo: {
    title: "Leadership: Board & Management | Mango",
    description: "Mango is led by founders and executives with deep roots in Bangladesh's telecommunications sector. Meet the board of directors and management team.",
  },
  crumb: [{ label: "Company", href: "/company/about" }, { label: "Leadership" }],
  overline: "LEADERSHIP",
  title: "Engineers and builders, for three decades.",
  sub: "Mango is led by founders and executives with deep roots in Bangladesh's telecommunications sector.",
  board: {
    overline: "BOARD OF DIRECTORS",
    members: [
      {
        id: "a-mannan-khan",
        name: "Mr. A. Mannan Khan",
        role: "Founder & Chairman",
        image: "/people/amk.jpg",
        alt: "Portrait of Mr. A. Mannan Khan, Founder and Chairman of Mango Teleservices",
        lead: "Mr. A. Mannan Khan is Founder and Chairman of Mango Teleservices Ltd, Bangladesh Auto Industries Ltd (BAIL), Bangladesh Lithium Batteries Ltd (BLBL) and HKGE Consortium Ltd, and a sponsor director of Modhumoti Bank Ltd.",
        body: "As Chairman of Communication Solutions Ltd (CSL), Mr. Mannan delivered office automation solutions and national projects including an Air-to-Ground Communication System. A graduate in Computer Engineering (Telecommunications) from Tianjin University, China, on a full government scholarship, Mr. Mannan also founded Baira College, Singair, Manikganj, in 1994, bringing quality education to rural students, especially young women.",
        tags: ["TIANJIN UNIVERSITY", "CSL", "BAIRA COLLEGE"],
        verify: "current titles; photo to be reshot",
      },
      {
        id: "mir-masud-kabir",
        name: "Mr. Mir Masud Kabir",
        role: "Founder & Managing Director",
        image: "/people/mmk.jpg",
        alt: "Portrait of Mr. Mir Masud Kabir, Founder and Managing Director of Mango Teleservices",
        lead: "Mr. Mir Masud Kabir is Founder and Managing Director of Mango Teleservices Ltd, BAIL, BLBL and HKGE Consortium Ltd.",
        body: "Mr. Kabir's career began at Schlumberger in 1990, where Mr. Kabir became the company's youngest Country Manager in 1994, then Country Manager of the Cable & Wireless–Schlumberger joint venture OMNES in 1995. Mr. Kabir founded Dhaka Shilpo Ltd in 1999, launching Bangladesh's first IVR-based value-added services, then Shilpo Services (2005) for telecom software, and in 2007 coordinated the LSR consortium's turnkey telecom infrastructure projects. Mr. Kabir was a visiting faculty member at BUET (1996–97), holds a Petroleum Engineering degree from Middle East Technical University, Ankara (Turkish Government scholarship), and is a Rajshahi Cadet College alumnus.",
        tags: ["SCHLUMBERGER", "METU ANKARA", "BUET"],
        verify: "titles and biography",
      },
    ] as Leader[],
  },
  management: {
    overline: "MANAGEMENT TEAM",
    title: "Decades of telecom operations and policy experience.",
    members: [
      {
        id: "aminur-rahman",
        name: "Col. Aminur Rahman (retd)",
        role: "Director & CEO",
        org: "Purple Telecom Limited",
        image: "/people/ceo.jpg",
        alt: "Portrait of Col. Aminur Rahman (retd), Director and CEO of Purple Telecom Limited",
        lead: "After a long career in the armed forces, including command of a Bangladesh Rifles unit and a UN mission, Col. Rahman held senior roles at Dhaka Telephone Company Ltd (General Manager Operations; Head of Operations; Head of HR & Administration) and served as Executive Director of the Telecommunication Infrastructure Operators of Bangladesh. Col. Rahman is a member of the BTCL, Bangladesh Frequency and Wireless Board, and General Secretary of AIOB.",
        verify: "biography",
      },
      {
        id: "gazi-md-salahuddin",
        name: "Col. Gazi Md Salahuddin (retd)",
        role: "CEO",
        org: "Platinum Communications Limited",
        image: "/people/ceo_platinum.jpg",
        alt: "Portrait of Col. Gazi Md Salahuddin (retd), CEO of Platinum Communications Limited",
        lead: "A 17-year defence career spanned Army Headquarters, the Army Signal Brigade, a UN mission, the National Telecommunication Monitoring Centre and the Interim Mobile Monitoring Centre, followed by the role of CEO at Banglalion. Col. Salahuddin has served on the national ILDTS, Broadcasting and ICT policy formulation committees and on BTRC's Spectrum Management Committee.",
        verify: "biography",
      },
    ] as Leader[],
    toAdd: {
      title: "Profiles to add",
      roles: ["Chief Technology Officer", "Head of Sales & Business", "Head of Mango CA", "Head of Mango Cloud"],
      note: "Missing on the old site · request from client",
    },
  },
  cta: { title: "Meet the team behind the backbone.", body: "Talk to the people who run the network, the data centre and Mango CA.", primary: { label: "Contact us", href: "/contact" }, secondary: { label: "Careers at Mango", href: "/careers" } },
};

/* ------------------------------------------------------------------ */
/* MILESTONES  /company/milestones                                     */
/* ------------------------------------------------------------------ */

export type Milestone = {
  year: string;
  title: string;
  body: string;
  track: "mango" | "group";
  verify?: string;
};

export const milestones = {
  seo: {
    title: "Milestones: Eighteen Years of Firsts",
    description: "From Bangladesh's first private International Internet Gateway licence in 2008 to a group building the country's next industries. The Mango Teleservices timeline.",
  },
  crumb: [{ label: "Company", href: "/company/about" }, { label: "Milestones" }],
  overline: "OUR RECORD",
  title: "Eighteen years of firsts.",
  sub: "From Bangladesh's first private internet gateway to a group building the country's next industries.",
  legend: { mango: "MANGO TELESERVICES", group: "MANGO GROUP" },
  items: [
    { year: "2007", title: "Incorporated", body: "Mango Teleservices Limited incorporated as a public limited company.", track: "mango" },
    { year: "2008", title: "First private IIG licence", body: "Bangladesh's first private-sector International Internet Gateway licence from BTRC. Data centre goes live.", track: "mango" },
    { year: "2009", title: "SEA-ME-WE 4 capacity", body: "Submarine cable capacity purchased.", track: "mango" },
    { year: "2009", title: "First Google cache in Bangladesh", body: "Content moved closer to Bangladeshi users.", track: "mango" },
    { year: "2011", title: "Certifying Authority licence", body: "CCA licence; Mango CA founded to issue digital signature and SSL certificates.", track: "mango" },
    { year: "2012", title: "ITC licence", body: "International Terrestrial Cable licence from BTRC.", track: "mango" },
    { year: "2012", title: "Purple Telecom · Platinum · Modhumoti Bank · Playpen", body: "Purple Telecom receives ICX licence; Platinum Communications incorporated; Modhumoti Bank Ltd; Playpen school.", track: "group" },
    { year: "2013", title: "ISP licence", body: "ISP licence from BTRC completes the connectivity stack.", track: "mango" },
    { year: "2018", title: "BAIL · BLBL", body: "Bangladesh Auto Industries Ltd (EV) and Bangladesh Lithium Batteries Ltd established.", track: "group" },
    { year: "2020", title: "HKGE Consortium", body: "HKGE Consortium Ltd acquired (solar).", track: "group" },
    { year: "2023", title: "NBR advanced training", body: "Advanced technology training for 18 National Board of Revenue officials.", track: "mango" },
    { year: "2024–26", title: "Recent milestones", body: "Recent milestones to be added with the client.", track: "mango", verify: "2024–26 milestones" },
  ] satisfies Milestone[],
  cta: { title: "Be part of the next chapter.", body: "Whether you need capacity, hosting or digital trust, the next milestone could be yours.", primary: { label: "Talk to us", href: "/contact" }, secondary: { label: "Careers at Mango", href: "/careers" } },
};

/* ------------------------------------------------------------------ */
/* PARTNERS & CLIENTS  /company/partners                               */
/* ------------------------------------------------------------------ */

export type LogoItem = { name: string; src?: string; verify?: string };

export const partners = {
  seo: {
    title: "Partners & Clients",
    description: "The organizations Mango Teleservices serves, the carriers and technology partners we connect with, and the regulators who license us: BTRC and the CCA.",
  },
  crumb: [{ label: "Company", href: "/company/about" }, { label: "Partners & Clients" }],
  overline: "IN GOOD COMPANY",
  title: "In good company.",
  sub: "The organizations we serve, the carriers we connect with and the regulators who license us.",
  permissionNote: "logo permission required",
  groups: [
    {
      id: "clients",
      overline: "CLIENTS",
      title: "Operators, banks, government and global brands.",
      verify: "permission required per logo",
      logos: [
        { name: "Grameenphone", src: "/logos/Grameenphone_Logo.png" },
        { name: "Robi", src: "/logos/robi.png" },
        { name: "Banglalink", src: "/logos/banglalink-logo.png" },
        { name: "Teletalk", src: "/logos/teletalk.png" },
        { name: "Bangladesh Bank", src: "/logos/bangladesh-bank.png" },
        { name: "Eastern Bank", src: "/logos/ebl-logo.jpg" },
        { name: "Prime Bank", src: "/logos/prime-bank.jpeg" },
        { name: "Pubali Bank", src: "/logos/pbl.png", verify: "\"pbl\" logo identity" },
        { name: "Modhumoti Bank", src: "/logos/modhumoti-bank.jpg" },
        { name: "Bangladesh Army", src: "/logos/army.png" },
        { name: "Bangladesh Navy", src: "/logos/navy.png" },
        { name: "Defence Services Command & Staff College", src: "/logos/defence-college.jpg" },
        { name: "MIST", src: "/logos/mist.png" },
        { name: "a2i", src: "/logos/a2i.png" },
        { name: "RJSC", src: "/logos/rjsc.jpg" },
        { name: "WASA", src: "/logos/wasa.jpeg", verify: "which WASA" },
        { name: "Chevron", src: "/logos/chevron.png" },
        { name: "DHL", src: "/logos/dhl.png" },
        { name: "H&M", src: "/logos/hnm.png" },
        { name: "Square", src: "/logos/square.png" },
        { name: "UNDP", src: "/logos/undp.png" },
        { name: "BRACNet", src: "/logos/bracnet.jpg" },
        { name: "Peerex", src: "/logos/peerex-logo.png" },
      ] satisfies LogoItem[],
    },
    {
      id: "partners",
      overline: "CARRIER & TECHNOLOGY PARTNERS",
      title: "The networks and vendors behind our infrastructure.",
      verify: "logo permission required",
      logos: [
        { name: "Tata Communications", src: "/logos/tata_logo.png" },
        { name: "Singtel", src: "/logos/singtel_logo.png" },
        { name: "Bharti Airtel" },
        { name: "Equinix", src: "/logos/equinix-logo.png" },
        { name: "Huawei", src: "/logos/huawei-logo.png" },
        { name: "Tejas Networks", src: "/logos/tejas.png" },
        { name: "Meta (Facebook)", src: "/logos/facebook.png" },
      ] satisfies LogoItem[],
    },
    {
      id: "regulators",
      overline: "LICENSED & REGULATED BY",
      title: "Our licences come from these authorities.",
      verify: "logo permission required",
      logos: [
        { name: "Bangladesh Telecommunication Regulatory Commission (BTRC)", src: "/logos/btrc.png" },
        { name: "Office of the Controller of Certifying Authorities (CCA)", src: "/logos/cca.png" },
      ] satisfies LogoItem[],
    },
  ],
  cta: { title: "Become our next success story.", body: "Operators, banks, ministries and global brands rely on Mango. Tell us what you need.", primary: { label: "Talk to an engineer", href: "/contact" }, secondary: { label: "Request capacity quote", href: "/contact?intent=quote" } },
};

/* ------------------------------------------------------------------ */
/* NEWSROOM  /company/newsroom                                         */
/* ------------------------------------------------------------------ */

export type NewsTopic = "Company" | "Connectivity" | "Digital Trust" | "Training" | "Group";

export type NewsPost = {
  id: string;
  title: string;
  date: string;
  /** ISO date for <time>; omit for placeholders. */
  iso?: string;
  topic: NewsTopic;
  excerpt: string;
  image: string;
  alt: string;
  href?: string;
  featured?: boolean;
  verify?: string;
};

export const newsroom = {
  seo: {
    title: "Newsroom",
    description: "Company announcements, milestones and stories from across Mango Teleservices and Mango Group.",
  },
  crumb: [{ label: "Company", href: "/company/about" }, { label: "Newsroom" }],
  overline: "NEWSROOM",
  title: "News from Mango.",
  sub: "Company announcements, milestones and stories from across Mango Teleservices and Mango Group.",
  topics: ["Company", "Connectivity", "Digital Trust", "Training", "Group"] satisfies NewsTopic[],
  featuredLabel: "FEATURED",
  latestLabel: "LATEST",
  posts: [
    {
      id: "nbr-graduation",
      title: "NBR officials graduate from Mango's advanced technology courses",
      date: "12 Dec 2023",
      iso: "2023-12-12",
      topic: "Training",
      excerpt: "18 National Board of Revenue officials received certificates after completing five advanced courses in Java, databases, network administration, systems security and QA.",
      image: "/images/nbr_training.jpg",
      alt: "National Board of Revenue officials and Mango trainers at the course graduation in Dhaka",
      href: "/resources/case-studies/nbr-training",
      featured: true,
    },
    {
      id: "mango-ca-esign-pki",
      title: "Mango CA team completes eSign and PKI training",
      date: "2 Nov 2023",
      iso: "2023-11-02",
      topic: "Digital Trust",
      excerpt: "The Mango CA team completed hands-on training on eSign workflows and public key infrastructure, strengthening the licensed Certifying Authority's service delivery.",
      image: "/images/digital_sig_training.jpeg",
      alt: "Mango CA team members in an eSign and PKI training session",
    },
    {
      id: "placeholder-company",
      title: "2024–26 announcement to be added",
      date: "Date to confirm",
      topic: "Company",
      excerpt: "Recent company news from 2024 to 2026 will be published here.",
      image: "/images/hero-network-globe.png",
      alt: "",
      verify: "2024–2026 news",
    },
    {
      id: "placeholder-network",
      title: "Network or capacity update to be added",
      date: "Date to confirm",
      topic: "Connectivity",
      excerpt: "Route, capacity and interconnect updates will be published here.",
      image: "/images/venture-fibre-light.png",
      alt: "",
      verify: "2024–2026 news",
    },
  ] satisfies NewsPost[],
  media: {
    overline: "MEDIA ENQUIRIES",
    title: "Press kit, logos and executive interviews.",
    contact: "contact@mango.com.bd",
    contactVerify: "media@ address and spokesperson",
    cta: { label: "Email media relations", href: "mailto:contact@mango.com.bd" },
  },
  empty: "No posts in this topic yet.",
  cta: { title: "Want the full company profile?", body: "Read how Mango became Bangladesh's first private International Internet Gateway, and what we have built since.", primary: { label: "About Mango", href: "/company/about" }, secondary: { label: "Talk to us", href: "/contact" } },
};

/* ------------------------------------------------------------------ */
/* MANGO GROUP  /group                                                 */
/* ------------------------------------------------------------------ */

export type VentureStatus = { label: string; tone: "good" | "neutral"; verify?: string };

export type Venture = {
  id: string;
  kicker: string;
  name: string;
  short?: string;
  body: string;
  bodyVerify?: string;
  image: string;
  alt: string;
  status: VentureStatus;
  facts: { k: string; v: string }[];
};

export type GroupSector = {
  id: string;
  tab: string;
  overline: string;
  title: string;
  tone: "ink" | "paper" | "stone";
};

export const group = {
  seo: {
    title: "Mango Group: Telecom, EV, Energy & Education",
    description: "The founders of Mango apply the same long-term thinking to voice telecom, clean mobility, energy, banking and education: Purple Telecom, Platinum Communications, BAIL, BLBL, HKGE, Modhumoti Bank, Playpen School and Baira College.",
  },
  crumb: [{ label: "Mango Group" }],
  overline: "MANGO GROUP",
  title: "Beyond the backbone.",
  sub: "The founders of Mango apply the same long-term thinking to voice telecom, clean mobility, energy, banking and education.",
  note: "Group companies are separate legal entities. Status information is current as of the date shown on each company's page.",
  noteVerify: "status date",
  sectors: [
    { id: "telecom", tab: "Telecom", overline: "TELECOM", title: "Voice infrastructure for Bangladesh.", tone: "ink" },
    { id: "mobility-energy", tab: "Mobility & Energy", overline: "MOBILITY & ENERGY", title: "Clean mobility and energy, made in Bangladesh.", tone: "paper" },
    { id: "finance-education", tab: "Finance & Education", overline: "FINANCE & EDUCATION", title: "Investing in people and institutions.", tone: "stone" },
  ] satisfies GroupSector[],
  telecom: [
    {
      id: "purple-telecom",
      kicker: "BTRC · ICX LICENCE",
      name: "Purple Telecom Limited",
      short: "Interconnection Exchange (ICX)",
      body: "Licensed by BTRC as an ICX operator in 2012, Purple Telecom routes domestic and international voice traffic between mobile and fixed operators (ANS) and international gateways (IGW), with a focus on voice quality and optimal routing.",
      image: "/images/venture-telecom-rack.png",
      alt: "Telecom equipment rack with fibre patching",
      status: { label: "OPERATING", tone: "good" },
      facts: [
        { k: "LICENSED", v: "2012" },
        { k: "SERVICE", v: "Voice interconnection" },
      ],
    },
    {
      id: "platinum-communications",
      kicker: "BTRC · IGW LICENCE",
      name: "Platinum Communications Limited",
      short: "International Gateway (IGW)",
      body: "Incorporated in 2012, Platinum holds a BTRC International Gateway licence, carrying wholesale international voice and terminating calls into Bangladesh through partnerships with global operators.",
      image: "/images/venture-fibre-light.png",
      alt: "Light travelling through optical fibre strands",
      status: { label: "OPERATING", tone: "good" },
      facts: [
        { k: "INCORPORATED", v: "2012" },
        { k: "SERVICE", v: "International voice" },
      ],
    },
  ] satisfies Venture[],
  mobilityEnergy: [
    {
      id: "bail",
      kicker: "ELECTRIC VEHICLES",
      name: "Bangladesh Auto Industries Ltd (BAIL)",
      short: "Electric vehicles",
      body: "An initiative to manufacture lithium-ion electric vehicles in Bangladesh, from motorcycles and three-wheelers to cars, SUVs, microbuses and mini trucks. It is located in the Bangabandhu Sheikh Mujib Shilpa Nagar (BSMSN) economic zone, Chattogram.",
      bodyVerify: "current production status",
      image: "/images/venture-ev.png",
      alt: "Electric vehicle assembly line at night",
      status: { label: "STATUS TO CONFIRM", tone: "neutral", verify: "current production status" },
      facts: [
        { k: "FOUNDED", v: "2018" },
        { k: "LOCATION", v: "BSMSN, Chattogram" },
      ],
    },
    {
      id: "blbl",
      kicker: "ENERGY STORAGE",
      name: "Bangladesh Lithium Batteries Ltd (BLBL)",
      short: "Energy storage",
      body: "Setting up lithium-ion battery manufacturing in Bangladesh to power electric mobility and energy storage. Located in BSMSN, Chattogram.",
      bodyVerify: "status",
      image: "/images/battery.jpg",
      alt: "Lithium-ion battery cells and a battery pack",
      status: { label: "STATUS TO CONFIRM", tone: "neutral", verify: "status" },
      facts: [
        { k: "FOUNDED", v: "2018" },
        { k: "LOCATION", v: "BSMSN, Chattogram" },
      ],
    },
    {
      id: "hkge",
      kicker: "SOLAR POWER",
      name: "HKGE Consortium Ltd",
      short: "Solar power",
      body: "A 32 MW (AC) grid-connected solar power project in Dharmapasha, Sunamganj, acquired by Mango Group in 2020.",
      bodyVerify: "current status; do not state production dates",
      image: "/images/venture-solar.png",
      alt: "Solar farm at dusk",
      status: { label: "STATUS TO CONFIRM", tone: "neutral", verify: "current status" },
      facts: [
        { k: "ACQUIRED", v: "2020" },
        { k: "CAPACITY", v: "32 MW (AC)" },
      ],
    },
  ] satisfies Venture[],
  financeEducation: [
    {
      id: "modhumoti-bank",
      kicker: "BANKING",
      name: "Modhumoti Bank Ltd",
      body: "Mango Teleservices is a shareholder and director of this new-generation scheduled commercial bank.",
      logo: "/logos/modhumoti-bank.jpg",
      icon: "bank" as const,
      fact: { k: "SINCE", v: "2012" },
    },
    {
      id: "playpen-school",
      kicker: "EDUCATION",
      name: "Playpen School",
      body: "An English-medium school preparing children to be global citizens.",
      icon: "school" as const,
      fact: { k: "SINCE", v: "2012" },
    },
    {
      id: "baira-college",
      kicker: "EDUCATION",
      name: "Baira College, Singair",
      body: "Founded in 1994 by Mr. A. Mannan Khan to bring higher education to rural students, especially women.",
      icon: "college" as const,
      fact: { k: "FOUNDED", v: "1994" },
    },
  ],
  cta: { title: "Looking for Mango Teleservices services?", body: "Connectivity, data centre, cloud and digital trust are delivered by Mango Teleservices Limited.", primary: { label: "Explore solutions", href: "/solutions" }, secondary: { label: "Talk to an engineer", href: "/contact" } },
};
