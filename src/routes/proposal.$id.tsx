import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { VALIDATORS } from "@/lib/validators";
import { GENLAYER_CONTRACT_ADDRESS } from "@/lib/constants";
import { toast } from "sonner";
import type { Proposal } from "@/lib/types";

export const Route = createFileRoute("/proposal/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Proposal · ${params.id.slice(0, 8)} — GenLayer Pulse` },
      {
        name: "description",
        content: "Live AI validator deliberation for a community proposal.",
      },
    ],
  }),
  component: ProposalPage,
});

function ProposalPage() {
  const { id } = Route.useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deliberating, setDeliberating] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const cached = JSON.parse(localStorage.getItem("gp_proposals") || "[]");
      const found = cached.find((p: Proposal) => String(p.id) === id);
      if (found) setProposal(found);
      const { getProposal: fetchProposal } = await import("@/lib/genlayer");
      const onChain = await fetchProposal(id);
      if (!mounted) return;
      if (onChain) setProposal(onChain);
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  async function handleDeliberate() {
    setDeliberating(true);
    toast.info("Deliberation submitted. Validators are reviewing (30-60s)…");
    try {
      const { deliberate: doDeliberate } = await import("@/lib/genlayer");
      const result = await doDeliberate(id);
      setProposal((prev) => prev ? {
        ...prev,
        status: "finalized",
        verdict: result.verdict || "abstain",
        confidence: result.confidence || 0,
        summary: result.summary || "",
        votes: result.votes || [],
      } : prev);
      const cached = JSON.parse(localStorage.getItem("gp_proposals") || "[]");
      const idx = cached.findIndex((p: Proposal) => String(p.id) === id);
      if (idx !== -1) {
        cached[idx].status = "finalized";
        cached[idx].verdict = result.verdict || "abstain";
        cached[idx].confidence = result.confidence || 0;
        cached[idx].summary = result.summary || "";
        cached[idx].votes = result.votes || [];
        localStorage.setItem("gp_proposals", JSON.stringify(cached));
      }
      toast.success("Deliberation complete!");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Deliberation failed");
    } finally {
      setDeliberating(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="surface-card p-10 text-center text-muted-foreground">
          Loading proposal…
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="surface-card p-10 text-center text-muted-foreground">
          Proposal not found.
        </div>
      </div>
    );
  }

  const yesVotes = proposal.votes?.filter((v) => v.vote === "yes").length ?? 0;
  const noVotes = proposal.votes?.filter((v) => v.vote === "no").length ?? 0;
  const abstainVotes = proposal.votes?.filter((v) => v.vote === "abstain").length ?? 0;

  const verdictColor =
    proposal.verdict === "yes"
      ? "text-yes"
      : proposal.verdict === "no"
        ? "text-no"
        : "text-abstain";

  const voteByName = new Map(proposal.votes?.map((v) => [v.validator, v]) ?? []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        to="/app"
        className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary"
      >
        ← back to feed
      </Link>

      <div className="mt-4 grid lg:grid-cols-[1fr_320px] gap-6">
        {/* MAIN */}
        <div className="space-y-6">
          {/* Header */}
          <div className="surface-card p-6">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span
                className={`h-1.5 w-1.5 rounded-full bg-yes`}
              />
              <span>finalized</span>
              <span className="opacity-50">·</span>
              <span>{proposal.category}</span>
              <span className="opacity-50">·</span>
              <span>by {proposal.author}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">
              {proposal.question}
            </h1>
            {proposal.context ? (
              <div className="mt-4 rounded-md border border-border bg-background/30 p-4 text-sm text-muted-foreground whitespace-pre-wrap">
                {proposal.context}
              </div>
            ) : null}
          </div>

          {/* Validator panel */}
          <div className="surface-card p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Validator deliberation
            </h2>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {VALIDATORS.map((v, i) => {
                const vote = voteByName.get(v.name);
                const color = `var(--validator-${i + 1})`;
                return (
                  <div
                    key={v.name}
                    className="rounded-lg border border-border bg-background/40 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}` }}
                        />
                        <span className="font-semibold">{v.name}</span>
                      </div>
                      {vote ? (
                        <span
                          className={`font-mono text-[10px] uppercase tracking-widest ${
                            vote.vote === "yes"
                              ? "text-yes"
                              : vote.vote === "no"
                                ? "text-no"
                                : "text-abstain"
                          }`}
                        >
                          {vote.vote} · {Math.round(vote.confidence)}%
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          no vote
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground truncate">
                      {v.model}
                    </p>
                    <p className="mt-3 min-h-[3.5rem] text-sm text-foreground/90 leading-relaxed">
                      {vote ? vote.reasoning : (
                        <span className="text-muted-foreground italic">
                          No reasoning recorded.
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div className="surface-card p-6 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Consensus
            </p>
            <div className="relative mx-auto mt-4 h-32 w-32">
              <div className="absolute inset-0 rounded-full border-2 border-border" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${verdictColor}`}>
                  {proposal.verdict ? proposal.verdict.toUpperCase() : "—"}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                  {proposal.confidence ? `${proposal.confidence}% conf.` : "pending"}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-xs">
              <Tally label="YES" value={yesVotes} color="text-yes" />
              <Tally label="NO" value={noVotes} color="text-no" />
              <Tally label="ABS" value={abstainVotes} color="text-abstain" />
            </div>
            {proposal.summary && (
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                {proposal.summary}
              </p>
            )}
          </div>

          {!proposal.verdict ? (
            <div className="surface-card p-6 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Needs deliberation
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                This proposal hasn't been deliberated yet.
              </p>
              <button
                onClick={handleDeliberate}
                disabled={deliberating}
                className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:opacity-90 transition"
              >
                {deliberating ? "Deliberating…" : "Deliberate now"}
              </button>
            </div>
          ) : null}

          <div className="surface-card p-4 font-mono text-[10px] text-muted-foreground space-y-1">
            <p>on-chain #{proposal.id}</p>
            <p className="text-muted-foreground/50 truncate">
              contract: {GENLAYER_CONTRACT_ADDRESS.slice(0, 10)}…
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Tally({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-2 py-2">
      <p className={`text-base font-semibold ${color}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
