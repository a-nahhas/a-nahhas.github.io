const assetPath = '../../assets/machine-learning';

export default {
  label: 'Gradient Descent and the Cost Function',
  text: 'Unit 8 · Practical activity: read Mayo (2017), run the gradient_descent_cost_function notebook, then change the number of iterations and the learning rate and observe how the cost decreases.',
  sections: [
    {
      heading: 'Reading: Mayo (2017)',
      paragraphs: [
        'Mayo (2017) explains how a neural network turns its prediction error into weight updates. Trying every combination of weights is impossible even for a small network, so training needs a methodical way of deciding which direction to move each weight and by how much. The cost function expresses the error as a function of the weights, and the best weights sit at its minimum, where the slope is zero. Gradient descent uses the slope (the gradient) at the current position to step downhill, and the learning rate sets the size of each step. Backpropagation is the mechanism that passes the error back through the layers so that each neuron receives its share of the gradient.',
        'The article also separates three variants. Batch gradient descent uses the whole dataset for every update, so it is deterministic. Stochastic gradient descent updates after each individual example, which makes its path noisy but can help it escape local minima. Mini-batch gradient descent sits between the two. Mayo raises the learning rate as an open question: step size affects how long it takes to reach the minimum, but the article gives no rule for choosing it. The notebook is a good place to find out.',
      ],
    },
    {
      heading: 'The notebook',
      paragraphs: [
        'The notebook fits a straight line y = mx + b to five points that lie exactly on y = 2x + 3. It starts from m = b = 0 and, on every iteration, computes the mean squared error (the cost), the partial derivatives of the cost with respect to m and b, and then moves both parameters a step against their gradients. Because every update uses all five points, this is batch gradient descent in Mayo’s terms. With the defaults of 100 iterations and a learning rate of 0.08, the cost falls from 89.0 to 0.0041 and the line ends at m = 2.041, b = 2.854: close to the true values, but not yet there.',
        'I ran the notebook unmodified first to confirm these figures. I then wrapped the function so that iterations and learning_rate became arguments and the cost history was returned instead of printed, which made it possible to sweep both settings. The script below reproduces every number and both figures in this entry.',
      ],
      code: `def gradient_descent(x, y, iterations=100, learning_rate=0.08):
    m_curr = b_curr = 0
    n = len(x)
    costs = []
    for i in range(iterations):
        y_predicted = m_curr * x + b_curr
        cost = (1/n) * sum([val**2 for val in (y - y_predicted)])
        md = -(2/n) * sum(x * (y - y_predicted))
        bd = -(2/n) * sum(y - y_predicted)
        m_curr = m_curr - learning_rate * md
        b_curr = b_curr - learning_rate * bd
        costs.append(cost)
    return m_curr, b_curr, costs`,
      links: [{ href: `${assetPath}/unit8-experiments.py`, label: 'Download the experiment script (Python)' }],
    },
    {
      heading: 'Changing the learning rate',
      paragraphs: [
        'I kept 100 iterations and varied the learning rate from 0.0001 to 0.1.',
      ],
      tables: [
        {
          headers: ['Learning rate', 'm after 100', 'b after 100', 'Cost after 100', 'Iterations to reach cost < 10⁻⁶'],
          rows: [
            ['0.0001', '0.553', '0.161', '56.0', '203,385'],
            ['0.001', '2.369', '0.737', '1.65', '20,336'],
            ['0.01', '2.448', '1.381', '0.480', '2,031'],
            ['0.03', '2.227', '2.180', '0.125', '675'],
            ['0.05', '2.114', '2.587', '0.0321', '404'],
            ['0.07', '2.057', '2.793', '0.0082', '288'],
            ['0.08 (notebook)', '2.041', '2.854', '0.0041', '251'],
            ['0.084', '1.280', '2.664', '7.45', '734'],
            ['0.085', '−6.023', '0.645', '808.7', 'never (diverges)'],
            ['0.09', '−5.1 × 10⁵', '−1.4 × 10⁵', '2.6 × 10¹²', 'never (diverges)'],
            ['0.1', '−9.4 × 10¹³', '−2.6 × 10¹³', '6.0 × 10²⁸', 'never (diverges)'],
          ],
          caption: 'Table 1. Effect of the learning rate. The true values are m = 2 and b = 3.',
        },
      ],
      figures: [
        {
          src: `${assetPath}/unit8-cost-curves.png`,
          alt: 'Two log-scale charts of cost against iteration. Left: over 100 iterations, learning rate 0.09 rises off the chart; 0.001 falls slowly; 0.01 and 0.05 drop sharply to about 1 and then flatten; 0.08 starts slower but ends lowest at 0.004. Right: over 3,000 iterations, 0.08 reaches about 10⁻³⁰ by iteration 1,200 while 0.01 is still near 10⁻⁸ at iteration 3,000.',
          caption: 'Figure 1. Cost by iteration for different learning rates. The right panel extends the two most useful rates well past the notebook’s 100 iterations.',
        },
      ],
    },
    {
      heading: 'Changing the number of iterations',
      paragraphs: [
        'I then kept the notebook’s learning rate of 0.08 and varied the number of iterations.',
      ],
      tables: [
        {
          headers: ['Iterations', 'm', 'b', 'Final cost'],
          rows: [
            ['5', '4.041', '1.433', '36.4'],
            ['10', '1.631', '1.038', '12.0'],
            ['50', '2.151', '2.421', '0.065'],
            ['100 (notebook)', '2.041', '2.854', '0.0041'],
            ['500', '2.000', '3.000', '1.2 × 10⁻¹²'],
            ['1,000', '2.000', '3.000', '1.5 × 10⁻²⁴'],
            ['2,000', '2.000', '3.000', '1.0 × 10⁻²⁹'],
          ],
          caption: 'Table 2. Effect of the number of iterations at a learning rate of 0.08.',
        },
      ],
      figures: [
        {
          src: `${assetPath}/unit8-cost-surface.png`,
          alt: 'Contour plot of the cost over m and b, forming long narrow ellipses angled from upper left to lower right, with the minimum at m = 2, b = 3. The path for learning rate 0.08 zig-zags back and forth across the valley in m before sliding up to the minimum. The path for learning rate 0.01 moves smoothly into the valley floor and then crawls along it, stopping well short of the minimum after 300 steps.',
          caption: 'Figure 2. The first 300 steps of gradient descent across the cost surface at learning rates 0.08 and 0.01.',
        },
      ],
    },
    {
      heading: 'What I observed',
      paragraphs: [
        'There is a cliff, not a slope, at the top of the learning rate range. Every rate up to 0.08 converged, and each increase reduced the number of iterations needed: from 203,385 at 0.0001 to 251 at 0.08. Then, in a step of just 0.005, behaviour collapsed. At 0.084 the method still converged but needed 734 iterations, and from 0.085 upwards the cost increased on every iteration. At 0.09 it reached 2.6 × 10¹² within 100 steps. The notebook’s default of 0.08 turns out to sit just below the edge.',
        'The edge can be calculated rather than found by trial. For mean squared error on a straight line, the curvature of the cost surface is fixed by the x values. Its two eigenvalues here are 23.66 and 0.34, and gradient descent is only stable when the learning rate is below 2 divided by the larger one, which gives 0.0845. That matches the experiment exactly. A rate above it makes each step overshoot the minimum by more than it started, so the parameters swing further out each time.',
        'The first iterations can mislead. In Figure 1, learning rates of 0.01 and 0.05 cut the cost much faster at the start than 0.08 did (52.3 against 71.1 after one step at 0.01), yet both then flattened out near a cost of 1 and finished behind. Figure 2 shows why. The cost surface is a long, narrow valley: it is 70 times steeper across than along (the ratio of the two eigenvalues). A small learning rate quickly drops into the valley floor but then creeps along it, because the gradient along the floor is tiny. At 0.08 the steps are large enough to zig-zag across the valley, which looks inefficient early on, but they also make real progress along it. Judging a learning rate from the first few iterations would have picked the wrong one.',
        'More iterations only help if the learning rate is already stable. At 0.08, raising the iterations from 100 to 500 took the cost from 0.0041 to 10⁻¹², and from about iteration 1,200 it stopped at around 10⁻³⁰, the limit of floating-point precision. Further iterations then cost computation and changed nothing. At 0.09 more iterations only made the result worse. Iterations and learning rate are therefore not independent settings: the learning rate decides whether the method converges and how fast, and the iteration count only decides how far along that path to stop. Five iterations at 0.08 left m at 4.04, double its true value, because the method was midway through a zig-zag.',
        'The notebook’s warning about “missing the global minimum” needs qualifying for this problem. Mean squared error for linear regression is convex, so there is only one minimum and no local minima to get trapped in. A rate that is too large did not miss the minimum and land somewhere else; it diverged entirely. The local-minimum concerns Mayo describes, and the case he makes for stochastic gradient descent, apply to the non-convex cost surfaces of neural networks, not to this example.',
        'Finally, the data can be changed instead of the learning rate. When I centred x by subtracting its mean, the valley became nearly round (the eigenvalue ratio dropped from 70 to 2) and the stability limit rose from 0.0845 to 0.5. At a learning rate of 0.4 the cost fell below 10⁻⁶ in 16 iterations, against 251 at the best rate on the original data. This is the practical reason for scaling features before training, and it links back to the data preparation work in earlier units.',
      ],
    },
    {
      heading: 'Reflection',
      paragraphs: [
        'Before this activity I thought of the learning rate as a dial between “slow but safe” and “fast but risky”. The experiments showed something more specific. Up to a threshold, a higher rate was both faster and just as safe. Past the threshold, a small change made the method fail completely. The threshold depends on the shape of the cost surface, which in turn depends on the scale of the data. This explains why learning rate schedules, adaptive optimisers and feature scaling are standard practice in neural network training, where the threshold cannot be calculated in advance and differs between layers.',
        'The exercise also reinforced a habit from the regression notebooks in Unit 3: no error message appeared at any point. A diverging run printed numbers just as cleanly as a converging one, so the only safeguard was to look at the cost curve. I will plot the cost against iterations for every model I train, and treat a curve that flattens early as a reason to check the learning rate and feature scaling rather than as a sign that the model has finished learning.',
      ],
    },
  ],
  references: [
    'Mayo, M. (2017) Neural network foundations, explained: updating weights with gradient descent & backpropagation. KDnuggets, 25 October. Available at: https://www.kdnuggets.com/2017/10/neural-network-foundations-explained-gradient-descent.html (Accessed: 18 October 2026).',
  ],
};
