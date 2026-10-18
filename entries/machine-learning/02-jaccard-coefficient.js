export default {
  label: 'Jaccard Coefficient Calculations',
  text: 'Practical activity · Calculating the Jaccard distance between three patients from their pathological test results, treating the symptoms and tests as asymmetric binary attributes.',
  sections: [
    {
      heading: 'The data',
      paragraphs: [
        'The table gives the pathological test results for three individuals. The task is to calculate the Jaccard distance for the pairs (Jack, Mary), (Jack, Jim) and (Jim, Mary).',
      ],
      tables: [
        {
          headers: ['Name', 'Gender', 'Fever', 'Cough', 'Test-1', 'Test-2', 'Test-3', 'Test-4'],
          rows: [
            ['Jack', 'M', 'Y', 'N', 'P', 'N', 'N', 'A'],
            ['Mary', 'F', 'Y', 'N', 'P', 'A', 'P', 'N'],
            ['Jim', 'M', 'Y', 'P', 'N', 'N', 'N', 'A'],
          ],
          caption: 'Table 1. Pathological test results (Y = yes, N = no or negative, P = positive or present, A = absent).',
        },
      ],
    },
    {
      heading: 'Approach',
      paragraphs: [
        'Gender is a symmetric binary attribute: male and female carry equal weight, so it is excluded from the calculation. The remaining six attributes are asymmetric. A positive result (Y or P) is rare and informative, while a negative result (N or A) is common and says little about similarity. Two patients who both lack a symptom are not meaningfully alike, so negative matches are ignored. This is what makes the Jaccard coefficient appropriate here rather than the simple matching coefficient (Han, Kamber and Pei, 2012).',
        'Each value is therefore coded as 1 for Y or P and 0 for N or A. For any two objects, let q be the number of attributes that equal 1 for both, r the number that equal 1 for the first object only, s the number that equal 1 for the second object only, and t the number that equal 0 for both. The Jaccard distance is d = (r + s) / (q + r + s). The t matches do not appear in the formula.',
      ],
      tables: [
        {
          headers: ['Name', 'Fever', 'Cough', 'Test-1', 'Test-2', 'Test-3', 'Test-4'],
          rows: [
            ['Jack', '1', '0', '1', '0', '0', '0'],
            ['Mary', '1', '0', '1', '0', '1', '0'],
            ['Jim', '1', '1', '0', '0', '0', '0'],
          ],
          caption: 'Table 2. Asymmetric attributes coded as binary values (Y, P = 1; N, A = 0).',
        },
      ],
    },
    {
      heading: 'Calculations',
      paragraphs: [
        '(Jack, Mary): both are positive for Fever and Test-1, so q = 2. Jack has no positive that Mary lacks, so r = 0. Mary is positive for Test-3 and Jack is not, so s = 1. d = (0 + 1) / (2 + 0 + 1) = 1/3 ≈ 0.33.',
        '(Jack, Jim): both are positive for Fever, so q = 1. Jack is positive for Test-1 and Jim is not, so r = 1. Jim is positive for Cough and Jack is not, so s = 1. d = (1 + 1) / (1 + 1 + 1) = 2/3 ≈ 0.67.',
        '(Jim, Mary): both are positive for Fever, so q = 1. Jim is positive for Cough and Mary is not, so r = 1. Mary is positive for Test-1 and Test-3 and Jim is not, so s = 2. d = (1 + 2) / (1 + 1 + 2) = 3/4 = 0.75.',
      ],
      tables: [
        {
          headers: ['Pair', 'q', 'r', 's', 't', 'Jaccard distance'],
          rows: [
            ['(Jack, Mary)', '2', '0', '1', '3', '1/3 ≈ 0.33'],
            ['(Jack, Jim)', '1', '1', '1', '3', '2/3 ≈ 0.67'],
            ['(Jim, Mary)', '1', '1', '2', '2', '3/4 = 0.75'],
          ],
          caption: 'Table 3. Contingency counts and Jaccard distance for each pair.',
        },
      ],
    },
    {
      heading: 'Checking the result in Python',
      paragraphs: [
        'SciPy’s jaccard function computes the same dissimilarity on boolean vectors and confirms the hand calculations.',
      ],
      code: `from scipy.spatial.distance import jaccard

# Fever, Cough, Test-1, Test-2, Test-3, Test-4 (Y/P = 1, N/A = 0)
jack = [1, 0, 1, 0, 0, 0]
mary = [1, 0, 1, 0, 1, 0]
jim  = [1, 1, 0, 0, 0, 0]

print(round(jaccard(jack, mary), 2))  # 0.33
print(round(jaccard(jack, jim), 2))   # 0.67
print(round(jaccard(jim, mary), 2))   # 0.75`,
    },
    {
      heading: 'Interpretation',
      paragraphs: [
        'Jack and Mary are the most similar pair (0.33), since they share both positive findings that Jack has. Jim and Mary are the least similar (0.75): fever is the only positive finding they share. If a clustering algorithm used these distances, Jack and Mary would most likely be grouped together, which may suggest a similar underlying condition.',
        'The result depends on the coding decision. If the negative matches were counted, as in the simple matching coefficient, every pair would look more alike because most of the attributes are negative for everyone. For sparse medical data, ignoring shared absences keeps the measure focused on the findings that actually distinguish patients.',
      ],
    },
  ],
  references: [
    'Han, J., Kamber, M. and Pei, J. (2012) Data Mining: Concepts and Techniques. 3rd edn. Waltham, MA: Morgan Kaufmann.',
  ],
};
