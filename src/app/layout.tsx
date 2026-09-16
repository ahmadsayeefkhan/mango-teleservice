import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DM_Sans, Hind_Siliguri, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { UtilityBar } from "@/components/layout/UtilityBar";
import { MOTION_BOOT_SCRIPT } from "@/components/motion/mode";
import { Preloader } from "@/components/motion/Preloader";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const sora = Sora({ subsets: ["latin"], weight: ["400", "600", "700"], variable: "--font-sora", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-dm-sans", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains", display: "swap" });
// Bengali face is only used by the "বাংলা" language toggle (utility bar / mobile nav), so it must not
// be preloaded on the critical path; the browser fetches it on first use like any @font-face.
const hind = Hind_Siliguri({ subsets: ["bengali", "latin"], weight: ["400", "600"], variable: "--font-hind", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mango Teleservices | IIG, IP Transit, Cloud & Digital Signature in Bangladesh",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Bangladesh's first private International Internet Gateway, since 2008. IP transit, international circuits, data centre, Mango Cloud and licensed digital signatures.",
  applicationName: SITE_NAME,
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_BD" },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0E1116",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning on <html>: the boot script stamps data-motion/data-preload before hydration.
    // suppressHydrationWarning on <body>: browser extensions (Grammarly, ColorZilla…) inject attributes such as
    // data-gr-ext-installed / cz-shortcut-listen before React loads; React would otherwise log an attribute
    // mismatch on every page. Neither element renders client-only text, so nothing else is masked.
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${jetbrains.variable} ${hind.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {/*
          Motion boot script. Must execute before first paint, so it is a plain inline <script> in a Server
          Component (the pattern from Next's "preventing flash before hydration" guide). next/script's
          beforeInteractive only queues inline code for the Next runtime and would run after first paint.
          React only warns about inline scripts when it *creates* the node on the client (HMR remount of this
          file), never during hydration.
        */}
        <script id="mango-motion-boot" dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        <Preloader />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-mango focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <UtilityBar />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        {/* Suspense boundary = separate hydration task, so the footer never extends the page's main commit. */}
        <Suspense>
          <SiteFooter />
        </Suspense>
        <SmoothScroll />
      </body>
    </html>
  );
}
