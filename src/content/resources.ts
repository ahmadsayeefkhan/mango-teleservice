/**
 * Resources content: Insights (articles), Case studies, FAQ.
 * Copy source: Website Content/04-Industries-Resources-Careers-Contact.md + content-strategy §9 briefs.
 * Facts are limited to the verified fact register; anything else is wrapped with [[text|verify note]].
 *
 * Inline markup supported in article text: **bold**, [label](href), [[text|verify note]].
 */

export type CategoryId = "connectivity" | "cloud" | "digital-trust" | "industry";

export const categories: { id: CategoryId; label: string }[] = [
  { id: "connectivity", label: "Connectivity" },
  { id: "cloud", label: "Cloud & Data Centre" },
  { id: "digital-trust", label: "Digital Trust" },
  { id: "industry", label: "Industry" },
];

export const categoryLabel = (id: CategoryId) => categories.find((c) => c.id === id)?.label ?? id;

export type Block =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; text: string; label?: string }
  | { t: "table"; head: string[]; rows: string[][] };

export type ArticleSection = { id: string; heading: string; blocks: Block[] };

export type Article = {
  slug: string;
  title: string;
  category: CategoryId;
  /** One-sentence teaser (cards, meta description). */
  summary: string;
  /** ~60-word answer box. */
  answer: string;
  author: { name: string; role: string; verify?: string };
  /** ISO date. */
  date: string;
  image: { src: string; alt: string };
  related: { overline: string; title: string; body: string; href: string; cta: string };
  sections: ArticleSection[];
  relatedSlugs: string[];
  /** Hub placement: "featured" = big card, "pick" = side list. */
  placement?: "featured" | "pick";
};

/* ------------------------------------------------------------------ */
/* Insights hub                                                        */
/* ------------------------------------------------------------------ */

export const insightsHub = {
  overline: "INSIGHTS",
  title: "Notes from the backbone.",
  sub: "Plain-language guides to connectivity, cloud and digital trust in Bangladesh, written by Mango engineers.",
  searchPlaceholder: "Search insights",
  allLabel: "ALL ARTICLES",
  newsletter: {
    title: "Get new guides in your inbox.",
    body: "One practical email a month. No spam.",
    placeholder: "Work email",
    cta: "Subscribe",
    invalid: "Enter a valid work email address.",
    success: "Thanks. You're on the list.",
  },
  cta: {
    title: "Have a question we haven't answered?",
    body: "Ask a Mango engineer directly. If it's useful to others, it becomes the next guide.",
    primary: { label: "Ask an engineer", href: "/contact" },
  },
  seo: {
    title: "Insights: Connectivity, Cloud & Digital Trust Guides",
    description:
      "Plain-language guides to IIG, IP transit, IPLC, data centres, cloud and digital signature certificates in Bangladesh, written by Mango Teleservices engineers.",
  },
};

const RELATED = {
  ipTransit: {
    overline: "RELATED SERVICE",
    title: "IP Transit & Bandwidth",
    body: "Wholesale capacity from Bangladesh's first private gateway.",
    href: "/solutions/ip-transit",
    cta: "Learn more",
  },
  circuits: {
    overline: "RELATED SERVICE",
    title: "International Circuits",
    body: "IPLC and ITC private links from Bangladesh to the world.",
    href: "/solutions/international-circuits",
    cta: "Learn more",
  },
  enterprise: {
    overline: "RELATED SERVICE",
    title: "Enterprise Internet",
    body: "Dedicated business internet that doesn't share your peak hour.",
    href: "/solutions/enterprise-internet",
    cta: "Learn more",
  },
  cloud: {
    overline: "RELATED SERVICE",
    title: "Mango Cloud",
    body: "Cloud servers, storage and backup that stay in Bangladesh.",
    href: "/solutions/cloud",
    cta: "Learn more",
  },
  dataCentre: {
    overline: "RELATED SERVICE",
    title: "Data Centre & Colocation",
    body: "Your critical systems, safely at home in Dhaka.",
    href: "/solutions/data-centre",
    cta: "Learn more",
  },
  digitalTrust: {
    overline: "RELATED SERVICE",
    title: "Digital Trust (Mango CA)",
    body: "Digital signature and SSL certificates from a CCA-licensed authority.",
    href: "/solutions/digital-trust",
    cta: "Learn more",
  },
};

const AUTHOR = {
  network: { name: "Mango Network Engineering", role: "Network Engineer", verify: "author name" },
  ca: { name: "Mango CA Team", role: "PKI & Certificates", verify: "author name" },
  cloud: { name: "Mango Cloud Team", role: "Cloud & Data Centre Engineer", verify: "author name" },
};

const IMG = {
  globe: { src: "/images/hero-network-globe.png", alt: "Bangladesh on a night-time globe with mango-coloured signal arcs reaching out to the world" },
  fibre: { src: "/images/venture-fibre-light.png", alt: "Light travelling through optical fibre strands" },
  rack: { src: "/images/venture-telecom-rack.png", alt: "Telecom equipment rack with fibre patching in a data centre" },
  signing: { src: "/images/digital_sig_training.jpeg", alt: "Mango CA eSign and PKI training session" },
  noc: { src: "/images/careers-noc-team.png", alt: "Network operations engineers at their desks" },
};

export const articles: Article[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: "what-is-an-international-internet-gateway",
    title: "What is an International Internet Gateway, and why does your ISP's choice matter?",
    category: "connectivity",
    summary:
      "How Bangladesh's internet traffic reaches the world, the difference between IIG, ITC, NTTN and ISP, and what to ask your provider about route diversity.",
    answer:
      "An IIG is the licensed gateway through which a country's internet traffic enters and leaves. In Bangladesh, ISPs buy international bandwidth from BTRC-licensed IIG operators, who connect to submarine and terrestrial cables. Mango became the first private IIG in 2008.",
    author: AUTHOR.network,
    date: "2026-09-15",
    image: IMG.globe,
    related: RELATED.ipTransit,
    placement: "featured",
    relatedSlugs: ["ip-transit-vs-dedicated-internet", "building-route-diversity-against-subsea-cuts", "procurement-checklist-for-choosing-an-iig-or-isp-partner"],
    sections: [
      {
        id: "how-traffic-leaves-bangladesh",
        heading: "How traffic leaves Bangladesh",
        blocks: [
          {
            t: "p",
            text: "When someone in Dhaka opens a video, the request travels from their ISP, across a national transmission network, to an International Internet Gateway. From there it crosses a submarine or terrestrial cable to reach servers abroad, unless the content is already cached locally.",
          },
          {
            t: "p",
            text: "Most of the internet Bangladeshis use every day is hosted outside the country. That makes the gateway layer the single most important hop in the chain: it decides how much international capacity is available, which physical routes carry it, and how quickly popular content is reached.",
          },
          {
            t: "p",
            text: "The gateway is also where a lot of the engineering lives that end users never see: peering with global content networks, cache servers for the biggest platforms, and the routing policy that decides which path a packet takes when one route fails.",
          },
        ],
      },
      {
        id: "iig-vs-itc-vs-nttn-vs-isp",
        heading: "IIG vs ITC vs NTTN vs ISP",
        blocks: [
          {
            t: "p",
            text: "Bangladesh separates the internet supply chain into licensed layers. The Bangladesh Telecommunication Regulatory Commission (BTRC) issues each licence, and a company can hold more than one. Here is what each layer actually does:",
          },
          {
            t: "table",
            head: ["Licence", "What it does", "Who buys from it"],
            rows: [
              ["IIG (International Internet Gateway)", "Connects the country's internet to the global internet; sells international IP bandwidth", "ISPs, mobile operators, large enterprises"],
              ["ITC (International Terrestrial Cable)", "Carries international capacity over land borders as an alternative to submarine cables", "IIGs and carriers"],
              ["NTTN (Nationwide Telecommunication Transmission Network)", "Owns and operates the domestic fibre backbone between cities and points of presence", "IIGs, ISPs, operators"],
              ["ISP (Internet Service Provider)", "Delivers internet access to homes, offices and institutions", "End customers"],
            ],
          },
          {
            t: "p",
            text: "The distinction matters because the layers fail in different ways. An ISP outage affects one provider's customers. A gateway problem can affect every ISP that buys from that gateway. When you choose an ISP, you are also, indirectly, choosing the IIG behind it.",
          },
          {
            t: "p",
            text: "Mango holds an IIG licence (2008, the first private-sector IIG in Bangladesh), an ITC licence (2012) and an ISP licence (2013). Holding the gateway, the terrestrial route and the access licence under one roof is what lets one team own a problem end to end.",
          },
        ],
      },
      {
        id: "why-route-diversity-matters",
        heading: "Why route diversity matters",
        blocks: [
          {
            t: "p",
            text: "Bangladesh reaches the world through two kinds of physical path: submarine cables that land on the coast, and terrestrial cables that cross the Indian border. Each has failed before. Submarine systems are cut by anchors and dredging; terrestrial routes are affected by fibre cuts and upstream outages.",
          },
          {
            t: "p",
            text: "A gateway with a single route turns any one of those incidents into a national outage for its customers. A gateway with diverse routes reroutes traffic in seconds, with some loss of capacity but no loss of service. Mango holds rights of use on the SEA-ME-WE 4 and SEA-ME-WE 5 submarine systems and operates terrestrial capacity through its ITC licence, so traffic has more than one way out.",
          },
          {
            t: "p",
            text: "The second part of diversity is content. Mango interconnects directly with Akamai, Amazon, DE-CIX, Equinix, Meta, Google and Zenlayer. When the platforms your subscribers use most are one hop away, or cached in Dhaka, a cable incident abroad affects far less of the traffic people notice.",
          },
        ],
      },
      {
        id: "what-to-ask-your-iig",
        heading: "What to ask your IIG",
        blocks: [
          {
            t: "p",
            text: "Whether you run an ISP or you are an enterprise buying a dedicated link, these questions separate a gateway from a reseller:",
          },
          {
            t: "ol",
            items: [
              "**Which physical routes carry my traffic?** Ask for the submarine systems and terrestrial paths by name, and whether they are on separate physical paths.",
              "**What happens when one route fails?** A real answer describes how rerouting works and how much capacity survives.",
              "**Which content networks do you interconnect with directly?** Direct peering and local caches change the experience for most traffic.",
              "**Who answers at 3am?** Ask for the escalation path: operations desk, senior engineer, head of network operations.",
              "**Which licences do you hold?** IIG, ITC and ISP licences from BTRC are public facts. A provider should be able to name them.",
              "**Can capacity grow on my timeline?** Committed capacity with a clear upgrade path beats a headline number you can never reach.",
            ],
          },
          {
            t: "note",
            label: "IN PRACTICE",
            text: "Bring these questions to any capacity conversation. If you are talking to Mango, [request a capacity quote](/contact?intent=quote) and an engineer will answer them line by line.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "digital-signature-certificates-for-e-gp",
    title: "Digital signature certificates for e-GP: a step-by-step guide",
    category: "digital-trust",
    summary: "What a digital signature certificate is, why the e-GP portal requires one, and the six steps from application to your first signed tender.",
    answer:
      "To bid on Bangladesh's electronic Government Procurement (e-GP) portal you need a digital signature certificate issued by a Certifying Authority licensed by the Office of the Controller of Certifying Authorities (CCA). Mango CA has been licensed since 2011. The process is: confirm the requirement, choose a certificate, gather documents, verify identity, install, then register on e-GP.",
    author: AUTHOR.ca,
    date: "2026-09-08",
    image: IMG.signing,
    related: RELATED.digitalTrust,
    placement: "pick",
    relatedSlugs: ["pki-in-plain-language", "ssl-tls-for-business-owners", "what-is-an-international-internet-gateway"],
    sections: [
      {
        id: "what-a-digital-signature-certificate-is",
        heading: "What a digital signature certificate is",
        blocks: [
          {
            t: "p",
            text: "A digital signature certificate (DSC) is an electronic credential that binds your identity to a cryptographic key pair. When you sign a document with it, anyone can verify that the signature came from you and that the document has not changed since. In Bangladesh, signatures made with a certificate from a licensed Certifying Authority carry legal weight under the ICT Act 2006 and the Information Technology (Certifying Authorities) Rules 2010.",
          },
          {
            t: "p",
            text: "That legal recognition is the reason government systems require one. A scanned signature can be copied; a digital signature cannot be forged without your private key.",
          },
        ],
      },
      {
        id: "why-e-gp-requires-one",
        heading: "Why e-GP requires one",
        blocks: [
          {
            t: "p",
            text: "The e-GP portal replaces paper tenders with electronic ones. Every bid, bid security document and contract needs a signature that a procuring entity can trust and that can be produced as evidence later. A DSC from a licensed CA gives the portal that trust: it can check who signed, when, and whether the file is intact.",
          },
          {
            t: "p",
            text: "Bidders are not the only users. Officers in procuring entities sign tender documents, evaluation reports and awards the same way, which is why many ministries and agencies issue certificates to staff in bulk.",
          },
        ],
      },
      {
        id: "the-six-steps",
        heading: "The six steps",
        blocks: [
          {
            t: "ol",
            items: [
              "**Confirm what you need.** Check the e-GP guidance for your role (bidder, procuring entity officer, bank user) so you apply for the right kind of certificate. [[Certificate classes and validity periods vary; confirm the current requirement with the CA before applying.|certificate classes and validity]]",
              "**Choose the certificate.** Individual certificates identify a person; organizational certificates identify a person acting for a company. Most bidders sign as an authorised representative of their organization.",
              "**Gather documents.** Expect to provide proof of identity, proof of the organization (registration and authorisation letters) and a passport-size photograph. Your CA will list exactly what applies.",
              "**Apply and verify identity.** Submit the application to the CA. Identity checks are part of what makes the signature legally valid, so allow time for verification rather than treating it as paperwork.",
              "**Install and protect the key.** Certificates are delivered on a secure USB token or installed with the CA's software. The private key must stay with you. Sharing a token is the equivalent of handing over your signature.",
              "**Register on e-GP and sign.** Link the certificate to your e-GP account, then test it on a sample document before a live deadline.",
            ],
          },
        ],
      },
      {
        id: "common-mistakes",
        heading: "Common mistakes",
        blocks: [
          {
            t: "ul",
            items: [
              "**Applying the week of a tender.** Verification takes time. Apply when you register on e-GP, not when a notice appears.",
              "**Letting the certificate expire.** Certificates have a fixed validity. Renew before expiry, or you will be locked out of signing at the worst moment.",
              "**Wrong signatory.** The certificate holder must be the person authorised to bind the organization. Update it when staff change.",
              "**Ignoring revocation.** If a token is lost or an employee leaves, ask the CA to revoke the certificate immediately so nothing can be signed in your name.",
            ],
          },
        ],
      },
      {
        id: "where-to-get-one",
        heading: "Where to get one",
        blocks: [
          {
            t: "p",
            text: "Mango CA was licensed by the Office of the CCA in 2011 and was the first to introduce digital certificates and SSL for government, businesses and individuals in Bangladesh. Certificates are issued through [Mango CA](/solutions/digital-trust#digital-signatures), and our team supports organizations that need to roll certificates out to many signers at once.",
          },
          {
            t: "note",
            label: "FOR ORGANIZATIONS",
            text: "Issuing certificates to a whole department? Talk to us about PKI and bulk enrolment rather than applying one by one. [Contact the Mango CA team](/contact).",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "data-centre-or-cloud-buyers-guide",
    title: "Data centre or cloud? A buyer's guide for Bangladeshi organizations",
    category: "cloud",
    summary: "Colocation, hosting and cloud servers solve different problems. Here is how to decide, and why most organizations end up with a mix.",
    answer:
      "Colocation means placing your own servers in a data centre that provides power, cooling, security and connectivity. Cloud means renting virtual servers that a provider runs for you. Choose colocation when you own hardware and need control; choose cloud when you want to start small and scale quickly. Many Bangladeshi organizations combine both, in-country.",
    author: AUTHOR.cloud,
    date: "2026-09-01",
    image: IMG.rack,
    related: RELATED.cloud,
    placement: "pick",
    relatedSlugs: ["backup-as-a-service-the-3-2-1-rule-for-smes", "data-residency-for-bangladeshi-financial-institutions", "ssl-tls-for-business-owners"],
    sections: [
      {
        id: "what-each-one-actually-is",
        heading: "What each one actually is",
        blocks: [
          {
            t: "p",
            text: "The terms get used loosely, so a short definition helps. **Colocation** is rack space in a purpose-built facility. You own the servers; the data centre provides power with backup, climate control, physical security, fire protection and network connectivity. **Hosting** is a step further: the provider owns the hardware and you rent a dedicated machine. **Cloud** is virtual: you rent slices of compute, storage and network that can be resized in minutes.",
          },
          {
            t: "p",
            text: "Mango's Dhaka data centre has run since 2008 with 24/7 monitoring, climate control, a sprinkler system and 12+ hours of power backup. Mango Cloud runs in the same facility, with virtual servers starting at 1 vCPU and 1 GB RAM on SSD or SAS storage, plus Backup-as-a-Service.",
          },
        ],
      },
      {
        id: "when-colocation-makes-sense",
        heading: "When colocation makes sense",
        blocks: [
          {
            t: "ul",
            items: [
              "**You already own capable hardware** and want to move it out of an office server room that was never designed for it.",
              "**Regulation or policy requires physical control** of the equipment, or an auditor wants to see the rack.",
              "**Your workloads are steady and predictable**, so the flexibility of cloud buys you little.",
              "**You run specialised equipment** such as telecom gear, caches or appliances that have no virtual equivalent.",
            ],
          },
          {
            t: "p",
            text: "For ISPs, colocation next to the gateway has a second benefit: caches and core routers sit one hop from international capacity.",
          },
        ],
      },
      {
        id: "when-cloud-makes-sense",
        heading: "When cloud makes sense",
        blocks: [
          {
            t: "ul",
            items: [
              "**You are starting small.** A 1 vCPU server is enough for a portal, a website or a test environment, and it grows when you do.",
              "**Demand is spiky.** Admissions week, results day, a product launch: scale up for the event and back down after.",
              "**You do not want to manage hardware.** Failed disks and end-of-life servers become the provider's problem.",
              "**You need backup and DR without a second building.** Backup-as-a-Service gives you an off-site copy inside Bangladesh.",
            ],
          },
          {
            t: "p",
            text: "Local cloud has two advantages over global providers for organizations serving Bangladeshi users: latency, because the servers are near the users, and practicality, because you deal with a local invoice and a support team you can phone.",
          },
        ],
      },
      {
        id: "the-hybrid-most-organizations-end-up-with",
        heading: "The hybrid most organizations end up with",
        blocks: [
          {
            t: "p",
            text: "In practice the answer is rarely one or the other. A typical pattern: core systems and databases on owned hardware in colocation, public-facing applications on cloud servers that can scale, and Backup-as-a-Service protecting both. Because everything sits in one facility with one support line, moving a workload between the two is a conversation, not a migration project.",
          },
          {
            t: "note",
            label: "DATA RESIDENCY",
            text: "Whichever mix you choose, keeping the data in Bangladesh simplifies compliance for banks, government bodies and anyone handling citizen data. Read [Data residency for Bangladeshi financial institutions](/resources/insights/data-residency-for-bangladeshi-financial-institutions).",
          },
        ],
      },
      {
        id: "a-checklist-before-you-sign",
        heading: "A checklist before you sign",
        blocks: [
          {
            t: "ol",
            items: [
              "**Where is the facility, physically?** Visit it. Ask about power backup duration, cooling and fire protection.",
              "**How is it connected?** A data centre inside a licensed gateway has a different network position from one that buys transit like everyone else.",
              "**What does support look like?** Phone, email, chat, WhatsApp or Viber, and at what hours. Mango Cloud support runs 24/7 on all five.",
              "**How do you get data out?** Backup, export and migration should be answered before you move in, not after.",
              "**What is the smallest step?** A provider should let you start with one server and grow, without a minimum commitment that forces you to guess.",
            ],
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "data-residency-for-bangladeshi-financial-institutions",
    title: "Data residency for Bangladeshi financial institutions",
    category: "industry",
    summary: "What data residency means, why regulators care, and how banks and fintechs keep sensitive systems inside Bangladesh without giving up flexibility.",
    answer:
      "Data residency means keeping specified data physically stored and processed inside a country's borders. For Bangladeshi banks, NBFIs and fintechs, regulators expect core systems and customer data to be hosted in-country with evidence. Local data centre and cloud services satisfy that requirement while still allowing scalable, modern architecture.",
    author: AUTHOR.cloud,
    date: "2026-08-25",
    image: IMG.rack,
    related: RELATED.dataCentre,
    placement: "pick",
    relatedSlugs: ["data-centre-or-cloud-buyers-guide", "iplc-explained-for-banks", "pki-in-plain-language"],
    sections: [
      {
        id: "what-residency-means",
        heading: "What residency actually means",
        blocks: [
          {
            t: "p",
            text: "Residency is about location: where the disks that hold your data sit, and where the servers that process it run. It is different from data sovereignty (which law applies) and from data security (how well it is protected), though the three overlap. A system hosted abroad can be secure and still fail a residency requirement.",
          },
          {
            t: "p",
            text: "The requirement usually covers more than the production database. Backups, disaster recovery replicas, logs and test copies that contain real customer records all count.",
          },
        ],
      },
      {
        id: "why-regulators-care",
        heading: "Why regulators care",
        blocks: [
          {
            t: "ul",
            items: [
              "**Supervision.** A regulator can inspect, audit and, if needed, seize systems inside its jurisdiction. It cannot do that abroad.",
              "**Continuity.** If an international link fails or a foreign provider changes terms, domestic banking must keep running.",
              "**Privacy.** Customer financial records are among the most sensitive data a country holds.",
            ],
          },
          {
            t: "p",
            text: "[[Bangladesh Bank's ICT guidelines set the expectations for banks and financial institutions; confirm the current version and the exact scope with your compliance team.|Legal review: cite Bangladesh Bank ICT guideline version]]",
          },
        ],
      },
      {
        id: "how-to-comply-without-losing-flexibility",
        heading: "How to comply without losing flexibility",
        blocks: [
          {
            t: "ol",
            items: [
              "**Map the data.** List every system that holds customer or transaction data, including backups and DR. Residency failures are usually in the copies nobody drew on the diagram.",
              "**Host core systems in-country.** Colocation for owned hardware, cloud servers for applications that need to scale. Mango's data centre and Mango Cloud both run in Dhaka.",
              "**Keep DR in-country too.** A second site connected by a private circuit, or Backup-as-a-Service, gives you recovery without exporting data.",
              "**Sign transactions with a licensed CA.** Digital signatures from a CCA-licensed authority keep approvals legally valid and auditable.",
              "**Keep the evidence.** Contracts, facility details and network diagrams that show where data lives are what an auditor asks for.",
            ],
          },
          {
            t: "note",
            label: "TALK TO US",
            text: "Mango has hosted digital resources for national platforms since 2008 and operates under BTRC and CCA licences. [Book a consultation](/contact) to walk through a residency review with an engineer.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "ip-transit-vs-dedicated-internet",
    title: "IP transit vs dedicated internet: which do you need?",
    category: "connectivity",
    summary: "Two products that both deliver 'internet' but to very different buyers. How to tell which one you are, and what changes in the contract.",
    answer:
      "IP transit carries a network's traffic to the global internet and is sold by capacity to ISPs and operators that run their own routing. Dedicated internet delivers a fixed, uncontended connection to a single organization that just wants reliable access. If you announce your own IP addresses, you need transit; if you don't, you need dedicated internet.",
    author: AUTHOR.network,
    date: "2026-08-18",
    image: IMG.fibre,
    related: RELATED.enterprise,
    placement: "pick",
    relatedSlugs: ["what-is-an-international-internet-gateway", "procurement-checklist-for-choosing-an-iig-or-isp-partner", "building-route-diversity-against-subsea-cuts"],
    sections: [
      {
        id: "the-difference-in-one-question",
        heading: "The difference in one question",
        blocks: [
          {
            t: "p",
            text: "Do you run your own network on the internet, with your own IP address space and routers that speak BGP? If yes, you are a transit customer. If no, you are a dedicated internet customer. Everything else follows from that answer.",
          },
        ],
      },
      {
        id: "ip-transit",
        heading: "IP transit",
        blocks: [
          {
            t: "p",
            text: "Transit is the wholesale product. An ISP, mobile operator or large enterprise with its own address space connects to a gateway and exchanges routes with it. The gateway carries the customer's traffic to everywhere on the internet and accepts traffic back. Capacity is committed and typically upgraded in steps as subscribers grow.",
          },
          {
            t: "ul",
            items: [
              "Sold by capacity, to networks that run BGP.",
              "The customer is responsible for its own routing, security and end-user support.",
              "What matters: route diversity, direct interconnects with content networks, and the escalation path when a route fails.",
            ],
          },
        ],
      },
      {
        id: "dedicated-internet",
        heading: "Dedicated internet",
        blocks: [
          {
            t: "p",
            text: "Dedicated internet is the retail product for organizations: a fixed connection for one office, campus or factory that is not shared with other customers at peak hour. The provider handles the routing; the customer plugs in.",
          },
          {
            t: "ul",
            items: [
              "Sold by connection speed to a single site, with optional backup links.",
              "The provider owns routing and the upstream path; the customer owns their LAN.",
              "What matters: whether the link is truly uncontended, how backup works, and how quickly a fault is answered.",
            ],
          },
        ],
      },
      {
        id: "choosing-a-provider-that-does-both",
        heading: "Choosing a provider that does both",
        blocks: [
          {
            t: "p",
            text: "Because Mango holds both an IIG licence and an ISP licence, the same gateway that sells transit to operators delivers dedicated internet to enterprises. The practical benefit is a short path: your office link reaches international capacity without passing through another company's network first.",
          },
          {
            t: "note",
            label: "NEXT STEP",
            text: "Operators: [request a capacity quote](/contact?intent=quote). Enterprises: read about [Enterprise Internet](/solutions/enterprise-internet) or [talk to an engineer](/contact).",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "ssl-tls-for-business-owners",
    title: "SSL/TLS explained for business owners",
    category: "digital-trust",
    summary: "What the padlock in the browser actually proves, what happens when it is missing, and how to choose and manage certificates for your sites and apps.",
    answer:
      "An SSL/TLS certificate encrypts the connection between a visitor and your website or app, and proves the site belongs to you. Without one, browsers warn users away, forms are exposed, and payment providers will not integrate. Certificates come from a Certificate Authority, are valid for a fixed period, and must be renewed before they expire.",
    author: AUTHOR.ca,
    date: "2026-08-11",
    image: IMG.signing,
    related: RELATED.digitalTrust,
    relatedSlugs: ["pki-in-plain-language", "digital-signature-certificates-for-e-gp", "data-centre-or-cloud-buyers-guide"],
    sections: [
      {
        id: "what-the-padlock-proves",
        heading: "What the padlock proves",
        blocks: [
          {
            t: "p",
            text: "Two things. First, that everything between the visitor's browser and your server is encrypted, so nobody on the path (a café Wi-Fi, an ISP, a compromised router) can read or alter it. Second, that a Certificate Authority has verified that the certificate was issued to the operator of that domain. The padlock is the browser's summary of both checks passing.",
          },
          {
            t: "p",
            text: "SSL is the older name; TLS is the current protocol. People say SSL and mean TLS. The certificate is the same product either way.",
          },
        ],
      },
      {
        id: "what-happens-without-one",
        heading: "What happens without one",
        blocks: [
          {
            t: "ul",
            items: [
              "Browsers label the site **Not secure** and, for expired or mismatched certificates, show a full-page warning most visitors will not click through.",
              "Login forms, customer details and card numbers travel as plain text.",
              "Payment gateways, app stores and many APIs refuse to integrate with unencrypted endpoints.",
              "Search engines treat HTTPS as a baseline, so an unencrypted site is at a disadvantage.",
            ],
          },
        ],
      },
      {
        id: "types-of-certificate",
        heading: "Types of certificate",
        blocks: [
          {
            t: "table",
            head: ["Type", "What is verified", "Typical use"],
            rows: [
              ["Domain Validated (DV)", "Control of the domain name", "Websites, blogs, internal tools"],
              ["Organization Validated (OV)", "Domain plus the legal organization", "Company sites, customer portals"],
              ["Extended Validation (EV)", "Domain plus an extended organization check", "Banking and high-trust portals"],
              ["Wildcard", "A domain and all its subdomains", "Many services under one name"],
            ],
          },
          {
            t: "p",
            text: "For most businesses, an OV certificate on the public site and DV certificates for internal tools is a sensible baseline. Banks and government portals usually go further.",
          },
        ],
      },
      {
        id: "managing-certificates",
        heading: "Managing certificates without surprises",
        blocks: [
          {
            t: "ol",
            items: [
              "**Keep an inventory.** Every domain, subdomain and API endpoint, with its expiry date and owner.",
              "**Renew early.** Set reminders well before expiry. An expired certificate is the most common self-inflicted outage.",
              "**Protect the private key.** It should live only on the server that uses it. If it leaks, revoke and reissue.",
              "**Use a licensed CA.** Mango CA has issued SSL certificates in Bangladesh since 2011 and supports organizations that need certificates with local documentation and local support.",
            ],
          },
          {
            t: "note",
            label: "GET A CERTIFICATE",
            text: "See [SSL/TLS certificates from Mango CA](/solutions/digital-trust#ssl) or [contact the team](/contact) for organizational and wildcard options.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "pki-in-plain-language",
    title: "PKI in plain language",
    category: "digital-trust",
    summary: "Public key infrastructure is the system behind digital signatures and SSL. Here is how the pieces fit, without the mathematics.",
    answer:
      "Public key infrastructure (PKI) is the set of roles, policies and software that issue, manage and revoke digital certificates. It lets anyone verify that a key belongs to a specific person, organization or server, which is what makes digital signatures legally meaningful and encrypted connections trustworthy. A licensed Certifying Authority sits at the top of that chain of trust.",
    author: AUTHOR.ca,
    date: "2026-08-04",
    image: IMG.signing,
    related: RELATED.digitalTrust,
    relatedSlugs: ["digital-signature-certificates-for-e-gp", "ssl-tls-for-business-owners", "data-residency-for-bangladeshi-financial-institutions"],
    sections: [
      {
        id: "two-keys",
        heading: "Two keys, one identity",
        blocks: [
          {
            t: "p",
            text: "Every participant in PKI has a pair of keys. The **private key** stays secret and is used to sign or decrypt. The **public key** is shared freely and is used to verify a signature or encrypt a message to the owner. The two are mathematically linked: what one does, only the other can undo.",
          },
          {
            t: "p",
            text: "That solves half the problem. Anyone can generate a key pair, so a public key on its own proves nothing about who owns it. The other half is the certificate.",
          },
        ],
      },
      {
        id: "the-certificate",
        heading: "The certificate",
        blocks: [
          {
            t: "p",
            text: "A certificate is a signed statement from a Certificate Authority that says: this public key belongs to this person, organization or server, and we checked. Because the CA signs the statement with its own key, and the CA's key is trusted by operating systems, browsers and, in Bangladesh, by law, the chain of trust reaches from your signature back to a root everyone recognises.",
          },
        ],
      },
      {
        id: "the-roles",
        heading: "The roles in a PKI",
        blocks: [
          {
            t: "table",
            head: ["Role", "Job"],
            rows: [
              ["Certificate Authority (CA)", "Issues and signs certificates; publishes which ones have been revoked"],
              ["Registration Authority (RA)", "Verifies identity before the CA issues a certificate"],
              ["Subscriber", "The person, organization or server that holds the certificate and private key"],
              ["Relying party", "Anyone who checks a signature or connection against the certificate"],
              ["Controller of Certifying Authorities (CCA)", "The government office that licenses and audits CAs in Bangladesh"],
            ],
          },
          {
            t: "p",
            text: "Mango CA has held a CA licence from the Office of the CCA since 2011, operating under the ICT Act 2006 and the IT (Certifying Authorities) Rules 2010.",
          },
        ],
      },
      {
        id: "where-you-meet-pki",
        heading: "Where you meet PKI every day",
        blocks: [
          {
            t: "ul",
            items: [
              "**Digital signatures** on e-GP tenders, contracts and approvals.",
              "**SSL/TLS** behind every padlock in the browser.",
              "**Secure email and document signing** inside organizations.",
              "**Authentication** for staff logging into sensitive systems with certificates instead of passwords.",
            ],
          },
          {
            t: "note",
            label: "BUILDING A PKI",
            text: "Organizations that need to issue many certificates, or run their own internal trust, can work with Mango CA on [PKI and security consulting](/solutions/digital-trust#pki).",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "building-route-diversity-against-subsea-cuts",
    title: "Building route diversity against subsea cable cuts",
    category: "connectivity",
    summary: "Submarine cables get cut. Terrestrial routes fail. Here is how a gateway and its customers design so that neither becomes an outage.",
    answer:
      "Route diversity means carrying traffic over physically separate paths so a single cut cannot isolate you. For Bangladesh that means combining submarine cable systems with terrestrial cross-border routes, and, at the customer end, buying capacity that is explicitly spread across them. Mango holds rights of use on SEA-ME-WE 4 and SEA-ME-WE 5 and runs terrestrial capacity under its ITC licence.",
    author: AUTHOR.network,
    date: "2026-07-28",
    image: IMG.fibre,
    related: RELATED.circuits,
    relatedSlugs: ["what-is-an-international-internet-gateway", "ip-transit-vs-dedicated-internet", "iplc-explained-for-banks"],
    sections: [
      {
        id: "how-cables-fail",
        heading: "How cables fail",
        blocks: [
          {
            t: "p",
            text: "Submarine cables are cut more often than people expect: ship anchors, fishing gear, dredging and seabed movement all cause faults. Repairs need a specialised ship and can take days or weeks. Terrestrial routes fail for more ordinary reasons: road works, fibre cuts and upstream carrier outages. Neither is rare enough to ignore.",
          },
        ],
      },
      {
        id: "three-kinds-of-diversity",
        heading: "Three kinds of diversity",
        blocks: [
          {
            t: "ol",
            items: [
              "**Physical path diversity.** Two routes that never share a cable, a duct or a landing station. Two circuits on the same cable are not diverse.",
              "**System diversity.** Different submarine systems (SEA-ME-WE 4 and SEA-ME-WE 5, for example) plus terrestrial routes across the land border.",
              "**Content diversity.** Direct interconnects and local caches with the largest content networks mean much of the traffic users care about does not depend on the long-haul path at all.",
            ],
          },
        ],
      },
      {
        id: "what-it-looks-like-in-practice",
        heading: "What it looks like in practice",
        blocks: [
          {
            t: "p",
            text: "When a route fails, routing protocols shift traffic to the surviving paths within seconds. Capacity is reduced, so the design question is how much of your peak traffic the remaining routes can carry. A gateway that plans for that, and tells you how it plans, is the one to buy from.",
          },
          {
            t: "p",
            text: "Mango interconnects directly with Akamai, Amazon, DE-CIX, Equinix, Meta, Google and Zenlayer, so during an international incident the platforms most subscribers use are the least affected part of the network.",
          },
        ],
      },
      {
        id: "what-to-ask-for",
        heading: "What to ask for in a contract",
        blocks: [
          {
            t: "ul",
            items: [
              "The named systems and routes your capacity uses.",
              "Whether your circuits are on physically separate paths, not just separate line items.",
              "How rerouting is handled and how you are informed during an incident.",
              "For critical sites, a backup circuit through a different route as standard.",
            ],
          },
          {
            t: "note",
            label: "NEXT STEP",
            text: "See [how Mango's network is built](/network), or [request a capacity quote](/contact?intent=quote) and ask for the route breakdown.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "iplc-explained-for-banks",
    title: "IPLC explained for banks",
    category: "connectivity",
    summary: "An International Private Leased Circuit is the link banks use for disaster recovery sites, SWIFT connectivity and regional hubs. What it is and when it is the right tool.",
    answer:
      "An IPLC (International Private Leased Circuit) is a dedicated, point-to-point circuit between a site in Bangladesh and a site abroad. Unlike internet traffic it is not shared and does not route across the public internet, which is why banks use it for disaster recovery replication, connections to international payment networks and links to regional headquarters.",
    author: AUTHOR.network,
    date: "2026-07-21",
    image: IMG.fibre,
    related: RELATED.circuits,
    relatedSlugs: ["data-residency-for-bangladeshi-financial-institutions", "building-route-diversity-against-subsea-cuts", "ip-transit-vs-dedicated-internet"],
    sections: [
      {
        id: "what-an-iplc-is",
        heading: "What an IPLC is",
        blocks: [
          {
            t: "p",
            text: "Think of an IPLC as a private cable between two of your buildings that happens to cross a border. Capacity is fixed and yours alone, latency is predictable, and the traffic never touches the public internet. It is delivered by carriers that hold international licences: in Bangladesh, an ITC licence for terrestrial routes and rights on submarine systems for subsea routes.",
          },
        ],
      },
      {
        id: "why-banks-use-them",
        heading: "Why banks use them",
        blocks: [
          {
            t: "ul",
            items: [
              "**Disaster recovery replication** to a DR site abroad or a regional data centre, where consistent throughput matters more than headline speed.",
              "**Payment and messaging networks** that require dedicated, controlled connectivity rather than an internet VPN.",
              "**Regional headquarters** of international banks that run shared systems across countries.",
              "**Predictability.** Fixed capacity and a fixed path make performance easy to measure and audit.",
            ],
          },
        ],
      },
      {
        id: "iplc-vs-vpn-over-internet",
        heading: "IPLC vs VPN over the internet",
        blocks: [
          {
            t: "table",
            head: ["", "IPLC", "VPN over internet"],
            rows: [
              ["Path", "Dedicated, fixed", "Shared, varies"],
              ["Capacity", "Guaranteed", "Best effort"],
              ["Latency", "Stable", "Variable with congestion"],
              ["Best for", "DR, payment networks, HQ links", "Branch access, low-volume links"],
            ],
          },
          {
            t: "p",
            text: "Most banks run both: IPLC for the links that cannot vary, internet VPN for everything else.",
          },
        ],
      },
      {
        id: "what-to-specify",
        heading: "What to specify",
        blocks: [
          {
            t: "ol",
            items: [
              "The two endpoints, exactly: building, floor, handoff type.",
              "Capacity now and the upgrade steps you expect.",
              "Route: subsea, terrestrial or both, and whether you need a diverse backup.",
              "Monitoring and the escalation path when the circuit degrades.",
            ],
          },
          {
            t: "note",
            label: "NEXT STEP",
            text: "Mango has held an ITC licence since 2012 and rights of use on SEA-ME-WE 4 and 5. [Read about International Circuits](/solutions/international-circuits) or [book a consultation](/contact).",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "backup-as-a-service-the-3-2-1-rule-for-smes",
    title: "Backup-as-a-Service: the 3-2-1 rule for SMEs",
    category: "cloud",
    summary: "A simple rule that survives ransomware, hardware failure and human error, and how a local backup service makes it practical for small teams.",
    answer:
      "The 3-2-1 rule: keep three copies of your data, on two different types of storage, with one copy off-site. Backup-as-a-Service provides the off-site copy without a second building: your data is backed up on a schedule to a data centre in Bangladesh and can be restored when the original is lost, corrupted or encrypted by ransomware.",
    author: AUTHOR.cloud,
    date: "2026-07-14",
    image: IMG.rack,
    related: RELATED.cloud,
    relatedSlugs: ["data-centre-or-cloud-buyers-guide", "data-residency-for-bangladeshi-financial-institutions", "ssl-tls-for-business-owners"],
    sections: [
      {
        id: "the-rule",
        heading: "The rule",
        blocks: [
          {
            t: "ol",
            items: [
              "**Three copies.** The live data plus two backups. One backup is not enough, because backups fail too.",
              "**Two media.** For example, a local disk or NAS plus a cloud backup. Different media fail for different reasons.",
              "**One off-site.** If the office floods, burns or is burgled, the copy that saves you is the one that was not in the office.",
            ],
          },
          {
            t: "p",
            text: "A modern addition is **one immutable copy**: a backup that cannot be altered or deleted for a set period, so ransomware that reaches your network cannot encrypt the backup as well.",
          },
        ],
      },
      {
        id: "why-smes-skip-it",
        heading: "Why small teams skip it",
        blocks: [
          {
            t: "p",
            text: "Not because they disagree, but because the off-site copy used to mean a second location, someone carrying drives, or a foreign cloud subscription paid in dollars on a personal card. Each of those quietly stops happening. Backup-as-a-Service removes the friction: the schedule runs itself and the copy lands in a Dhaka data centre.",
          },
        ],
      },
      {
        id: "what-to-back-up",
        heading: "What to back up",
        blocks: [
          {
            t: "ul",
            items: [
              "Accounting and ERP databases.",
              "File shares and shared drives.",
              "Email, if it is hosted on your own server.",
              "Website and application servers, including configuration.",
              "Anything you would have to recreate by hand if it vanished.",
            ],
          },
        ],
      },
      {
        id: "test-the-restore",
        heading: "Test the restore",
        blocks: [
          {
            t: "p",
            text: "A backup you have never restored is a hope, not a plan. Once a quarter, pick a file or a database and restore it somewhere safe. Time it. If the answer is longer than your business can tolerate, change the plan before you need it.",
          },
          {
            t: "note",
            label: "GET STARTED",
            text: "Mango Cloud includes [Backup-as-a-Service](/solutions/cloud#backup) with support by phone, email, chat, WhatsApp and Viber, 24/7.",
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "procurement-checklist-for-choosing-an-iig-or-isp-partner",
    title: "Procurement checklist for choosing an IIG or ISP partner",
    category: "industry",
    summary: "A one-page checklist for procurement and IT teams comparing connectivity providers: licences, routes, support, contract terms and the questions that expose a reseller.",
    answer:
      "Choosing a connectivity partner comes down to five areas: licences held, physical routes and diversity, interconnects with content networks, the support and escalation model, and contract terms for capacity growth. Ask for evidence on each. A licensed gateway can name its cables, its licences and the engineer who picks up the phone.",
    author: AUTHOR.network,
    date: "2026-07-07",
    image: IMG.noc,
    related: RELATED.ipTransit,
    relatedSlugs: ["what-is-an-international-internet-gateway", "ip-transit-vs-dedicated-internet", "building-route-diversity-against-subsea-cuts"],
    sections: [
      {
        id: "licences",
        heading: "1. Licences",
        blocks: [
          {
            t: "ul",
            items: [
              "Which BTRC licences does the provider hold directly: IIG, ITC, ISP? Ask for the licence, not a brochure.",
              "If the provider resells another company's gateway, who is accountable when that gateway fails?",
              "For digital trust bundled with connectivity, is the CA licensed by the Office of the CCA?",
            ],
          },
        ],
      },
      {
        id: "routes",
        heading: "2. Routes and diversity",
        blocks: [
          {
            t: "ul",
            items: [
              "Named submarine systems and terrestrial routes carrying your traffic.",
              "Whether backup capacity is on a physically separate path.",
              "How the provider communicated during its last international incident. Ask for an example.",
            ],
          },
        ],
      },
      {
        id: "interconnects",
        heading: "3. Interconnects and content",
        blocks: [
          {
            t: "ul",
            items: [
              "Which content networks are directly interconnected (for example Google, Meta, Amazon, Akamai, Equinix, DE-CIX, Zenlayer).",
              "Whether caches for major platforms are hosted locally.",
              "For enterprises: whether the office link reaches the gateway directly or via another carrier.",
            ],
          },
        ],
      },
      {
        id: "support",
        heading: "4. Support and escalation",
        blocks: [
          {
            t: "ul",
            items: [
              "24/7 phone numbers, published and answered by engineers.",
              "A written escalation path: operations desk, senior engineer, head of network operations.",
              "Monitoring: does the provider see a fault before you report it?",
            ],
          },
        ],
      },
      {
        id: "contract",
        heading: "5. Contract terms",
        blocks: [
          {
            t: "ul",
            items: [
              "Committed capacity and the steps to upgrade, with lead times.",
              "Handoff type and location, in writing.",
              "Term, exit and what happens to capacity pricing on renewal.",
              "[[Service levels and response windows should be stated per contract; ask for them in writing rather than accepting a marketing figure.|SLA and response windows per contract]]",
            ],
          },
          {
            t: "note",
            label: "USE IT",
            text: "Send this list with your RFP. To see how Mango answers it, [request a capacity quote](/contact?intent=quote).",
          },
        ],
      },
    ],
  },
];

export const articleSlugs = articles.map((a) => a.slug);

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

/** Rough word count for read time (200 wpm). */
export function articleWords(a: Article) {
  const text = [a.answer, ...a.sections.flatMap((s) => [s.heading, ...s.blocks.flatMap(blockText)])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function readMinutes(a: Article) {
  return Math.max(3, Math.round(articleWords(a) / 200));
}

function blockText(b: Block): string[] {
  switch (b.t) {
    case "p":
    case "note":
      return [b.text];
    case "ul":
    case "ol":
      return b.items;
    case "table":
      return [...b.head, ...b.rows.flat()];
  }
}

/** End-of-article CTA by category. */
export function getArticleCta(category: CategoryId): { title: string; body?: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } } {
  switch (category) {
    case "connectivity":
      return {
        title: "Need help choosing a gateway partner?",
        body: "Bring your capacity numbers and your questions. A Mango network engineer answers them line by line.",
        primary: { label: "Talk to an engineer", href: "/contact" },
        secondary: { label: "Request capacity quote", href: "/contact?intent=quote" },
      };
    case "cloud":
      return {
        title: "Ready to host at home?",
        body: "Start with one server or a rack. Everything runs in our Dhaka data centre with 24/7 support.",
        primary: { label: "Talk to an engineer", href: "/contact" },
        secondary: { label: "Explore Mango Cloud", href: "/solutions/cloud" },
      };
    case "digital-trust":
      return {
        title: "Need certificates for your organization?",
        body: "Digital signature and SSL certificates from a CCA-licensed authority, with local documentation and support.",
        primary: { label: "Talk to the Mango CA team", href: "/contact" },
        secondary: { label: "Explore Digital Trust", href: "/solutions/digital-trust" },
      };
    default:
      return {
        title: "Tell us what you need to connect, host or secure.",
        body: "A Mango engineer, not a call centre, will reply within one business day.",
        primary: { label: "Talk to an engineer", href: "/contact" },
        secondary: { label: "Request capacity quote", href: "/contact?intent=quote" },
      };
  }
}

export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).toUpperCase();
}

/* ------------------------------------------------------------------ */
/* Case studies                                                        */
/* ------------------------------------------------------------------ */

export type CaseStat = { k: string; v: string; verify?: string };

export type CaseStudy = {
  slug: string;
  status: "published" | "draft";
  client: string;
  sector: string;
  kicker: string;
  /** List card title. */
  title: string;
  summary: string;
  image: { src: string; alt: string };
  stats: CaseStat[];
  /** Detail page (published only). */
  detail?: {
    overline: string;
    title: string;
    facts: { label: string; value: string; verify?: string }[];
    challenge: string;
    delivered: string;
    outcome: string;
    quote: { text: string; by: string; verify: string };
    services: { label: string; href: string }[];
    cta: { title: string; body: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } };
    seo: { title: string; description: string };
  };
};

export const caseStudiesHub = {
  overline: "CASE STUDIES",
  title: "Proof, not promises.",
  sub: "How operators, banks and public institutions use Mango infrastructure, with measured outcomes.",
  draftLabel: "DRAFT · APPROVAL NEEDED",
  publishedLabel: "PUBLISHED",
  draftNote: "Draft stories are awaiting client approval before publication.",
  cta: {
    title: "Become our next case study.",
    body: "Start with a conversation about what you need to connect, host or secure. The measured outcome comes later.",
    primary: { label: "Start a conversation", href: "/contact" },
  },
  seo: {
    title: "Case Studies: Measured Outcomes for Operators, Banks & Government",
    description:
      "How operators, banks and public institutions in Bangladesh use Mango connectivity, hosting, digital trust and training, with measured outcomes.",
  },
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "nbr-training",
    status: "published",
    client: "National Board of Revenue",
    sector: "Government",
    kicker: "GOVERNMENT · TRAINING",
    title: "National Board of Revenue",
    summary: "18 officials certified across 5 advanced technology courses, building technical self-sufficiency.",
    image: { src: "/images/nbr_training.jpg", alt: "National Board of Revenue officials holding certificates at the close of a Mango-delivered training programme" },
    stats: [
      { k: "18", v: "Officials certified" },
      { k: "5", v: "Courses" },
      { k: "6 MO", v: "Programme", verify: "programme duration" },
    ],
    detail: {
      overline: "CASE STUDY · NATIONAL BOARD OF REVENUE",
      title: "Building technical self-sufficiency at NBR.",
      facts: [
        { label: "Client", value: "National Board of Revenue" },
        { label: "Sector", value: "Government" },
        { label: "Services", value: "Training" },
        { label: "Completed", value: "12 December 2023" },
      ],
      challenge: "NBR wanted to reduce its dependence on third-party technology suppliers by building advanced skills inside its own teams.",
      delivered:
        "A programme of five advanced courses: Java programming, database systems, network administration, systems security and software quality assurance, delivered by Mango's engineering and training team.",
      outcome:
        "On 12 December 2023, certificates of achievement were awarded to 18 NBR officials who completed the programme, part of NBR's drive for technical self-sufficiency.",
      quote: { text: "[Approved client quote to be added.]", by: "[Name · Title · NBR]", verify: "client quote and approval" },
      services: [
        { label: "Training & Capability", href: "/solutions/training" },
        { label: "Software & Integration", href: "/solutions/software" },
      ],
      cta: {
        title: "Build capability inside your organization.",
        body: "Multi-course programmes for government and enterprise teams, taught by the engineers who run the infrastructure.",
        primary: { label: "Request a programme", href: "/contact" },
        secondary: { label: "Explore Training", href: "/solutions/training" },
      },
      seo: {
        title: "Case Study: NBR Technical Training Programme",
        description:
          "How Mango Teleservices delivered five advanced technology courses to the National Board of Revenue, certifying 18 officials in December 2023.",
      },
    },
  },
  {
    slug: "nationwide-isp",
    status: "draft",
    client: "[Nationwide ISP]",
    sector: "ISP",
    kicker: "ISP · CONNECTIVITY",
    title: "[Nationwide ISP: approval pending]",
    summary: "[Capacity growth and route diversity outcome]",
    image: { src: "/images/venture-fibre-light.png", alt: "Light travelling through optical fibre strands" },
    stats: [
      { k: "[X] Gbps", v: "Capacity" },
      { k: "[X]%", v: "Fewer outages" },
      { k: "24/7", v: "Support" },
    ],
  },
  {
    slug: "bank-digital-signature",
    status: "draft",
    client: "[Bank]",
    sector: "Banking",
    kicker: "BANKING · DIGITAL TRUST",
    title: "[Bank: approval pending]",
    summary: "[Digital signature rollout for transaction approvals]",
    image: { src: "/images/digital_sig_training.jpeg", alt: "Mango CA eSign and PKI training session" },
    stats: [
      { k: "[X]", v: "Signers" },
      { k: "[X] days", v: "Faster approvals" },
      { k: "CCA", v: "Licensed CA" },
    ],
  },
];

export const caseStudySlugs = caseStudies.filter((c) => c.status === "published").map((c) => c.slug);

export function getCaseStudy(slug: string) {
  const c = caseStudies.find((cs) => cs.slug === slug);
  return c && c.status === "published" && c.detail ? c : undefined;
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export type FaqEntry = { q: string; a: string; verify?: string };
export type FaqGroup = { id: string; label: string; items: FaqEntry[] };

export const faqHub = {
  overline: "FAQ",
  title: "Answers, without the jargon.",
  sub: "The questions customers ask most about Mango, connectivity, cloud, digital certificates and support.",
  searchPlaceholder: "Search questions…",
  noResults: "No questions match. Try a different word, or ask us directly.",
  cta: {
    title: "Still have a question?",
    body: "An engineer replies within one business day.",
    primary: { label: "Talk to our team", href: "/contact" },
    secondary: { label: "24/7 support", href: "/support" },
  },
  seo: {
    title: "FAQ: IIG, IP Transit, Cloud, Digital Signature & Support",
    description:
      "Answers to common questions about Mango Teleservices: what we do, IP transit and IPLC, Mango Cloud and data residency, Mango CA certificates, and 24/7 support.",
  },
};

export const faqGroups: FaqGroup[] = [
  {
    id: "about-mango",
    label: "About Mango",
    items: [
      {
        q: "What does Mango Teleservices do?",
        a: "We are a licensed IIG, ITC, ISP and Certifying Authority. We provide IP transit, international circuits, business internet, data centre, Mango Cloud, digital signature and SSL certificates, managed services, software and training.",
      },
      {
        q: "Is Mango a government company?",
        a: "No. Mango is a private public limited company. In 2008 it became the first private-sector company licensed as an IIG.",
      },
      {
        q: "Where is Mango located?",
        a: "Police Plaza Concord, Tower-02 (7th Floor), Plot 02, Road 144, Gulshan-1, Dhaka-1212.",
      },
    ],
  },
  {
    id: "connectivity",
    label: "Connectivity",
    items: [
      { q: "What is IP transit?", a: "A service that carries a network's traffic to the global internet, sold by capacity." },
      { q: "What is IPLC?", a: "A dedicated private circuit between a site in Bangladesh and a site abroad." },
      { q: "Do you sell internet to homes?", a: "Our focus is businesses, institutions and operators.", verify: "residential availability" },
    ],
  },
  {
    id: "cloud-data-centre",
    label: "Cloud & Data Centre",
    items: [
      { q: "Is my data stored in Bangladesh?", a: "Yes. Mango Cloud and colocation run in our Dhaka data centre." },
      { q: "What's the smallest cloud server?", a: "1 vCPU with 1 GB RAM, plus storage, bandwidth and a public IP." },
    ],
  },
  {
    id: "digital-trust",
    label: "Digital Trust",
    items: [
      { q: "Is Mango CA licensed?", a: "Yes, by the Office of the Controller of Certifying Authorities since 2011." },
      { q: "Where do I buy a certificate?", a: "Visit mangoca.com or contact our team.", verify: "mangoca.com URL" },
    ],
  },
  {
    id: "support",
    label: "Support",
    items: [{ q: "How do I report an outage?", a: "Call +880 1730 068810 or +880 1730 068811, available 24/7." }],
  },
];
