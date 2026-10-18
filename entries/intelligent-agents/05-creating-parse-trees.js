const assetPath = '../../assets/intelligent-agents';

export default {
  label: 'Creating Parse Trees',
  text: 'Unit 8 · Task: create a constituency-based parse tree for each of three sentences: “The government raised interest rates.”, “The internet gives everyone a voice.” and “The man saw the dog with the telescope.”',
  sections: [
    {
      heading: 'Approach',
      paragraphs: [
        'A constituency parse tree shows how a sentence breaks into nested phrases. The root S (sentence) splits into a noun phrase (NP) subject and a verb phrase (VP) predicate, and each phrase splits again until every leaf is a word with its part-of-speech tag (Jurafsky and Martin, 2025). Phrase labels are shown in grey, part-of-speech tags in purple and words in italics. Final punctuation is left out because it has no effect on the structure.',
        'All three trees are built from the small context-free grammar below. Det is a determiner, N a noun, Pro a pronoun, V a verb, P a preposition and PP a prepositional phrase.',
      ],
      code: `S   → NP VP
NP  → Det N | N N | Pro | NP PP
VP  → V NP | V NP NP | V NP PP
PP  → P NP`,
    },
    {
      heading: 'Sentence 1: The government raised interest rates.',
      paragraphs: [
        'A simple transitive sentence. “Raised” takes a single object, the noun phrase “interest rates”, in which the noun “interest” modifies the head noun “rates” (a noun–noun compound).',
      ],
      figures: [
        {
          src: `${assetPath}/parse-tree-1-government.svg`,
          alt: 'Parse tree: S splits into NP (Det The, N government) and VP (V raised, NP (N interest, N rates)).',
        },
      ],
      code: `[S [NP [Det The] [N government]]
   [VP [V raised]
       [NP [N interest] [N rates]]]]`,
    },
    {
      heading: 'Sentence 2: The internet gives everyone a voice.',
      paragraphs: [
        '“Gives” is ditransitive, so the VP holds two noun phrases: the indirect object “everyone” (the recipient, a single pronoun) and the direct object “a voice” (the thing given). Both are direct children of the VP rather than one phrase nested in the other.',
      ],
      figures: [
        {
          src: `${assetPath}/parse-tree-2-internet.svg`,
          alt: 'Parse tree: S splits into NP (Det The, N internet) and VP (V gives, NP (Pro everyone), NP (Det a, N voice)).',
        },
      ],
      code: `[S [NP [Det The] [N internet]]
   [VP [V gives]
       [NP [Pro everyone]]
       [NP [Det a] [N voice]]]]`,
    },
    {
      heading: 'Sentence 3: The man saw the dog with the telescope.',
      paragraphs: [
        'This sentence is structurally ambiguous, so the grammar gives it two valid trees. The words and tags are the same in both; the only difference is where the prepositional phrase “with the telescope” (highlighted) attaches.',
        'Reading A attaches the PP to the verb phrase. It modifies “saw”, so the telescope is the instrument: the man used a telescope to see the dog.',
      ],
      figures: [
        {
          src: `${assetPath}/parse-tree-3a-telescope-instrument.svg`,
          alt: 'Parse tree, reading A: VP contains V saw, NP (the dog) and PP (with the telescope) as three sibling children.',
          caption: 'Reading A: PP attached to the VP. The man used the telescope.',
        },
      ],
      code: `[S [NP [Det The] [N man]]
   [VP [V saw]
       [NP [Det the] [N dog]]
       [PP [P with] [NP [Det the] [N telescope]]]]]`,
    },
    {
      heading: 'Sentence 3, reading B',
      paragraphs: [
        'Reading B attaches the PP inside the object noun phrase. It modifies “dog”, so the phrase picks out which dog was seen: the one that has the telescope. An extra NP level is needed, giving NP → NP PP.',
      ],
      figures: [
        {
          src: `${assetPath}/parse-tree-3b-telescope-modifier.svg`,
          alt: 'Parse tree, reading B: VP contains V saw and a single NP, which splits into NP (the dog) and PP (with the telescope).',
          caption: 'Reading B: PP attached to the NP. The dog has the telescope.',
        },
      ],
      code: `[S [NP [Det The] [N man]]
   [VP [V saw]
       [NP [NP [Det the] [N dog]]
           [PP [P with] [NP [Det the] [N telescope]]]]]]`,
    },
    {
      heading: 'Reflection',
      paragraphs: [
        'The first two sentences each have exactly one tree, so parsing them is mechanical once the grammar is fixed. The third shows why parsing is hard for an agent: syntax alone cannot decide between the two readings, so something outside the grammar has to choose. Hindle and Rooth (1993) showed that word statistics settle many of these PP-attachment cases: “saw … with” is a common verb–instrument pairing, which favours reading A, whereas in “the dog with the collar” the noun attachment would be more likely. Probabilistic context-free grammars build this idea into the parser by scoring every possible tree and returning the most probable one (Jurafsky and Martin, 2025).',
        'For an agent that acts on language, the choice has consequences. An agent that picks the wrong reading has not simply made a grammar error; it has misunderstood the request. Where the readings lead to different actions, a well-designed agent should either use context to resolve the ambiguity or ask a clarifying question, rather than quietly committing to one tree (Russell and Norvig, 2021).',
      ],
    },
  ],
  references: [
    'Hindle, D. and Rooth, M. (1993) ‘Structural ambiguity and lexical relations’, Computational Linguistics, 19(1), pp. 103–120.',
    'Jurafsky, D. and Martin, J.H. (2025) Speech and Language Processing. 3rd edn (draft). Available at: https://web.stanford.edu/~jurafsky/slp3/ (Accessed: 18 October 2026).',
    'Russell, S. and Norvig, P. (2021) Artificial Intelligence: A Modern Approach. 4th edn. Harlow: Pearson.',
  ],
};
