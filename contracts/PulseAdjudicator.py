# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import typing
import json

VALIDATOR_PERSONAS = {
    "Solon": "You are Solon, an analytical validator who weighs evidence carefully and values precedent. You prefer measured judgments and admit uncertainty when the case is thin.",
    "Hammurabi": "You are Hammurabi, a strict validator. You enforce the literal terms of any agreement and rule decisively. You dislike ambiguity and call it out.",
    "Athena": "You are Athena, a wise validator focused on long-term consequences and fairness to all parties, not just the ones in front of you.",
    "Themis": "You are Themis, a balanced validator. You look for the middle path and only side strongly when the evidence is overwhelming.",
    "Justinian": "You are Justinian, a modernist validator. You apply contemporary norms and reasoning, and you are not afraid to break with tradition when needed.",
}

VALIDATOR_NAMES = ["Solon", "Hammurabi", "Athena", "Themis", "Justinian"]


def _to_dict(raw):
    if isinstance(raw, dict):
        return raw
    if isinstance(raw, str):
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            first_nl = cleaned.find("\n")
            if first_nl != -1:
                cleaned = cleaned[first_nl + 1:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
        return json.loads(cleaned.strip())
    raise gl.vm.UserError("LLM did not return dict or string")


class PulseAdjudicator(gl.Contract):
    proposals: TreeMap[str, str]
    proposal_count: bigint

    def __init__(self):
        pass

    @gl.public.write
    def submit_proposal(
        self,
        question: str,
        context: str = "",
        category: str = "general",
        author: str = "anon",
    ) -> str:
        self.proposal_count = self.proposal_count + 1
        pid = str(int(self.proposal_count))
        proposal = json.dumps({
            "id": pid,
            "question": question,
            "context": context,
            "category": category,
            "author": author,
            "status": "pending",
            "votes": [],
            "verdict": "",
            "confidence": 0.0,
            "summary": "",
        })
        self.proposals[pid] = proposal
        return pid

    @gl.public.write
    def deliberate(self, proposal_id: str) -> str:
        raw = self.proposals.get(proposal_id, "")
        if not raw:
            raise gl.vm.UserError(f"Proposal {proposal_id} not found")
        proposal = json.loads(raw)
        if proposal["status"] != "pending":
            raise gl.vm.UserError(f"Proposal {proposal_id} already deliberated")

        proposal["status"] = "deliberating"
        self.proposals[proposal_id] = json.dumps(proposal)

        validators_block = "\n".join(
            f"  - {name}: {persona}" for name, persona in VALIDATOR_PERSONAS.items()
        )

        prompt_parts = [
            "You are the GenLayer Pulse council adjudicating a subjective question.",
            "",
            f"QUESTION: {proposal['question']}",
        ]
        if proposal.get("context"):
            prompt_parts.append(f"CONTEXT:\n{proposal['context']}")
        prompt_parts.append(f"CATEGORY: {proposal['category']}")
        prompt_parts.append("")
        prompt_parts.append(
            "Role-play as each of these 5 validators in turn and cast "
            "an honest vote from THEIR perspective:"
        )
        prompt_parts.append(validators_block)
        prompt_parts.append("")
        prompt_parts.append(
            'For each validator return:\n'
            '  - vote: "yes", "no", or "abstain"\n'
            "  - confidence: int 0-100\n"
            "  - reasoning: one sentence, <= 220 chars, in that validator's voice"
        )
        prompt_parts.append(
            'Return ONLY valid JSON: {"votes": [{"validator": str, "vote": str, '
            '"confidence": int, "reasoning": str}, ...]}'
        )

        prompt = "\n".join(prompt_parts)

        def judge() -> str:
            return gl.nondet.exec_prompt(prompt, response_format="json")

        raw_result = gl.eq_principle.prompt_comparative(
            judge,
            "Both outputs must be valid JSON with a 'votes' array of exactly 5 "
            "entries. Each vote must have: validator (string), vote "
            '("yes"/"no"/"abstain"), confidence (int 0-100), reasoning (string). '
            "Exact wording, scores, JSON whitespace, and key order may differ. "
            "The contract aggregates the final consensus after parsing.",
        )
        d = _to_dict(raw_result)

        raw_votes = d.get("votes", [])
        if not isinstance(raw_votes, list):
            raw_votes = []

        votes_data = []
        for i, vname in enumerate(VALIDATOR_NAMES):
            v = raw_votes[i] if i < len(raw_votes) and isinstance(raw_votes[i], dict) else {}
            vote_val = str(v.get("vote", "abstain"))
            if vote_val not in ("yes", "no", "abstain"):
                vote_val = "abstain"
            votes_data.append({
                "validator": vname,
                "vote": vote_val,
                "confidence": max(0, min(100, int(v.get("confidence", 0) or 0))),
                "reasoning": str(v.get("reasoning", ""))[:220],
            })

        yes = sum(1 for v in votes_data if v["vote"] == "yes")
        no = sum(1 for v in votes_data if v["vote"] == "no")
        abstain = sum(1 for v in votes_data if v["vote"] == "abstain")
        conf_sum = sum(v["confidence"] for v in votes_data)
        total = len(votes_data)

        verdict = "abstain"
        if yes > no and yes >= abstain:
            verdict = "yes"
        elif no > yes and no >= abstain:
            verdict = "no"

        confidence = round(conf_sum / total, 2) if total > 0 else 0.0
        summary = (
            f'Optimistic Democracy reached "{verdict.upper()}" with '
            f"{yes} yes / {no} no / {abstain} abstain across "
            f"{total} diverse AI validators."
        )

        proposal["votes"] = votes_data
        proposal["verdict"] = verdict
        proposal["confidence"] = confidence
        proposal["summary"] = summary
        proposal["status"] = "finalized"

        self.proposals[proposal_id] = json.dumps(proposal)

        return json.dumps({
            "verdict": verdict,
            "confidence": confidence,
            "summary": summary,
            "votes": votes_data,
        })

    @gl.public.view
    def get_proposal(self, proposal_id: str) -> str:
        return self.proposals.get(proposal_id, "")

    @gl.public.view
    def get_all_proposals(self) -> str:
        out = []
        for i in range(1, int(self.proposal_count) + 1):
            pid = str(i)
            p = self.proposals.get(pid, "")
            if p:
                out.append(p)
        return "[" + ",".join(out) + "]"

    @gl.public.view
    def get_proposal_count(self) -> bigint:
        return self.proposal_count
