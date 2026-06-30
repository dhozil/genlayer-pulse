import { createIsomorphicFn } from "@tanstack/react-start";
import type { DeliberationResult, Proposal } from "./types";

export const submitProposal = createIsomorphicFn()
  .server((_q: string, _ctx: string, _cat: string, _a: string) => {
    throw new Error("client-only");
  })
  .client(async (question: string, context: string, category: string, author: string) => {
    const g = await import("./genlayer.client");
    return g.submitProposal(question, context, category, author);
  });

export const deliberate = createIsomorphicFn()
  .server((_id: string) => {
    throw new Error("client-only");
  })
  .client(async (proposalId: string) => {
    const g = await import("./genlayer.client");
    return g.deliberate(proposalId);
  });

export const getProposal = createIsomorphicFn()
  .server((_id: string) => null as Proposal | null)
  .client(async (proposalId: string) => {
    const g = await import("./genlayer.client");
    return g.getProposal(proposalId);
  });

export const getAllProposals = createIsomorphicFn()
  .server(() => [] as Proposal[])
  .client(async () => {
    const g = await import("./genlayer.client");
    return g.getAllProposals();
  });

export async function checkWallet(): Promise<"metamask" | "unsupported" | "none"> {
  if (typeof window === "undefined") return "none";
  const eth = (window as { ethereum?: { isMetaMask?: boolean; request?: Function } }).ethereum;
  if (!eth) return "none";
  try {
    await eth.request?.({ method: "wallet_getSnaps" });
    return "metamask";
  } catch {
    return "unsupported";
  }
}
