const assetPath = '../../assets/intelligent-agents';

export default {
  label: 'Team Project: Research Planning Agent Design',
  text: 'Unit 6 · Group B design proposal for an LLM-powered academic research planning agent. This is the design phase of the module project; the implemented solution follows in the Individual Presentation Project. The sub-entries cover the design itself, my contribution to the team, and my evaluation of the design.',
  sections: [
    {
      heading: 'The brief and our scope',
      paragraphs: [
        'Systematic reviews require researchers to screen large volumes of candidate abstracts before synthesis begins. We specified an agent for a health-sciences research group that turns a research question into search queries, retrieves records from PubMed/PubMed Central and Semantic Scholar, deduplicates, filters and ranks them, and produces extractive summaries with a supporting extract and identifier for every claim. A human researcher approves every record before it is stored, and inclusion decisions stay with the researcher.',
        'The prototype is limited to English-language literature, metadata, abstracts and legitimately available open-access full text. It does not process patient-identifiable data or give clinical recommendations.',
      ],
      links: [
        { href: `${assetPath}/team-project-design-proposal.pdf`, label: 'Download the full design proposal (PDF)' },
      ],
    },
  ],
  children: [
    {
      label: 'Design decisions and system diagrams',
      sections: [
        {
          heading: 'Key design decisions',
          paragraphs: [
            'Hybrid architecture: deliberation at task decomposition and reaction at retrieval, because a purely reactive agent cannot keep ordered research subgoals and classical symbolic planning needs representations that suit unstructured literature poorly (Wooldridge, 2009).',
            'BDI-inspired planning state: beliefs are the retrieved records and search state, desires the research objective, and intentions the committed subtask queue (Rao and Georgeff, 1995). Committing to the queue bounds further deliberation (Bratman, Israel and Pollack, 1988). ReAct is the execution loop, alternating reasoning with action (Yao et al., 2023).',
            'Two cooperating agents: a Planning and Retrieval Agent and a Curation Agent, consolidated from LEADS’s search, eligibility and extraction stages to reduce orchestration overhead (Wang, Z. et al., 2025). Deduplication, validation and storage stay outside the LLM to limit variability.',
            'A schema-validated JSON buffer rather than an agent communication language. KQML suits autonomous agents negotiating across independently controlled knowledge bases (Finin et al., 1994); our two agents are one trusted application with a shared schema, so that overhead is not justified.',
            'A human verification gate before storage, with every record carrying its extract, following recommendations for traceable evidence chains (Wang, G. et al., 2026).',
          ],
        },
        {
          heading: 'System designs',
          figures: [
            {
              src: `${assetPath}/team-project-figure-1.png`,
              alt: 'Architecture diagram: the User Interface sends a query to the Planning and Retrieval Agent, which uses the Gemini LLM service to produce subgoals, queries the PubMed, PMC, Semantic Scholar and Crossref APIs, and writes results to a JSON buffer. The Curation Agent reads the buffer, calls the LLM for extractive summarisation and passes ranked, cited summaries to a Human Reviewer. Approved records go to the SQLite Evidence Store; rejected ones send the planner back to revise its subgoals.',
              caption: 'Figure 1: Two-agent system overview.',
            },
            {
              src: `${assetPath}/team-project-figure-2.png`,
              alt: 'Activity diagram of a request: generate a subgoal list and validate its schema with up to three re-prompts; run a ReAct loop issuing API calls with exponential back-off on failure; write abstracts to the buffer until all subgoals are complete; the Curation Agent filters, ranks and summarises; the human reviewer approves, flags or rejects; approved records are stored and the interface is notified.',
              caption: 'Figure 2: Request lifecycle activity view.',
            },
            {
              src: `${assetPath}/team-project-figure-3.jpg`,
              alt: 'Technology decisions: LLM, orchestration (LangGraph and LangChain), validation (Pydantic), sources (PubMed/PMC, Semantic Scholar, Crossref), processing (pandas and RapidFuzz), and storage and UI (SQLite and Streamlit), each with its alternative, rationale and risk.',
              caption: 'Figure 3: Technology decisions, alternatives and tooling risks.',
            },
          ],
        },
        {
          heading: 'Success criteria and anticipated challenges',
          paragraphs: [
            'Success criteria: recall of at least 0.80 against a hand-screened sample of 50 abstracts; every claim resolving to an identifier and supporting extract; a 20-record audit finding no claim absent from its abstract; and the evidence store reconciling with the reviewer decision log.',
            'Challenges identified: unreliable LLM decomposition (handled by schema validation and three bounded retries); partial observability from abstract-only retrieval; hallucination and misattribution (handled by extractive summarisation); silent degradation, where a partial retrieval still produces a polished result, so each run reports failed subgoals and coverage as PRISMA expects (Page et al., 2021); the cost of human verification; and legal and ethical exposure around licensing, retractions and GDPR.',
          ],
        },
      ],
      references: [
        'Bratman, M.E., Israel, D.J. and Pollack, M.E. (1988) ‘Plans and resource-bounded practical reasoning’, Computational Intelligence, 4(3), pp. 349–355.',
        'Finin, T., Fritzson, R., McKay, D. and McEntire, R. (1994) ‘KQML as an agent communication language’, in Proceedings of the Third International Conference on Information and Knowledge Management (CIKM ’94). New York: ACM, pp. 456–463.',
        'Page, M.J. et al. (2021) ‘The PRISMA 2020 statement: an updated guideline for reporting systematic reviews’, International Journal of Surgery, 88, 105906.',
        'Rao, A.S. and Georgeff, M.P. (1995) ‘BDI agents: from theory to practice’, in Proceedings of the First International Conference on Multi-Agent Systems (ICMAS-95). Menlo Park: AAAI Press, pp. 312–319.',
        'Wang, G. et al. (2026) ‘Human–large language model collaboration in clinical medicine: a systematic review and meta-analysis’, npj Digital Medicine, 9(1), 195.',
        'Wang, Z. et al. (2025) ‘A foundation model for human-AI collaboration in medical literature mining’, Nature Communications, 16(1), 8361.',
        'Wooldridge, M.J. (2009) An Introduction to Multiagent Systems. 2nd edn. Chichester: John Wiley & Sons.',
        'Yao, S. et al. (2023) ‘ReAct: synergizing reasoning and acting in language models’, in 11th International Conference on Learning Representations (ICLR 2023).',
      ],
    },
    {
      label: 'My contribution',
      sections: [
        {
          heading: 'Role and tasks',
          paragraphs: [
            'Interpreting the brief: I worked out what the assignment was asking us to deliver and turned it into a working scope for the team. This meant agreeing on the health-sciences use case, the boundaries of the prototype (English-language literature, abstracts and open-access text only, no patient data or clinical advice), and the deliverables the proposal had to cover.',
            'Technical stack research: I researched and compared the tools for each layer of the system, which became the technology decisions in Figure 3. For each choice (the LLM, LangGraph and LangChain for orchestration, Pydantic for validation, PubMed/PMC, Semantic Scholar and Crossref as sources, pandas and RapidFuzz for processing, and SQLite and Streamlit for storage and the interface), I set out the alternative considered, the rationale and the main risk.',
            'Architecture: I contributed to parts of the system architecture, connecting the stack research to the design so that each component in the overview (Figure 1) had a concrete tool behind it and known limits, such as free-tier quotas and API failure handling.',
          ],
        },
        {
          heading: 'Reflection on my contribution',
          paragraphs: [
            'Working on the brief and the stack early meant much of my contribution shaped the decisions others built on. The cost of that position showed later: the model version mismatch between Figure 3 and the text, and the missing LLM call budget, both sit in my area. Both should have been caught by checking the stack research against the final text before submission. In future team work I will own a final consistency check for anything I research.',
          ],
        },
      ],
    },
    {
      label: 'Critical evaluation',
      sections: [
        {
          heading: 'Evaluation of the design phase',
          paragraphs: [
            'Strengths: every major decision is justified against an alternative, including the choice not to use KQML, which applied what I had practised in the agent dialogues task to a real design trade-off. The success criteria are measurable, and naming silent degradation as a risk moved the design beyond preventing crashes to making gaps visible.',
            'Weaknesses: Figure 3 names Gemini 2.5 Flash while the text specifies Gemini 3.6 Flash, an inconsistency that should have been caught in review. The design relies on a free-tier model while the ReAct loop and curation make many LLM calls per query, but it sets no call budget for quota limits. The recall target of 0.80 is close to the 0.81 reported for a purpose-built system (Wang, Z. et al., 2025), which is ambitious for a two-source prototype, and a 50-abstract sample is small for measuring it. The BDI model is described conceptually, so it is not yet clear how commitment and re-planning will work in code.',
            'Carried into implementation: test whether the free tier can sustain a full run, check the recall target early against a hand-screened set, and decide concretely when the planner drops a subgoal or re-plans.',
          ],
        },
      ],
      references: [
        'Wang, Z. et al. (2025) ‘A foundation model for human-AI collaboration in medical literature mining’, Nature Communications, 16(1), 8361.',
      ],
    },
  ],
};
