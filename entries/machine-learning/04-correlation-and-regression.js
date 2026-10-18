const assetPath = '../../assets/machine-learning';

export default {
  label: 'Correlation and Regression',
  text: 'Unit 3 · Practical activity: run the four notebooks covariance_pearson_correlation, linear_regression, multiple_linear_regression and polynomial_regression, then change the variables to see how the data points affect correlation and regression. The sub-entries cover each notebook in turn: what I changed, what happened and what it means. The last one links the results to the module’s learning outcomes.',
  sections: [
    {
      heading: 'Setup',
      paragraphs: [
        'I ran the notebooks in a local Python 3.12 environment (NumPy 2.5, SciPy 1.18, scikit-learn 1.9). Before changing anything, I ran each notebook unmodified to confirm that its original outputs could be reproduced. Two notebooks needed attention first. The linear regression notebook imports scipy.stats as stats but then calls stat.linregress and stat.pearsonr, so its first cell raises a NameError until the name is corrected. The multiple regression notebook reads cars.csv, which is not supplied with it. I rebuilt the 36-row cars dataset, and it reproduces the notebook’s coefficients and its prediction of 107.209 g exactly.',
        'The script below reruns every experiment in this entry and prints the figures quoted in the tables.',
      ],
      links: [
        { href: `${assetPath}/unit3-experiments.py`, label: 'Download the experiment script (Python)' },
        { href: `${assetPath}/unit3-cars.csv`, label: 'Download the cars dataset (CSV)' },
      ],
    },
  ],
  children: [
    {
      label: 'Covariance and Pearson correlation',
      sections: [
        {
          heading: 'Original notebook',
          paragraphs: [
            'The notebook draws 1,000 values for data1 from a normal distribution (mean 100, standard deviation 20). It then sets data2 = data1 + noise, where the noise has mean 50 and standard deviation 10. With seed(1), it reports a covariance of 389.755 and a Pearson correlation of 0.888.',
          ],
        },
        {
          heading: 'What I changed',
          paragraphs: [
            'I added a slope a and a noise level to the line that builds data2, so that data2 = a × data1 + (noise × randn(n) + 50). I then varied a, the noise level, the sample size n, the scale of data1 and the shape of the relationship, one at a time.',
          ],
          code: `def run(n=1000, a=1, noise=10, s=1):
    seed(s)
    data1 = 20 * randn(n) + 100
    data2 = a * data1 + (noise * randn(n) + 50)
    return data1, data2

for noise in [0, 5, 10, 20, 40, 80]:
    d1, d2 = run(noise=noise)
    print(noise, cov(d1, d2)[0][1], pearsonr(d1, d2)[0])`,
          figures: [
            {
              src: `${assetPath}/unit3-correlation-noise.png`,
              alt: 'Six scatter plots of data1 against data2. As noise rises from 0 to 80 the cloud widens and r falls from 1.000 to 0.252, while covariance stays between 385 and 421. A slope of −1 gives r = −0.883 and a slope of 0 gives r = 0.022.',
              caption: 'Figure 1. The same data1 with different noise levels and slopes (n = 1,000, seed 1).',
            },
          ],
          tables: [
            {
              headers: ['Change', 'Covariance', 'Pearson r'],
              rows: [
                ['Original (noise 10, slope 1)', '389.8', '0.888'],
                ['Noise 0', '385.3', '1.000'],
                ['Noise 5', '387.5', '0.968'],
                ['Noise 20', '394.2', '0.698'],
                ['Noise 40', '403.0', '0.446'],
                ['Noise 80', '420.7', '0.252'],
                ['Slope −1 (negative relationship)', '−380.9', '−0.883'],
                ['Slope 0 (independent variables)', '4.4', '0.022'],
                ['data1 × 10 (change of units)', '3,897.5', '0.888'],
              ],
              caption: 'Table 1. Effect of noise, slope and scale on covariance and correlation.',
            },
            {
              headers: ['Sample size n', 'r with seed 1', 'p-value', 'Range of r over 200 seeds'],
              rows: [
                ['5', '0.762', '0.134', '−0.300 to 0.998'],
                ['10', '0.971', '3.2 × 10⁻⁶', '0.414 to 0.991'],
                ['30', '0.916', '1.2 × 10⁻¹²', '0.790 to 0.974'],
                ['100', '0.894', '5.4 × 10⁻³⁶', '0.824 to 0.936'],
                ['1,000', '0.888', '< 10⁻³⁰⁰', '0.875 to 0.913'],
              ],
              caption: 'Table 2. The same underlying relationship estimated from samples of different sizes.',
            },
          ],
        },
        {
          heading: 'What I observed',
          paragraphs: [
            'Noise drives correlation, not covariance. As the noise rose from 0 to 80, r fell from 1.000 to 0.252, yet the covariance actually increased slightly, from 385 to 421. Covariance measures how the two variables move together in their original units, so it grows with the spread of data2 and cannot show how tight the relationship is. Multiplying data1 by 10 made this obvious: the covariance rose tenfold while r stayed at 0.888. Pearson’s r divides the covariance by both standard deviations, which makes it unit-free and comparable across datasets.',
            'The sign carries over directly. With a slope of −1, both values turned negative (r = −0.883), and with a slope of 0 they fell to roughly zero (r = 0.022).',
            'Small samples are unreliable. The true relationship never changed, but with n = 5 the estimated r ranged from −0.30 to 0.998 across 200 random seeds, and even the seed 1 result was not statistically significant (p = 0.134). By n = 1,000 the range had narrowed to 0.875–0.913.',
            'Two further tests showed where r can mislead. With n = 30 the correlation was 0.916. After I added a single outlier at (200, 40), it collapsed to 0.025. A relationship that was perfectly deterministic but U-shaped, y = (x − 100)², gave r = 0.008. Pearson’s r only measures linear association, so a value near zero means “no straight-line relationship”, not “no relationship”. Plotting the data before trusting the coefficient, as the notebook does with plt.scatter, is the safeguard.',
          ],
        },
      ],
    },
    {
      label: 'Linear regression',
      sections: [
        {
          heading: 'Original notebook',
          paragraphs: [
            'The notebook fits a straight line to 13 (x, y) points with scipy.stats.linregress. Once the stat/stats typo is corrected, it gives slope = −1.751, intercept = 103.11 and r = −0.759, and predicts y = 85.59 at x = 10.',
          ],
          code: `from scipy import stats   # notebook imports "stats" but calls "stat"

x = [5,7,8,7,2,17,2,9,4,11,12,9,6]
y = [99,86,87,88,111,86,103,87,94,78,77,85,86]

slope, intercept, r, p, std_err = stats.linregress(x, y)   # fixed: stat -> stats
corr, _ = stats.pearsonr(x, y)                             # fixed: stat -> stats`,
        },
        {
          heading: 'What I changed',
          paragraphs: [
            'I refitted the model after removing individual points, adding points that either followed or broke the trend, and reducing the dataset to its first five points. For each version I recorded the slope, r, R², the p-value and the prediction at x = 10.',
          ],
          figures: [
            {
              src: `${assetPath}/unit3-linear-outlier.png`,
              alt: 'Scatter plot of the 13 points with two regression lines. The line fitted to all points has slope −1.75 and R² 0.58. Removing the single point at x = 17 gives a steeper line with slope −2.88 and R² 0.86.',
              caption: 'Figure 2. The point at x = 17 lies far from the other x values and pulls the line towards itself.',
            },
          ],
          tables: [
            {
              headers: ['Dataset', 'n', 'Slope', 'r', 'R²', 'p-value', 'Prediction at x = 10'],
              rows: [
                ['Original', '13', '−1.751', '−0.759', '0.575', '0.003', '85.59'],
                ['Remove (17, 86)', '12', '−2.884', '−0.928', '0.860', '< 0.001', '80.95'],
                ['Remove (2, 111)', '12', '−1.355', '−0.716', '0.513', '0.009', '85.40'],
                ['Add (20, 110)', '14', '−0.380', '−0.184', '0.034', '0.528', '90.64'],
                ['Add 4 on-trend points', '17', '−2.067', '−0.862', '0.743', '< 0.001', '84.85'],
                ['First 5 points only', '5', '−4.421', '−0.981', '0.963', '0.003', '75.63'],
              ],
              caption: 'Table 3. Sensitivity of the fitted line and its prediction to individual data points.',
            },
          ],
        },
        {
          heading: 'What I observed',
          paragraphs: [
            'Points with extreme x values have far more influence than others. Removing (17, 86), the only point with x above 12, raised the strength of the relationship from r = −0.759 to −0.928 and moved the prediction at x = 10 by almost five units. Removing (2, 111), which has an extreme y value but an ordinary x value, changed far less. This is the difference between an outlier in y and a high-leverage point in x: a point far from the mean of x acts like a long lever on the line.',
            'A single contradictory point can erase the relationship. Adding (20, 110) cut R² from 0.575 to 0.034, and the p-value rose to 0.53, so the model was no longer distinguishable from no relationship. Adding four points that followed the trend had the opposite effect, raising R² to 0.743.',
            'A high R² from very little data is not evidence of a good model. The first five points alone gave r = −0.981 and R² = 0.963, the best fit in the table, but the slope was more than double the full-data estimate, and the prediction at x = 10 fell to 75.63. Extrapolation fails in a similar way: the original line predicts y = 33 at x = 40, well below any observed value, because nothing in the data supports the assumption that the trend stays linear that far out.',
          ],
        },
      ],
    },
    {
      label: 'Multiple linear regression',
      sections: [
        {
          heading: 'Original notebook',
          paragraphs: [
            'The notebook predicts CO2 emissions from a car’s Weight (kg) and engine Volume (cm³) using scikit-learn’s LinearRegression. It reports coefficients of 0.00755 for weight and 0.00781 for volume, and predicts 107.209 g for a 2,300 kg car with a 1,300 cm³ engine. Increasing the weight to 3,300 kg raises the prediction to 114.760 g, which is the weight coefficient multiplied by 1,000.',
          ],
        },
        {
          heading: 'What I changed',
          paragraphs: [
            'I checked how well the model fitted, refitted it on subsets of the cars, dropped each predictor in turn, changed the units of weight, standardised the inputs and added one unusual car.',
          ],
          code: `X = df[['Weight', 'Volume']]
y = df['CO2']
regr = linear_model.LinearRegression().fit(X, y)
print(regr.score(X, y))                          # R² = 0.377
print(df['Weight'].min(), df['Weight'].max())   # 790 to 1746 kg

# subsets, single predictors, unit change, an added electric car ...
regr.fit(df[df.Weight < 1500][['Weight', 'Volume']], df[df.Weight < 1500]['CO2'])`,
          tables: [
            {
              headers: ['Model', 'Weight coef.', 'Volume coef.', 'R²'],
              rows: [
                ['Original (36 cars)', '0.00755', '0.00781', '0.377'],
                ['Cars under 1,500 kg (30 cars)', '−0.00578', '0.01014', '0.281'],
                ['First 18 cars in the file', '−0.01393', '0.00872', '0.165'],
                ['Weight only', '0.01700', '—', '0.305'],
                ['Volume only', '—', '0.01135', '0.351'],
                ['Weight in tonnes', '7.55095', '0.00781', '0.377'],
                ['Add one electric car (Volume 0, CO2 0)', '−0.03186', '0.03309', '0.723'],
              ],
              caption: 'Table 4. Coefficients and fit of the CO2 model under different data and feature choices.',
            },
          ],
        },
        {
          heading: 'What I observed',
          paragraphs: [
            'The headline prediction is an extrapolation. The heaviest car in the dataset weighs 1,746 kg, so the notebook’s 2,300 kg and 3,300 kg examples fall well outside the data the model learned from. The “fair guess” check in the notebook only confirms that a linear model behaves linearly. It says nothing about whether real emissions would follow.',
            'The model is also weak. R² is 0.377, so weight and volume explain less than 40% of the variation in CO2 between these cars. The coefficients should be read as rough tendencies, not precise effects.',
            'The coefficients are unstable because the predictors overlap. Weight and volume are strongly correlated (r = 0.754), so the model struggles to separate their individual effects. Fitting only the lighter cars, or only the first half of the file, flipped the weight coefficient to negative, which would imply that heavier cars emit less. Weight on its own has a coefficient of 0.017, more than double its value in the joint model. This is multicollinearity: the coefficients depend heavily on which rows and columns happen to be included.',
            'Coefficient size depends on units. Recording weight in tonnes multiplied its coefficient by 1,000 (to 7.551) without changing a single prediction or the R². The raw coefficients therefore cannot show which feature matters more. After standardising both inputs, volume had the larger effect (3.0 g per standard deviation, against 1.8 g for weight).',
            'One car from a different population distorted the whole model. Adding an electric car with zero engine volume and zero emissions raised R² to 0.723, apparently a much better model, while turning the weight coefficient strongly negative. The higher R² came entirely from a single point unlike the rest, not from a better explanation of petrol cars. A dataset that mixes populations should be split, or modelled with features that capture the difference.',
          ],
        },
      ],
    },
    {
      label: 'Polynomial regression',
      sections: [
        {
          heading: 'Original notebook',
          paragraphs: [
            'The notebook records the speed of 18 cars passing a tollbooth at different hours of the day. Speed falls in the morning and rises again in the evening, so a straight line is a poor fit. A third-degree polynomial fitted with numpy.polyfit gives R² = 0.943 and predicts a speed of 88.87 at 17:00.',
          ],
        },
        {
          heading: 'What I changed',
          paragraphs: [
            'I varied the polynomial degree from 1 to 10. For each degree I recorded R² on the training data, the prediction at 17:00 and predictions outside the observed hours. Because training R² always rises with complexity, I also used leave-one-out cross-validation: each point was removed in turn, the model was refitted without it, and the held-out point was predicted. I then removed the first five morning observations, and finally replaced the speeds with random numbers.',
          ],
          code: `for deg in [1, 2, 3, 4, 6, 10]:
    errs = []
    for k in range(len(x)):                       # leave-one-out
        xt = x[:k] + x[k+1:]; yt = y[:k] + y[k+1:]
        m = numpy.poly1d(numpy.polyfit(xt, yt, deg))
        errs.append((m(x[k]) - y[k]) ** 2)
    print(deg, numpy.sqrt(numpy.mean(errs)))`,
          figures: [
            {
              src: `${assetPath}/unit3-polynomial-degrees.png`,
              alt: 'Two panels showing degree 1, 3 and 10 polynomial fits to tollbooth speed by hour. Within the data range, degree 3 follows the U-shape smoothly and degree 10 wiggles through every point. Outside the range, degree 10 shoots off the chart and degree 3 turns sharply downward after hour 22.',
              caption: 'Figure 3. Polynomial fits of increasing degree. Shaded areas fall outside the observed hours.',
            },
          ],
          tables: [
            {
              headers: ['Degree', 'Training R²', 'Leave-one-out RMSE', 'Prediction at 17:00', 'Prediction at hour 30'],
              rows: [
                ['1', '0.182', '15.76', '83.93', '96.9'],
                ['2', '0.760', '9.44', '81.18', '188.4'],
                ['3 (notebook)', '0.943', '4.23', '88.87', '38.0'],
                ['4', '0.954', '4.59', '87.21', '160.2'],
                ['6', '0.980', '6.38', '84.29', '−1,837.6'],
                ['10', '0.992', '24.95', '83.73', '88,806.1'],
              ],
              caption: 'Table 5. Training fit, held-out error and predictions by polynomial degree.',
            },
          ],
        },
        {
          heading: 'What I observed',
          paragraphs: [
            'Training R² is a misleading guide to model quality. It rose with every extra degree, reaching 0.992 at degree 10, but the held-out error told a different story. Degree 3 had the lowest leave-one-out error (4.23), and by degree 10 the error had risen to 24.95, worse than a straight line. The degree 10 curve wiggles through almost every training point and so fits noise rather than the daily pattern. This is overfitting.',
            'Polynomials should never be used to extrapolate. At hour 30, outside the observed range, the models predicted anything from −1,838 to 88,806, and even the best model predicted a fall to 38. Each prediction reflects how the polynomial terms behave mathematically, not anything in the traffic data.',
            'Gaps in the data turn interpolation into extrapolation. After I removed the first five morning observations, degree 3 still gave a high R² (0.962) on the remaining points. However, it predicted 42.9 for hour 2, where the original data showed 90. The model was confident about a region it had never seen.',
            'A reasonable R² can come from noise alone. Fitting degree 3 to 18 random speeds still produced R² = 0.478. With few points and a flexible model, a moderate R² does not prove that a real relationship exists, which is why the notebook’s description of R² as a measure of whether “there is a relationship” needs to be qualified.',
          ],
        },
      ],
    },
    {
      label: 'Reflection and learning outcomes',
      sections: [
        {
          heading: 'Datasets and their challenges',
          paragraphs: [
            'Across all four notebooks, the data shaped the results as much as the algorithm did. Sample size determined whether a correlation could be trusted. One high-leverage point could double a regression slope, and one car from a different population could reverse a coefficient. A polynomial could reach an R² of 0.99 while predicting worse than a straight line. None of these problems raised an error or warning; the code ran cleanly every time. This is the practical meaning of the learning outcome about the applicability and challenges of datasets: an algorithm will fit whatever data it is given, so whether the model means anything depends on checking the data’s size, range, outliers, collinearity and population before trusting the output.',
            'The checks I would now apply as routine are: plot the data before computing a coefficient; report how many points the model was fitted on and the range they cover; refuse to predict outside that range without saying so; evaluate on held-out data rather than training R²; and test how sensitive the result is to removing individual points.',
          ],
        },
        {
          heading: 'Legal, social, ethical and professional issues',
          paragraphs: [
            'These numerical weaknesses become ethical problems once a model informs real decisions. The cars model reported a precise prediction of 107.209 g for a vehicle heavier than any in its data, from a model that explains under 40% of the variation. Presented without that context, it would give decision-makers false confidence, for example in an emissions estimate used for taxation or compliance. Professional codes such as the BCS Code of Conduct require members to work only within their professional competence and not to misrepresent their capability or the quality of their work (BCS, 2022). Reporting R², the data range and the model’s limits is part of meeting that duty, not an optional extra.',
            'The multicollinearity and electric-car results show how easily a coefficient can be read as a causal claim, such as “heavier cars emit less”. A coefficient that changes sign depending on which rows are included should not support a policy argument. The same risk applies when the variables describe people. If a regression on a dataset that under-represents one group were used in lending, insurance or hiring, the extrapolation and population-mixing problems seen here would land on individuals who had little chance to contest them. UK GDPR Article 22 gives people rights where decisions with legal or similarly significant effects are based solely on automated processing, and the ICO expects organisations to be able to explain how such systems reach their outputs (ICO and The Alan Turing Institute, 2022). A model whose behaviour depends on a handful of influential points is hard to explain and hard to defend.',
            'The main professional lesson I take from this activity is that a model’s uncertainty is part of its output. I will report it alongside every prediction, and I will treat a surprisingly good fit as a reason to look harder at the data, not as a result to publish.',
          ],
        },
      ],
      references: [
        'BCS, The Chartered Institute for IT (2022) BCS Code of Conduct. Swindon: BCS.',
        'Information Commissioner’s Office and The Alan Turing Institute (2022) Explaining decisions made with AI. Wilmslow: ICO.',
        'Regulation (EU) 2016/679 (General Data Protection Regulation), as retained in UK law by the Data Protection Act 2018 and the European Union (Withdrawal) Act 2018, Article 22.',
      ],
    },
  ],
};
