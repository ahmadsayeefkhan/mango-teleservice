import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SelectField, SolutionSlug } from "@/content/solutions";

export type AsideFormProps = {
  slug: SolutionSlug;
  title: string;
  fields: SelectField[];
  submit: string;
  /** Extra query params carried to the contact page. */
  intent?: string;
};

/**
 * Hero aside "quick quote" mock form. Real, labelled <select>s inside a plain GET form that lands on
 * `/contact?intent=quote&service=<slug>&…` so it works without JS and with no backend.
 */
export function AsideForm({ slug, title, fields, submit, intent = "quote" }: AsideFormProps) {
  return (
    <form action="/contact" method="get" className="flex flex-col" aria-labelledby={`aside-${slug}-title`}>
      <p id={`aside-${slug}-title`} className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-mango">
        {title}
      </p>
      <input type="hidden" name="intent" value={intent} />
      <input type="hidden" name="service" value={slug} />
      <div className="mt-5 flex flex-col gap-4">
        {fields.map((f) => (
          <SelectControl key={f.name} field={f} idPrefix={slug} />
        ))}
      </div>
      <Button type="submit" variant="primary" tone="dark" className="mt-6 w-full" magnetic>
        {submit}
      </Button>
    </form>
  );
}

export function SelectControl({ field, idPrefix }: { field: SelectField; idPrefix: string }) {
  const id = `${idPrefix}-${field.name}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-medium text-mist">
        {field.label}
      </label>
      <span className="relative block">
        <select
          id={id}
          name={field.name}
          defaultValue={field.options[0]}
          className="h-11 w-full appearance-none rounded-lg border border-white/12 bg-ink px-3.5 pr-10 text-[14px] text-paper transition-colors hover:border-white/25 focus-visible:border-mango"
        >
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-mist" />
      </span>
    </div>
  );
}
