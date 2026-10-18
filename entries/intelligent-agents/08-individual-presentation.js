const assetPath = '../../assets/intelligent-agents';

export default {
  label: 'Individual Presentation Project: Research Planning Agent',
  text: 'Unit 11 · My individual implementation of the research planning agent designed by Group B in Unit 6, presented as a narrated ten-minute presentation. The design came from the group proposal; the code, tests, evaluation and documentation are my individual work. The sub-entries cover the presentation, the implementation, testing, evaluation and my critical evaluation of the project from design to implementation.',
  sections: [
    {
      heading: 'Submission files',
      paragraphs: [
        'The slides and the full code submission, including tests, evaluation results and evidence from live runs, can be downloaded below.',
      ],
      links: [
        { href: `${assetPath}/presentation-slides.pdf`, label: 'Download the slides (PDF)' },
        { href: `${assetPath}/presentation-code.zip`, label: 'Download the code, tests and evidence (ZIP)' },
      ],
    },
  ],
  children: [
    {
      label: 'Presentation slides and narration',
      text: 'Each slide is shown below the narration I recorded for it.',
      sections: [
        {
          heading: 'Slide 1: LLM-powered research planning agent',
          paragraphs: [
            'This presentation demonstrates my implementation of the LLM-powered research planning agent proposed in Unit 6. The agent receives a health-sciences research question, plans a literature search, retrieves and screens records, and hands a ranked, cited evidence set to a human reviewer, who alone decides what enters the evidence store. I will cover the problem and scope, the architecture, how each of the two agents works, a live run, the testing and remediation carried out, the evaluation against the success criteria set in the proposal, and finally a critical reflection on what the prototype does and does not achieve.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-1.png`,
              alt: 'Title slide: LLM-powered research planning agent.',
            },
          ],
        },
        {
          heading: 'Slide 2: Screening is the bottleneck the agent targets',
          paragraphs: [
            'Systematic reviewers screen hundreds of abstracts before synthesis begins. The agent automates the mechanical part: turning a question into search queries, retrieving from PubMed and Semantic Scholar, removing duplicates, and making a first-pass screening decision with extractive, cited summaries. Inclusion decisions stay with the researcher. Equally important is what it never does: it gives no clinical advice, processes no patient data, and does not claim to have read full texts. The proposal fixed four measurable success criteria, shown at the bottom: recall of at least 0.80, full traceability of every claim, fidelity of claims to their abstracts, and a store that reconciles with the reviewer\'s decision log. The evaluation reports where each stands, including where the evidence is weaker than it looks.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-2.png`,
              alt: 'Slide listing what the agent automates, what the researcher decides, what is out of scope, and the four success criteria.',
            },
          ],
        },
        {
          heading: 'Slide 3: Two cooperating agents and a human gate',
          paragraphs: [
            'This is the implemented architecture, which follows the proposal\'s Figure 1. The Planning and Retrieval Agent deliberates once, decomposing the question into subgoals, and then reacts during retrieval; this hybrid avoids both a purely reactive agent that cannot hold ordered goals and a symbolic planner that needs hand-built domain models (Wooldridge, 2009). The two agents communicate through a schema-validated JSON buffer that is written to disk and re-validated when the Curation Agent reads it. A full agent communication language such as KQML suits autonomous, heterogeneous agents (Finin et al., 1994); here both agents share one trusted process, so a validated schema gives the same guarantees with far less machinery. Only records the reviewer approves enter the evidence table. A flag sends a record back to the Curation Agent with the reviewer\'s note, and feedback on the whole run sends the planner back to revise its subgoals. Researchers can also fix the eligibility criteria in advance, as a review protocol requires, and the planner may not change them.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-3.png`,
              alt: 'Architecture diagram: question, Planning and Retrieval Agent, JSON buffer, Curation Agent, human reviewer and SQLite evidence table, with Gemini, PubMed, Semantic Scholar and Crossref as supporting services and a feedback loop to revise the subgoals.',
            },
          ],
        },
        {
          heading: 'Slide 4: Planning agent: BDI intentions, ReAct execution',
          paragraphs: [
            'The planning agent uses BDI as a conceptual model rather than a formal interpreter (Rao and Georgeff, 1995). Beliefs are the retrieved records and query log, the desire is the research question, and intentions are the committed queue of subgoals. Committing to that queue bounds further deliberation, as Bratman, Israel and Pollack (1988) argue a resource-bounded agent must. Execution is a ReAct loop (Yao et al., 2023), implemented as an explicit LangGraph state machine. A deliberate refinement: when a search behaves as expected the next thought is rule-based, and the LLM is consulted only when an observation is anomalous, such as too few results, where it chooses to refine, accept or drop the subgoal. Generated plans are schema-validated with three re-prompts before escalating to the human, a circuit breaker stops calling a failing source (Nygard, 2018), and a step budget reports unfinished subgoals as failed.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-4.png`,
              alt: 'Slide showing the BDI mapping and the LangGraph ReAct loop: plan, select, act, observe.',
            },
          ],
        },
        {
          heading: 'Slide 5: Curation Agent: every claim is checked against its source',
          paragraphs: [
            'The Curation Agent uses the LLM only where language understanding is needed. Deduplication uses RapidFuzz with identifier checks; BM25 pre-ranks records (Robertson and Zaragoza, 2009) so the free-tier quota is spent on the most promising ones; the LLM then screens batches of five against explicit criteria and must quote verbatim extracts. The key safeguard is that those extracts are verified in code, not by another model. An extract must appear in the abstract; a near match may differ only cosmetically, never in a number, a negation or a direction word such as increased or decreased. An inclusion that cannot be verified is downgraded to uncertain. Crossref supplies retraction status. On the right is a real review card: each claim sits beside its extract, identifiers link to the source, and the record is labelled abstract-only, making fabrication visible rather than merely unlikely (Wang, Z. et al., 2025; Wang, G. et al., 2026).',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-5.png`,
              alt: 'Slide showing the five curation steps and a live review card with claims beside their verbatim extracts.',
            },
          ],
        },
        {
          heading: 'Slide 6: Live run: working around a failing source',
          paragraphs: [
            'This is a live run from the Streamlit interface. The agent committed to three subgoals and covered all of them. It retrieved twenty-four records, reduced them to seventeen unique studies, and screened thirteen as include, one as uncertain and three as exclude. Two behaviours are worth pointing out. First, the free tier was overloaded, so the LLM client failed over from Gemini 3.6 Flash to 3.1 Flash-Lite and recorded which model answered each call. Second, the trace on the right shows Semantic Scholar rate-limiting the agent twice, after which the circuit breaker opened and the agent stopped calling it. Critically, this run still reported full coverage, because PubMed satisfied every subgoal: exactly the silent degradation the proposal warned about. The code review caught it, and the report now names any source that was unavailable for the whole run, which a later live run confirmed.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-6.png`,
              alt: 'Slide with live run statistics and the ReAct trace showing the Semantic Scholar circuit breaker opening.',
            },
          ],
        },
        {
          heading: 'Slide 7: Testing: 125 deterministic tests plus live smoke tests',
          paragraphs: [
            'Testing has two layers. One hundred and twenty-five deterministic tests run in about ten seconds with no network or API key. Unit tests cover every component and the planning agent\'s branches: refine, accept, drop, escalate, zero results, budget exhaustion, circuit breaker, fixed criteria and re-planning. Functional tests run the whole system from question to approved evidence using the real source clients, LangGraph loop and SQLite store; only the network and the LLM are replaced, by recorded PubMed responses, a synthetic Semantic Scholar response and a prompt-aware fake model. The CLI and the Streamlit interface are tested end to end, the latter with Streamlit\'s AppTest. Line coverage is ninety-seven per cent. Three opt-in live smoke tests confirm the real integrations, including detecting a known retracted paper through Crossref.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-7.png`,
              alt: 'Slide summarising 125 deterministic tests, 97% line coverage and 3 live smoke tests.',
            },
          ],
        },
        {
          heading: 'Slide 8: Evaluation against the proposal\'s success criteria',
          paragraphs: [
            'For evaluation, retrieval was held fixed and the Curation Agent screened a stratified set of twenty-eight real PubMed records, including deliberate near-misses such as acute pain, neck pain, passive-only therapy and trial protocols, three times. Every relevant record reached the reviewer in every run, so recall was 1.0, or 0.9 once the default cut-off sends only the top twenty BM25 records to the LLM; both meet the 0.80 target. The store reconciled every time, and an audit of the retained claims found eighteen of nineteen faithful, with one overgeneralisation. The consistent error was over-inclusion: a trial measuring pain sensitisation rather than pain intensity was included in every run.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-8.png`,
              alt: 'Slide with evaluation results: recall 1.0, recall at default cut-off 0.9, specificity 0.833, store reconciles in 3 of 3 runs.',
            },
          ],
        },
        {
          heading: 'Slide 9: Conclusion, limitations and next steps',
          paragraphs: [
            'To conclude: the prototype meets most of its design requirements, with two cooperating agents, a hybrid BDI and ReAct planner, a validated hand-off, verified extractive claims and a human gate with a revision loop, and it now degrades visibly rather than silently. The gaps are stated, not hidden. Coverage is abstracts only, with an English filter on PubMed; Semantic Scholar was unavailable without a key; screening varies between runs; the validator proves an extract is genuine, not that a paraphrase is faithful. Reviewers tend to over-trust automation (Goddard, Roudsari and Wyatt, 2012), so the tool defaults to "skip", prefers "uncertain" to a guess and shows every source. Ethically, it uses sanctioned APIs, abstracts are sent to a free-tier LLM and kept in run files, and only approved records enter the evidence table; the README documents these data flows. Next steps: an independent human-screened set of fifty records, a Semantic Scholar key and open-access full text. Thank you.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-9.png`,
              alt: 'Slide summarising what was achieved, limitations, next steps and ethics.',
            },
          ],
        },
      ],
      references: [
        'Bratman, M.E., Israel, D.J. and Pollack, M.E. (1988) \'Plans and resource-bounded practical reasoning\', Computational Intelligence, 4(3), pp. 349-355.',
        'Finin, T. et al. (1994) \'KQML as an Agent Communication Language\', Proceedings of the Third International Conference on Information and Knowledge Management (CIKM \'94). New York: ACM, pp. 456-463. Available at: https://doi.org/10.1145/191246.191322',
        'Goddard, K., Roudsari, A. and Wyatt, J.C. (2012) \'Automation bias: a systematic review of frequency, effect mediators, and mitigators\', Journal of the American Medical Informatics Association, 19(1), pp. 121-127. Available at: https://doi.org/10.1136/amiajnl-2011-000089',
        'Nygard, M.T. (2018) Release It! Design and Deploy Production-Ready Software. 2nd edn. Raleigh, NC: Pragmatic Bookshelf.',
        'Rao, A.S. and Georgeff, M.P. (1995) \'BDI Agents: From Theory to Practice\', Proceedings of the First International Conference on Multiagent Systems (ICMAS-95). Menlo Park, CA: AAAI Press, pp. 312-319.',
        'Robertson, S. and Zaragoza, H. (2009) \'The Probabilistic Relevance Framework: BM25 and Beyond\', Foundations and Trends in Information Retrieval, 3(4), pp. 333-389. Available at: https://doi.org/10.1561/1500000019',
        'Wang, G. et al. (2026) \'Human–large language model collaboration in clinical medicine: a systematic review and meta-analysis\', npj Digital Medicine, 9(1), 195. Available at: https://doi.org/10.1038/s41746-026-02382-2',
        'Wang, Z. et al. (2025) \'A foundation model for human-AI collaboration in medical literature mining\', Nature Communications, 16(1), 8361. Available at: https://doi.org/10.1038/s41467-025-62058-5',
        'Wooldridge, M. (2009) An Introduction to MultiAgent Systems. 2nd edn. Chichester: John Wiley & Sons.',
        'Yao, S. et al. (2023) \'ReAct: Synergizing Reasoning and Acting in Language Models\', 11th International Conference on Learning Representations (ICLR 2023). Available at: https://doi.org/10.48550/arXiv.2210.03629',
      ],
    },
    {
      label: 'Implementation',
      sections: [
        {
          heading: 'From design to code',
          paragraphs: [
            'The implementation follows the proposal’s Figure 1 closely. The Planning and Retrieval Agent is a LangGraph state machine (plan → select → act → observe) whose AgentState holds the BDI elements: beliefs are the retrieved records and query log, the desire is the research question, and intentions are the committed subgoal queue. The two agents hand over through a Pydantic-validated JSON buffer written to disk and re-validated on read. The Curation Agent deduplicates with RapidFuzz, pre-ranks with BM25, screens with the LLM in batches of five, verifies every extract in code and checks retraction status through Crossref. Only records the reviewer approves are written to the SQLite evidence table.',
            'The project is written in Python with LangGraph, Pydantic, httpx, RapidFuzz, SQLite and Streamlit, and uses the Gemini API free tier with failover across several models.',
          ],
        },
        {
          heading: 'Key implementation decisions',
          paragraphs: [
            'The LLM is used only where language understanding is needed: decomposing the question, reasoning about an anomalous search result, and screening and extraction. Deduplication, ranking, validation and storage are deterministic, which limits variability and keeps them testable.',
            'The ReAct “thought” is rule-based when a search behaves as expected; the LLM is consulted only when a search returns fewer than two results. This applies the hybrid design inside the loop and spends the free-tier quota where it matters. The trade-off is that the planner never decides to re-plan on its own; re-planning is triggered by the reviewer.',
            'Extractive claims are verified in code, not by another model. Every claim must quote a span of the abstract and is checked word by word: a near match may differ only cosmetically, never in a number, a negation or a direction word. An include with no verifiable extract is downgraded to uncertain.',
            'Partial failures are surfaced, not hidden. The run report states failed subgoals, the status of each source (including any source unavailable for the whole run), unscreened records and records without abstracts, so a review can report how automation was used.',
          ],
        },
        {
          heading: 'The running system',
          figures: [
            {
              src: `${assetPath}/presentation-run-summary.png`,
              alt: 'Streamlit interface showing a run on chronic low back pain: 100% subgoal coverage, 24 records retrieved and 17 unique, 13 include, 1 uncertain and 3 exclude, with the models used for each LLM call.',
              caption: 'Run summary in the Streamlit interface, including the LLM calls served by each model after failover.',
            },
            {
              src: `${assetPath}/presentation-review-card.png`,
              alt: 'Review card for a Cochrane review: screening reason, two claims each beside its verbatim extract, PMID and DOI links, retraction status and abstract-only label, and skip, approve, flag or reject controls.',
              caption: 'A review card: each claim sits beside its verbatim extract, and nothing is stored until the reviewer approves it.',
            },
            {
              src: `${assetPath}/presentation-react-trace.png`,
              alt: 'ReAct trace listing plan, thought, action and observation steps, including Semantic Scholar returning HTTP 429 twice and the agent skipping it for the rest of the run.',
              caption: 'The ReAct trace: after two rate-limit failures, the circuit breaker stops the agent calling Semantic Scholar.',
            },
          ],
        },
      ],
      references: [
        'Bratman, M.E., Israel, D.J. and Pollack, M.E. (1988) \'Plans and resource-bounded practical reasoning\', Computational Intelligence, 4(3), pp. 349-355.',
        'Nygard, M.T. (2018) Release It! Design and Deploy Production-Ready Software. 2nd edn. Raleigh, NC: Pragmatic Bookshelf.',
        'Rao, A.S. and Georgeff, M.P. (1995) \'BDI Agents: From Theory to Practice\', Proceedings of the First International Conference on Multiagent Systems (ICMAS-95). Menlo Park, CA: AAAI Press, pp. 312-319.',
        'Robertson, S. and Zaragoza, H. (2009) \'The Probabilistic Relevance Framework: BM25 and Beyond\', Foundations and Trends in Information Retrieval, 3(4), pp. 333-389. Available at: https://doi.org/10.1561/1500000019',
        'Yao, S. et al. (2023) \'ReAct: Synergizing Reasoning and Acting in Language Models\', 11th International Conference on Learning Representations (ICLR 2023). Available at: https://doi.org/10.48550/arXiv.2210.03629',
      ],
    },
    {
      label: 'Testing and remediation',
      sections: [
        {
          heading: 'Test strategy',
          paragraphs: [
            '125 deterministic unit and functional tests run in about 14 seconds with no network or API key, with 97% line coverage of the agent package. Unit tests cover every component and each branch of the planning agent: refine, accept, drop, escalate, zero results, budget exhaustion, circuit breaker, fixed criteria and re-planning.',
            'Functional tests run the whole system from question to approved evidence using the real source clients, LangGraph loop and SQLite store; only the network (recorded PubMed responses and a synthetic Semantic Scholar response) and the LLM (a prompt-aware fake) are replaced. The command line and the Streamlit interface are tested end to end. Three opt-in live smoke tests confirm the real PubMed, Crossref and Gemini integrations, including detecting a known retracted paper.',
          ],
          code: `TOTAL                                         1104     32    97%
===================== 125 passed, 3 deselected in 14.05s ======================`,
        },
        {
          heading: 'Defects found and fixed',
          paragraphs: [
            'I kept a remediation log of 17 defects, each with its root cause, fix and the regression test that now guards it. R1–R8 were found by unit tests and early live runs; R9–R17 by a structured code review with four independent reviewers covering correctness, compliance with the brief, traceability to the proposal and the accuracy of documented claims.',
            'The most significant were: the first live run crashing on a Gemini 503 overload, which led to model failover (R3, R4); the fidelity check accepting an extract whose effect size had been changed from 2.1 to 3.1, and later extracts that flipped “no significant” to “a significant” or “increased” to “decreased”, which led to the word-level validator (R6, R10); and a run where Semantic Scholar failed on every call yet the report showed 100% coverage, the silent degradation the proposal had warned about, now reported per source (R11).',
            'The traceability review also closed seven gaps between the proposal and the code, for example making “flag” return a record to the Curation Agent for revision rather than behaving like “reject”, and letting researchers fix eligibility criteria in advance as a review protocol requires.',
          ],
        },
      ],
    },
    {
      label: 'Evaluation against the success criteria',
      sections: [
        {
          heading: 'Method',
          paragraphs: [
            'Retrieval was held fixed so the results measure screening and extraction only. The Curation Agent screened the same 28 real PubMed records (10 includes and 18 excludes) three times. The set was built from stratified queries and includes deliberate near-misses: acute pain, neck pain, adolescents, passive-only therapy, trial protocols, spinal stenosis and trials without a pain-intensity outcome. Gemini’s free-tier quota for the larger models was used up on the day, so all three runs were served by gemini-3.1-flash-lite.',
          ],
        },
        {
          heading: 'Results',
          paragraphs: [
            'Recall (target ≥ 0.80): 1.0 in all three runs, or 0.9 with the default cut-off, because one include ranks below the BM25 top 20 and would be listed as unscreened rather than sent to the LLM.',
            'Traceability: guaranteed by design, because the validator drops any claim without an identifier and a verified extract; it rejected 1 of 21 claims in run 3.',
            'Fidelity: 18 of 19 retained claims were faithful across 13 records; one claim overgeneralised a genuine extract.',
            'Storage: the evidence table reconciled with the reviewer decision log in every run.',
          ],
          code: `Run  Recall (to reviewer)  Recall at cut-off  Specificity  Precision  Claims kept  Store reconciles
1    1.0                   0.9                0.833        0.769      19 / 19      yes
2    1.0                   0.9                0.833        0.909      24 / 24      yes
3    1.0                   0.9                0.833        0.909      20 / 21      yes`,
        },
        {
          heading: 'Findings and limits of the evidence',
          paragraphs: [
            'No relevant record was lost, but the consistent error was over-inclusion on outcome type: a trial measuring pain sensitisation rather than pain intensity was included in every run. This favours recall over precision, which suits a first-pass screen, but criteria about outcome type are where the screener is weakest. Results also varied between runs on borderline excludes, which is why the human gate is essential.',
            'The evidence is weaker than the proposal intended: 28 AI-checked records rather than 50 hand-screened abstracts, so one record moves recall by 0.1, and the fidelity audit covered 13 records rather than 20 and was done by AI rather than a human auditor.',
          ],
        },
      ],
    },
    {
      label: 'Critical evaluation: design to implementation',
      sections: [
        {
          heading: 'What the implementation confirmed',
          paragraphs: [
            'The core of the design held up. The hybrid planner, the validated JSON buffer and the human gate all translated directly into code, and choosing not to use KQML was right: two agents in one trusted process needed a shared schema, not a negotiation protocol. Keeping deduplication, validation and storage outside the LLM made most of the system deterministic and testable, which is what allowed 125 tests to run offline.',
          ],
        },
        {
          heading: 'Where reality differed from the design',
          paragraphs: [
            'The free-tier risk I identified in the design phase turned out to be the dominant engineering problem. The design assumed one free model; in practice the first live run crashed on a 503 overload, a fallback model had been withdrawn, and capacity moved between models from minute to minute. Failover across four models, pacing and a rule-based ReAct thought were all responses to quota, not to the research problem.',
            'Silent degradation, which the proposal named as the harder failure, actually happened: Semantic Scholar was rate-limited on every call while the report showed full coverage. It was caught by code review rather than by tests, because no test had asked what the report should say when a whole source is missing. Without an API key the agent is effectively single-source, so the coverage risk in the proposal’s conclusion is real.',
            'The success criteria were met, but on weaker evidence than planned. The proposal promised 50 hand-screened abstracts; the evaluation used 28 AI-checked records, so a recall of 1.0 is encouraging but not conclusive. The word-level validator proves an extract is genuine, not that a claim built on it is faithful, which the fidelity audit confirmed with one overgeneralisation.',
          ],
        },
        {
          heading: 'What I would do differently',
          paragraphs: [
            'I would build the evaluation set with a human screener before writing the curation code, so that the target was fixed independently of the system being tested, and I would get a Semantic Scholar key at the start rather than designing around its absence. I would also write tests for what the system reports when things fail, not only for whether it survives the failure.',
          ],
        },
      ],
      references: [
        'Goddard, K., Roudsari, A. and Wyatt, J.C. (2012) \'Automation bias: a systematic review of frequency, effect mediators, and mitigators\', Journal of the American Medical Informatics Association, 19(1), pp. 121-127. Available at: https://doi.org/10.1136/amiajnl-2011-000089',
      ],
    },
  ],
};
