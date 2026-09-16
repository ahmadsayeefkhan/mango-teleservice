import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { solutionSlugs } from "@/content/solutions";
import { industrySlugs } from "@/content/industries";
import { articleSlugs, caseStudySlugs } from "@/content/resources";
import { roles } from "@/content/careers";

/**
 * XML sitemap for search engines. Excludes /contact/thank-you (noindex).
 * `priority` and `changeFrequency` are hints only; the URL list is what matters.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, SITE_URL).toString();
  const now = new Date();

  const entry = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: url(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    entry("/solutions", 0.9),
    ...solutionSlugs.map((s) => entry(`/solutions/${s}`, 0.9)),
    entry("/network", 0.8),
    entry("/industries", 0.7),
    ...industrySlugs.map((s) => entry(`/industries/${s}`, 0.7)),
    entry("/company/about", 0.7),
    entry("/company/leadership", 0.6),
    entry("/company/milestones", 0.5),
    entry("/company/partners", 0.5),
    entry("/company/newsroom", 0.6, "weekly"),
    entry("/group", 0.6),
    entry("/resources/insights", 0.7, "weekly"),
    ...articleSlugs.map((s) => entry(`/resources/insights/${s}`, 0.6)),
    entry("/resources/case-studies", 0.6),
    ...caseStudySlugs.map((s) => entry(`/resources/case-studies/${s}`, 0.6)),
    entry("/resources/faq", 0.6),
    entry("/careers", 0.6, "weekly"),
    ...roles.map((r) => entry(`/careers/${r.slug}`, 0.5, "weekly")),
    entry("/support", 0.7),
    entry("/contact", 0.9),
    entry("/legal/privacy", 0.3, "yearly"),
  ];
}
