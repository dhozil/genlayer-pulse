ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS contract_proposal_id TEXT,
  ADD COLUMN IF NOT EXISTS contract_tx_hash TEXT;
