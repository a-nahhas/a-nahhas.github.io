export default {
  label: 'Deep Learning in Action',
  text: 'Unit 10 · Task: research an application of deep learning likely to have an impact on society, and post an overview of the technology, a synopsis of how it works and its potential socio-technical impacts.',
  sections: [
    {
      heading: 'Initial post',
      paragraphs: [
        'The application I have chosen is live facial recognition (LFR) in public spaces. Cameras on a van or pole scan the face of everyone who walks past and compare each one in real time against a watchlist of people the police want to find. When the system reports a likely match, an officer decides whether to stop the person. Several UK forces now use it operationally, so its impact is no longer hypothetical.',
        'Modern systems depend on deep convolutional neural networks. One network finds and aligns each face in the video frame. A second maps the face to an embedding, a short vector of numbers, trained so that images of the same person sit close together and images of different people sit far apart. FaceNet learned this mapping with a triplet loss and reached 99.63% accuracy on the Labeled Faces in the Wild benchmark (Schroff, Kalenichenko and Philbin, 2015), up from 97.35% for the earlier DeepFace system (Taigman et al., 2014). Matching is then a distance calculation between a passer-by’s embedding and each watchlist embedding. A similarity threshold set by the operator decides what counts as an alert, so the trade-off between missed matches and false alerts is a policy choice as well as a technical one.',
        'The most discussed risk is unequal accuracy. Buolamwini and Gebru (2018) found that commercial gender classifiers misclassified darker-skinned women up to 34.7% of the time, against 0.8% for lighter-skinned men. NIST’s evaluation of 189 algorithms found that many produced false positives 10 to 100 times more often for some demographic groups than others (Grother, Ngan and Hanaoka, 2019). The picture is not fixed, though. The National Physical Laboratory’s test of the Met’s algorithm found no statistically significant demographic difference at the threshold the force uses, although differences appeared at lower settings (Mansfield, 2023). To me this shows that bias depends on how a model is deployed as well as how it was trained, so it has to be tested in the setting where it is used.',
        'Privacy is the harder issue, because it remains even if the system is perfectly accurate. LFR processes the biometric data of everyone in view, almost none of whom are suspected of anything, and they cannot meaningfully opt out. An independent review of the Met’s trials found that only eight of 42 matches could be verified as correct and questioned the legal basis of the deployments (Fussey and Murray, 2019). The Court of Appeal later ruled South Wales Police’s use unlawful, citing too much discretion over who went on watchlists and where cameras were placed, and a failure to check the software for bias (R (Bridges) v Chief Constable of South Wales Police, 2020). There is also a chilling effect: people may avoid protests or particular places if they know they will be scanned, which affects freedom of assembly as well as privacy.',
        'There are real benefits. LFR can locate missing people or suspects of serious crimes far faster than officers reviewing footage by hand. The EU AI Act reflects this tension by banning real-time remote biometric identification in public spaces for law enforcement, except in narrow cases such as searching for victims or preventing an imminent threat (Regulation (EU) 2024/1689, Article 5). My view is that LFR is acceptable only under similar conditions: a clear legal basis, narrow and published watchlists, independent bias testing at the operating threshold and a human check before anyone is stopped. In agent terms, an alert should be treated as a percept that needs verifying, not as a decision the system has already made.',
      ],
    },
    {
      heading: 'References',
      links: [
        {
          label: 'Buolamwini, J. and Gebru, T. (2018) ‘Gender shades: intersectional accuracy disparities in commercial gender classification’, Proceedings of the 1st Conference on Fairness, Accountability and Transparency, PMLR 81, pp. 77–91.',
          href: 'https://proceedings.mlr.press/v81/buolamwini18a.html',
        },
        {
          label: 'Fussey, P. and Murray, D. (2019) Independent report on the London Metropolitan Police Service’s trial of live facial recognition technology. Colchester: University of Essex Human Rights Centre.',
          href: 'https://www.essex.ac.uk/research/showcase/report-on-the-police-use-of-facial-recognition-technology-identifies-significant-concerns',
        },
        {
          label: 'Grother, P., Ngan, M. and Hanaoka, K. (2019) Face recognition vendor test (FRVT) part 3: demographic effects. NISTIR 8280. Gaithersburg, MD: National Institute of Standards and Technology. doi: 10.6028/NIST.IR.8280.',
          href: 'https://doi.org/10.6028/NIST.IR.8280',
        },
        {
          label: 'Mansfield, T. (2023) Facial recognition technology in law enforcement equitability study: final report. NPL Report MS 43. Teddington: National Physical Laboratory.',
          href: 'https://science.police.uk/research/resources/operational-testing-of-facial-recognition-technology/',
        },
        {
          label: 'R (Bridges) v Chief Constable of South Wales Police [2020] EWCA Civ 1058.',
          href: 'https://www.bailii.org/ew/cases/EWCA/Civ/2020/1058.html',
        },
        {
          label: 'Regulation (EU) 2024/1689 of the European Parliament and of the Council of 13 June 2024 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act), Official Journal of the European Union, L, 12 July 2024.',
          href: 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
        },
        {
          label: 'Schroff, F., Kalenichenko, D. and Philbin, J. (2015) ‘FaceNet: a unified embedding for face recognition and clustering’, Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition, pp. 815–823. doi: 10.1109/CVPR.2015.7298682.',
          href: 'https://doi.org/10.1109/CVPR.2015.7298682',
        },
        {
          label: 'Taigman, Y., Yang, M., Ranzato, M. and Wolf, L. (2014) ‘DeepFace: closing the gap to human-level performance in face verification’, Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition, pp. 1701–1708. doi: 10.1109/CVPR.2014.220.',
          href: 'https://doi.org/10.1109/CVPR.2014.220',
        },
      ],
    },
  ],
};
