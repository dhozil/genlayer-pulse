import { useWallet } from "@/hooks/use-wallet";
import { useEffect, useState, type ReactNode } from "react";

type WalletState = "loading" | "none" | "unsupported" | "metamask";

export function WalletGate({ children }: { children: ReactNode }) {
  const { address, connecting, connect } = useWallet();
  const [state, setState] = useState<WalletState>("loading");

  useEffect(() => {
    async function check() {
      const eth = (window as { ethereum?: { request?: Function } }).ethereum;
      if (!eth) { setState("none"); return; }
      try {
        await eth.request?.({ method: "wallet_getSnaps" });
        setState("metamask");
      } catch {
        setState("unsupported");
      }
    }
    check();
  }, []);

  if (address) return <>{children}</>;

  return (
    <section className="mx-auto max-w-lg px-6 py-20 text-center">
      <div className="surface-card p-10 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-border">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Connect your wallet
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          GenLayer Pulse requires MetaMask with the GenLayer Snap to submit
          proposals on Studionet.
        </p>

        {state === "loading" ? (
          <div className="h-10 flex items-center justify-center">
            <span className="font-mono text-[10px] text-muted-foreground animate-pulse">checking wallet…</span>
          </div>
        ) : state === "metamask" ? (
          <button
            onClick={connect}
            disabled={connecting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground glow-cyan hover:opacity-90 transition disabled:opacity-50"
          >
            {connecting ? "Connecting…" : "Connect MetaMask"}
          </button>
        ) : state === "unsupported" ? (
          <div className="space-y-3">
            <p className="text-xs text-destructive font-semibold">
              Unsupported wallet detected
            </p>
            <p className="text-xs text-muted-foreground">
              Rabby and other EVM wallets don't support the GenLayer Snap.
              Please switch to MetaMask.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Get MetaMask
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              No wallet detected. Please install MetaMask.
            </p>
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
            >
              Install MetaMask
            </a>
          </div>
        )}

        <div className="rounded-md border border-border/60 bg-background/30 p-3 font-mono text-[10px] text-muted-foreground space-y-1">
          <p>network: GenLayer Studionet</p>
          <p>contract: 0xb943…4E20</p>
        </div>
      </div>
    </section>
  );
}
