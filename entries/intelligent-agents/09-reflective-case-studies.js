export default {
  label: 'Reflective Case Studies',
  text: 'Three formative case studies, each grounded in the research planning agent I designed with Group B (Unit 6) and implemented individually (Unit 11). Each follows Rolfe, Freshwater and Jasper’s (2001) What, So what, Now what framework. Themes: AI safety constraints, explainable decisions, and bias in autonomous decision-making.',
  children: [
    {
      label: 'Case study 1: AI safety constraints',
      sections: [
        {
          heading: 'What',
          paragraphs: [
            'The design placed a human gate before the evidence store, and the implementation added further bounds: three re-prompts before escalating to a human, a step budget that reports unfinished subgoals as failed, a circuit breaker on failing sources, and eligibility criteria the planner cannot change. During one live run Semantic Scholar was rate-limited on every call, yet the run report showed full coverage.',
          ],
        },
        {
          heading: 'So what',
          paragraphs: [
            'Each bound is a small version of what Amodei et al. (2016) call avoiding unsafe exploration, and the gate keeps the agent open to correction in the sense of Hadfield-Menell et al.’s (2017) off-switch game: nothing enters the store without approval. The incident showed the limit of that gate. The reviewer was in the loop, but was approving a picture that looked complete. A kill switch only protects you if the person holding it can see what is happening. Parasuraman and Riley (1997) describe this as misuse: over-reliance on automation that cannot be inspected. I had treated “human in the loop” as the safety measure, when the real measure was the quality of what the human sees (Braun et al., 2024).',
            'I felt uneasy finding this, because I had named silent degradation as a risk in the design and still built it. That discomfort showed me that naming a risk is not the same as testing for it.',
          ],
        },
        {
          heading: 'Now what',
          paragraphs: [
            'I will treat every constraint as two requirements: the constraint itself and a visible signal when it fires. I will test what a system reports when parts fail, set step and call budgets from the start, and keep irreversible actions behind a human decision with the agent’s uncertainty shown beside it.',
          ],
        },
      ],
      references: [
        'Amodei, D., Olah, C., Steinhardt, J., Christiano, P., Schulman, J. and Mané, D. (2016) ‘Concrete problems in AI safety’, arXiv:1606.06565.',
        'Braun, M., Greve, M., Brendel, A.B. and Kolbe, L.M. (2024) ‘Humans supervising artificial intelligence: investigation of designs to optimize error detection’, Journal of Decision Systems, 33(4), pp. 674–699.',
        'Hadfield-Menell, D., Dragan, A., Abbeel, P. and Russell, S. (2017) ‘The off-switch game’, in Proceedings of the 26th International Joint Conference on Artificial Intelligence (IJCAI-17), pp. 220–227.',
        'Parasuraman, R. and Riley, V. (1997) ‘Humans and automation: use, misuse, disuse, abuse’, Human Factors, 39(2), pp. 230–253.',
      ],
    },
    {
      label: 'Case study 2: Explainable decisions',
      sections: [
        {
          heading: 'What',
          paragraphs: [
            'The Curation Agent must justify every screening decision with verbatim extracts, shown beside each claim on the review card with PMID and DOI links. In testing, the fidelity check accepted an extract whose effect size had changed from 2.1 to 3.1, and later extracts that flipped “no significant” to “a significant” or “increased” to “decreased” (defects R6 and R10). I replaced the similarity check with a word-level validator in code that rejects any difference in a number, negation or direction word.',
          ],
        },
        {
          heading: 'So what',
          paragraphs: [
            'The model’s justifications looked convincing even when wrong. Turpin et al. (2023) show that language-model explanations can be unfaithful to what actually drove the output, so the model could not be trusted to explain itself. Rudin (2019) argues that high-stakes systems should be interpretable by design rather than explained after the fact. The validator follows that logic: the explanation is a quote checked deterministically, not a rationale to be believed. Miller (2019) adds that useful explanations are selective; a reviewer needs the sentence that supports inclusion, not the model’s full reasoning. The limit remains: the validator proves an extract is genuine, not that a claim built on it is faithful, and the audit found one overgeneralisation.',
            'R6 alarmed me: a one-digit change could have reached a reviewer looking fully referenced. It changed what “cited” means to me.',
          ],
        },
        {
          heading: 'Now what',
          paragraphs: [
            'For agents whose output people act on, I will separate the decision from its evidence, verify the evidence in code where possible, state what an explanation does not prove, and test explanations adversarially with altered numbers and negations.',
          ],
        },
      ],
      references: [
        'Miller, T. (2019) ‘Explanation in artificial intelligence: insights from the social sciences’, Artificial Intelligence, 267, pp. 1–38.',
        'Rudin, C. (2019) ‘Stop explaining black box machine learning models for high stakes decisions and use interpretable models instead’, Nature Machine Intelligence, 1(5), pp. 206–215.',
        'Turpin, M., Michael, J., Perez, E. and Bowman, S.R. (2023) ‘Language models don’t always say what they think: unfaithful explanations in chain-of-thought prompting’, in Advances in Neural Information Processing Systems 36 (NeurIPS 2023).',
      ],
    },
    {
      label: 'Case study 3: Bias in autonomous decision-making',
      sections: [
        {
          heading: 'What',
          paragraphs: [
            'Three biases appeared in my agent, none of them demographic. PubMed retrieval was filtered to English. Without an API key Semantic Scholar was unavailable, so the agent was effectively single-source. The BM25 cut-off sent only the top twenty records to the LLM, lowering recall from 1.0 to 0.9. In screening, a trial measuring pain sensitisation rather than pain intensity was included in all three runs.',
          ],
        },
        {
          heading: 'So what',
          paragraphs: [
            'In my Deep Learning in Action post I argued that facial recognition bias depends on the operating threshold, not only the model (Grother, Ngan and Hanaoka, 2019). My agent has the same structure: filters and cut-offs are thresholds that decide whose evidence is seen. Mehrabi et al. (2021) class these as sampling biases introduced before any model runs. Morrison et al. (2012) found no systematic bias from English-language restriction in conventional medicine, but I did not measure it for my topic. In Discussion 3 I argued that generated content can narrow the shared pool of ideas; a screener favouring well-ranked, English, single-database records narrows the evidence base the same way. Over-inclusion is a safer error for a first pass, but reviewers tend to accept automated suggestions (Goddard, Roudsari and Wyatt, 2012), so a consistent error can become the reviewer’s.',
            'I felt defensive at first because recall met the target. Accepting that a passing metric can hide a skewed sample was uncomfortable but important.',
          ],
        },
        {
          heading: 'Now what',
          paragraphs: [
            'I will report filters and thresholds as design decisions with their effects, build an independent human-labelled evaluation set with deliberate edge cases before building a screener, and measure performance by subgroup (language, source, outcome type) rather than one aggregate score.',
          ],
        },
      ],
      references: [
        'Goddard, K., Roudsari, A. and Wyatt, J.C. (2012) ‘Automation bias: a systematic review of frequency, effect mediators, and mitigators’, Journal of the American Medical Informatics Association, 19(1), pp. 121–127.',
        'Grother, P., Ngan, M. and Hanaoka, K. (2019) Face recognition vendor test (FRVT) part 3: demographic effects. NISTIR 8280. Gaithersburg, MD: National Institute of Standards and Technology.',
        'Mehrabi, N., Morstatter, F., Saxena, N., Lerman, K. and Galstyan, A. (2021) ‘A survey on bias and fairness in machine learning’, ACM Computing Surveys, 54(6), article 115.',
        'Morrison, A. et al. (2012) ‘The effect of English-language restriction on systematic review-based meta-analyses: a systematic review of empirical studies’, International Journal of Technology Assessment in Health Care, 28(2), pp. 138–144.',
      ],
    },
  ],
  references: [
    'Rolfe, G., Freshwater, D. and Jasper, M. (2001) Critical reflection in nursing and the helping professions: a user’s guide. Basingstoke: Palgrave Macmillan.',
  ],
};
