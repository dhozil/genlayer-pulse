import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type EthereumProvider = {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

const STORAGE_KEY = "genlayer-pulse:wallet";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accs) => {
          const list = accs as string[];
          if (list && list.length > 0) setAddress(list[0]);
          else localStorage.removeItem(STORAGE_KEY);
        })
        .catch(() => localStorage.removeItem(STORAGE_KEY));
    }

    const handler = (...args: unknown[]) => {
      const accs = args[0] as string[];
      if (!accs || accs.length === 0) {
        setAddress(null);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        setAddress(accs[0]);
        localStorage.setItem(STORAGE_KEY, accs[0]);
      }
    };
    window.ethereum?.on?.("accountsChanged", handler);
    return () => window.ethereum?.removeListener?.("accountsChanged", handler);
  }, []);

  const connect = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!window.ethereum) {
      toast.error("MetaMask not detected", {
        description: "Install MetaMask to connect your wallet.",
        action: {
          label: "Install",
          onClick: () => window.open("https://metamask.io/download/", "_blank"),
        },
      });
      return;
    }
    try {
      setConnecting(true);
      const accs = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      if (accs && accs.length > 0) {
        setAddress(accs[0]);
        localStorage.setItem(STORAGE_KEY, accs[0]);
        toast.success("Wallet connected", {
          description: shortAddress(accs[0]),
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to connect";
      toast.error("Connection rejected", { description: msg });
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    localStorage.removeItem(STORAGE_KEY);
    toast("Wallet disconnected");
  }, []);

  return { address, connecting, connect, disconnect };
}

export function shortAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}
