import { Link } from "@tanstack/react-router";
import { useWallet, shortAddress } from "@/hooks/use-wallet";

function ConnectWalletButton() {
  const { address, connecting, connect, disconnect } = useWallet();

  if (address) {
    return (
      <button
        onClick={disconnect}
        title="Click to disconnect"
        className="group inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-primary group-hover:bg-destructive animate-pulse" />
        {shortAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={connecting}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-gradient-to-r from-primary/20 to-accent/20 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/40 backdrop-blur-xl sticky top-0 z-30">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-2">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent" />
            <div className="absolute inset-[3px] rounded-full bg-background" />
            <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-primary to-accent" />
          </div>
          <span className="font-mono text-sm tracking-[0.3em] text-foreground/90">
            GENLAYER<span className="text-primary">/</span>PULSE
          </span>
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors hidden sm:inline">
            Home
          </Link>
          <Link to="/app" className="hover:text-primary transition-colors">
            App
          </Link>
          <Link to="/submit" className="hover:text-primary transition-colors hidden sm:inline">
            Submit
          </Link>
          <Link to="/about" className="hover:text-primary transition-colors hidden sm:inline">
            About
          </Link>
          <ConnectWalletButton />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <p>
          GenLayer Pulse — an open community simulator inspired by GenLayer's
          Intelligent Contracts &amp; Optimistic Democracy.
        </p>
        <p className="opacity-70">Not affiliated. Built with Lovable AI.</p>
      </div>
    </footer>
  );
}
