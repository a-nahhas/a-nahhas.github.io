const assetPath = '../../assets/machine-learning';

export default {
  label: 'Individual Presentation: Classical ML vs Deep Learning for Paediatric Pneumonia Detection',
  text: 'Unit 11 · My individual presentation, Comparative Intelligence and Ethics in Machine Learning Systems. I compared a classical model (HOG features with an RBF-kernel SVM) with a deep model (a fine-tuned ResNet-18) for detecting pneumonia on children’s chest X-rays, then examined why each model decides, where their errors fall and how one could be deployed safely. The dataset choice, code, experiments, slides and narration are all my individual work. The sub-entries cover the presentation, the implementation, validation and results, explainability and bias, my critical evaluation of the project and an evaluation of this final project against the Unit 6 team project.',
  sections: [
    {
      heading: 'Submission files',
      paragraphs: [
        'The slides and the full Jupyter notebook, with every output, figure and table used in the presentation, can be downloaded below.',
      ],
      links: [
        { href: `${assetPath}/presentation-slides.pdf`, label: 'Download the slides (PDF)' },
        { href: `${assetPath}/presentation-notebook.ipynb`, label: 'Download the notebook (Jupyter)' },
      ],
    },
  ],
  children: [
    {
      label: 'Presentation slides and narration',
      text: 'Each slide is shown below the narration I recorded for it.',
      sections: [
        {
          heading: 'Slide 1: Is the model looking at the lungs?',
          paragraphs: [
            'Hello. In this project I compared a classical machine-learning model with a deep-learning model for spotting pneumonia on children’s chest X-rays. The image on the right is where it ended up. A model that scored about ninety-nine percent in validation is almost certain this healthy child has pneumonia, and its attention is on a label printed in the corner. I’ll show how I found that, and what it means for hospitals.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-1.png`,
              alt: 'Title slide: Is the model looking at the lungs? A Grad-CAM overlay on a healthy child’s X-ray, scored as near-certain pneumonia, with the heat on the KV59 label rather than the lungs.',
            },
          ],
        },
        {
          heading: 'Slide 2: Pneumonia is a leading killer of young children',
          paragraphs: [
            'Pneumonia killed over seven hundred and forty thousand children under five in 2019, according to the World Health Organization. A chest X-ray is a key test, but radiologists aren’t always available, so automated triage is attractive. My question has two parts. Which is better at supporting radiologists: a classical support vector machine, or a deep neural network? And can we trust why it decides? I’ll cover data, models, validation, explainability, ethics and deployment.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-2.png`,
              alt: 'Slide showing 740,180 under-5 pneumonia deaths in 2019, the research question and the six parts of the talk.',
            },
          ],
        },
        {
          heading: 'Slide 3: A real clinical dataset from one hospital',
          paragraphs: [
            'The data is the paediatric chest X-ray set from Kermany and colleagues, published in Cell in 2018. I took it from the original Mendeley release, which the popular Kaggle version copies. There are 5,856 X-rays of children aged one to five from one hospital in Guangzhou, labelled normal, bacterial or viral pneumonia. I chose it because the stakes are real, the filenames identify patients, so I could validate without leakage, and the subtypes give a ready-made group to check for bias.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-3.png`,
              alt: 'Slide with sample normal, bacterial and viral X-rays and dataset facts: 5,856 images, about 4,100 children, one hospital, CC BY 4.0 licence.',
            },
          ],
        },
        {
          heading: 'Slide 4: What the data told us before modelling',
          paragraphs: [
            'Exploring the data shaped the design. There are nearly three pneumonia images for every normal one, so I used class weighting, and judged the models on precision, the share of flagged children who are really ill, and recall, the share of ill children we catch, plus F1, which balances the two. Many children have several images, so I split by patient. Normal images have about 2.4 times as many pixels as pneumonia images, a possible acquisition clue, and many carry burnt-in text. Everything was converted to greyscale and resized to 224 pixels square.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-4.png`,
              alt: 'Slide with class and image-size distributions and four findings: 2.88 to 1 imbalance, several images per child, normal images about 2.4 times the pixels, and burnt-in text.',
            },
          ],
        },
        {
          heading: 'Slide 5: Two models, same data, same folds',
          paragraphs: [
            'The classical model can’t learn from raw pixels, so I built features: histograms of oriented gradients, which describe edges and texture like rib outlines and patchy shadowing, plus a brightness histogram. PCA compresses them to 455 numbers, and an SVM with an RBF kernel, which can draw curved boundaries, separates the classes; its two settings were tuned by grid search. The deep model is a ResNet-18, the smallest standard ResNet, pre-trained on ImageNet, a million everyday photos, and fine-tuned on X-rays. I augmented for positioning and exposure, but never flipped images, because the heart sits on the left. I chose scikit-learn for its leak-free pipelines and grouped cross-validation, and PyTorch for pre-trained models and Grad-CAM support.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-5.png`,
              alt: 'Slide comparing the two pipelines: HOG plus intensity histogram, PCA and RBF SVM in scikit-learn, against an ImageNet-pretrained ResNet-18 fine-tuned in PyTorch.',
            },
          ],
        },
        {
          heading: 'Slide 6: Validating on new patients, not new images',
          paragraphs: [
            'Both models are only as good as how we test them. I used stratified group five-fold cross-validation: every image of a child stays in one fold, and each fold keeps the same class balance. Both models use identical folds. The learning curves show why validation matters: training loss falls towards zero, while validation loss levels off higher. That gap is overfitting. Here it was mild; the overfitting that really mattered, to this hospital’s images, only showed up on the test set: 624 images from 428 other children, never used for training or tuning.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-6.png`,
              alt: 'Slide showing patient-grouped five-fold cross-validation, the separate 624-image test set and the ResNet-18 learning curves.',
            },
          ],
        },
        {
          heading: 'Slide 7: Near-perfect in validation, not on new patients',
          paragraphs: [
            'And this is the central result. In cross-validation both models look almost perfect, with F1 around 0.98 to 0.99. On the test set, recall stays near one, so almost no pneumonia is missed. But specificity, the share of healthy children correctly cleared, falls from 99 to 74 percent for the CNN, and from 95 to 40 percent for the SVM. Patient grouping rules out obvious leakage, so the likeliest cause is a shift between training and test images. Yet the CNN’s AUC, its ability to rank sick above healthy, stays at 0.97: the ranking survives; the threshold doesn’t.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-7.png`,
              alt: 'Slide showing specificity falling from 0.99 to 0.74 for ResNet-18 and from 0.95 to 0.40 for the SVM between cross-validation and the test set.',
            },
          ],
        },
        {
          heading: 'Slide 8: The CNN is significantly better overall',
          paragraphs: [
            'Head to head on the test set, the CNN, a ResNet-18, is better on every metric except recall, where both are essentially perfect: the SVM missed none and the CNN three of the 390 pneumonia cases. The CNN raises 60 false alarms against 140. McNemar’s test compares two models on the same images by looking only where they disagree: 82 images only the CNN got right, 5 only the SVM. That gives a p-value around ten to the minus 19, so the difference isn’t chance.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-8.png`,
              alt: 'Slide with the test metrics table, both confusion matrices and McNemar’s test: 82 against 5, p about 10 to the minus 19.',
            },
          ],
        },
        {
          heading: 'Slide 9: Trade-offs beyond accuracy, and the bigger picture',
          paragraphs: [
            'Stepping back from the scores. The usual case for classical models is interpretability, but not here: after PCA and an RBF kernel, the SVM is just as opaque. Its real advantages are cost and data: it trains in seconds on a CPU with no pre-training, while the CNN needs a GPU and ImageNet features. For context, on this same test set Kermany’s original model reported 90 percent specificity at 93 percent sensitivity, and Rajaraman’s, which crops to the lungs, 96 for both. Our AUC matches Kermany’s, so the gap is mostly the threshold: at their sensitivity, our CNN would reach about 91 percent specificity, though that’s only illustrative, since the threshold was picked on test data.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-9.png`,
              alt: 'Slide comparing the models on specificity, robustness, explainability, data needs, training time and serving cost, with approaches not tried.',
            },
          ],
        },
        {
          heading: 'Slide 10: Grad-CAM: the CNN often looks at corners and labels',
          paragraphs: [
            'So why the false alarms? Grad-CAM shows which regions drive the CNN’s pneumonia score. On the images it flags, 42 percent of its attention falls in the outer border band, against 36 if spread evenly. The bottom row shows its five most confident false alarms: healthy children scored as near-certain pneumonia. In all five, the heat sits on burnt-in text: the exposure label in the corner, a timestamp, or the side marker. That’s shortcut learning, also reported by Zech and DeGrave: a feature that separates the classes here but isn’t disease.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-10.png`,
              alt: 'Slide with the mean Grad-CAM maps for each class, peaking at the corners, and the five most confident false alarms with heat on burnt-in labels.',
            },
          ],
        },
        {
          heading: 'Slide 11: LIME: neither model reasons like a radiologist',
          paragraphs: [
            'Grad-CAM only works for CNNs, so to compare both models fairly I used LIME. It hides patches of the image and measures how the prediction changes. Green patches push towards pneumonia, red ones away. For both models, influential patches often include background, borders and the abdomen. The SVM’s edge features respond anywhere in the image, so it has no concept of a lung. LIME varies between runs, so I read it alongside Grad-CAM.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-11.png`,
              alt: 'Slide with LIME explanations for both models on five test images, showing influential patches on borders, abdomen and shoulders.',
            },
          ],
        },
        {
          heading: 'Slide 12: Error rates depend partly on how the image was taken',
          paragraphs: [
            'For bias, the subtypes showed no gap: both are caught almost every time. The disparities fall on healthy children. Normal images come in two filename batches, and there’s a trend: the CNN clears 81 percent of the IM batch but 72 percent of NORMAL2, although with these sample sizes the intervals overlap. Brightness gives clearer evidence: when I brightened the test images, specificity fell from 74 to 59 percent for the CNN, and from 40 to 25 for the SVM. So error rates depend partly on how an image was taken, not only on the child.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-12.png`,
              alt: 'Slide with the exposure stress test and three findings: no subtype gap, a batch trend, and more false alarms on brighter images.',
            },
          ],
        },
        {
          heading: 'Slide 13: Fixing where it looked made false alarms worse',
          paragraphs: [
            'Next I tried to remove the shortcut. This was exploratory, designed after seeing test-set heatmaps. I cropped ten percent from each border, removing most text, applied CLAHE, a local contrast equaliser, and retrained both models. The CNN’s average heatmap moved onto the lung fields. But its false alarms went up, from 60 to 91, a significant drop in specificity, and it was no more robust to brightness. One explanation: the test set comes from the same hospital and shares its labels, so here the shortcut actually helps. Whether removing it helps elsewhere, only another hospital’s data can tell. The lesson: a plausible heatmap doesn’t make a better model.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-13.png`,
              alt: 'Slide comparing mean Grad-CAM before and after border crop and CLAHE: attention moves to the lungs but false alarms rise from 60 to 91.',
            },
          ],
        },
        {
          heading: 'Slide 14: What the errors mean for a child',
          paragraphs: [
            'Now the ethics. On privacy: the images came from routine care and, as the authors report, were de-identified under ethics approval. But the children didn’t consent to machine-learning use, and burnt-in timestamps are leftover identifiers that must be scrubbed. Errors aren’t equal. A missed pneumonia can be fatal; a false alarm means unnecessary antibiotics, more resistance, worried parents and extra work for radiologists. And at a realistic twenty percent prevalence, only 49 percent of the CNN’s flags would be real pneumonia, which risks alert fatigue. On bias: one hospital, one age group, and no sex or ethnicity data, so fairness across those can’t be tested.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-14.png`,
              alt: 'Slide covering data privacy, the unequal cost of missed pneumonia and false alarms, 49% positive predictive value at 20% prevalence, and bias and harm.',
            },
          ],
        },
        {
          heading: 'Slide 15: Recommendation: the CNN, as decision support only',
          paragraphs: [
            'So I recommend the CNN, the original baseline version, as decision support only. It’s significantly better than the SVM, stays well ahead of it on brighter images, and runs fast on a CPU. The cropped version was worse, so the evidence favours the baseline despite its less convincing heatmaps. Its known risk is the shortcut, so in deployment I’d mask burnt-in text, retrain on masked images, and validate at each new site. The other conditions: recalibrate the threshold locally, run in shadow mode first, keep the radiologist in charge, and get medical-device approval.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-15.png`,
              alt: 'Slide recommending the baseline ResNet-18 with its evidence and five conditions: local calibration, external validation, shadow mode, human in the loop and regulatory approval.',
            },
          ],
        },
        {
          heading: 'Slide 16: Deploying it safely: human in the loop',
          paragraphs: [
            'Deployment would look like this. X-rays go from the hospital’s imaging system through de-identification to a containerised model behind a REST API, for example a SageMaker endpoint in the hospital’s own cloud region. Results return to the radiologist’s worklist as a priority flag with a heatmap. It runs in milliseconds on a CPU, so it scales cheaply. Monitoring tracks input drift and agreement with radiologists per site; confirmed cases feed retraining, and new models are validated on a held-out site first.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-16.png`,
              alt: 'Deployment diagram: hospital PACS, de-identification, inference API, radiologist worklist, shadow mode, monitoring, retraining and validation before registering a new version.',
            },
          ],
        },
        {
          heading: 'Slide 17: Demo: both models on an unseen X-ray',
          paragraphs: [
            'This small app runs both models on any X-ray. I’ll pick a healthy child from the test set and click Analyse. The SVM gives a high pneumonia score, a false alarm, while the CNN says close to zero, so its pneumonia heatmap is faint: there’s little evidence to show. Now a viral pneumonia case, and Analyse: both flag it, and the heatmap shows where the CNN found its evidence. Finally, back to the healthy child: I raise the threshold to 0.85 and click Analyse again. Now the SVM clears it, but every step up risks missing a sick child.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-17.png`,
              alt: 'Demo slide with a screenshot of the app and the three demo steps.',
            },
          ],
        },
        {
          heading: 'Slide 18: Key takeaways',
          paragraphs: [
            'To conclude. On this dataset the CNN clearly beat the SVM, at an inference cost that’s still negligible. Validation must mirror deployment: even patient-grouped cross-validation overstated specificity by 25 points for the CNN and 55 for the SVM. Explainability exposed a shortcut, but making the heatmaps look right made the model worse. And deployment must be decision support, with local calibration and monitoring. If I did this again, I’d get a second hospital’s data first, set the threshold on validation data, use nested cross-validation and several random seeds, and try lung segmentation instead of a fixed crop. Thank you for listening.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-slide-18.png`,
              alt: 'Slide with four takeaways and what I would do differently.',
            },
          ],
        },
      ],
      references: [
        'Cortes, C. and Vapnik, V. (1995) ‘Support-vector networks’, Machine Learning, 20(3), pp. 273–297.',
        'Dalal, N. and Triggs, B. (2005) ‘Histograms of oriented gradients for human detection’, IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 1, pp. 886–893.',
        'DeGrave, A.J., Janizek, J.D. and Lee, S.-I. (2021) ‘AI for radiographic COVID-19 detection selects shortcuts over signal’, Nature Machine Intelligence, 3, pp. 610–619.',
        'Geirhos, R. et al. (2020) ‘Shortcut learning in deep neural networks’, Nature Machine Intelligence, 2, pp. 665–673.',
        'He, K. et al. (2016) ‘Deep residual learning for image recognition’, IEEE Conference on Computer Vision and Pattern Recognition (CVPR), pp. 770–778.',
        'Kermany, D.S. et al. (2018) ‘Identifying medical diagnoses and treatable diseases by image-based deep learning’, Cell, 172(5), pp. 1122–1131.e9. Data: Mendeley Data. Available at: https://doi.org/10.17632/rscbjbr9sj.2',
        'Loshchilov, I. and Hutter, F. (2019) ‘Decoupled weight decay regularization’, International Conference on Learning Representations (ICLR).',
        'McNemar, Q. (1947) ‘Note on the sampling error of the difference between correlated proportions or percentages’, Psychometrika, 12, pp. 153–157.',
        'Paszke, A. et al. (2019) ‘PyTorch: an imperative style, high-performance deep learning library’, Advances in Neural Information Processing Systems (NeurIPS), 32.',
        'Pedregosa, F. et al. (2011) ‘Scikit-learn: machine learning in Python’, Journal of Machine Learning Research, 12, pp. 2825–2830.',
        'Rajaraman, S. et al. (2018) ‘Visualization and interpretation of convolutional neural network predictions in detecting pneumonia in pediatric chest radiographs’, Applied Sciences, 8(10), 1715.',
        'Ribeiro, M.T., Singh, S. and Guestrin, C. (2016) ‘“Why should I trust you?” Explaining the predictions of any classifier’, Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, pp. 1135–1144.',
        'Selvaraju, R.R. et al. (2017) ‘Grad-CAM: visual explanations from deep networks via gradient-based localization’, IEEE International Conference on Computer Vision (ICCV), pp. 618–626.',
        'World Health Organization (2022) Pneumonia in children. Fact sheet, 11 November. Available at: https://www.who.int/news-room/fact-sheets/detail/pneumonia',
        'Zech, J.R. et al. (2018) ‘Variable generalization performance of a deep learning model to detect pneumonia in chest radiographs: a cross-sectional study’, PLOS Medicine, 15(11), e1002683.',
        'Zuiderveld, K. (1994) ‘Contrast limited adaptive histogram equalization’, in Heckbert, P. (ed.) Graphics Gems IV. San Diego: Academic Press, pp. 474–485.',
      ],
    },
    {
      label: 'Implementation',
      sections: [
        {
          heading: 'From question to two comparable pipelines',
          paragraphs: [
            'The whole study is one Jupyter notebook, run locally on an RTX 5070 Ti laptop GPU with PyTorch 2.11. Every image is decoded once, converted to 8-bit greyscale, resized to 224×224 and cached as a single uint8 array, so both models read exactly the same pixels. I squashed the aspect ratio rather than centre-cropping, because a crop could cut off the lung bases or apices.',
            'Patient IDs come from the filenames. Person numbers restart for each pneumonia subtype, so person12_bacteria and person12_virus are different children; treating them as one patient would have created 170 false overlaps between the official train and test sets. With the corrected ID, the two sets share no patients.',
          ],
        },
        {
          heading: 'The classical model',
          paragraphs: [
            'Each image is reduced to 128×128 and described by HOG (16-pixel cells, 2×2 blocks, 9 orientations: 1,764 features) plus a 32-bin intensity histogram, because pneumonia shows as whiter, more opaque lung fields. A scikit-learn Pipeline standardises the features, keeps 95% of the variance with PCA (455 components) and fits a class-balanced RBF SVM. C and gamma were grid-searched on the same patient-grouped folds, selecting on F1; scaling and PCA sit inside the pipeline, so they are refitted on every training fold. The best setting was C = 10 with gamma = scale, and the final fit took about 14 seconds on a CPU.',
          ],
        },
        {
          heading: 'The deep model',
          paragraphs: [
            'The CNN is an ImageNet-pretrained ResNet-18 (11.2 million parameters) with all layers fine-tuned. The greyscale image is repeated to three channels and normalised with ImageNet statistics. Training uses class-weighted cross-entropy, AdamW (learning rate and weight decay 1e-4) with cosine decay, batches of 64 and mixed precision. Augmentation mimics positioning and exposure differences (±10° rotation, ±5% shift, 0.9–1.1 zoom, ±15% brightness and contrast) but never flips, because the heart sits on the left.',
            'One engineering choice made the experiments practical: the whole 290 MB dataset is kept on the GPU and augmented there in batches. This avoided Windows DataLoader multiprocessing problems inside the notebook and cut an epoch to a few seconds, so five-fold cross-validation of the CNN took three minutes.',
            'In each fold I kept the epoch with the lowest validation loss. The best epochs were 7, 5, 11, 7 and 12, so the final model was trained on all 5,232 training images for the median, seven epochs; the test set was never used to choose anything about the model.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-learning-curves.png`,
              alt: 'Left: training loss falling towards zero in all five folds while validation loss flattens higher. Right: validation F1 per fold between 0.967 and 0.996 over 12 epochs.',
              caption: 'ResNet-18 learning curves across the five folds. The gap between training and validation loss is the overfitting that early stopping guards against.',
            },
          ],
        },
        {
          heading: 'The demo app',
          paragraphs: [
            'The same single-image function a deployment API would wrap drives a small interactive app. It scores an uploaded X-ray with both models, shows the CNN’s Grad-CAM overlay and lets the user move the decision threshold, which I used in the recorded demo to show the trade-off between false alarms and missed cases.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-demo-app.png`,
              alt: 'Demo app with a healthy child’s X-ray: the SVM scores 0.78 and flags pneumonia, while ResNet-18 scores 0.02 and clears it, with a faint Grad-CAM overlay and a threshold slider at 0.5.',
              caption: 'The demo on a healthy test image: the SVM raises a false alarm and the CNN correctly clears the child.',
            },
          ],
        },
      ],
      references: [
        'He, K. et al. (2016) ‘Deep residual learning for image recognition’, IEEE Conference on Computer Vision and Pattern Recognition (CVPR), pp. 770–778.',
        'Dalal, N. and Triggs, B. (2005) ‘Histograms of oriented gradients for human detection’, IEEE Conference on Computer Vision and Pattern Recognition (CVPR), 1, pp. 886–893.',
        'Loshchilov, I. and Hutter, F. (2019) ‘Decoupled weight decay regularization’, International Conference on Learning Representations (ICLR).',
      ],
    },
    {
      label: 'Validation and results',
      sections: [
        {
          heading: 'Validation design',
          paragraphs: [
            'Validation had two levels. Within the training set I used StratifiedGroupKFold with five folds: every image of a child stays in one fold, and each fold keeps the 74% pneumonia rate. Both models use identical folds, so their fold scores are paired. The official 624-image test set, from 428 children who never appear in training, was held back for the final comparison. I discarded the 16-image validation split from the Kaggle version, which is far too small to estimate anything.',
          ],
        },
        {
          heading: 'Cross-validation against the held-out test set',
          tables: [
            {
              headers: ['Model', 'Data', 'Accuracy', 'Precision', 'Recall', 'Specificity', 'F1', 'ROC-AUC'],
              rows: [
                ['SVM (HOG)', '5-fold CV', '0.976', '0.983', '0.984', '0.952', '0.984', '0.997'],
                ['SVM (HOG)', 'Test', '0.776', '0.736', '1.000', '0.402', '0.848', '0.938'],
                ['ResNet-18', '5-fold CV', '0.990', '0.997', '0.990', '0.990', '0.993', '0.999'],
                ['ResNet-18', 'Test', '0.899', '0.866', '0.992', '0.744', '0.925', '0.967'],
              ],
              caption: 'Cross-validation means against the held-out test set, at a 0.5 threshold. Fold standard deviations were 0.008 or less, apart from SVM specificity (0.023).',
            },
          ],
          paragraphs: [
            'Recall held up, but specificity collapsed on the test set. Because the folds are grouped by patient, the obvious leakage is ruled out; the most likely cause is a distribution shift between the training images and the separately collected test images. AUC stayed high, so the models still rank cases well, and the failure is mainly one of threshold and calibration.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-roc-threshold.png`,
              alt: 'Left: ROC curves on the test set, ResNet-18 AUC 0.967 and SVM AUC 0.938. Right: recall stays near 1.0 for both models across thresholds, while specificity rises with the threshold and is much lower for the SVM.',
              caption: 'ROC curves and the threshold trade-off on the held-out test set.',
            },
          ],
        },
        {
          heading: 'Comparing the models',
          paragraphs: [
            'McNemar’s exact test on the 624 test images found 82 images that only the CNN classified correctly and 5 that only the SVM did (p = 5.1 × 10⁻¹⁹). The CNN raised 60 false alarms against the SVM’s 140, at the cost of missing 3 of 390 pneumonia cases against none.',
          ],
          tables: [
            {
              headers: ['', 'SVM (HOG)', 'ResNet-18'],
              rows: [
                ['Final training time', '13.8 s (CPU)', '26.3 s (GPU)'],
                ['Inference latency per image', '3.1 ms (CPU)', '13 ms (CPU) / 2.2 ms (GPU)'],
                ['Model size', '7.4 MB', '44.8 MB'],
                ['Learned parameters', '1,116 support vectors × 455 PCA dimensions', '11.2 million'],
                ['Pre-training needed', 'None', 'ImageNet weights'],
              ],
              caption: 'Practical trade-offs measured in the notebook.',
            },
          ],
        },
        {
          heading: 'Placing the results in context',
          paragraphs: [
            'Published models report results on the same test set: Kermany et al. (2018) 0.932 sensitivity and 0.901 specificity with Inception-v3, and Rajaraman et al. (2018) 0.962 for both with a VGG16 cropped to the lungs. My CNN’s AUC (0.967) matches Kermany’s (0.968), so the difference is mostly the operating point. At Kermany’s sensitivity my CNN would reach about 0.91 specificity, but that threshold was chosen on the test set, so I present it only as an illustration.',
          ],
        },
      ],
      references: [
        'Kermany, D.S. et al. (2018) ‘Identifying medical diagnoses and treatable diseases by image-based deep learning’, Cell, 172(5), pp. 1122–1131.e9.',
        'McNemar, Q. (1947) ‘Note on the sampling error of the difference between correlated proportions or percentages’, Psychometrika, 12, pp. 153–157.',
        'Rajaraman, S. et al. (2018) ‘Visualization and interpretation of convolutional neural network predictions in detecting pneumonia in pediatric chest radiographs’, Applied Sciences, 8(10), 1715.',
      ],
    },
    {
      label: 'Explainability, bias and mitigation',
      sections: [
        {
          heading: 'Shortcut learning',
          paragraphs: [
            'Grad-CAM on the CNN’s last convolutional block showed its pneumonia evidence leaning towards the corners and edges. On the 447 test images it flagged, 42.3% of the attention fell outside a central box covering 64% of the image, against 36.1% if the attention were spread evenly; for its false alarms the figure was 45.6%. Its five most confident false alarms all lit up burnt-in text: the KV58 or KV59 exposure label (three), a timestamp (one) or the R side marker (one). This matches the shortcut learning described by Geirhos et al. (2020) and reported for chest X-ray models by Zech et al. (2018) and DeGrave et al. (2021). Most attention was still central, so this is a bias in the model rather than a total failure.',
            'LIME, which treats both models the same way, found that influential patches often covered background, borders and the abdomen for both. The SVM’s HOG features respond to strong edges anywhere, so it has no notion of a lung at all.',
          ],
        },
        {
          heading: 'Where the errors fall',
          paragraphs: [
            'I checked recall by pneumonia subtype and specificity by acquisition batch and brightness, with exact Clopper–Pearson 95% intervals because the groups are small. Bacterial and viral cases were both detected almost perfectly. The errors fell on healthy children: the CNN cleared 81% of the IM batch but 72% of NORMAL2, though the intervals overlap, and NORMAL2 makes up 71% of the healthy test images against 56% in training, which may explain part of the drop from validation to test.',
            'A gamma stress test gave clearer evidence. Brightening the test images (gamma 0.5) lowered specificity from 0.744 to 0.585 for the CNN and from 0.402 to 0.248 for the SVM, which suggests both have partly learned that brighter means pneumonia. A hospital whose equipment produces brighter images would see more healthy children flagged.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-exposure-stress.png`,
              alt: 'F1, recall and specificity for both models across gamma values from 0.5 to 2.0. Recall stays near 1.0; specificity drops as images get brighter, and the CNN stays well above the SVM.',
              caption: 'Exposure stress test: gamma below 1 brightens the images, gamma above 1 darkens them.',
            },
          ],
        },
        {
          heading: 'Trying to remove the shortcut',
          paragraphs: [
            'As an exploratory experiment, designed after seeing the test-set heatmaps, I cropped 10% from each border to remove most of the text, applied CLAHE to standardise contrast, and retrained both models on the same folds. The CNN kept every hyperparameter; the SVM was re-tuned because its features changed.',
            'The CNN’s mean heatmap moved onto the lung fields, but its false alarms rose from 60 to 91 (McNemar p = 1.1 × 10⁻⁶) and it was no more robust to brightness. The SVM barely changed. The test set comes from the same hospital and shares its labels, so on this data the shortcut genuinely helps. Whether removing it would help at another hospital can only be shown with external data.',
          ],
          figures: [
            {
              src: `${assetPath}/presentation-mitigation-gradcam.png`,
              alt: 'Mean Grad-CAM maps for normal and pneumonia images and one healthy child, before and after border crop and CLAHE. After mitigation, the pneumonia map peaks over the lungs instead of the corners.',
              caption: 'Mean Grad-CAM before (top) and after (bottom) the crop and CLAHE.',
            },
            {
              src: `${assetPath}/presentation-mitigation-results.png`,
              alt: 'Bar charts of test F1, recall and specificity for both models with baseline and mitigated inputs. CNN specificity falls from 0.74 to 0.61; the SVM is almost unchanged.',
              caption: 'Test results with baseline and mitigated inputs.',
            },
          ],
        },
      ],
      references: [
        'DeGrave, A.J., Janizek, J.D. and Lee, S.-I. (2021) ‘AI for radiographic COVID-19 detection selects shortcuts over signal’, Nature Machine Intelligence, 3, pp. 610–619.',
        'Geirhos, R. et al. (2020) ‘Shortcut learning in deep neural networks’, Nature Machine Intelligence, 2, pp. 665–673.',
        'Ribeiro, M.T., Singh, S. and Guestrin, C. (2016) ‘“Why should I trust you?” Explaining the predictions of any classifier’, Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, pp. 1135–1144.',
        'Selvaraju, R.R. et al. (2017) ‘Grad-CAM: visual explanations from deep networks via gradient-based localization’, IEEE International Conference on Computer Vision (ICCV), pp. 618–626.',
        'Zech, J.R. et al. (2018) ‘Variable generalization performance of a deep learning model to detect pneumonia in chest radiographs: a cross-sectional study’, PLOS Medicine, 15(11), e1002683.',
        'Zuiderveld, K. (1994) ‘Contrast limited adaptive histogram equalization’, in Heckbert, P. (ed.) Graphics Gems IV. San Diego: Academic Press, pp. 474–485.',
      ],
    },
    {
      label: 'Critical evaluation',
      sections: [
        {
          heading: 'What the project showed',
          paragraphs: [
            'The comparison gave a clear answer: on this dataset the CNN was significantly better than the SVM, more robust to exposure changes and still cheap to serve on a CPU. The usual argument for a classical model, that it is easier to interpret, did not hold here, because after PCA and an RBF kernel the SVM was just as opaque and could only be explained with LIME. Its real advantages were cost and independence from pre-training, and those did not outweigh flagging about 60% of healthy children.',
            'The more important finding was about evaluation rather than models. Patient-grouped cross-validation, which I had designed specifically to avoid leakage, still overstated specificity by 25 points for the CNN and 55 for the SVM. Without the untouched test set I would have reported two near-perfect models. Earlier units treated a single accuracy figure with suspicion; this project showed that even a careful validation scheme can be wrong when the data it is drawn from does not resemble the data the model will meet.',
          ],
        },
        {
          heading: 'Explainability is a diagnostic, not a fix',
          paragraphs: [
            'Grad-CAM was the most useful tool in the project, because it explained the false alarms that the metrics only counted. But the mitigation experiment taught me the limit of that kind of evidence. The heatmaps after cropping looked exactly as a radiologist would want, yet the model got worse. A plausible explanation is not proof of a better model, and if I had judged the fix by its heatmaps alone I would have recommended the weaker model. For deployment, that also matters for automation bias: a convincing overlay could reassure a clinician about a wrong decision.',
          ],
        },
        {
          heading: 'Limitations',
          paragraphs: [
            'Every conclusion about generalisation rests on one test set from the same hospital, and the test results were also used to choose the final model, so they are slightly optimistic for it. Tuning was asymmetric: the SVM was grid-searched while the CNN used common default settings. Each model was trained with a single seed, all results use a 0.5 threshold, LIME was run on only five images and Grad-CAM works on a coarse 7×7 grid. The dataset has no sex or ethnicity attributes, so fairness across those groups could not be tested at all.',
          ],
        },
        {
          heading: 'What I would do differently',
          paragraphs: [
            'I would obtain a second hospital’s data at the start, so that the question of generalisation could be answered rather than flagged. I would set the decision threshold on validation data for a target sensitivity, use nested cross-validation and several seeds for both models, and tune the CNN as carefully as the SVM. Instead of a fixed border crop, I would segment the lungs, which would allow a direct measure of how much attention falls inside them and a better-targeted way of removing the shortcut.',
          ],
        },
      ],
    },
    {
      label: 'Evaluation against the Unit 6 team project',
      sections: [
        {
          heading: 'Two projects with the same shape',
          paragraphs: [
            'The Unit 6 team project and this Unit 11 project ask different questions about different data, but they have the same structure. Each compares two families of model (linear regression against a random forest; an SVM against a CNN), holds back a test set and then asks whether the better model is good enough to use. That makes the Unit 6 report a fair starting point for judging what changed. Its critical evaluation ended with three things to carry forward: compare models with cross-validation and report the spread before declaring a winner, explain a weak result rather than just reporting it, and check every figure against the final run. The table below sets the two projects side by side.',
          ],
          tables: [
            {
              headers: ['', 'Unit 6 team project', 'Unit 11 individual project'],
              rows: [
                ['Question', 'Can listing profiles improve Airbnb price prediction?', 'Is a CNN better than a classical model for paediatric pneumonia, and is it safe to deploy?'],
                ['Task and data', 'Clustering and regression on 48,895 tabular listings', 'Binary image classification on 5,856 chest X-rays'],
                ['Validation', 'One 90/10 split, no cross-validation', 'Patient-grouped 5-fold CV, then an untouched test set'],
                ['Comparing models', 'Point metrics; a winner declared on a $0.16 MAE gap', 'Paired folds, fold spread and McNemar’s exact test'],
                ['Weak result', 'R² of 0.13, answered with a calibrated price range', 'Specificity collapse on the test set, traced to distribution shift and a shortcut'],
                ['Ethics', 'Review selection bias noted as a limitation', 'Shortcut learning, error rates by subgroup, human-in-the-loop deployment'],
                ['Work', 'Shared: I did the data analysis and the price prediction modelling and testing', 'All of it, from dataset choice to narration'],
              ],
              caption: 'The two projects compared.',
              wrap: true,
            },
          ],
        },
        {
          heading: 'What improved',
          paragraphs: [
            'Validation is the clearest change. In Unit 6 I could not say whether the global model really beat the per-cluster models, because one split cannot show how much a score moves by chance. Here every model was cross-validated on the same patient-grouped folds, the fold standard deviations were reported, and the final comparison used McNemar’s test, which Dietterich (1998) recommends for comparing two classifiers on one test set. The claim that the CNN is better is therefore supported in a way the Unit 6 claim was not. Grouping by patient also dealt with the leakage risk that Kapoor and Narayanan (2023) identify as one of the most common reasons published machine learning results fail to reproduce.',
            'Weak results were also handled better. In Unit 6 the negative baseline R² was reported but not explained. Here the drop from cross-validation to test was the centre of the analysis: I tested why it happened with Grad-CAM, LIME, subgroup error rates and an exposure stress test, and the deployment recommendation was built around it. Finally, because one notebook produced every figure and table, the figure–text mismatch found in the Unit 6 report could not happen again.',
          ],
        },
        {
          heading: 'What stayed the same',
          paragraphs: [
            'In both projects the data, not the model, set the limit. The Airbnb data described supply but not the property or demand, so no model could predict price well; the X-ray data came from one hospital, so no experiment could show whether the CNN generalises. Both projects ended by recommending more data rather than a better algorithm. That suggests a lesson I have not yet acted on: the data question has to be settled at the start, before the models are chosen.',
            'Some weaknesses also carried over. Both projects relied on single random seeds, and in both the test set did more than test. In Unit 6 it was the only basis for the comparison; here it was also used to choose the final model and to design the mitigation experiment. I reported that as a limitation this time, which I did not do in Unit 6, but reporting it is not the same as avoiding it.',
          ],
        },
        {
          heading: 'Working in a team and working alone',
          paragraphs: [
            'In Unit 6 my work began where the data analysis began and ended at the price prediction results. The clustering was done by teammates, and my prediction experiments took the clusters as given. The finding that they carried almost no price information was therefore never fed back into how the segments were built or presented. Working alone in Unit 11 meant every decision was mine, from the patient ID fix to the threshold, and I could follow a problem through from the data to the deployment advice. The cost was that nobody checked my work. The team project had several readers, while this project’s errors could only be caught by me. Keeping the test set untouched and stating the limits plainly were partly a substitute for that review. In future I would also ask a peer to review individual work before it is submitted.',
          ],
        },
      ],
      references: [
        'Dietterich, T.G. (1998) ‘Approximate statistical tests for comparing supervised classification learning algorithms’, Neural Computation, 10(7), pp. 1895–1923.',
        'Kapoor, S. and Narayanan, A. (2023) ‘Leakage and the reproducibility crisis in machine-learning-based science’, Patterns, 4(9), 100804.',
      ],
    },
  ],
};
