const assetPath = '../../assets/machine-learning';

export default {
  label: 'Team Project: Airbnb Listing Segmentation and Price Prediction',
  text: 'Group 1 project report analysing New York City Airbnb listings. We clustered listings into profiles and tested whether those profiles improve price prediction. The sub-entries cover the analysis and results, my contribution to the team, and my evaluation of the work.',
  sections: [
    {
      heading: 'The brief and our question',
      paragraphs: [
        'Short-term rentals are growing faster than the wider online accommodation market, and price is still the main factor in booking decisions (Expedia Group, 2025). As supply grows, the problem for a platform moves from scarcity to helping guests and hosts make sense of a crowded market. We framed the project around one business question: what distinct listing profiles can be identified, and can these profiles improve price prediction?',
        'We used the New York City Airbnb Open Data (Dgomonov, 2019): 48,895 listings with 16 listing and host attributes, including borough, neighbourhood, coordinates, room type, nightly price, minimum nights, review activity, host listing count and availability. The work followed a classical machine learning workflow of data understanding, preparation, modelling and evaluation (Géron, 2025), in Python on Kaggle.',
      ],
      links: [
        { href: `${assetPath}/team-project-report.pdf`, label: 'Download the full project report (PDF)' },
        { href: 'https://www.kaggle.com/code/rafacavalcante/airbnb-host-segmentation-and-price-prediction', label: 'View the analysis notebook on Kaggle' },
      ],
    },
  ],
  references: [
    'de Jonge-Gryciuk, A. et al. (2026) Airbnb host-segmentation and price prediction. Kaggle. Available at: https://www.kaggle.com/code/rafacavalcante/airbnb-host-segmentation-and-price-prediction (Accessed: 3 September 2026).',
    'Dgomonov (2019) New York City Airbnb Open Data. Kaggle. Available at: https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data (Accessed: 12 August 2026).',
    'Expedia Group (2025) 2025 Traveler Value Index. Expedia Group.',
    'Géron, A. (2025) Hands-On Machine Learning with Scikit-Learn and PyTorch. Sebastopol, CA: O’Reilly Media.',
  ],
  children: [
    {
      label: 'Analysis and results',
      sections: [
        {
          heading: 'Pipeline',
          paragraphs: [
            'The analysis ran in two phases. The segmentation phase cleaned and prepared the data and clustered the listings. The prediction phase trained regression models, calibrated a price range around their predictions and evaluated everything on a held-out 10% test set that was used by all models.',
          ],
          figures: [
            {
              src: `${assetPath}/team-project-pipeline.jpg`,
              alt: 'Pipeline of eight stages: data collection from Airbnb Open Data (New York City, 2019); data preparation and cleaning; a 90% train and 10% test split per cluster; feature preparation and scaling; unsupervised learning to choose K and assign clusters; regression modelling comparing a cluster median baseline, linear regression, random forest, and random forest with location; calibration of an 80% asking-price range without using test data; and evaluation and reporting. The first five stages form the segmentation phase and the last three the prediction phase. Tools listed are pandas, numpy, matplotlib, seaborn, scikit-learn K-Means with the elbow method and silhouette score, kmodes K-Prototypes, scikit-learn linear regression and random forest, and MAE, RMSE, R² and MAPE for evaluation.',
              caption: 'Analytical pipeline and tooling.',
            },
          ],
        },
        {
          heading: 'Exploring and preparing the data',
          paragraphs: [
            'Missing values were concentrated in last_review and reviews_per_month, about 20% of listings, and every missing reviews_per_month value belonged to a listing with zero reviews. The numerical variables had weak linear relationships with price. Room type and location separated prices more clearly: entire homes had a median of $160 against $70 for private rooms and $45 for shared rooms, and Manhattan had the highest borough median at $150. Price and minimum_nights were strongly right-skewed.',
            'Missing reviews_per_month values were set to 0, with a binary has_reviews flag so that “no reviews yet” stayed distinguishable from low activity. The 11 zero-price listings were removed, while high prices were kept as genuine market observations. Skewed variables were log1p-transformed and numerical features standardised so that extreme values and scale differences did not dominate the distance calculations. Identifiers, free text, last_review and the high-cardinality neighbourhood field were left out of clustering, with latitude and longitude representing location. Room type was one-hot encoded for K-Means and kept categorical for K-Prototypes.',
          ],
          figures: [
            {
              src: `${assetPath}/team-project-eda-price.jpg`,
              alt: 'Four panels of nightly price. Violin and box plots by room type show entire homes priced highest, with a median around $160, above private rooms and shared rooms. Violin and box plots by borough show Manhattan highest, then Brooklyn, with Queens, Staten Island and the Bronx lower. Every group has a long upper tail of outliers reaching $1,000.',
              caption: 'Price by room type and borough, showing the strong right skew.',
            },
          ],
        },
        {
          heading: 'Choosing the models',
          paragraphs: [
            'K-Means and K-Prototypes were run independently and compared. K-Means is efficient and interpretable but only handles numerical data, so room type had to be one-hot encoded. K-Prototypes handles mixed numerical and categorical data natively (Huang, 1998), at a higher computational cost.',
            'For price prediction we compared linear regression with a random forest. Linear regression is easy to interpret but assumes linear relationships, which the exploration had already shown were weak. A random forest captures non-linear effects and interactions but is harder to explain and needs tuning (Hastie, Tibshirani and Friedman, 2009).',
          ],
          figures: [
            {
              src: `${assetPath}/team-project-clustering-comparison.jpg`,
              alt: 'Comparison table of K-Means and K-Prototypes. K-Means handles numeric data only, using one-hot encoding for categories and Euclidean distance, is sensitive to outliers, handles high dimensionality poorly, scales well, and is highly interpretable through centroid profiles. K-Prototypes handles numeric and categorical data natively using Euclidean distance plus categorical dissimilarity, is sensitive to outliers in its mean-based part, avoids dimension expansion, scales less well, and is highly interpretable through centroid and mode profiles.',
              caption: 'Clustering model comparison.',
            },
            {
              src: `${assetPath}/team-project-regression-comparison.jpg`,
              alt: 'Comparison table of linear regression and random forest. Linear regression assumes linear relationships, is unstable with correlated features, has a low overfitting risk with few features, has directly interpretable coefficients, and needs little tuning. Random forest captures non-linear relationships, is less affected by correlated features, carries an overfitting risk from ensemble complexity, is harder to explain, and has multiple parameters that need tuning.',
              caption: 'Regression model comparison.',
            },
          ],
        },
        {
          heading: 'Listing profiles',
          paragraphs: [
            'The elbow method and silhouette score both supported three clusters. At K = 3, K-Means and K-Prototypes produced almost identical profiles despite handling room type differently, which gave us more confidence that the segments reflected real structure rather than an artefact of one algorithm. Price was excluded from clustering so that the segments would be independent of the variable we later tried to predict.',
          ],
          tables: [
            {
              headers: ['Cluster', 'Listings', 'Median price', 'Min. nights', 'Reviews', 'Host listings', 'Availability (days)', 'Leading room type', 'Leading borough'],
              rows: [
                ['0', '26,507', '$110', '3', '2', '1', '0', 'Entire home (53.0%)', 'Manhattan (45.6%)'],
                ['1', '4,482', '$149', '30', '1', '18', '319', 'Entire home (67.8%)', 'Manhattan (72.5%)'],
                ['2', '17,895', '$100', '2', '36', '1', '160', 'Private room (50.7%)', 'Brooklyn (42.2%)'],
              ],
              caption: 'Cluster profiles, using medians for numerical features and the most common category for categorical ones.',
            },
          ],
          figures: [
            {
              src: `${assetPath}/team-project-personas.jpg`,
              alt: 'Three host persona cards. Professional Portfolio Host, a scale-oriented operator: multiple listings, high availability, longer minimum stays, Manhattan-heavy. Active Urban Host, a high-engagement operator: high review activity, medium availability, likely smaller portfolio, Brooklyn and Queens. Low-Activity Host, with limited observed activity: zero availability, low review activity, limited observed activity, mixed locations.',
              caption: 'Host personas derived from the three clusters.',
            },
          ],
        },
        {
          heading: 'Price prediction',
          paragraphs: [
            'We tested whether the clusters help predict price by training models separately within each cluster and comparing them with one global model trained on all listings. The baseline predicted each listing’s cluster median price. Models were scored on mean absolute error (MAE), root mean squared error (RMSE) and R².',
          ],
          tables: [
            {
              headers: ['#', 'Approach', 'Model', 'Location features', 'MAE ($)', 'RMSE ($)', 'R²'],
              rows: [
                ['1', 'Within clusters', 'Cluster median (baseline)', 'No', '85.06', '109.63', '−0.025'],
                ['2', 'Within clusters', 'Linear regression', 'No', '64.23', '86.21', '0.076'],
                ['3', 'Within clusters', 'Random forest', 'No', '58.32', '79.96', '0.132'],
                ['4', 'Within clusters', 'Random forest', 'Borough + neighbourhood', '57.88', '79.41', '0.136'],
                ['5', 'Global model', 'Random forest', 'Borough + neighbourhood', '57.72', '79.13', '0.134'],
              ],
              caption: 'Price prediction experiments on the held-out test set. Lower MAE and RMSE and higher R² are better.',
            },
          ],
        },
        {
          paragraphs: [
            'The random forest outperformed linear regression, and adding location features helped further. Training one model per cluster gave no meaningful gain over the global model. The best models explained only about 13% of the variation in price, so an exact predicted price would mislead a host. Instead we calibrated an 80% asking-price range around each prediction without using the test data. On the test set, 79.4% of actual prices fell inside their range, with an average width of about $131.',
          ],
          figures: [
            {
              src: `${assetPath}/team-project-price-by-cluster.jpg`,
              alt: 'Violin plots of log nightly price for each cluster. Cluster 0 holds 53.9% of listings with a median of $119, cluster 1 holds 9.2% with a median of $155, and cluster 2 holds 36.9% with a median of $98. All three distributions overlap heavily and span roughly $10 to $1,000. A note says there is substantial price variation within each cluster, so a pricing range suits better than a single recommended price.',
              caption: 'Price variation within each cluster.',
            },
          ],
        },
        {
          heading: 'Limitations and recommendations',
          paragraphs: [
            'The question was only partly answered. The clusters produced distinct, usable host profiles, but they did not improve price prediction. The low R² points to missing information rather than a modelling failure: the dataset describes supply (where a listing is, what type it is, how often it is reviewed) but not the property itself, guest demand or commercial performance (Rezazadeh Kalehbasti, Nikolenko and Rezaei, 2021). The results also come from one city in one year, and review counts carry selection bias, since not every guest leaves a review.',
            'We recommended enriching the data with property features such as size, rooms and amenities, adding review sentiment and listing text and images, and joining demand data. The personas could support targeted host engagement now, for example helping low-activity hosts reactivate listings. Repeating the analysis in other cities would show whether the profiles generalise beyond New York.',
          ],
        },
      ],
      references: [
        'Dgomonov (2019) New York City Airbnb Open Data. Kaggle. Available at: https://www.kaggle.com/datasets/dgomonov/new-york-city-airbnb-open-data (Accessed: 12 August 2026).',
        'Géron, A. (2025) Hands-On Machine Learning with Scikit-Learn and PyTorch. Sebastopol, CA: O’Reilly Media.',
        'Hastie, T., Tibshirani, R. and Friedman, J. (2009) The Elements of Statistical Learning: Data Mining, Inference, and Prediction. 2nd edn. New York: Springer.',
        'Huang, Z. (1998) ‘Extensions to the k-means algorithm for clustering large data sets with categorical values’, Data Mining and Knowledge Discovery, 2(3), pp. 283–304.',
        'Rezazadeh Kalehbasti, P., Nikolenko, L. and Rezaei, H. (2021) ‘Airbnb price prediction using machine learning and sentiment analysis’, in Holzinger, A. et al. (eds) Machine Learning and Knowledge Extraction. CD-MAKE 2021. Lecture Notes in Computer Science, vol. 12844. Cham: Springer, pp. 173–184.',
      ],
    },
    {
      label: 'My contribution',
      sections: [
        {
          heading: 'Data analysis',
          paragraphs: [
            'My first responsibility was the exploratory data analysis. I profiled the 48,895 listings, traced where the missing values sat and found that every missing reviews_per_month value belonged to a listing with zero reviews, so the gap meant “no reviews yet” rather than lost data. That finding is why the preparation filled the value with 0 and added the has_reviews flag instead of imputing an average. I also identified the 11 zero-price listings, measured the skew in price and minimum_nights, and showed that the numerical variables had only weak linear relationships with price while room type and borough separated prices clearly.',
            'These results shaped the rest of the project in two ways. The skew supported the log1p transform and scaling used before clustering, and the weak linear relationships were an early warning that price would be hard to predict from this data. When the models later explained little of the variation in price, the exploration had already pointed to the reason.',
          ],
        },
        {
          heading: 'Price prediction modelling and testing',
          paragraphs: [
            'I built and tested the prediction phase. I set up the 90/10 train–test split, fitted the cluster-median baseline, linear regression and random forest within each cluster, then added borough and neighbourhood features and trained the global model for comparison, giving the five experiments in the results table. All models were scored with MAE, RMSE and R² on the same held-out test set, so the comparison was like for like.',
            'Because the best model explained only about 13% of the variation in price, the prediction work also covered the asking-price range. The 80% range was calibrated without touching the test data and then checked on the test set, where 79.4% of actual prices fell inside their range, which showed the calibration held on unseen listings.',
          ],
        },
        {
          heading: 'Looking back on my part',
          paragraphs: [
            'The weaknesses identified in the critical evaluation fall mostly in my part of the work. I used a single split with no cross-validation, so I could not show whether a difference of $0.16 in MAE between the global and per-cluster models was real, and I reported the negative baseline R² without explaining what it meant for the clusters. The Unit 11 model performance activity later showed me why this matters: per-cluster and global R² are not directly comparable, because each cluster has a narrower price range. If I repeated the work, I would cross-validate every model, report the spread of each metric and compare the approaches in dollars rather than R².',
          ],
        },
      ],
    },
    {
      label: 'Critical evaluation',
      sections: [
        {
          heading: 'Evaluation of the project',
          paragraphs: [
            'Strengths: the design avoided the most obvious trap. Price was kept out of clustering, so the segments could be tested fairly as predictors rather than simply encoding the target. Running two clustering algorithms and finding the same three profiles was a useful robustness check. Reporting a calibrated range instead of a point prediction was an honest response to a weak model, and the 79.4% coverage shows the calibration held on unseen data. The preparation also applied a lesson from the first collaborative discussion: the has_reviews flag kept “no data yet” separate from genuinely low activity.',
            'Weaknesses: the claim that the global model performs best rests on differences that are too small to support it. Experiment 5 beats experiment 4 by $0.16 in MAE, while experiment 4 has the higher R² (0.136 against 0.134), all from a single 90/10 split with no cross-validation or confidence intervals. The defensible conclusion is that segmentation adds no measurable value, not that the global model wins. The baseline also had a negative R², so cluster medians predicted price worse than the overall mean. That is strong evidence on its own that the clusters carry almost no price information, and the report could have said so directly.',
            'The $131 average range width is larger than the overall median price of $106, which limits how useful the range is to a host. The Low-Activity persona is built on a median availability of 0 days, which may describe inactive or unlisted properties rather than a type of host; it needed checking before being presented as a persona. Figure 13 also reports cluster sizes and medians ($119, $155, $98) that do not match the profile table ($110, $149, $100), most likely because it came from a different run, and it is not labelled as such. That is the same kind of figure–text inconsistency I identified in the Intelligent Agents team project.',
            'Carried forward: compare models with cross-validation and report the spread of each metric before declaring a winner; treat a negative R² as a result to explain rather than a baseline to beat; and check every figure against the final notebook run before submission.',
          ],
        },
      ],
    },
  ],
};
