import { createFileRoute, Link } from "@tanstack/react-router";
import { VALIDATORS } from "@/lib/validators";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "How it works — GenLayer Pulse" },
      {
        name: "description",
        content:
          "GenLayer Pulse simulates GenLayer's Intelligent Contracts and Optimistic Democracy with 5 diverse AI validators reaching consensus on community questions.",
      },
    ],
  }),
  component: AboutPage,
});

const FEATURES = [
  {
    title: "Intelligent Contracts",
    body: "GenLayer contracts interpret natural language and unstructured data. Pulse mirrors this: every proposal is a freeform natural-language question, not a numeric vote.",
  },
  {
    title: "Optimistic Democracy",
    body: "Diverse AI validators independently judge each proposal. A consensus emerges from their distinct models and personas — not a single oracle.",
  },
  {
    title: "Subjective Decisions",
    body: "Pulse handles the messy stuff: disputes, vibe-checks, DAO trade-offs. Things traditional smart contracts can't reason about.",
  },
  {
    title: "Realtime jurisdiction",
    body: "Validator votes stream in live over websockets. The community can watch every node reason — like a courtroom you can refresh.",
  },
];

function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        About this project
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        A community simulator of{" "}
        <a
          href="https://genlayer.com"
          target="_blank"
          rel="noreferrer"
          className="text-gradient hover:underline"
        >
          GenLayer
        </a>
      </h1>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        GenLayer is building an AI-native trust layer where validator nodes
        powered by diverse language models reach consensus on subjective
        on-chain decisions. GenLayer Pulse is an unofficial, open community
        playground that demonstrates that idea in your browser — useful for
        DAO governance experiments, dispute simulations, prediction warm-ups
        and community polls.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="surface-card p-5">
            <h3 className="font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {f.body}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-semibold">The validator panel</h2>
      <p className="mt-2 text-muted-foreground">
        Five validators, five distinct models, five personas. Each one
        deliberates in parallel and writes its reasoning on-chain… well,
        on-database.
      </p>
      <div className="mt-5 space-y-3">
        {VALIDATORS.map((v, i) => (
          <div key={v.name} className="surface-card p-4 flex items-start gap-4">
            <span
              className="mt-1 h-3 w-3 rounded-full flex-shrink-0"
              style={{
                backgroundColor: `var(--validator-${i + 1})`,
                boxShadow: `0 0 14px var(--validator-${i + 1})`,
              }}
            />
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-semibold">{v.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {v.model}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{v.persona}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 surface-card p-6 text-center">
        <h3 className="text-xl font-semibold">Try it now</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Submit any subjective question and watch consensus form.
        </p>
        <Link
          to="/submit"
          className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground glow-cyan hover:opacity-90 transition"
        >
          Submit a proposal →
        </Link>
      </div>

      <p className="mt-10 text-center font-mono text-[10px] text-muted-foreground">
        Unaffiliated with GenLayer · For learning &amp; community fun
      </p>
    </section>
  );
}
