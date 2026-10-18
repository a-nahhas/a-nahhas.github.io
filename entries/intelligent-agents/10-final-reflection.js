export default {
  label: 'Final Reflection',
  text: 'Unit 12 · My reflective commentary on the module as a whole, structured using Rolfe, Freshwater and Jasper’s (2001) What, So what, Now what framework.',
  sections: [
    {
      heading: 'What',
      paragraphs: [
        'This module took me from arguing about why organisations adopt agents to building one. In Discussion 1 I claimed, deliberately provocatively, that agent adoption is driven by laziness. In the dialogues task I wrote KQML messages between two agents, and in the parse trees task I saw one sentence produce two valid trees. In Unit 6 our group designed an LLM-powered research planning agent; my part was turning the brief into a scope, researching the technical stack and contributing to the architecture. In Unit 11 I implemented the design individually: two cooperating agents, a BDI-inspired planner running a ReAct loop, a validated JSON hand-off and a human review gate, with 125 tests and a log of 17 defects.',
      ],
    },
    {
      heading: 'So what',
      paragraphs: [
        'Three things stand out when I look back at how I behaved.',
        'First, I started overconfident. My Discussion 1 post took a strong position and named agent architectures without explaining them. When peers challenged it, my first reaction was defensive; I wanted to restate the argument rather than rethink it. Reading Hemmer et al. (2025) changed that. The question became when delegation improves a decision, not whether to delegate, and that idea, bounded autonomy, became the thread through everything I built. Boud, Keogh and Walker (1985) argue that unattended feelings can block learning from experience; in my case, noticing the defensiveness was what allowed the feedback to land.',
        'Second, the team project made me feel responsible in a new way. Because I researched the stack, others built on my choices. I enjoyed that, but it also made me anxious, and in hindsight I rushed the final check. Figure 3 named a different Gemini version from the text, and the design set no LLM call budget even though I had identified the free-tier quota as a risk. Both errors were in my area. I had treated research as finished once a decision was made, not once the document was consistent. Implementing the group design alone later tested how well we had communicated: a traceability review found seven gaps between the proposal and my code, such as “flag” behaving like “reject”. Some were my shortcuts, but others were places where the proposal itself was ambiguous, which showed me that a shared design is only as clear as the team’s agreement on what each word means.',
        'Third, implementation was where most of the learning happened, and much of it was uncomfortable. The first live run crashed on a 503 overload, capacity moved between free-tier models from minute to minute, and a fallback model had been withdrawn. I was frustrated to spend time on quota rather than the research problem, but this was the risk I had flagged, now real. The most important moment was finding that Semantic Scholar had failed on every call while my report showed full coverage. I had named silent degradation as the hardest failure in the proposal and still built it. I felt embarrassed, and briefly tempted to present the run as a success because, technically, it was. Choosing to report it, and to state that my evaluation used 28 AI-checked records rather than 50 hand-screened abstracts, was a decision about integrity as much as engineering.',
        'What produced this learning was not the reading on its own but the gap between what I designed and what the system actually did. The design said “human in the loop”; the code showed that a human is only as effective as the information they are shown (Braun et al., 2024). The design said extractive summaries reduce hallucination; testing showed an extract could change 2.1 to 3.1 and still pass a similarity check. Earlier tasks prepared me for these choices. The dialogues task is why I could justify not using KQML for two agents in one trusted process (Finin et al., 1994), and the parse-tree ambiguity is why the agent prefers “uncertain” to a confident guess (Russell and Norvig, 2021).',
        'The evidence of these skills is in this portfolio: a working multi-agent system with 125 deterministic tests at 97% line coverage, a remediation log linking each defect to its root cause and regression test, an evaluation that reports its own weaknesses, and three case studies connecting safety, explainability and bias to specific incidents in my code. Less visibly, I have learned to read my own results critically, which I could not do at the start of the module.',
      ],
    },
    {
      heading: 'Now what',
      paragraphs: [
        'I will carry four changes into practice. First, I will design what a system reports when it fails before deciding how it recovers, and test that reporting. Second, I will fix evaluation sets independently, ideally with a human labeller, before building the component they measure, so that I cannot unconsciously tune the target to the system. Third, I will apply bounded autonomy by default: agents act freely on cheap, reversible steps, while anything irreversible, such as writing to a store, changing records or approving a payment, needs a human decision supported by visible evidence. Fourth, in team work I will own a final consistency check for anything I research, rather than assuming it is finished when the decision is made.',
        'The main change, though, is in how I respond to my own results. I now treat discomfort with them as a signal to look closer rather than something to explain away. That shift, more than any single technique, is what I expect to rely on as a developer of intelligent agents.',
      ],
    },
  ],
  references: [
    'Boud, D., Keogh, R. and Walker, D. (1985) Reflection: turning experience into learning. London: Kogan Page.',
    'Braun, M., Greve, M., Brendel, A.B. and Kolbe, L.M. (2024) ‘Humans supervising artificial intelligence: investigation of designs to optimize error detection’, Journal of Decision Systems, 33(4), pp. 674–699.',
    'Finin, T., Fritzson, R., McKay, D. and McEntire, R. (1994) ‘KQML as an agent communication language’, in Proceedings of the Third International Conference on Information and Knowledge Management (CIKM ’94). New York: ACM, pp. 456–463.',
    'Hemmer, P., Schemmer, M., Kühl, N., Vössing, M. and Satzger, G. (2025) ‘Complementarity in human-AI collaboration: concept, sources, and evidence’, European Journal of Information Systems, 34(6), pp. 979–1002.',
    'Rolfe, G., Freshwater, D. and Jasper, M. (2001) Critical reflection in nursing and the helping professions: a user’s guide. Basingstoke: Palgrave Macmillan.',
    'Russell, S. and Norvig, P. (2021) Artificial Intelligence: A Modern Approach. 4th edn. Harlow: Pearson.',
  ],
};
