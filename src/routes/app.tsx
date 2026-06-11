import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProposalCard } from "@/components/ProposalCard";
import { VALIDATORS } from "@/lib/validators";
import { useWallet, shortAddress } from "@/hooks/use-wallet";
import type { Proposal } from "@/lib/types";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Pulse App — live AI validator consensus" },
      {
        name: "description",
        content:
          "The live GenLayer Pulse arena. Watch 5 AI validators deliberate on community proposals in realtime.",
      },
    ],
  }),
  component: AppPage,
});

const CATEGORIES = ["all", "general", "dispute", "dao", "prediction", "vibe-check", "ethics"];

function AppPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [category, setCategory] = useState("all");
  const { address } = useWallet();

  useEffect(() => {
    let mounted = true;
    async function load() {
      const cached = JSON.parse(localStorage.getItem("gp_proposals") || "[]");
      const { getAllProposals: fetchAll } = await import("@/lib/genlayer");
      const onChain = await fetchAll();
      if (!mounted) return;

      const seen = new Set<string>();
      const merged: Proposal[] = [];

      for (const p of cached) {
        if (!seen.has(String(p.id))) {
          merged.push(p);
          seen.add(String(p.id));
        }
      }
      for (const p of onChain) {
        if (!seen.has(String(p.id))) {
          merged.push(p);
          seen.add(String(p.id));
        }
      }
      setProposals(merged);
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      {/* Arena header */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 -z-10 opacity-50">
          <div className="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-12 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Pulse Arena · Live
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
                The <span className="text-gradient">jurisdiction</span> is open.
              </h1>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Submit proposals, watch the panel deliberate, and signal your
                stance with the community.
              </p>
            </div>
            <div className="surface-card px-4 py-3 font-mono text-[10px] uppercase tracking-widest">
              <p className="text-muted-foreground">Signed in as</p>
              <p
                className={`mt-1 text-sm normal-case ${
                  address ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {address ? shortAddress(address) : "Guest (connect wallet)"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat label="Proposals" value={proposals.length.toString()} />
            <Stat label="Validators" value={VALIDATORS.length.toString()} />
          </div>
        </div>

        {/* Validator panel */}
        <div className="mx-auto max-w-6xl px-6 pb-10">
          <div className="surface-card p-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>The Validator Panel · Optimistic Democracy</span>
              <span className="text-primary">node status: nominal</span>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
              {VALIDATORS.map((v, i) => (
                <div
                  key={v.name}
                  className="rounded-md border border-border/60 bg-background/40 p-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: `var(--validator-${i + 1})` }}
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

      {/* Feed */}
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Live feed</h2>
            <p className="text-sm text-muted-foreground">
              All proposals are stored on-chain. New proposals appear after
              deliberation completes.
            </p>
          </div>
          <Link
            to="/submit"
            className="hidden sm:inline rounded-md border border-border px-3 py-2 text-xs font-mono uppercase tracking-widest hover:border-primary hover:text-primary"
          >
            + New proposal
          </Link>
        </div>

        {/* Filter bar */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`font-mono text-[10px] uppercase tracking-widest rounded-full border px-3 py-1 transition ${
                category === c
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {proposals.length === 0 ? (
          <div className="surface-card p-10 text-center">
            <p className="text-muted-foreground">
              No proposals yet. Be the first to submit one.
            </p>
            <Link
              to="/submit"
              className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Submit the first proposal
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {proposals
              .filter((p) => category === "all" || p.category === category)
              .map((p) => (
                <ProposalCard key={p.id} p={p} />
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="surface-card px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 font-mono text-2xl font-semibold ${
          accent ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
