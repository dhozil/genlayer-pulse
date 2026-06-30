import { createClient, chains } from "genlayer-js";
import { GENLAYER_CONTRACT_ADDRESS } from "./constants";

function getWindowEthereum() {
  if (typeof window === "undefined") return null;
  return (window as { ethereum?: unknown }).ethereum;
}

export async function checkMetaMaskSnaps(eth: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }): Promise<boolean> {
  try {
    await eth.request({ method: "wallet_getSnaps" });
    return true;
  } catch {
    return false;
  }
}

async function getClient() {
  const provider = getWindowEthereum();
  if (!provider) throw new Error("Wallet not detected. Please install MetaMask.");
  const eth = provider as { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };
  const hasSnaps = await checkMetaMaskSnaps(eth);
  if (!hasSnaps) throw new Error(
    "MetaMask is required. The wallet you're using doesn't support GenLayer Snap. " +
    "Please install MetaMask from https://metamask.io/download/"
  );
  const accounts = await eth.request({ method: "eth_requestAccounts" }) as string[];
  const client = createClient({
    chain: chains.studionet,
    provider: eth,
    account: accounts[0] as `0x${string}`,
  });
  await client.connect("studionet");
  return client;
}

function getReadClient() {
  return createClient({ chain: chains.studionet });
}

export type DeliberationResult = {
  verdict: string;
  confidence: number;
  summary: string;
  votes: Array<{
    validator: string;
    vote: string;
    confidence: number;
    reasoning: string;
  }>;
};

export type ProposalData = {
  id: string;
  question: string;
  context: string;
  category: string;
  author: string;
  status: string;
  votes: Array<{
    validator: string;
    vote: string;
    confidence: number;
    reasoning: string;
  }>;
  verdict: string;
  confidence: number;
  summary: string;
};

async function submitProposal(
  question: string,
  context: string,
  category: string,
  author: string,
): Promise<string> {
  const client = await getClient();
  const readClient = getReadClient();
  const countBefore = Number(await readClient.readContract({
    address: GENLAYER_CONTRACT_ADDRESS,
    functionName: "get_proposal_count",
    args: [],
  }));
  await client.writeContract({
    address: GENLAYER_CONTRACT_ADDRESS,
    functionName: "submit_proposal",
    args: [question, context, category, author],
    value: 0n,
  });
  return String(countBefore + 1);
}

async function deliberate(proposalId: string): Promise<DeliberationResult> {
  const client = await getClient();
  const txId = await client.writeContract({
    address: GENLAYER_CONTRACT_ADDRESS,
    functionName: "deliberate",
    args: [proposalId],
    value: 0n,
  });
  // poll until proposal has a verdict (contract LLM takes 30-60s)
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const proposal = await getProposal(proposalId);
    if (proposal && proposal.verdict) {
      return {
        verdict: proposal.verdict,
        confidence: proposal.confidence,
        summary: proposal.summary,
        votes: proposal.votes,
      };
    }
  }
  throw new Error("Deliberation timed out");
}

async function getProposal(proposalId: string): Promise<ProposalData | null> {
  try {
    const client = getReadClient();
    const raw = await client.readContract({
      address: GENLAYER_CONTRACT_ADDRESS,
      functionName: "get_proposal",
      args: [proposalId],
    });
    const rawStr = typeof raw === "string" ? raw : String(raw);
    if (!rawStr) return null;
    return JSON.parse(rawStr) as ProposalData;
  } catch (err) {
    console.error("[GenLayer] getProposal failed", err);
    return null;
  }
}

async function getAllProposals(): Promise<ProposalData[]> {
  try {
    const client = getReadClient();
    const raw = await client.readContract({
      address: GENLAYER_CONTRACT_ADDRESS,
      functionName: "get_all_proposals",
      args: [],
    });
    const rawStr = typeof raw === "string" ? raw : String(raw);
    const parsed = JSON.parse(rawStr);
    return Array.isArray(parsed) ? parsed as ProposalData[] : [];
  } catch (err) {
    console.error("[GenLayer] getAllProposals failed", err);
    return [];
  }
}

async function getProposalCount(): Promise<number> {
  try {
    const client = getReadClient();
    const raw = await client.readContract({
      address: GENLAYER_CONTRACT_ADDRESS,
      functionName: "get_proposal_count",
      args: [],
    });
    return Number(raw) || 0;
  } catch {
    return 0;
  }
}

export { submitProposal, deliberate, getProposal, getAllProposals, getProposalCount, getWindowEthereum };
