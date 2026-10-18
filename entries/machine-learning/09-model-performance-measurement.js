const assetPath = '../../assets/machine-learning';

export default {
  label: 'Model Performance Measurement: AUC and R²',
  text: 'Unit 11 · Practical activity: run the model_Performance_Measurement notebook, change different parameters and observe their effect on AUC and R². I changed the settings of the models, the data, the train/test split and the predictions themselves, to find out what each metric actually responds to and what it hides.',
  sections: [
    {
      heading: 'The notebook',
      paragraphs: [
        'The notebook is a tour of scikit-learn’s evaluation metrics (Pedregosa et al., 2011). For classification it computes a confusion matrix, F1 with each averaging option, accuracy, precision, recall, a classification report, log loss and ROC AUC. The AUC examples are a logistic regression on the breast cancer dataset, a one-vs-rest logistic regression on iris, and a ROC curve for a linear SVM on iris after 800 columns of random noise have been added to the four real measurements to make the problem harder. For regression it computes MSE, MAE and R² for four hand-written predictions.',
        'I ran it in Python 3.12 with scikit-learn 1.9.1. Every cell reproduced the saved results except one. The multiclass AUC cell fails because the liblinear solver no longer accepts three classes, so I wrapped it in OneVsRestClassifier, as the error message suggests. SVC(probability=True) now raises a deprecation warning; the ROC cell only uses decision_function, which probability does not affect, so I dropped it. Three things in the notebook need care when reading it. The cell headed “RMSE” computes mean squared error (0.375); the RMSE is its square root, 0.612. The breast cancer AUC of 0.9947 is measured on the same data the model was trained on. And the R² cell has no data of its own: it silently reuses y_true and y_pred from the cell above.',
      ],
      tables: [
        {
          headers: ['Metric', 'Notebook example', 'Result'],
          rows: [
            ['Confusion matrix (SVC on make_classification)', '25 test points', 'TN 12, FP 1, FN 2, TP 10'],
            ['ROC AUC, breast cancer', 'logistic regression, training data', '0.9947'],
            ['ROC AUC per class, noisy iris', 'linear SVM, 800 noise features', 'setosa 0.913, versicolor 0.604, virginica 0.787, micro 0.728'],
            ['Log loss', 'four spam/ham probabilities', '0.216'],
            ['MSE / RMSE', 'y_true = [3, −0.5, 2, 7], y_pred = [2.5, 0, 2, 8]', '0.375 / 0.612'],
            ['MAE', 'same', '0.500'],
            ['R²', 'same', '0.9486'],
          ],
          caption: 'Table 1. The notebook’s baseline results, which I reproduced before changing anything.',
        },
      ],
      links: [
        { href: `${assetPath}/unit11-experiments.py`, label: 'Download the experiment script (Python)' },
        { href: `${assetPath}/unit11-figures.py`, label: 'Download the figure script (Python)' },
      ],
    },
    {
      heading: 'AUC: what it measures',
      paragraphs: [
        'A ROC curve plots the true positive rate against the false positive rate as the decision threshold moves from strict to lenient. The area under it (AUC) has a simple meaning: it is the probability that the model gives a randomly chosen positive example a higher score than a randomly chosen negative one (Hanley and McNeil, 1982; Fawcett, 2006). An AUC of 1 means the scores separate the classes perfectly and 0.5 means they are no better than chance. Because it depends only on the order of the scores, AUC does not depend on any single threshold. I changed four groups of settings to see what moves it.',
      ],
    },
    {
      heading: 'AUC experiment 1: the number of noise features',
      paragraphs: [
        'The notebook adds 200 × 4 = 800 random columns to iris. I varied the number from 0 to 2,000 and, because a single split of 150 flowers is small, repeated every setting with 20 different random seeds.',
      ],
      tables: [
        {
          headers: ['Noise features', 'Setosa', 'Versicolor', 'Virginica', 'Micro-average', 'Accuracy'],
          rows: [
            ['0', '1.000', '0.786 ± 0.042', '0.998', '0.961 ± 0.012', '0.907'],
            ['20', '1.000', '0.653 ± 0.070', '0.961', '0.882 ± 0.029', '0.769'],
            ['100', '1.000', '0.551 ± 0.045', '0.870', '0.806 ± 0.030', '0.655'],
            ['200', '0.991', '0.543 ± 0.068', '0.854', '0.802 ± 0.031', '0.643'],
            ['400', '0.971', '0.541 ± 0.062', '0.831', '0.781 ± 0.038', '0.619'],
            ['800 (notebook)', '0.919', '0.496 ± 0.066', '0.770', '0.719 ± 0.031', '0.546'],
            ['2,000', '0.828', '0.515 ± 0.083', '0.697', '0.658 ± 0.048', '0.477'],
          ],
          caption: 'Table 2. Test AUC (mean over 20 seeds, with the standard deviation for the two most variable columns) for the notebook’s linear SVM as random noise features are added. Accuracy is the share of test flowers whose highest-scoring class is correct.',
        },
      ],
      figures: [
        {
          src: `${assetPath}/unit11-auc-noise.png`,
          alt: 'Left: micro-average ROC curves for seed 0. With no noise features the curve rises steeply into the top-left corner (AUC 0.94); with 20, 800 and 2,000 noise features it sinks progressively towards the diagonal (AUC 0.82, 0.73 and 0.67). Right: AUC per class against the number of noise features, averaged over 20 seeds with a shaded band of one standard deviation. Setosa stays near 1.0 until 400 features and then falls to 0.83. Virginica falls steadily from 1.0 to 0.70. Versicolor starts at only 0.79 and falls to about 0.5, the chance line, by 800 features.',
          caption: 'Figure 1. Left: the ROC curve flattens towards the chance diagonal as noise is added. Right: AUC per class, mean ± 1 standard deviation over 20 seeds. The grey band marks the notebook’s setting.',
        },
      ],
      paragraphs: [
        'Adding noise lowered AUC for every class, but not equally. Setosa’s petals are so different from the other two species that it kept an AUC near 1 until 400 noise columns. Versicolor fell to chance at the notebook’s own setting: an average AUC of 0.496 means its scores carried no information at all. The notebook’s single run reported 0.604 for versicolor, which looks like a weak but real signal, yet across 20 seeds it was luck. A single run also hid the trend in places. With seed 0 the micro-average was higher with 200 noise features (0.825) than with 20 (0.817), even though the 20-seed average fell from 0.882 to 0.802 over the same change. The standard deviation of 0.03 to 0.08 is as large as many of the differences I would otherwise have reported.',
        'The reason noise hurts is that the training half contains only 75 flowers. With 800 random columns, the SVM can always find some combination of noise that separates those 75 flowers perfectly, and it has no way to tell that combination from the four real measurements. It learns the noise, and the noise does not carry over to the test half.',
      ],
    },
    {
      heading: 'AUC experiment 2: the size of the test split',
      paragraphs: [
        'The notebook sends half the data to the test set. Changing test_size trades training data against the reliability of the test score.',
      ],
      tables: [
        {
          headers: ['test_size', 'Training flowers', 'Micro-average AUC', 'Versicolor AUC'],
          rows: [
            ['0.2', '120', '0.765 ± 0.053', '0.532 ± 0.088'],
            ['0.3', '105', '0.746 ± 0.044', '0.494 ± 0.078'],
            ['0.5 (notebook)', '75', '0.719 ± 0.031', '0.496 ± 0.066'],
            ['0.7', '45', '0.683 ± 0.037', '0.509 ± 0.057'],
            ['0.9', '15', '0.579 ± 0.038', '0.496 ± 0.063'],
          ],
          caption: 'Table 3. Effect of the test split on AUC with 800 noise features (20 seeds).',
        },
      ],
      paragraphs: [
        'More training data raised AUC, from 0.579 with 15 training flowers to 0.765 with 120, because the model had more real examples to set against the noise. But the spread across seeds also grew as the test set shrank (0.031 at a 50% test split, 0.053 at 20%): with only 30 test flowers, a few lucky or unlucky splits move the score a lot. This is the practical argument for cross-validation, which uses every example for both training and testing.',
      ],
    },
    {
      heading: 'AUC experiment 3: the kernel and C',
      paragraphs: [
        'I then changed the SVM itself. With 800 noise features, C made almost no difference: C = 1 and C = 100 gave identical results (micro-average 0.719), and C = 0.001 gave 0.702. With 75 points in 804 dimensions the training data is already perfectly separable, so the penalty on misclassified training points that C controls is never used. Switching to an RBF kernel made things worse (0.664), because a more flexible model has even more freedom to fit the noise.',
        'Without the noise, the result reversed. The linear SVM gave versicolor an AUC of only 0.786 even on clean data, while the RBF kernel gave 0.990. Versicolor’s measurements lie between those of setosa and virginica, so a single straight line cannot separate it from both of the others at once, which is what one-vs-rest asks for. Versicolor’s low AUC in the notebook is therefore partly a limitation of the model, not of the data: the noise made it worse, but the linear model was never able to do this part of the task well.',
      ],
    },
    {
      heading: 'AUC experiment 4: training data, regularisation, scores and class balance',
      paragraphs: [
        'For the breast cancer example I held out 30% of the data for testing and also ran 10-fold cross-validation, then varied the logistic regression’s regularisation strength C with and without standardising the features.',
      ],
      tables: [
        {
          headers: ['C', 'Unscaled: train AUC', 'Unscaled: test AUC', 'Scaled: train AUC', 'Scaled: test AUC', 'Scaled: 10-fold CV AUC'],
          rows: [
            ['0.0001', '0.9672', '0.9505', '0.9868', '0.9651', '0.9823 ± 0.0190'],
            ['0.01', '0.9850', '0.9787', '0.9947', '0.9860', '0.9932 ± 0.0105'],
            ['1 (notebook)', '0.9953', '0.9914', '0.9974', '0.9956', '0.9960 ± 0.0052'],
            ['100', '0.9970', '0.9871', '0.9999', '0.9947', '0.9873 ± 0.0144'],
            ['1,000', '0.9972', '0.9869', '1.0000', '0.9928', '0.9872 ± 0.0142'],
          ],
          caption: 'Table 4. Breast cancer: logistic regression AUC on training data, a 30% held-out test set and 10-fold cross-validation.',
        },
      ],
      paragraphs: [
        'The pattern from Unit 3 returned. As C increased (weaker regularisation), training AUC kept rising until, with scaled features and C = 1,000, it reached a perfect 1.0000. Test and cross-validated AUC peaked at C = 1 and then fell. Standardising the features helped at every C, because unscaled features with very different ranges are penalised unequally. The notebook’s training AUC of 0.9947 happens to be close to the held-out 0.9914, but only because this dataset is easy; with C = 1,000 the training score would have claimed perfection. All of the differences here are small, around 0.01, and smaller than the fold-to-fold spread of cross-validation, so on this dataset AUC is close to its ceiling and cannot separate the models clearly.',
        'Next I changed what was passed to roc_auc_score. Probabilities, the raw decision function and probabilities raised to the tenth power all gave exactly 0.9914, because they rank the patients in the same order. Passing hard 0/1 predictions from predict() dropped AUC to 0.9219: the ranking collapses to two values, so the ROC curve has only one operating point joined to the corners by straight lines. Moving the decision threshold from 0.1 to 0.9 changed accuracy (0.936 to 0.906) and F1 (0.951 to 0.919) but, by definition, did not change AUC at all.',
        'Finally, I generated a synthetic two-class problem and made the positive class rarer. As the minority share fell from 50% to 1%, accuracy rose from 0.926 to 0.995, but a model that always predicted the majority would have scored 0.990. F1 for the minority class fell from 0.925 to 0.700. AUC stayed between 0.965 and 0.978 throughout. AUC is not fooled by imbalance in the way accuracy is, but it does not reveal the problem either: with 1% positives, a small false positive rate still means many false alarms for each true case. Saito and Rehmsmeier (2015) recommend precision–recall curves instead of ROC curves for this situation, and the F1 column shows why.',
      ],
    },
    {
      heading: 'R²: what it measures',
      paragraphs: [
        'R² compares a model’s squared error with the squared error of always predicting the mean of the true values: R² = 1 − SSres / SStot. A value of 1 is a perfect fit, 0 is no better than predicting the mean, and anything below 0 is worse than that. Unlike RMSE and MAE, it has no units, which makes it easy to quote and easy to misread. I changed the predictions, the model and the data.',
      ],
    },
    {
      heading: 'R² experiment 1: the notebook’s four predictions',
      paragraphs: [
        'I edited the hand-written predictions in the notebook’s regression cells directly.',
      ],
      tables: [
        {
          headers: ['Change to y_pred (y_true = [3, −0.5, 2, 7])', 'MSE', 'RMSE', 'MAE', 'R²'],
          rows: [
            ['Notebook: [2.5, 0, 2, 8]', '0.375', '0.612', '0.500', '0.949'],
            ['Perfect predictions', '0', '0', '0', '1.000'],
            ['Every prediction +1', '1.000', '1.000', '1.000', '0.863'],
            ['Every error doubled', '1.500', '1.225', '1.000', '0.794'],
            ['One prediction off by 5, others perfect', '6.250', '2.500', '1.250', '0.144'],
            ['Always predict the mean (2.875)', '7.297', '2.701', '2.125', '0.000'],
            ['Always predict 0', '15.563', '3.945', '3.125', '−1.133'],
            ['True and predicted values × 10', '37.500', '6.124', '5.000', '0.949'],
            ['Same errors, y_true = [3, 2.5, 3, 3.5]', '0.375', '0.612', '0.500', '−2.000'],
          ],
          caption: 'Table 5. Regression metrics for edited versions of the notebook example.',
        },
      ],
      paragraphs: [
        'Three results stood out. First, doubling every error left MAE unchanged at 1.0 (the absolute errors 0.5, 0.5, 0 and 1 became 1, 1, 0 and 2, which average to 1) but quadrupled MSE, because squaring punishes large errors more. A single error of 5 cut R² from 0.95 to 0.14 even though three of the four predictions were perfect. Second, multiplying everything by 10 multiplied MSE by 100 and RMSE and MAE by 10, but left R² unchanged: R² ignores units, while RMSE is in the units of the target. Third, and most important, I kept exactly the same errors but made the true values closer together. MSE stayed at 0.375 and R² fell from 0.949 to −2.0. R² does not measure how close the predictions are; it measures how close they are compared with how spread out the true values are. A model can be very accurate and still have a negative R² if the target barely varies.',
      ],
    },
    {
      heading: 'R² experiment 2: model complexity and training set size',
      paragraphs: [
        'To change the model, I generated 30 training points from y = sin(2πx) plus random noise with a standard deviation of 0.3, fitted polynomials of increasing degree, and scored them on 1,000 fresh test points. With this much noise, the best R² any model could achieve on new data is 0.85.',
      ],
      figures: [
        {
          src: `${assetPath}/unit11-r2-complexity-and-range.png`,
          alt: 'Left: median training and test R² over 20 seeds against polynomial degree from 0 to 15. Both rise sharply to about 0.83 at degree 3. Training R² then keeps rising slowly to 0.89, above the dashed line marking the best possible test R² of 0.85. Test R² peaks at 0.82 around degree 5 and falls to 0.70 by degree 15. Right: bars of test R² for a straight-line model fitted to data from y = 2x + 1 plus noise, with x drawn from ranges 0 to 10, 0 to 5, 0 to 2, 0 to 1 and 0 to 0.5. R² falls from 0.97 to 0.90, 0.61, 0.29 and 0.10, while RMSE is 0.98 in every case.',
          caption: 'Figure 2. Left: training R² keeps improving with model complexity while test R² falls, and training R² ends above what is achievable on new data. Right: the correct model, the same noise and the same RMSE give very different R² depending only on the range of x.',
        },
      ],
      tables: [
        {
          headers: ['Training points (degree 9)', 'Training R²', 'Test R²', 'Test RMSE'],
          rows: [
            ['12', '0.961', '−2.992', '1.534'],
            ['15', '0.931', '−0.714', '1.014'],
            ['20', '0.895', '0.554', '0.512'],
            ['30', '0.883', '0.763', '0.375'],
            ['100', '0.856', '0.834', '0.312'],
            ['500', '0.845', '0.843', '0.306'],
          ],
          caption: 'Table 6. A degree-9 polynomial trained on different amounts of data (median of 20 seeds).',
        },
      ],
      paragraphs: [
        'Degrees 0 to 2 underfit (test R² 0.46 to 0.49 at most), and degree 3 captured the curve (0.82). Beyond degree 5, training R² kept rising and passed the 0.85 ceiling, which can only happen by fitting the noise, while test R² fell to 0.70 at degree 15. With only 12 training points, a degree-9 polynomial reached a training R² of 0.96 and a test R² of −2.99: three times worse than predicting the mean. The same model with 500 points scored 0.845 on training data and 0.843 on test data. Training R² rewards complexity whether or not it generalises, which is why it should never be reported on its own.',
      ],
    },
    {
      heading: 'R² experiment 3: noise, range and outliers',
      paragraphs: [
        'Next I kept the correct model (degree 3 with 500 training points) and changed only the noise. Test R² followed the theoretical ceiling, signal variance ÷ (signal variance + noise variance), almost exactly: 0.97 at noise 0.1, 0.67 at 0.5, 0.35 at 1.0 and 0.12 at 2.0, against ceilings of 0.98, 0.67, 0.33 and 0.11. Test RMSE matched the noise level each time. At noise 2.0 the model had found the right curve, yet its R² was 0.12. A low R² does not mean the model is wrong; it can mean the outcome is mostly unpredictable.',
        'I then fitted the true model (a straight line) to data from y = 2x + 1 with noise of standard deviation 1, changing only the range that x was drawn from (Figure 2, right). The RMSE was 0.98 in every case, because the noise was the same, but R² fell from 0.97 when x ran from 0 to 10 to 0.10 when it ran from 0 to 0.5. Narrowing the range reduces the spread of y, so the same errors make up a larger share of it. Two studies of the same relationship could therefore report very different R² values simply because one sampled a wider population.',
        'Finally, I added a single outlier to one of 100 test points. An outlier of +10 raised RMSE from 0.289 to 1.046 and cut R² from 0.855 to 0.348, while MAE only rose from 0.223 to 0.323. One bad point out of 100 halved R². Both R² and RMSE are built on squared errors, so they are dominated by the largest errors; MAE is not.',
      ],
    },
    {
      heading: 'R² experiment 4: a real dataset',
      paragraphs: [
        'To check these effects on real data, I used scikit-learn’s diabetes dataset (442 patients, ten measurements, disease progression after one year as the target) with a 30% test set and 10-fold cross-validation.',
      ],
      tables: [
        {
          headers: ['Model', 'Training R²', 'Test R²', 'Test RMSE', '10-fold CV R² (range)'],
          rows: [
            ['Linear, BMI only', '0.381', '0.231', '62.6', '0.302 (0.002 to 0.503)'],
            ['Linear, BMI + s5', '0.507', '0.318', '59.0', '0.417 (0.152 to 0.617)'],
            ['Linear, all 10 features', '0.554', '0.393', '55.7', '0.462 (0.231 to 0.686)'],
            ['Polynomial degree 2', '0.657', '0.225', '–', '–'],
            ['Polynomial degree 3', '0.931', '−22.873', '–', '–'],
            ['Degree 2 + Ridge (α = 0.1)', '0.553', '0.405', '–', '–'],
          ],
          caption: 'Table 7. Diabetes dataset. The target has a standard deviation of 77.0.',
        },
      ],
      paragraphs: [
        'Adding features raised R², but the best linear model still explained less than half the variation, and its RMSE of 55.7 is not far below the 77.0 standard deviation of the target. The cross-validation folds ranged from 0.23 to 0.69 for the same model, so the single test split (0.393) was just one draw from a wide distribution. A degree-3 polynomial reached a training R² of 0.93 and a test R² of −22.9, the most extreme overfitting I have seen in the module. Ridge regularisation with α = 0.1 brought the degree-2 model back to 0.405, slightly better than plain linear regression, which is the regression equivalent of the C setting in the breast cancer experiment.',
      ],
    },
    {
      heading: 'What I observed',
      paragraphs: [
        'Neither metric describes a model on its own. Both describe a model, a dataset and a test procedure together. AUC changed with the noise in the data, the size of the split and the random seed as much as with the model’s settings, and R² changed with the spread of the target and a single outlier as much as with the quality of the fit. The most useful single change I made was repeating each experiment with 20 seeds or 10 folds: it showed that the notebook’s versicolor AUC of 0.604 was luck and that a test R² of 0.393 could equally have been 0.23 or 0.69.',
        'AUC answers one specific question: how well does the model rank positives above negatives? It ignores the threshold, the calibration of the probabilities and the class balance. That made it stable across thresholds and imbalance, but it also meant AUC stayed at 0.97 while minority-class F1 fell to 0.70. It needs to be reported alongside a threshold-dependent metric chosen for the actual cost of each kind of error.',
        'R² answers a relative question: how much better than the mean is the model? That made it misleading in both directions. A correct model on noisy or narrow data scored 0.10, while an overfitted one scored 0.96 on its training data. RMSE, in the units of the target, was the more honest figure for how far off a prediction is likely to be, and MAE the more robust one when outliers are present. Chicco, Warrens and Jurman (2021) argue that R² is more informative than MSE, RMSE or MAE because it is bounded above by 1 and so can be compared across problems. My experiments suggest that this comparison only works when the targets have similar spreads, which is rarely true across different datasets.',
      ],
    },
    {
      heading: 'Reflection and learning outcomes',
      paragraphs: [
        'This activity connected most of the earlier units. In Unit 3 I saw training R² rise with polynomial degree while held-out error worsened; here the same thing happened with real data, ending at a test R² of −22.9. In Unit 9 the CNN’s overall accuracy hid large differences between classes; here the micro-average AUC hid that one iris species was at chance, and accuracy hid that a 1% minority class was being handled poorly. In both cases the per-class breakdown, not the headline number, showed where the model failed. And as in Units 7 and 9, results from a single random seed were not reliable enough to draw conclusions from.',
        'For the learning outcome on applying and critically evaluating machine learning algorithms, the practice I will follow is: never report a metric on training data; use cross-validation or repeated splits and report the spread; give classification results per class and with a threshold-dependent metric next to AUC; use precision–recall curves when the positive class is rare; and report RMSE or MAE with R², together with the standard deviation of the target so that readers can judge it. It also changed how I read published results. An AUC or R² quoted without the dataset, the split and the variation across runs cannot be compared with anything.',
        'The experiments also changed how I see the team project. We compared Airbnb price models on a single 90/10 split, and the global model beat experiment 4 by 0.002 in R²; the diabetes folds here ranged from 0.23 to 0.69 for one model, so a difference of that size says nothing. We also trained models within each cluster. The range experiment shows that a cluster’s narrower price range lowers R² even when the errors in dollars are the same, so per-cluster and global R² were not directly comparable, and MAE and RMSE in dollars were the fairer basis for that comparison. Choosing a metric is a decision about which errors matter, and the BCS Code of Conduct’s requirement not to misrepresent the quality of one’s work (BCS, 2022) applies to that choice as much as to the result.',
      ],
    },
  ],
  references: [
    'BCS, The Chartered Institute for IT (2022) BCS Code of Conduct. Swindon: BCS.',
    'Chicco, D., Warrens, M.J. and Jurman, G. (2021) ‘The coefficient of determination R-squared is more informative than SMAPE, MAE, MAPE, MSE and RMSE in regression analysis evaluation’, PeerJ Computer Science, 7, e623.',
    'Fawcett, T. (2006) ‘An introduction to ROC analysis’, Pattern Recognition Letters, 27(8), pp. 861–874.',
    'Hanley, J.A. and McNeil, B.J. (1982) ‘The meaning and use of the area under a receiver operating characteristic (ROC) curve’, Radiology, 143(1), pp. 29–36.',
    'Pedregosa, F. et al. (2011) ‘Scikit-learn: machine learning in Python’, Journal of Machine Learning Research, 12, pp. 2825–2830.',
    'Saito, T. and Rehmsmeier, M. (2015) ‘The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets’, PLoS ONE, 10(3), e0118432.',
  ],
};
