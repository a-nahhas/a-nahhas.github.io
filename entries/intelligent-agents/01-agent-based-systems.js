export default {
  label: 'Collaborative Discussion 1: Agent Based Systems',
  text: 'Units 1–3 · Discussion topic: the rise of agent-based systems in organisations. The sub-entries contain my initial post, a summary of the peer feedback I received, my summary post, and a short reflection on how my view changed.',
  children: [
    {
      label: 'Initial post',
      sections: [
        {
          meta: '6 August 2026',
          paragraphs: [
            'It is tempting to say agent-based systems are rising because people are lazy. That sounds flippant, but there is a serious organisational point behind it. People naturally avoid unnecessary effort, especially when technology can complete routine work faster. The recent rise of large language model agents has made this delegation more attractive because agents can interpret goals, plan actions, use tools and revise their behaviour rather than simply follow fixed commands (Wang et al., 2024).',
            'This changes the role of software from passive support to active responsibility. Baird and Maruping (2021) argue that agentic information systems can accept delegated tasks under uncertainty, which helps explain their appeal to organisations. The underlying models include reactive agents that respond to immediate events, deliberative agents that plan towards goals, and hybrid agents that combine both approaches (Wang et al., 2024). Used well, these systems can reduce administrative workload, provide continuous monitoring and allow employees to focus on judgement, relationships and creative decisions.',
            'However, laziness becomes a problem when useful delegation turns into dependence. Gerlich (2025) found that heavier AI use was associated with cognitive offloading and weaker critical-thinking performance. Read alongside Baird and Maruping (2021), this suggests that the real issue is not whether organisations delegate to agents, but how much responsibility they surrender. Agent-based systems can improve productivity, yet unchecked autonomy may leave employees less able to challenge errors or operate when systems fail. Organisations should therefore use agents to remove pointless effort while preserving meaningful human involvement. The best agent is not one that thinks instead of people, but one that makes human thinking worth the effort.',
          ],
        },
      ],
      references: [
        'Baird, A. and Maruping, L.M. (2021) ‘The next generation of research on IS use: a theoretical framework of delegation to and from agentic IS artifacts’, MIS Quarterly, 45(1), pp. 315–341.',
        'Gerlich, M. (2025) ‘AI tools in society: impacts on cognitive offloading and the future of critical thinking’, Societies, 15(1), article 6.',
        'Wang, L., Ma, C., Feng, X., Zhang, Z., Yang, H., Zhang, J., Chen, Z., Tang, J., Chen, X., Lin, Y., Zhao, W.X., Wei, Z. and Wen, J. (2024) ‘A survey on large language model based autonomous agents’, Frontiers of Computer Science, 18, article 186345.',
      ],
    },
    {
      label: 'Peer feedback received',
      sections: [
        {
          heading: 'Summary of peer responses',
          paragraphs: [
            'Abdullah suggested that I explain, rather than only name, the reactive, deliberative and hybrid architectures, using Wooldridge (2009) to distinguish agents without internal symbolic representations from those that reason over a world model. He also recommended referring explicitly to the BDI (Belief-Desire-Intention) model (Rao and Georgeff, 1995) and noted that Gerlich’s (2025) evidence relies largely on self-reported behaviour, which I had not acknowledged.',
            'Yasmin challenged my “laziness” framing. Drawing on Autor (2015) and Davenport and Kirby (2016), she argued that automation historically replaces tasks rather than whole jobs and is better understood as augmentation, where people and systems collaborate. She agreed that organisations need human oversight and AI literacy to prevent over-dependence.',
          ],
        },
      ],
      references: [
        'Autor, D.H. (2015) ‘Why are there still so many jobs? The history and future of workplace automation’, Journal of Economic Perspectives, 29(3), pp. 3–30.',
        'Davenport, T.H. and Kirby, J. (2016) Only Humans Need Apply: Winners and Losers in the Age of Smart Machines. New York: Harper Business.',
        'Gerlich, M. (2025) ‘AI tools in society: impacts on cognitive offloading and the future of critical thinking’, Societies, 15(1), article 6.',
        'Rao, A.S. and Georgeff, M.P. (1995) ‘BDI agents: from theory to practice’, in Proceedings of the First International Conference on Multi-Agent Systems (ICMAS-95). Menlo Park: AAAI Press, pp. 312–319.',
        'Wooldridge, M.J. (2009) An Introduction to Multiagent Systems. 2nd edn. Chichester: John Wiley & Sons.',
      ],
    },
    {
      label: 'Summary post',
      sections: [
        {
          meta: '8 August 2026',
          paragraphs: [
            'My initial post argued that the rise of agent-based systems reflects a desire to avoid unnecessary effort. After reading the peer responses and revisiting, I would refine that view. “Laziness” was useful as a provocation, but selective delegation is the better explanation. Organisations are not simply trying to make people do less. They are deciding which kinds of effort deserve human attention.',
            'Abdullah’s response made me reconsider how I described agent architectures. Reactive, deliberative and hybrid agents are useful categories, but modern LLM-based agents do not fit neatly into older models. Abou Ali, Dornaika and Charafeddine (2026) distinguish symbolic systems, which rely on explicit rules and planning, from neural or generative agents, which operate through learned, probabilistic behaviour. Their argument for combining these approaches is important because reliability and adaptability are not the same thing. An organisation may want an agent to be flexible when analysing an unfamiliar problem, but predictable when approving a payment or changing customer data.',
            'Yasmin’s challenge to my “laziness” argument also changed my view of augmentation. Human-AI collaboration is not automatically better than either working alone. Hemmer et al. (2025) found that genuine complementarity depends on differences in the information and capabilities available to humans and AI. Delegating a task simply because an agent can perform it therefore misses the point. The better question is whether delegation improves the overall decision.',
            'This also changes how I see human oversight. Keeping a person “in the loop” sounds safe, but supervision itself has to be designed properly. Braun et al. (2024) show that how information is presented can materially affect people’s ability to detect AI errors. Overall, I now see successful agent-based computing as bounded autonomy: give agents freedom where they add value, while keeping human judgement active where errors are difficult, consequential or hard to reverse.',
          ],
        },
      ],
      references: [
        'Abou Ali, M., Dornaika, F. and Charafeddine, J. (2026) ‘Agentic AI: a comprehensive survey of architectures, applications, and future directions’, Artificial Intelligence Review, 59, article 11.',
        'Braun, M., Greve, M., Brendel, A.B. and Kolbe, L.M. (2024) ‘Humans supervising artificial intelligence: investigation of designs to optimize error detection’, Journal of Decision Systems, 33(4), pp. 674–699.',
        'Hemmer, P., Schemmer, M., Kühl, N., Vössing, M. and Satzger, G. (2025) ‘Complementarity in human-AI collaboration: concept, sources, and evidence’, European Journal of Information Systems, 34(6), pp. 979–1002.',
      ],
    },
    {
      label: 'Reflection',
      sections: [
        {
          heading: 'What, so what, now what',
          paragraphs: [
            'What: I opened with a deliberately provocative claim that agent adoption is driven by laziness, and two peers pushed back on both the framing and the theoretical depth.',
            'So what: The feedback showed that I had stated agent architectures without explaining them and had accepted Gerlich’s (2025) findings without questioning the method. Yasmin’s augmentation argument moved me from “delegation versus dependence” to the more useful question of when delegation improves a decision.',
            'Now what: I now treat bounded autonomy as a design principle: agents act freely where errors are cheap and reversible, while human checks are built in where they are not. I will carry this into the team project design and into the AI safety case study.',
          ],
        },
      ],
      references: [
        'Gerlich, M. (2025) ‘AI tools in society: impacts on cognitive offloading and the future of critical thinking’, Societies, 15(1), article 6.',
      ],
    },
  ],
};
