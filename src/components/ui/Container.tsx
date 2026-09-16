import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "nav" | "header" | "footer" | "ul";
  /** "wide" = 1320px for full-bleed-ish layouts; default 1200px. */
  size?: "default" | "wide" | "narrow";
  id?: string;
};

/** Centered content column: 1200px max, `px-5 md:px-8 xl:px-0`. */
export function Container({ children, className, as: Tag = "div", size = "default", id }: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full px-5 md:px-8",
        size === "default" && "max-w-[1200px] xl:px-0",
        size === "wide" && "max-w-[1320px] 2xl:px-0",
        size === "narrow" && "max-w-[800px] xl:px-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
