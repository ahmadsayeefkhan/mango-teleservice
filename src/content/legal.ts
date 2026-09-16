/**
 * Legal documents. Privacy sections follow the approved design; the remaining documents are
 * briefs for the legal team (content doc "LEGAL") and render as clearly-marked drafts.
 */

export type LegalSection = { id: string; title: string; paragraphs: string[]; draft?: boolean };
export type LegalDoc = { id: string; title: string; label: string; sections: LegalSection[]; external?: string };

export const legalMeta = {
  lastUpdated: "[date]",
  status: "Draft for legal review",
} as const;

export const legalNav = [
  { id: "privacy", label: "Privacy Policy", href: "#privacy" },
  { id: "terms", label: "Terms of Use", href: "#terms" },
  { id: "cookies", label: "Cookie Policy", href: "#cookies" },
  { id: "aup", label: "Acceptable Use Policy", href: "#aup" },
  { id: "licences", label: "Licence Information", href: "#licences" },
  { id: "cps", label: "Mango CA CPS", href: "https://mangoca.com", external: true },
] as const;

export const privacySections: LegalSection[] = [
  {
    id: "who-we-are",
    title: "1. Who we are",
    paragraphs: [
      "Mango Teleservices Limited (“Mango”, “we”) is a public limited company registered in Bangladesh, with its head office at Police Plaza Concord, Tower-02, Gulshan-1, Dhaka-1212.",
    ],
  },
  {
    id: "information-we-collect",
    title: "2. Information we collect",
    paragraphs: [
      "When you submit a form we collect your name, organization, contact details and the requirement you describe. Our website also uses cookies and analytics to understand how pages are used.",
      "[Legal to complete]",
    ],
  },
  {
    id: "how-we-use-it",
    title: "3. How we use it",
    paragraphs: [
      "To respond to enquiries, deliver and support services, improve our website and meet legal obligations. We do not sell personal data.",
    ],
  },
  {
    id: "retention-security",
    title: "4. Retention & security",
    paragraphs: ["[Retention periods and security controls — legal and information security teams to define]"],
  },
  {
    id: "your-rights",
    title: "5. Your rights & contact",
    paragraphs: ["You can request access, correction or deletion of your data by writing to [privacy@mango.com.bd — VERIFY]."],
  },
];

/** Briefs for the legal team: rendered as draft placeholders so footer anchors resolve. */
export const otherDocs: LegalDoc[] = [
  {
    id: "terms",
    title: "Terms of Use",
    label: "TERMS",
    sections: [
      {
        id: "terms-scope",
        title: "Scope",
        draft: true,
        paragraphs: ["[Legal draft] Terms governing use of mango.com.bd, its content and any customer portals linked from it."],
      },
    ],
  },
  {
    id: "cookies",
    title: "Cookie Policy",
    label: "COOKIES",
    sections: [
      {
        id: "cookies-use",
        title: "Cookies and analytics",
        draft: true,
        paragraphs: [
          "[Legal draft] Which cookies the site sets, the consent banner and analytics opt-in, and how to withdraw consent.",
        ],
      },
    ],
  },
  {
    id: "aup",
    title: "Acceptable Use Policy",
    label: "AUP",
    sections: [
      {
        id: "aup-scope",
        title: "For ISP and cloud customers",
        draft: true,
        paragraphs: ["[Legal draft] Permitted and prohibited use of Mango connectivity, data centre and Mango Cloud services."],
      },
    ],
  },
  {
    id: "licences",
    title: "Licence Information",
    label: "LICENCES",
    sections: [
      {
        id: "licences-list",
        title: "Licences and issuing authorities",
        draft: true,
        paragraphs: [
          "Mango Teleservices Limited holds IIG, ITC and ISP licences issued by the Bangladesh Telecommunication Regulatory Commission (BTRC) and is a licensed Certifying Authority under the Office of the Controller of Certifying Authorities (CCA). [VERIFY: licence numbers]",
          "Mango CA documents, including the Certificate Practice Statement, are published on mangoca.com.",
        ],
      },
    ],
  },
];
