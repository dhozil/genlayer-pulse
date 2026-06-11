import { createFileRoute, Link } from "@tanstack/react-router";
import { VALIDATORS } from "@/lib/validators";
import { useWallet } from "@/hooks/use-wallet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GenLayer Pulse — AI consensus for the community" },
      {
        name: "description",
        content:
          "GenLayer Pulse brings any subjective question to a jury of 5 diverse AI validators, in realtime. Inspired by GenLayer's Intelligent Contracts & Optimistic Democracy.",
      },
      { property: "og:title", content: "GenLayer Pulse — landing" },
      {
        property: "og:description",
        content:
          "A community simulator of GenLayer's Optimistic Democracy. Connect MetaMask, submit a proposal, watch consensus form live.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    badge: "01",
    title: "Intelligent Contracts",
    body: "Your proposals are natural-language, not numbers. Validators interpret intent the way GenLayer Intelligent Contracts read the real world.",
  },
  {
    badge: "02",
    title: "Optimistic Democracy",
    body: "Five distinct AI models — different vendors, different personalities — deliberate independently and converge on a verdict.",
  },
  {
    badge: "03",
    title: "Realtime jurisdiction",
    body: "Watch every validator reason live over websockets. The courtroom never closes.",
  },
  {
    badge: "04",
    title: "Web3 ready",
    body: "Connect MetaMask in one click. Your wallet identity is your signature on the synthetic jurisdiction.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Connect your wallet",
    body: "Tap Connect Wallet in the header. MetaMask gives you a verifiable on-chain identity.",
  },
  {
    n: "2",
    title: "Post a proposal",
    body: "Ask the panel anything subjective — a DAO dispute, a prediction, a vibe-check.",
  },
  {
    n: "3",
    title: "Watch consensus form",
    body: "Five validators deliberate in parallel. A live confidence ring shows the emerging verdict.",
  },
];

function Landing() {
  const { address, connect } = useWallet();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 opacity-70">
          <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-primary/25 blur-[140px]" />
          <div className="absolute -bottom-48 -right-24 h-[36rem] w-[36rem] rounded-full bg-accent/25 blur-[140px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-24 pb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Synthetic Jurisdiction · v0.1
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl sm:text-7xl font-semibold leading-[1.02] tracking-tight">
            A live <span className="text-gradient">jury of AIs</span>
            <br />
            for your community.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Inspired by GenLayer's Intelligent Contracts and Optimistic
            Democracy. Post any subjective question, watch five diverse AI
            validators deliberate, and let consensus emerge in realtime.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              to="/app"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-cyan hover:opacity-90 transition"
            >
              Enter the Arena →
            </Link>
            {!address && (
              <button
                onClick={connect}
                className="rounded-lg border border-border bg-gradient-to-r from-primary/15 to-accent/15 px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary transition"
              >
                Connect Wallet
              </button>
            )}
            <Link
              to="/about"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:border-primary hover:text-primary transition"
            >
              How it works
            </Link>
          </div>

          {/* validators preview */}
          <div className="mt-16 surface-card p-5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Active validators</span>
              <span className="text-primary">5 nodes · multi-model</span>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {VALIDATORS.map((v, i) => (
                <div
                  key={v.name}
                  className="rounded-lg border border-border/60 bg-background/40 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: `var(--validator-${i + 1})`,
                        boxShadow: `0 0 10px var(--validator-${i + 1})`,
                      }}
                    />
                    <span className="text-sm font-semibold">{v.name}</span>
                  </div>
                  <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                    {v.model}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          What makes it different
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl">
          Built to mirror{" "}
          <span className="text-gradient">GenLayer's core ideas</span>.
        </h2>

        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="surface-card p-6">
              <p className="font-mono text-[10px] tracking-widest text-primary">
                /{f.badge}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border/60 bg-background/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            How it works
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight">
            Three steps. No setup.
          </h2>

          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {STEPS.map((s) => (
              <div key={s.n} className="surface-card p-6">
                <div className="font-mono text-3xl font-semibold text-gradient">
                  {s.n}
                </div>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Open the <span className="text-gradient">courtroom</span>.
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          The arena is live. Connect your wallet, submit a proposal, and let
          the panel deliberate.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/app"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-cyan hover:opacity-90 transition"
          >
            Enter the Arena →
          </Link>
          <Link
            to="/submit"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:border-primary hover:text-primary transition"
          >
            Submit a proposal
          </Link>
        </div>
      </section>
    </div>
  );
}
