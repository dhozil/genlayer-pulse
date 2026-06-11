import { Link } from "@tanstack/react-router";
import type { Proposal } from "@/lib/types";

const verdictMap: Record<string, { label: string; color: string }> = {
  yes: { label: "APPROVED", color: "text-yes border-yes/50 bg-yes/10" },
  no: { label: "REJECTED", color: "text-no border-no/50 bg-no/10" },
  abstain: { label: "INCONCLUSIVE", color: "text-abstain border-abstain/40 bg-abstain/5" },
};

export function ProposalCard({ p }: { p: Proposal }) {
  const v = p.verdict ? verdictMap[p.verdict] : null;
  const isPending = !p.verdict;
  const dot = isPending ? "bg-muted-foreground animate-pulse" : "bg-yes";
  const yesVotes = p.votes?.filter((v) => v.vote === "yes").length ?? 0;
  const noVotes = p.votes?.filter((v) => v.vote === "no").length ?? 0;
  const abstainVotes = p.votes?.filter((v) => v.vote === "abstain").length ?? 0;

  return (
    <Link
      to="/proposal/$id"
      params={{ id: p.id }}
      className="surface-card block p-5 transition-all hover:border-primary/60 hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
          <span>{isPending ? "pending" : "finalized"}</span>
          <span className="opacity-50">·</span>
          <span>{p.category}</span>
        </div>
        <span>by {p.author}</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">
        {p.question}
      </h3>
      {p.context ? (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.context}</p>
      ) : null}
      <div className="mt-4 flex items-center justify-between">
        {v ? (
          <span className={`font-mono text-[10px] tracking-widest rounded-md border px-2 py-1 ${v.color}`}>
            {v.label} · {p.confidence ?? 0}%
          </span>
        ) : (
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
            PENDING
          </span>
        )}
        <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
          <span>
            <span className="text-yes">{yesVotes}</span> /{" "}
            <span className="text-no">{noVotes}</span> /{" "}
            <span className="text-abstain">{abstainVotes}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
