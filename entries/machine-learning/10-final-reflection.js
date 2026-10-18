export default {
  label: 'Final Reflection',
  text: 'Unit 12 · My reflective commentary on the module as a whole, structured using Rolfe, Freshwater and Jasper’s (2001) What, So what, Now what framework.',
  sections: [
    {
      heading: 'What',
      paragraphs: [
        'This module took me from fitting a straight line to deciding whether a medical image classifier could be trusted with children. In Discussion 1 I argued, using the Synnovis ransomware attack, that data continuity is part of patient safety. The practical activities then worked through the main families of algorithm: Jaccard distance for clustering, correlation and regression, perceptrons and multi-layer networks, gradient descent, a CNN on CIFAR-10, and the AUC and R² metrics. In the Unit 6 team project, Group 1 clustered New York Airbnb listings and tested whether the clusters improved price prediction; my part was the data analysis and the price prediction modelling and testing. In Unit 11 I worked alone, comparing an SVM with a fine-tuned ResNet-18 for detecting pneumonia on paediatric chest X-rays.',
      ],
    },
    {
      heading: 'So what',
      paragraphs: [
        'First, my understanding of the algorithms changed from how they work to how they fail. I used to judge a model by whether it ran and how high it scored. The notebooks broke that habit: none of the serious failures produced an error. A polynomial reached an R² of 0.99 while predicting worse than a straight line, a gradient descent run diverged while printing numbers as cleanly as one that converged, and a perceptron training loop crashed after one epoch while the notebook still drew its plot. I found this unsettling at first, because it meant clean output was no evidence of a working model. Each algorithm turned out to have one assumption that mattered most: linearity for regression, linear separability for the single perceptron, scale for distance-based clustering and gradient descent, and, for the CNN, that softmax always gives an answer. Domingos (2012) argues that most of machine learning is knowing which assumptions a method makes; I learned them by breaking each one deliberately.',
        'Second, the team project showed me what my contribution was worth and where it stopped. The exploration I did shaped the design: finding that every missing reviews_per_month value belonged to a listing with no reviews led to the has_reviews flag, which applied what I had learned from Discussion 1 about telling absent data from normal behaviour. I was pleased that the analysis was used. The modelling was harder emotionally. The best random forest explained only about 13% of the variation in price, and I felt a pull to find a model that “worked” rather than to report a weak one. The calibrated price range was a more honest answer, but I still let the report name the global model as the best on a $0.16 difference from a single split. Working by pipeline stage also had a cost. The clustering was done by teammates and my experiments took the clusters as given, so the clearest finding, that the clusters carried almost no price information, was never fed back into how the segments were presented. Edmondson (1999) links team learning to members feeling safe to question each other’s work; looking back, I treated our hand-offs as one-way and did not question work that was not mine, and I did not invite questions about mine.',
        'Third, the individual project was where the earlier lessons were tested. Patient-grouped cross-validation gave both models near-perfect scores, and I was briefly excited before the untouched test set showed specificity falling to 0.744 for the CNN and 0.402 for the SVM. That disappointment was the most valuable result of the module: without the test set I would have reported two excellent models. The mitigation experiment taught me something similar about explainability. After cropping the borders, the Grad-CAM maps looked exactly as a radiologist would want, yet the model raised more false alarms. A convincing explanation is not proof of a better model, which is the shortcut-learning problem Geirhos et al. (2020) describe. Comparing the two projects, I applied the lessons I had written down after Unit 6, using cross-validation, paired tests and one reproducible notebook, but I repeated others, relying on single seeds and letting the test set do more than test.',
        'The thread joining these is that every error falls on someone. In my reflection on Wall (2019) I argued that a single accuracy figure hides who bears the errors, and in the pneumonia project the errors fell almost entirely on healthy children flagged for follow-up. The BCS Code of Conduct requires members not to misrepresent the quality of their work (BCS, 2022). Choosing the metric, split and threshold is part of meeting that duty, not a detail decided afterwards.',
        'The evidence is in this portfolio: reproducible scripts and raw results for every activity, and two projects that report where their own validation fell short.',
      ],
    },
    {
      heading: 'Now what',
      paragraphs: [
        'I will carry four changes into practice. First, I will settle the data question before choosing models: what population the data represents, what is missing, and where an independent test set will come from. Both projects were limited by data rather than algorithms, and in both I only found that out at the end. Second, I will not declare a winner without cross-validation, the spread of each metric and a significance test, and I will report results per group and at a stated threshold, as model cards recommend (Mitchell et al., 2019). Third, in team work I will treat hand-offs as two-way, sending results back to whoever produced my inputs and asking them to review my outputs, and I will own a final check that every figure matches the final run. Fourth, I will notice when I want to stop looking, because a weak R² and a disappointing test set taught me most.',
        'The main change is in what I trust. I used to trust a result because the code ran and the score was high. I now trust it only once I have tried to make it fail, and that is the habit I expect to rely on as a machine learning practitioner.',
      ],
    },
  ],
  references: [
    'BCS, The Chartered Institute for IT (2022) BCS Code of Conduct. Swindon: BCS.',
    'Domingos, P. (2012) ‘A few useful things to know about machine learning’, Communications of the ACM, 55(10), pp. 78–87.',
    'Edmondson, A. (1999) ‘Psychological safety and learning behavior in work teams’, Administrative Science Quarterly, 44(2), pp. 350–383.',
    'Geirhos, R. et al. (2020) ‘Shortcut learning in deep neural networks’, Nature Machine Intelligence, 2, pp. 665–673.',
    'Mitchell, M., Wu, S., Zaldivar, A., Barnes, P., Vasserman, L., Hutchinson, B., Spitzer, E., Raji, I.D. and Gebru, T. (2019) ‘Model cards for model reporting’, Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT* ’19), pp. 220–229.',
    'Rolfe, G., Freshwater, D. and Jasper, M. (2001) Critical reflection in nursing and the helping professions: a user’s guide. Basingstoke: Palgrave Macmillan.',
    'Wall, M. (2019) ‘Biased and wrong? Facial recognition tech in the dock’, BBC News, 8 July. Available at: https://www.bbc.co.uk/news/business-48842750 (Accessed: 18 October 2026).',
  ],
};
