
-- Enums
CREATE TYPE public.proposal_status AS ENUM ('pending', 'deliberating', 'finalized', 'failed');
CREATE TYPE public.vote_choice AS ENUM ('yes', 'no', 'abstain');

-- proposals
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  context TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  author_name TEXT NOT NULL DEFAULT 'anon',
  status public.proposal_status NOT NULL DEFAULT 'pending',
  consensus_verdict public.vote_choice,
  consensus_confidence NUMERIC(5,2),
  consensus_summary TEXT,
  total_yes INT NOT NULL DEFAULT 0,
  total_no INT NOT NULL DEFAULT 0,
  total_abstain INT NOT NULL DEFAULT 0,
  community_up INT NOT NULL DEFAULT 0,
  community_down INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finalized_at TIMESTAMPTZ
);
GRANT SELECT, INSERT ON public.proposals TO anon, authenticated;
GRANT ALL ON public.proposals TO service_role;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read proposals" ON public.proposals FOR SELECT USING (true);
CREATE POLICY "anyone can create proposals" ON public.proposals FOR INSERT WITH CHECK (true);

-- validator votes
CREATE TABLE public.validator_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  validator_name TEXT NOT NULL,
  model TEXT NOT NULL,
  vote public.vote_choice NOT NULL,
  confidence NUMERIC(5,2) NOT NULL DEFAULT 50,
  reasoning TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.validator_votes TO anon, authenticated;
GRANT ALL ON public.validator_votes TO service_role;
ALTER TABLE public.validator_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read votes" ON public.validator_votes FOR SELECT USING (true);
CREATE INDEX validator_votes_proposal_idx ON public.validator_votes(proposal_id);

-- community signals (lightweight reactions)
CREATE TABLE public.community_signals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  signal TEXT NOT NULL CHECK (signal IN ('agree','disagree')),
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (proposal_id, fingerprint)
);
GRANT SELECT, INSERT ON public.community_signals TO anon, authenticated;
GRANT ALL ON public.community_signals TO service_role;
ALTER TABLE public.community_signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone reads signals" ON public.community_signals FOR SELECT USING (true);
CREATE POLICY "anyone inserts signals" ON public.community_signals FOR INSERT WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.validator_votes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_signals;
