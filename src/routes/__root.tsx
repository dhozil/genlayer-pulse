import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useMatches,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
import { WalletGate } from "@/components/WalletGate";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Route not found in this jurisdiction</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          No validator could match this URL.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Return to feed
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { router.invalidate(); }, []);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Consensus failed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A node panicked. You can retry or head back to the feed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Retry
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent/20"
          >
            Feed
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GenLayer Pulse — community AI consensus, live" },
      {
        name: "description",
        content:
          "Submit any subjective question to a panel of 5 diverse AI validators and watch consensus form in realtime — inspired by GenLayer's Intelligent Contracts.",
      },
      { property: "og:title", content: "GenLayer Pulse" },
      {
        property: "og:description",
        content:
          "A live community simulator of GenLayer's Optimistic Democracy. 5 AI validators decide subjective questions on-the-fly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const matches = useMatches();
  const pathname = matches[matches.length - 1]?.routeId || "";
  const isPublic = pathname === "/" || pathname === "/about";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-grid">
        <SiteHeader />
        <main className="flex-1">
          {isPublic ? <Outlet /> : <WalletGate><Outlet /></WalletGate>}
        </main>
        <SiteFooter />
        <Toaster theme="dark" position="bottom-right" />
      </div>
    </QueryClientProvider>
  );
}
