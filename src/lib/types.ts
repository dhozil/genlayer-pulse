export type ContractVote = {
  validator: string;
  vote: string;
  confidence: number;
  reasoning: string;
};

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

export type Proposal = {
  id: string;
  question: string;
  context: string;
  category: string;
  author: string;
  status: string;
  votes: ContractVote[];
  verdict: string;
  confidence: number;
  summary: string;
};
