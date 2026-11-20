import { z } from "zod";

export const companyNames = [
  "VINK Group", "Ballylife Online", "Mansya", "OpHelp", "AffordableLife", "Siira", "Drive to Own", "Totoise", "Altegic",
  "VINK Telecommunications", "VINK Television", "VINK News Media", "VINK Vehicle Tracking", "VINK Construction",
  "VINK Energy", "Call My Lawyer", "Bakes Braai", "VINK Insurance", "VINK Immigration Consultancy",
] as const;

export const enquiryTypes = ["General enquiry", "Partnership", "Investor relations", "Media", "Company-specific"] as const;
const text = (min: number, max: number, label: string) =>
  z.string({ required_error: `${label} is required` }).trim().min(min, `${label} is required`).max(max, `${label} is too long`);

const email = z.string({ required_error: "Email is required" }).trim().toLowerCase().max(200).email("Enter a valid email address");
const phone = text(6, 40, "Phone number").regex(/^\+?[\d\s().-]{6,}$/, "Enter a valid phone number");
const httpsUrl = (label: string) =>
  z.string().trim().max(500).refine((v) => v === "" || /^https:\/\/[^\s]+$/i.test(v), `${label} must be a secure https:// link`).default("");
const consent = z.literal(true, { errorMap: () => ({ message: "Please confirm that we may contact you" }) });

export const enquirySchema = z
  .object({
    name: text(2, 120, "Full name"),
    email,
    phone,
    organisation: z.string().trim().max(160).default(""),
    type: z.enum(enquiryTypes).default("General enquiry"),
    contactPreference: z.enum(["Email", "Phone call", "WhatsApp"]).default("Email"),
    company: z.enum(companyNames).default("VINK Group"),
    message: text(10, 4000, "Message"),
    consent,
    details: z
      .object({
        coverage: z.string().trim().max(120).optional(),
        coverFor: z.string().trim().max(120).optional(),
        existingCover: z.string().trim().max(120).optional(),
        currentCountry: z.string().trim().max(120).optional(),
        destination: z.string().trim().max(120).optional(),
        service: z.string().trim().max(120).optional(),
      })
      .default({}),
    website: z.string().max(200).optional(), // honeypot — humans never fill this in
  })
  .superRefine((v, ctx) => {
    const need = (key: keyof typeof v.details, msg: string) => {
      if (!v.details[key]) ctx.addIssue({ code: "custom", path: ["details", key], message: msg });
    };
    if (v.company === "VINK Insurance") need("coverage", "Select a type of cover");
    if (v.company === "VINK Immigration Consultancy") {
      need("destination", "Enter a destination country");
      need("service", "Select a service");
    }
  });

export const subscribeSchema = z.object({ email, source: z.string().trim().max(40).default("website"), website: z.string().max(200).optional() });

export const applicationSchema = z.object({
  name: text(2, 120, "Full name"),
  email,
  phone,
  linkedinUrl: httpsUrl("LinkedIn link"),
  cvUrl: httpsUrl("CV link"),
  coverNote: text(20, 3000, "Cover note"),
  consent,
  website: z.string().max(200).optional(),
});

export const articleInput = z.object({
  title: text(3, 200, "Title"),
  category: z.enum(["Group news", "Impact", "Perspective"]),
  excerpt: z.string().trim().max(400).default(""),
  body: z.string().max(40_000).default(""),
  imageUrl: z.string().trim().max(600).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  publishedAt: z.string().datetime().nullish(),
});

export const jobInput = z.object({
  title: text(3, 160, "Title"),
  department: text(2, 80, "Department"),
  location: text(2, 80, "Location"),
  employmentType: z.string().trim().max(40).default("Full-time"),
  summary: z.string().trim().max(300).default(""),
  description: z.string().max(10_000).default(""),
  active: z.boolean().default(true),
});

/** Flatten zod issues into { fieldName: message } for the form to display. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.filter((p) => p !== "details");
    const key = String(path[path.length - 1] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
