import type { SolutionAside as AsideConfig, SolutionSlug } from "@/content/solutions";
import { AsideForm } from "./AsideForm";
import { AsideStats } from "./AsideStats";
import { AsideSteps } from "./AsideSteps";
import { CloudEstimator } from "./CloudEstimator";

/** Picks the hero aside card for a service page from its data. */
export function SolutionAside({ slug, aside }: { slug: SolutionSlug; aside: AsideConfig }) {
  switch (aside.kind) {
    case "form":
      return <AsideForm slug={slug} title={aside.title} fields={aside.fields} submit={aside.submit} />;
    case "stats":
      return <AsideStats title={aside.title} headline={aside.headline} rows={aside.rows} cta={aside.cta} verify={aside.verify} />;
    case "steps":
      return <AsideSteps title={aside.title} steps={aside.steps} cta={aside.cta} verify={aside.verify} />;
    case "estimator":
      return <CloudEstimator title={aside.title} submit={aside.submit} note={aside.note} verify={aside.verify} />;
  }
}
