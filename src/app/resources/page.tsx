import { redirect } from "next/navigation";

/** /resources has no page of its own; send visitors to the Insights hub. */
export default function ResourcesIndex() {
  redirect("/resources/insights");
}
