export default {
  label: 'Creating Agent Dialogues',
  text: 'Unit 6 · Task: create a dialogue, using KQML and KIF, between Alice, an agent that procures stock, and Bob, an agent that controls stock levels in a warehouse. Alice asks Bob about the available stock of 50-inch televisions and the number of HDMI slots they have.',
  sections: [
    {
      heading: 'Approach',
      paragraphs: [
        'KQML (Knowledge Query and Manipulation Language) supplies the outer layer of each message: the performative states the speech act (ask-one, tell, sorry) and the parameters identify the sender, receiver, content language, ontology and conversation thread (Finin et al., 1994). KIF (Knowledge Interchange Format) supplies the inner content: a first-order logic expression in prefix notation, where symbols beginning with ? are variables to be bound by the receiver (Genesereth and Fikes, 1992).',
        'Both agents share a warehouse-inventory ontology that defines the relation television and the functions screen-size (in inches), stock-level (units available to sell) and hdmi-ports. The :reply-with and :in-reply-to parameters link each answer to its question so Alice can run several queries at once without confusing the replies.',
      ],
    },
    {
      heading: 'Message 1: Alice asks for the stock of 50-inch televisions',
      paragraphs: [
        'Alice does not know Bob’s product codes, so she describes the item by its properties and leaves both the product (?tv) and the quantity (?quantity) as variables. ask-one requests a single matching answer.',
      ],
      code: `(ask-one
  :sender      Alice
  :receiver    Bob
  :language    KIF
  :ontology    warehouse-inventory
  :reply-with  stock-query-1
  :content     (and (television ?tv)
                    (= (screen-size ?tv) 50)
                    (= (stock-level ?tv) ?quantity)))`,
    },
    {
      heading: 'Message 2: Bob reports the stock level',
      paragraphs: [
        'Bob replies with tell, returning the same expression with the variables bound: product TV-50-UHD, of which 120 units are available.',
      ],
      code: `(tell
  :sender      Bob
  :receiver    Alice
  :language    KIF
  :ontology    warehouse-inventory
  :in-reply-to stock-query-1
  :content     (and (television TV-50-UHD)
                    (= (screen-size TV-50-UHD) 50)
                    (= (stock-level TV-50-UHD) 120)))`,
    },
    {
      heading: 'Message 3: Alice asks how many HDMI slots the television has',
      paragraphs: [
        'Now that she knows the product identifier, Alice can ask about it directly, using a new conversation tag.',
      ],
      code: `(ask-one
  :sender      Alice
  :receiver    Bob
  :language    KIF
  :ontology    warehouse-inventory
  :reply-with  hdmi-query-1
  :content     (= (hdmi-ports TV-50-UHD) ?ports))`,
    },
    {
      heading: 'Message 4: Bob reports the number of HDMI slots',
      code: `(tell
  :sender      Bob
  :receiver    Alice
  :language    KIF
  :ontology    warehouse-inventory
  :in-reply-to hdmi-query-1
  :content     (= (hdmi-ports TV-50-UHD) 4))`,
    },
    {
      heading: 'Alternative reply: Bob cannot answer',
      paragraphs: [
        'If Bob held no 50-inch televisions, or had no HDMI data for the product, he would reply with sorry rather than leave Alice waiting. This tells Alice the query was understood but cannot be answered, so she can try another supplier.',
      ],
      code: `(sorry
  :sender      Bob
  :receiver    Alice
  :in-reply-to stock-query-1)`,
    },
    {
      heading: 'Notes on the design',
      paragraphs: [
        'Separating the message layer (KQML) from the content layer (KIF) means Bob can process the performative and route the query without first understanding its content, and the same content could be carried in a different message type. The shared ontology carries much of the weight: if Alice measured screen size in centimetres, the query would fail silently, which is the kind of semantic mismatch that later standards such as FIPA-ACL also leave to the ontology to resolve (FIPA, 2002).',
        'ask-one returns only one answer. If the warehouse stocked several 50-inch models, Alice should use ask-all to receive every match and compare them before ordering.',
      ],
    },
  ],
  references: [
    'Finin, T., Fritzson, R., McKay, D. and McEntire, R. (1994) ‘KQML as an agent communication language’, in Proceedings of the Third International Conference on Information and Knowledge Management (CIKM ’94). New York: ACM, pp. 456–463.',
    'FIPA (2002) FIPA ACL Message Structure Specification (SC00061G). Foundation for Intelligent Physical Agents.',
    'Genesereth, M.R. and Fikes, R.E. (1992) Knowledge Interchange Format, Version 3.0 Reference Manual. Technical Report Logic-92-1. Stanford, CA: Stanford University.',
  ],
};
