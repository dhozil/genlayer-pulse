import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GENLAYER_CONTRACT_ADDRESS } from "@/lib/constants";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a proposal — GenLayer Pulse" },
      {
        name: "description",
        content:
          "Submit a subjective question to the GenLayer Pulse validator panel and watch consensus form live.",
      },
    ],
  }),
  component: SubmitPage,
});

const CATEGORIES = [
  "general",
  "dispute",
  "dao",
  "prediction",
  "vibe-check",
  "ethics",
];

const QUESTIONS = [
  { q: "Should DAOs be required to publish monthly financial reports?", ctx: "Proposal to mandate monthly treas reports for all ecosystem DAOs" },
  { q: "Is a 2-day refund window fair for NFT buyers?", ctx: "Marketplace proposes 2-day refunds for accidental purchases; sellers object" },
  { q: "Should gas fees be waived for first-time proposers?", ctx: "Community proposal to subsidize gas for new members first on-chain proposal" },
  { q: "Is it fair to cap any wallet voting power at 10%?", ctx: "Whale holds 40% tokens; counter-proposal to cap voting weight per wallet" },
  { q: "Should the DAO fund a public goods grant over a marketing campaign?", ctx: "Treasury can fund one: a public goods grant or a marketing push" },
  { q: "Should the protocol prioritize L2 scaling over new features?", ctx: "Dev team proposes 6-month L2 migration over building new features" },
  { q: "Is it ethical to airdrop tokens based on past gas spend?", ctx: "Airdrop weights by cumulative gas fees paid, critics call it whale-favoring" },
  { q: "Should cross-chain bridges be officially supported?", ctx: "Proposal to allocate dev resources to build and maintain cross-chain bridges" },
  { q: "Should staking rewards be locked for 30 days?", ctx: "Reduce sell pressure by locking staking rewards for a month after claim" },
  { q: "Is it time to increase the quorum threshold from 10% to 15%?", ctx: "Governance change: raise proposal quorum to reduce low-turnout decisions" },
  { q: "Should treasury diversify 10% into real-world assets (RWA)?", ctx: "Allocate 10% of stablecoins to tokenized treasuries bonds for yield" },
  { q: "Should the community run a bug bounty program?", ctx: "Allocate 5% of treasury to incentivize whitehat security research" },
  { q: "Should validator slashing penalties be reduced by half?", ctx: "Validators argue current slashing is too harsh for minor infra failures" },
  { q: "Is a sunset clause healthy for governance proposals?", ctx: "Auto-expire unused proposals after 90 days to keep governance lean" },
  { q: "Should we require a minimum 500-word rationale for proposals?", ctx: "Raise quality bar by enforcing minimum description length for submissions" },
  { q: "Should the community split treasury into three independent multisigs?", ctx: "Reduce single-point-of-failure by dividing treasury control across teams" },
  { q: "Is a weekly governance call better than monthly?", ctx: "Proposal to increase cadence of community calls to accelerate decisions" },
  { q: "Should protocol revenue share be distributed to stakers?", ctx: "Redirect a portion of protocol fees directly to token stakers" },
  { q: "Should the DAO hire a full-time community manager?", ctx: "Paid role to coordinate governance, onboard members, manage communications" },
  { q: "Is it fair to burn unclaimed airdrop tokens after 6 months?", ctx: "Unclaimed airdrop tokens sit idle; proposal to burn them reducing supply" },
];


function SubmitPage() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [category, setCategory] = useState("general");
  const [author, setAuthor] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (question.trim().length < 8) {
      toast.error("Question must be at least 8 characters.");
      return;
    }
    const { hasMetaMask } = await import("@/lib/genlayer");
    if (!hasMetaMask()) {
      toast.error("MetaMask not detected", {
        description: "Install MetaMask to submit proposals on GenLayer.",
        action: {
          label: "Install",
          onClick: () => window.open("https://metamask.io/download/", "_blank"),
        },
      });
      return;
    }
    setBusy(true);
    try {
      const { submitProposal: doSubmit } = await import("@/lib/genlayer");

      const contractId = await doSubmit(
        question.trim(),
        context.trim(),
        category,
        author.trim() || "anon",
      );

      const cached = JSON.parse(localStorage.getItem("gp_proposals") || "[]");
      cached.unshift({
        id: contractId,
        question: question.trim(),
        context: context.trim(),
        category,
        author: author.trim() || "anon",
        status: "pending",
        votes: [],
        verdict: "",
        confidence: 0,
        summary: "",
      });
      localStorage.setItem("gp_proposals", JSON.stringify(cached.slice(0, 50)));

      toast.success("Proposal submitted! You can now deliberate it.");
      navigate({ to: "/proposal/$id", params: { id: contractId } });
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-14">
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        New transaction · pending validation
      </div>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">
        Submit a <span className="text-gradient">subjective</span> question
      </h1>
      <p className="mt-3 text-muted-foreground">
        Five diverse AI validators will deliberate in parallel and reach
        consensus. Their reasoning will stream into the proposal page live.
      </p>

      <form onSubmit={onSubmit} className="mt-8 surface-card p-6 space-y-5">
        <Field label="Question" required>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            maxLength={300}
            placeholder="e.g. Should our DAO fund a public goods grant over a marketing campaign?"
            className="w-full resize-none rounded-md bg-input/60 border border-border px-3 py-2 text-base focus:outline-none focus:border-primary"
          />
          <p className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
            {question.length}/300
          </p>
        </Field>

        <Field label="Context (optional)">
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Paste evidence, links, contract terms, or background…"
            className="w-full resize-y rounded-md bg-input/60 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
          />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md bg-input/60 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Display name">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={40}
              placeholder="anon"
              className="w-full rounded-md bg-input/60 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </Field>
        </div>

        <div className="rounded-md border border-border/60 bg-background/30 p-3 font-mono text-[10px] text-muted-foreground space-y-1">
          <p>contract: {GENLAYER_CONTRACT_ADDRESS.slice(0, 10)}…{GENLAYER_CONTRACT_ADDRESS.slice(-6)}</p>
          <p>network: GenLayer (Optimistic Democracy)</p>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground glow-cyan hover:opacity-90 transition disabled:opacity-50"
        >
          {busy ? "Submitting…" : "Submit to the jurisdiction"}
        </button>
      </form>

      <div className="mt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Try an example
        </p>
        <button
          onClick={() => {
            const pick = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
            setQuestion(pick.q);
            setContext(pick.ctx);
          }}
          type="button"
          className="mt-2 text-xs rounded-md border border-border px-4 py-2 text-muted-foreground hover:border-primary hover:text-primary transition"
        >
          🎲 Random question
        </button>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
