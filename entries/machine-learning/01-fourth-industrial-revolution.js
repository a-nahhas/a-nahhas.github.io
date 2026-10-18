export default {
  label: 'Collaborative Discussion 1: The 4th Industrial Revolution',
  text: 'Units 1–3 · Discussion topic: Industry 4.0, Industry 5.0 and the impact of an information system failure. The sub-entries contain my initial post, a summary of the peer feedback I received, my summary post, and a short reflection on how my view changed.',
  children: [
    {
      label: 'Initial post',
      sections: [
        {
          meta: '10 August 2026',
          paragraphs: [
            'Healthcare is a useful sector for examining the tension between Industry 4.0 and Industry 5.0 because digital integration can improve care while also creating new points of failure. Metcalf (2024) argues that Industry 5.0 develops partly as a response to the limitations of Industry 4.0, especially its focus on efficiency, automation and interconnected technologies. In healthcare, that shift matters because resilience is not only an IT concern. It can directly affect whether clinicians make safe decisions.',
            'The 2024 ransomware attack on Synnovis, a pathology provider supporting NHS organisations in London, shows this clearly. The disruption spread beyond hospitals to 194 GP practices in southeast London, restricting pathology services and delaying diagnostic processes (Rajput, Darzi and Ghafur, 2025). What stands out is that the failure was not confined to one computer system. Digital dependence had linked laboratories, clinicians and patients into a shared information chain, so the loss of one supplier’s systems became a clinical problem.',
            'This exposes a weakness in a purely Industry 4.0 approach. Ghobakhloo et al. (2024) argue that Industry 5.0 should build on digitalisation while placing greater emphasis on resilience and human-centred systems. Synnovis suggests healthcare needs this balance. Faster automated workflows are valuable, but they should degrade safely when systems fail. That could mean independent backups, tested manual procedures, alternative laboratory capacity and clearer responsibility across third-party suppliers.',
            'There is also a machine-learning issue. Healthcare discussions often focus on whether datasets are large, representative and accurate. Synnovis highlights another requirement: data must remain available and trustworthy during disruption. A highly accurate model has little practical value if clinicians cannot access the data feeding it. Industry 5.0 therefore means treating data continuity as part of patient safety, rather than assuming that more connected technology automatically produces a better healthcare system.',
          ],
        },
      ],
      references: [
        'Ghobakhloo, M., Amoozad Mahdiraji, H., Iranmanesh, M. and Jafari-Sadeghi, V. (2024) ‘From Industry 4.0 digital manufacturing to Industry 5.0 digital society: a roadmap toward human-centric, sustainable, and resilient production’, Information Systems Frontiers.',
        'Metcalf, G.S. (2024) ‘An introduction to Industry 5.0: history, foundations, and futures’, in Nousala, S., Metcalf, G. and Ing, D. (eds.) Industry 4.0 to Industry 5.0: Explorations in the Transition from a Techno-Economic to a Socio-Technical Future. Singapore: Springer, pp. 1–29.',
        'Rajput, K., Darzi, A. and Ghafur, S. (2025) ‘Overlooked and under-reported: the impact of cyberattacks on primary care in the UK National Health Service’, The Lancet Digital Health, 7(7), article 100879.',
      ],
    },
    {
      label: 'Peer feedback received',
      sections: [
        {
          heading: 'Summary of peer responses',
          paragraphs: [
            'Lana extended my point about data availability by asking what could have stopped the attack cascading across 194 GP practices. Using Perrow’s (1984) concept of “normal accidents”, she argued that a single pathology provider had become a structural single point of failure: centralising services under Industry 4.0 increased coupling without a matching increase in redundancy. She added that clinical urgency makes healthcare a disproportionate ransomware target (Coventry and Branley, 2018), that business continuity obligations under the NIS Regulations appear to have been inconsistently enforced across NHS suppliers (Department for Science, Innovation and Technology, 2024; Rajput, Darzi and Ghafur, 2025), and that contractual requirements such as mandated failover laboratory capacity may matter more than technical fixes alone (Kruse et al., 2017).',
            'Mattia agreed that Industry 5.0 can be read as a correction to Industry 4.0 and pointed to Baz et al. (2023), who propose a security-by-design risk assessment framework for Healthcare Industry 5.0. Their argument places cybersecurity at the centre of system design from the earliest stages, rather than treating it as a response to threats.',
            'John-Jon distinguished data availability from clinical usability. Restored pathology results may be incomplete, stale or awaiting reconciliation, and a backup alone does not restore specimen transport, analyser interfaces or result validation. Drawing on the NCSC (2025) and the National Data Guardian (2025), he argued that spare capacity must be tested and that senior clinicians, including primary care, should decide testing priorities during an incident. For machine learning, he proposed outage-state metadata, data-completeness thresholds and controls that suspend or qualify predictions when source feeds are impaired, so that missing activity is not read as normal behaviour.',
          ],
        },
      ],
      references: [
        'Baz, A., Ahmed, R., Khan, S.A. and Kumar, S. (2023) ‘Security risk assessment framework for the healthcare industry 5.0’, Sustainability, 15(23), article 16519. doi: 10.3390/su152316519.',
        'Coventry, L. and Branley, D. (2018) ‘Cybersecurity in healthcare: a narrative review of trends, threats and ways forward’, Maturitas, 113, pp. 48–52.',
        'Department for Science, Innovation and Technology (2024) Network and Information Systems (NIS) Regulations 2018: post-implementation review. London: UK Government.',
        'Kruse, C.S., Frederick, B., Jacobson, T. and Monticone, D.K. (2017) ‘Cybersecurity in healthcare: a systematic review of modern threats and trends’, Technology and Health Care, 25(1), pp. 1–10.',
        'National Cyber Security Centre (2025) ‘Engineering resilience against critical loss’, NCSC Annual Review 2025, 14 October.',
        'National Data Guardian (2025) Annual report 2024–25. London: National Data Guardian.',
        'Perrow, C. (1984) Normal Accidents: Living with High-Risk Technologies. New York: Basic Books.',
        'Rajput, K., Darzi, A. and Ghafur, S. (2025) ‘Overlooked and under-reported: the impact of cyberattacks on primary care in the UK National Health Service’, The Lancet Digital Health, 7(7), article 100879.',
      ],
    },
    {
      label: 'Summary post',
      sections: [
        {
          meta: '15 August 2026',
          paragraphs: [
            'The Synnovis incident shows that the risks of healthcare digitalisation are not limited to cybersecurity itself. The wider problem is what happens when highly connected systems fail and essential clinical work depends on them. Rajput, Darzi and Ghafur (2025) show that the 2024 attack disrupted pathology services across hospitals and GP practices, demonstrating how a failure in one provider can quickly become a wider clinical problem.',
            'This also changes how Industry 5.0 should be understood in healthcare. Ghobakhloo et al. (2024) argue that Industry 5.0 places greater emphasis on resilience and human-centred systems, rather than simply extending automation. In the Synnovis case, that would mean designing digital services so that clinicians can still work safely when normal systems are unavailable. Resilience therefore involves more than backups. It includes clear fallback procedures, access to essential patient information, reliable data provenance and enough flexibility for staff to make decisions without depending entirely on automated workflows.',
            'The discussion also made the machine-learning issue more practical. Dataset quality is often judged by accuracy, completeness and representativeness, but availability should be treated as equally important. Garcia-Perez et al. (2023) connect digital transformation with cyber resilience, which supports the idea that a technically accurate model is still of limited value if the data pipeline behind it is disrupted or cannot be trusted during an incident. In healthcare, that can directly affect diagnosis, prioritisation and continuity of care.',
            'Overall, the main lesson from Synnovis is that digital maturity should not be measured by how much technology is connected or automated. A stronger Industry 5.0 approach is one where technology supports clinical judgement, remains dependable under pressure and fails in a way that still allows essential care to continue. For healthcare, resilience is therefore not separate from digital innovation. It is one of the conditions that makes innovation useful.',
          ],
        },
      ],
      references: [
        'Garcia-Perez, A., Cegarra-Navarro, J.G., Sallos, M.P., Martinez-Caro, E. and Chinnaswamy, A. (2023) ‘Resilience in healthcare systems: cyber security and digital transformation’, Technovation, 121, article 102583.',
        'Ghobakhloo, M., Amoozad Mahdiraji, H., Iranmanesh, M. and Jafari-Sadeghi, V. (2024) ‘From Industry 4.0 digital manufacturing to Industry 5.0 digital society: a roadmap toward human-centric, sustainable, and resilient production’, Information Systems Frontiers.',
        'Rajput, K., Darzi, A. and Ghafur, S. (2025) ‘Overlooked and under-reported: the impact of cyberattacks on primary care in the UK National Health Service’, The Lancet Digital Health, 7(7), article 100879.',
      ],
    },
    {
      label: 'Reflection',
      sections: [
        {
          heading: 'What, so what, now what',
          paragraphs: [
            'What: I used the 2024 Synnovis ransomware attack to argue that Industry 5.0 means treating data continuity as part of patient safety. Three peers extended the argument, two of them after I had posted my summary.',
            'So what: Lana’s use of Perrow (1984) showed that the failure was structural. I had framed resilience mainly as backups and manual fallbacks, but the deeper problem was a tightly coupled system with one supplier at its centre. John-Jon’s distinction between availability and clinical usability exposed a gap in my own claim that data must remain “available and trustworthy”: restored data can be accessible and still be stale, incomplete or unreconciled. Mattia’s point about security-by-design moved resilience earlier, from incident response into system design.',
            'Now what: For the rest of this module, I will treat the data pipeline as part of a model’s evaluation rather than a fixed assumption. When preparing data, I will ask how missing or delayed inputs are represented, and whether a model can tell the difference between absent data and normal behaviour. John-Jon’s suggestion of completeness thresholds that suspend or qualify predictions is a practical way to apply this.',
          ],
        },
      ],
      references: [
        'Perrow, C. (1984) Normal Accidents: Living with High-Risk Technologies. New York: Basic Books.',
      ],
    },
  ],
};
