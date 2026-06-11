# GenLayer Pulse

A live **synthetic jurisdiction** powered by a real [GenLayer](https://genlayer.com) Intelligent Contract.  
Post a subjective question → 5 AI validators deliberate on-chain → consensus emerges.

> Unaffiliated with GenLayer. Built for learning, demos & DAO experiments.

---

## How it works

```
User submits proposal  →  GenLayer contract stores it
                         ↓
User clicks deliberate →  Contract runs 5 LLM validators via prompt_comparative
                         ↓
Verdict (yes/no/abstain) stored on-chain, visible to everyone
```

No database. No backend. The contract is the single source of truth.

---

## Features

- **Real GenLayer Intelligent Contract** — `PulseAdjudicator.py` deployed on Studionet
- **5 AI validators** — Solon, Hammurabi, Athena, Themis, Justinian — one LLM call via `prompt_comparative`
- **MetaMask signing** — all writes signed client-side; no private key on the server
- **Live feed** — reads proposals direct from the contract
- **Pending proposals** — old or new proposals can be deliberated anytime

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing landing |
| `/app` | Live feed — all proposals from the contract |
| `/submit` | Submit a proposal (1 MetaMask tx) |
| `/proposal/$id` | Proposal detail + "Deliberate now" button |
| `/about` | Explainer |

---

## Tech Stack

- **Framework**: TanStack Start v1 (React 19, SSR)
- **Bundler**: Vite 7
- **Styling**: Tailwind CSS v4
- **Contract**: Python (GenLayer) — `contracts/PulseAdjudicator.py`
- **Client lib**: `genlayer-js`
- **Wallet**: MetaMask (EIP-1193)

---

## Project Structure

```
src/
├── components/
│   ├── ProposalCard.tsx
│   ├── WalletGate.tsx
│   └── SiteChrome.tsx
├── hooks/
│   └── use-wallet.tsx
├── lib/
│   ├── genlayer.client.ts    # Raw genlayer-js calls (client‑only)
│   ├── genlayer.ts            # Isomorphic wrappers (createIsomorphicFn)
│   ├── constants.ts           # Contract address, network
│   ├── types.ts               # Proposal, DeliberationResult
│   └── validators.ts          # Validator personas
├── routes/
│   ├── __root.tsx
│   ├── index.tsx              # Landing
│   ├── app.tsx                # Feed
│   ├── submit.tsx
│   ├── proposal.$id.tsx
│   └── about.tsx
└── styles.css
contracts/
└── PulseAdjudicator.py        # Deployed Intelligent Contract
```

---

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

No `.env` needed. Writes go through MetaMask; reads go to Studionet RPC.

---

## Contract

- **Address**: `0xb94311b0e88735f8D386d5604fcaf4E58D1c4E20`
- **Network**: Studionet
- **Methods**: `submit_proposal`, `deliberate`, `get_proposal`, `get_all_proposals`, `get_proposal_count`

---

## License

MIT
