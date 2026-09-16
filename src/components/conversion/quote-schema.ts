/**
 * Request-a-Quote form: options, parsing and validation shared by the client (per-step) and the
 * Server Action (full). Pure TypeScript, no React.
 */

export const SERVICES = [
  { id: "ip-transit", label: "IP transit & bandwidth", connectivity: true, team: "connectivity" },
  { id: "international-circuits", label: "International circuit", connectivity: true, team: "connectivity" },
  { id: "enterprise-internet", label: "Enterprise internet", connectivity: true, team: "connectivity" },
  { id: "data-connectivity", label: "Data connectivity", connectivity: true, team: "connectivity" },
  { id: "data-centre", label: "Data centre", connectivity: false, team: "hosting" },
  { id: "cloud", label: "Mango Cloud", connectivity: false, team: "hosting" },
  { id: "digital-trust", label: "Digital signature / SSL", connectivity: false, team: "digital-trust" },
  { id: "managed-services", label: "Managed services", connectivity: false, team: "managed-services" },
  { id: "software", label: "Software", connectivity: false, team: "software" },
  { id: "training", label: "Training", connectivity: false, team: "training" },
  { id: "other", label: "Other", connectivity: false, team: "solutions" },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

/** Team label shown on the thank-you page ("…is with our {team} team"). */
export const TEAMS: Record<string, string> = {
  connectivity: "connectivity",
  hosting: "cloud and data centre",
  "digital-trust": "digital trust",
  "managed-services": "managed services",
  software: "software",
  training: "training",
  solutions: "solutions",
};

export const ORG_TYPES = [
  "ISP / Operator",
  "Bank / Financial institution",
  "Government",
  "Enterprise",
  "Education",
  "Digital business",
  "Individual",
] as const;

export const CAPACITIES = ["< 1 Gbps", "1–10 Gbps", "10 Gbps+", "Not sure"] as const;
export const HANDOFFS = ["Dhaka PoP", "Our premises", "Not sure yet"] as const;
export const CONTACT_PREFS = ["Email", "Phone", "WhatsApp"] as const;

export type QuoteValues = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  orgType: string;
  services: string[];
  capacity: string;
  locations: string;
  handoff: string;
  message: string;
  contactPref: string;
  consent: boolean;
};

export const EMPTY_VALUES: QuoteValues = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  orgType: "",
  services: [],
  capacity: "",
  locations: "",
  handoff: "",
  message: "",
  contactPref: "Email",
  consent: false,
};

export type QuoteErrors = Partial<Record<keyof QuoteValues, string>>;

export const STEP_FIELDS: (keyof QuoteValues)[][] = [
  ["name", "email", "phone", "organization", "orgType"],
  ["services", "capacity", "locations", "handoff"],
  ["message", "contactPref", "consent"],
];

export const STEPS = [
  { id: "about", short: "About you", title: "Tell us about you" },
  { id: "need", short: "What you need", title: "What do you need?" },
  { id: "details", short: "Details", title: "Anything else we should know?" },
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const isOneOf = (list: readonly string[], v: string) => list.includes(v);

export function isServiceId(v: string): v is ServiceId {
  return SERVICES.some((s) => s.id === v);
}

export function needsCapacity(services: string[]) {
  return services.some((id) => SERVICES.find((s) => s.id === id)?.connectivity);
}

/** Validate a subset of fields (a step) or everything. Returns an empty object when valid. */
export function validate(values: QuoteValues, fields: (keyof QuoteValues)[] = STEP_FIELDS.flat()): QuoteErrors {
  const e: QuoteErrors = {};
  const v = values;
  for (const f of fields) {
    switch (f) {
      case "name":
        if (v.name.trim().length < 2) e.name = "Please enter your full name.";
        else if (v.name.length > 80) e.name = "Name is too long.";
        break;
      case "email":
        if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid work email address.";
        break;
      case "phone":
        if (!PHONE_RE.test(v.phone.trim())) e.phone = "Enter a phone number we can reach you on.";
        break;
      case "organization":
        if (v.organization.trim().length < 2) e.organization = "Tell us which organization you represent.";
        break;
      case "orgType":
        if (!isOneOf(ORG_TYPES, v.orgType)) e.orgType = "Choose the closest organization type.";
        break;
      case "services":
        if (!v.services.length) e.services = "Select at least one service.";
        else if (!v.services.every(isServiceId)) e.services = "One of the selected services is not recognised.";
        break;
      case "capacity":
        if (needsCapacity(v.services) && !isOneOf(CAPACITIES, v.capacity)) e.capacity = "Pick a capacity range, or “Not sure”.";
        break;
      case "locations":
        if (v.locations.length > 200) e.locations = "Keep locations under 200 characters.";
        break;
      case "handoff":
        if (v.handoff && !isOneOf(HANDOFFS, v.handoff)) e.handoff = "Choose a handoff option.";
        break;
      case "message":
        if (v.message.length > 2000) e.message = "Keep the message under 2,000 characters.";
        break;
      case "contactPref":
        if (!isOneOf(CONTACT_PREFS, v.contactPref)) e.contactPref = "Choose how you would like us to reply.";
        break;
      case "consent":
        if (!v.consent) e.consent = "Please agree to the privacy policy so we can process your request.";
        break;
    }
  }
  return e;
}

/** Index of the first step containing an error (or -1). */
export function firstErrorStep(errors: QuoteErrors) {
  return STEP_FIELDS.findIndex((fields) => fields.some((f) => errors[f]));
}

const str = (fd: FormData, key: string, max = 500) => {
  const v = fd.get(key);
  return (typeof v === "string" ? v : "").slice(0, max);
};

/** Parse a submitted FormData into QuoteValues (trimmed, bounded). */
export function parseQuoteForm(fd: FormData): QuoteValues {
  return {
    name: str(fd, "name", 120).trim(),
    email: str(fd, "email", 160).trim(),
    phone: str(fd, "phone", 40).trim(),
    organization: str(fd, "organization", 160).trim(),
    orgType: str(fd, "orgType", 60),
    services: fd
      .getAll("services")
      .filter((s): s is string => typeof s === "string")
      .slice(0, SERVICES.length),
    capacity: str(fd, "capacity", 40),
    locations: str(fd, "locations", 400).trim(),
    handoff: str(fd, "handoff", 40),
    message: str(fd, "message", 4000).trim(),
    contactPref: str(fd, "contactPref", 20),
    consent: fd.get("consent") === "on" || fd.get("consent") === "true",
  };
}

/** Which team the request lands with (first selected service decides; mixed categories → solutions). */
export function teamForServices(services: string[]) {
  const teams = new Set(services.map((id) => SERVICES.find((s) => s.id === id)?.team).filter(Boolean));
  if (teams.size === 1) return [...teams][0] as string;
  return "solutions";
}
