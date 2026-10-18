const assetPath = '../../assets/machine-learning';

export default {
  label: 'Perceptrons and Multi-layer Networks',
  text: 'Unit 7 · Practical activity: run the three notebooks simple_perceptron, perceptron_AND_operator and multi-layer Perceptron (the sigmoid function) in order, then change the inputs, weights and settings to see how each network behaves. The sub-entries cover each notebook in turn: what I changed, what happened and what it means. The last one links the results to the module’s learning outcomes.',
  sections: [
    {
      heading: 'Setup',
      paragraphs: [
        'As in the earlier activities, I ran the notebooks in Jupyter on a local Python 3.12 environment (NumPy 2.5, Matplotlib 3.11). Before changing anything, I ran each notebook unmodified to check whether its saved outputs could be reproduced. The first two reproduced exactly. The multi-layer notebook did not. Its training loop refers to weights1.T, but the variable is called weights_1, so the loop stops with a NameError after the first epoch. The cells after it still run, but they use the untrained random weights, so the network predicts 0 for every input. The saved outputs in the notebook must have come from a session in which a variable called weights1 already existed. Once I corrected the name, the network trained as described.',
        'The first script below reruns every experiment in this entry and prints the figures quoted in the tables. The second script draws the three figures.',
      ],
      links: [
        { href: `${assetPath}/unit7-experiments.py`, label: 'Download the experiment script (Python)' },
        { href: `${assetPath}/unit7-figures.py`, label: 'Download the figure script (Python)' },
      ],
    },
  ],
  children: [
    {
      label: 'Simple perceptron',
      sections: [
        {
          heading: 'Original notebook',
          paragraphs: [
            'The notebook builds a single neuron with NumPy. The inputs [45, 25] are multiplied by the weights [0.7, 0.1] with a dot product, giving a sum of 34. A step function then outputs 1 because the sum is at least 1. With the weights [−0.7, 0.1], the sum is −29 and the output is 0. The notebook explains that the dot product replaces the for loop used in the previous lecture and is much faster on large datasets.',
          ],
        },
        {
          heading: 'What I changed',
          paragraphs: [
            'I tried different inputs and weights, including the same inputs on a smaller scale. For each case I recorded the output with the notebook’s threshold of 1 and with the more usual threshold of 0. I also timed the dot product against a plain Python loop for vectors of different lengths.',
          ],
          tables: [
            {
              headers: ['Inputs', 'Weights', 'Sum', 'Output (threshold 1)', 'Output (threshold 0)'],
              rows: [
                ['[45, 25] (notebook)', '[0.7, 0.1]', '34.00', '1', '1'],
                ['[45, 25] (notebook)', '[−0.7, 0.1]', '−29.00', '0', '0'],
                ['[0.45, 0.25] (divided by 100)', '[0.7, 0.1]', '0.34', '0', '1'],
                ['[1, 3]', '[0.7, 0.1]', '1.00', '1', '1'],
                ['[1, 3]', '[−0.7, 0.1]', '−0.40', '0', '0'],
                ['[45, 25]', '[0, 0]', '0.00', '0', '1'],
              ],
              caption: 'Table 1. Output of the single neuron for different inputs, weights and thresholds.',
            },
            {
              headers: ['Vector length', 'Python loop', 'NumPy dot product', 'Speed-up'],
              rows: [
                ['2 (notebook)', '0.26 µs', '0.41 µs', '0.6×'],
                ['1,000', '78.7 µs', '0.46 µs', '173×'],
                ['1,000,000', '81.3 ms', '0.30 ms', '272×'],
              ],
              caption: 'Table 2. Time for one weighted sum. Exact timings vary between runs and machines.',
            },
          ],
          code: `def sum_func(inputs, weights):
    return inputs.dot(weights)

def step_function(s, threshold=1):     # notebook uses 1
    return 1 if s >= threshold else 0

for inputs, weights in [([45, 25], [0.7, 0.1]), ([0.45, 0.25], [0.7, 0.1])]:
    s = sum_func(np.array(inputs), np.array(weights))
    print(inputs, weights, s, step_function(s), step_function(s, 0))`,
          figures: [
            {
              src: `${assetPath}/unit7-perceptron-boundary.png`,
              alt: 'Two plots of x1 against x2. On the left, the lines where the sum equals 1 for weights [0.7, 0.1] and [−0.7, 0.1] cross near the origin, and the point (45, 25) lies far from both. On the right, with weights [0.7, 0.1], the shaded region that outputs 1 lies to the right of a steep line. The rescaled point (0.45, 0.25) falls outside it and (1, 3) lies exactly on the line.',
              caption: 'Figure 1. The line where the weighted sum equals the threshold separates inputs that output 1 from inputs that output 0.',
            },
          ],
        },
        {
          heading: 'What I observed',
          paragraphs: [
            'A perceptron is a linear classifier. The step function outputs 1 on one side of the line 0.7·x1 + 0.1·x2 = 1 and 0 on the other (Figure 1). The weights set the angle of the line and the threshold sets its position. Changing the weight on x1 from 0.7 to −0.7 rotated the line, so the same input moved from one side to the other. With the second set of weights and x1 = 45, x2 would need to reach 325 before the output changed to 1.',
            'The scale of the inputs matters as much as the weights. Dividing the inputs by 100 changed the sum from 34 to 0.34, which flipped the output from 1 to 0, even though the inputs carried the same information. Units in this neuron are not neutral, because the threshold is fixed at 1 and does not change with the data. This is one reason neural network inputs are usually normalised before training.',
            'The threshold of 1 acts as a hidden bias. With all weights set to 0, the notebook’s neuron outputs 0, but with a threshold of 0 it outputs 1. Most implementations use a threshold of 0 and a separate bias weight, which the network can learn. In this notebook, the decision point is fixed by hand and cannot be learned.',
            'The notebook’s claim about speed is true for large vectors but not for small ones. With two inputs the Python loop was slightly faster, because calling into NumPy has a fixed cost. At 1,000 elements the dot product was about 170 times faster, and at a million elements about 270 times faster. Vectorisation matters because real networks multiply large matrices, not two numbers.',
          ],
        },
      ],
    },
    {
      label: 'Perceptron AND operator',
      sections: [
        {
          heading: 'Original notebook',
          paragraphs: [
            'The notebook trains a perceptron to reproduce the AND operator on the four inputs (0,0), (0,1), (1,0) and (1,1). Both weights start at 0, and the learning rate is 0.1. After each wrong prediction, each weight increases by learning rate × input × error, and training stops when a full pass through the data makes no errors. It converges after six epochs with the weights [0.5, 0.5], and then classifies all four inputs correctly.',
          ],
        },
        {
          heading: 'What I changed',
          paragraphs: [
            'I changed the learning rate and the starting weights, and then trained the same code on the OR, NAND and XOR operators. The training loop has no limit on the number of epochs and runs until the error reaches 0, so I capped it at 1,000 epochs. Without the cap, any problem it cannot solve would make the loop run forever.',
            'The notebook’s update rule uses abs(outputs[i] − prediction), so the error is never negative and the weights can only increase. I therefore also wrote a corrected version that uses the signed error and learns a bias with a threshold of 0, which is the standard perceptron rule (Rosenblatt, 1958).',
          ],
          tables: [
            {
              headers: ['Learning rate', 'Epochs to converge', 'Final weights'],
              rows: [
                ['0.01', '51', '[0.50, 0.50]'],
                ['0.05', '12', '[0.55, 0.55]'],
                ['0.1 (notebook)', '6', '[0.50, 0.50]'],
                ['0.3', '3', '[0.60, 0.60]'],
                ['0.5', '2', '[0.50, 0.50]'],
                ['1.0', 'Never (stopped at 1,000)', '[1,000, 1,000]'],
              ],
              caption: 'Table 3. Effect of the learning rate on training the AND operator with the notebook’s rule.',
            },
            {
              headers: ['Operator', 'Notebook rule (abs error, threshold 1)', 'Corrected rule (signed error, learned bias)'],
              rows: [
                ['AND', 'Learned in 6 epochs', 'Learned in 4 epochs'],
                ['OR', 'Learned in 10 epochs', 'Learned in 4 epochs'],
                ['NAND', 'Never: weights grow to 100.4 and 2 of 4 outputs are wrong', 'Learned in 6 epochs'],
                ['XOR', 'Never: weights grow to 100.4', 'Never: the weights keep changing'],
              ],
              caption: 'Table 4. Which logic operators each version of the perceptron can learn (limit 1,000 epochs).',
            },
          ],
          code: `def train(y, lr=0.1, max_epochs=1000):          # corrected rule
    w = np.zeros(2); b = 0.0
    for epoch in range(1, max_epochs + 1):
        total = 0
        for i in range(len(y)):
            err = y[i] - step_function(X[i].dot(w) + b, 0)   # signed, not abs()
            total += abs(err)
            w = w + lr * err * X[i]; b += lr * err
        if total == 0:
            return epoch, w, b
    return None, w, b                              # no solution found`,
          figures: [
            {
              src: `${assetPath}/unit7-logic-gates.png`,
              alt: 'Four panels showing the four inputs of each operator coloured by target. For AND, OR and NAND a learned straight line separates the green target 1 points from the orange target 0 points. For XOR the two green points sit on opposite corners and no line is drawn.',
              caption: 'Figure 2. Lines learned by the corrected perceptron. No straight line can separate the XOR targets.',
            },
          ],
        },
        {
          heading: 'What I observed',
          paragraphs: [
            'Within a safe range, the learning rate traded speed against precision. Raising it from 0.01 to 0.5 cut training from 51 epochs to 2, and every run found a working pair of weights. The final weights differed slightly because larger steps overshoot the smallest weights that would work. At a learning rate of 1.0 the perceptron never converged. The first update moved both weights to 1. After that, the input (0,1) produced a sum of exactly 1, which counted as a 1 and was therefore an error. Because abs() makes the error positive, every correction increased the weights again and the error could never be fixed.',
            'The same flaw explains the starting-weight results. Starting from [−1, −1], the weights climbed to [0.6, 0.6] in 17 epochs. Starting from [1, 0], the input (1,0) was already wrongly classified as 1, and the rule could only push the weight higher, so it grew to 101 with the error unchanged. The notebook’s rule only works when every mistake is a missed 1. That is why it learns AND and OR, which only need the weights to grow, but fails on NAND, which needs negative weights.',
            'The corrected rule learned AND, OR and NAND in four to six epochs (Figure 2), but still failed on XOR. This is not an implementation problem. A single perceptron can only draw one straight line, and XOR’s two positive cases sit on opposite corners, so no straight line can separate them. Minsky and Papert (1969) showed this limitation formally. It is the reason for the multi-layer network in the next notebook.',
            'The training loop itself is also a risk. A loop that ends only when the error reaches 0 hangs on any problem that has no exact solution, which, as the notebook’s own note says, includes almost all real-world data. A maximum number of epochs, or a stopping rule based on the error no longer improving, is essential.',
          ],
        },
      ],
    },
    {
      label: 'Multi-layer perceptron and the sigmoid function',
      sections: [
        {
          heading: 'Original notebook',
          paragraphs: [
            'The notebook replaces the step function with the sigmoid, 1 / (1 + e^−x), which maps any sum to a value between 0 and 1 and has a smooth gradient. It builds a network with two inputs, three hidden neurons and one output, and trains it on XOR using backpropagation. The output error is multiplied by the sigmoid’s derivative and passed back through the transposed weight matrices to update both layers. One cell deliberately fails with a shape error to show why weights_1 must be transposed. The notebook first works through one epoch step by step from fixed starting weights, then repeats the process for 400,000 epochs from random weights with a learning rate of 0.6. Its saved run reaches a mean error of 0.008, and the rounded outputs match XOR exactly.',
          ],
        },
        {
          heading: 'What I changed',
          paragraphs: [
            'After correcting the weights1 name, I trained the full network from the lecture’s fixed starting weights, so that the result is reproducible. The notebook’s random weights are not seeded, so each run gives different numbers. I recorded the error every 200 epochs instead of every 100,000. I then varied the learning rate and the number of hidden neurons, retrained from 50 random seeds per setting, and repeated the tests with a bias term added to each layer. I counted a run as solved only if every output ended within 0.2 of its target, so that an undecided output of 0.5 could not be rounded to the right answer by chance.',
          ],
          tables: [
            {
              headers: ['Learning rate', 'Mean error', 'Output for (0,0), (0,1), (1,0), (1,1)', 'Solved'],
              rows: [
                ['0.1', '0.165', '0.05, 0.95, 0.95, 0.51', 'No'],
                ['0.3', '0.144', '0.03, 0.98, 0.98, 0.50', 'No'],
                ['0.6 (notebook)', '0.138', '0.02, 0.98, 0.98, 0.50', 'No'],
                ['1.0', '0.135', '0.01, 0.99, 0.99, 0.50', 'No'],
                ['3.0', '0.047', '0.05, 0.96, 0.96, 0.06', 'Yes'],
                ['10.0', '0.009', '0.01, 0.99, 0.99, 0.01', 'Yes'],
              ],
              caption: 'Table 5. XOR after 20,000 epochs from the lecture’s starting weights. Target outputs are 0, 1, 1, 0.',
            },
            {
              headers: ['Hidden neurons', 'Solved, no bias (notebook design)', 'Median error, no bias', 'Solved, with bias'],
              rows: [
                ['1', '0 / 50', '0.491', '0 / 50'],
                ['2', '10 / 50', '0.258', '40 / 50'],
                ['3 (notebook)', '44 / 50', '0.027', '50 / 50'],
                ['4', '50 / 50', '0.016', '—'],
                ['8', '50 / 50', '0.013', '—'],
              ],
              caption: 'Table 6. XOR runs solved from 50 random starting weights (20,000 epochs, learning rate 0.6).',
            },
          ],
          code: `for epoch in range(epochs):
    hidden_layer = sigmoid(np.dot(inputs, weights_0))
    output_layer = sigmoid(np.dot(hidden_layer, weights_1))
    error_output_layer = outputs - output_layer

    delta_output = error_output_layer * sigmoid_derivative(output_layer)
    delta_hidden_layer = delta_output.dot(weights_1.T) \\
                         * sigmoid_derivative(hidden_layer)   # was weights1.T

    weights_1 = weights_1 + hidden_layer.T.dot(delta_output) * learning_rate
    weights_0 = weights_0 + inputs.T.dot(delta_hidden_layer) * learning_rate`,
          figures: [
            {
              src: `${assetPath}/unit7-xor-training.png`,
              alt: 'Left: mean error over 400,000 epochs. It falls quickly to about 0.13, stays flat until roughly epoch 92,000, then drops below 0.05 and slowly approaches 0.008. The notebook’s four recorded points join into a smooth curve that hides the plateau. Right: the output for each input. (0,0), (0,1) and (1,0) reach their targets within a few thousand epochs, while (1,1) stays at 0.5 until about epoch 92,000 and then falls to near 0.',
              caption: 'Figure 3. Training on XOR from the lecture’s starting weights (learning rate 0.6).',
            },
          ],
        },
        {
          heading: 'What I observed',
          paragraphs: [
            'The hidden layer solves the problem that defeated the single perceptron. After 400,000 epochs from the lecture’s weights, the outputs were 0.009, 0.993, 0.993 and 0.010, and the mean error was 0.008, close to the notebook’s saved result. The trained weights show how. Two hidden neurons became detectors for “x1 but not x2” and “x2 but not x1”, each with a weight of about +6 on one input and −13 on the other. The output neuron adds them together, which is exactly how XOR is defined. The third neuron, with a large negative output weight, pushes the result towards 0 when neither detector fires, doing the job a bias would normally do. Two straight lines combined give a region that one line cannot.',
            'The notebook’s error plot hides the most important part of training. It records the error only every 100,000 epochs, so its plot shows a smooth decline from four points. Recording every 200 epochs (Figure 3) showed that the network quickly learned three of the four cases, then sat on a plateau. For about 90,000 epochs the output for (1,1) stayed at 0.50, the point of maximum uncertainty, and the error barely changed. It escaped only at around epoch 92,000. Stopping at 20,000 or 50,000 epochs, which would look reasonable, leaves a network that cannot classify (1,1) at all.',
            'Larger learning rates escaped the plateau sooner from this starting point. At 0.1 to 1.0 the network was still stuck after 20,000 epochs, while 3.0 and 10.0 solved XOR within that time. This should not be generalised: a learning rate that is too large can make training unstable on real data. What it shows is that the plateau is a slow region of the error surface, not a true limit of the network.',
            'Network size and starting point both decide whether training succeeds. With one hidden neuron the network failed every time, because one neuron draws only one line. With two neurons, the minimum XOR needs in theory, only 10 of 50 random starts succeeded. The notebook’s three neurons succeeded 44 times out of 50, and four or more succeeded every time. Adding a bias term to each layer, which the notebook omits, raised the two-neuron success rate from 10 to 40 out of 50 and the three-neuron rate to 50 out of 50. Without a bias, the input (0,0) always produces a hidden activation of exactly 0.5, whatever the weights, so the network has less freedom. The same weakness appeared with AND, which a single perceptron can learn. From the lecture’s weights, the network without a bias left (1,1) stuck at 0.50 even after 200,000 epochs. Across 50 random starts, the network without a bias learned AND 38 times, against 50 times with a bias.',
            'Two smaller points from the notebook are worth correcting. Its cells calculate 1 − 0.0082 = 0.992 after the comment that the error is very low, which reads like 99% accuracy, but the mean absolute error is not accuracy. The rounded predictions were 4 out of 4 correct, and on four training points that says nothing about performance on new data. Also, with NumPy the sigmoid of a large negative number such as −1,000 raises an overflow warning in np.exp, although it still returns 0. Production libraries use a numerically stable form of the function.',
          ],
        },
      ],
    },
    {
      label: 'Reflection and learning outcomes',
      sections: [
        {
          heading: 'What the three notebooks show together',
          paragraphs: [
            'The three notebooks repeat the history of the field in miniature. A single neuron with a step function is a linear classifier, so its result depends on which side of a line an input falls, and that line moved whenever I changed the inputs’ scale or the threshold. Training it on AND worked, but the same rule failed on NAND because of one abs() call, and no rule could make it learn XOR. Adding a hidden layer and a differentiable sigmoid made backpropagation possible (Rumelhart, Hinton and Williams, 1986) and solved XOR, but brought new problems: plateaus, sensitivity to random starting weights, and the need to choose the network size, learning rate and number of epochs.',
            'As in the regression activity, the most serious failures produced no error message. The abs() rule kept increasing the weights for 1,000 epochs without complaint. The multi-layer notebook ran to the end and produced a plot even though its training loop had crashed after one epoch, and its saved outputs could not be reproduced from its own code. The plateau looked like a model that had finished learning. For the learning outcome on applying and evaluating machine learning algorithms, this means that the training process itself must be checked: record the loss often enough to see its shape, fix the random seed, test more than one starting point, compare against a simple baseline, and put a limit on every training loop. A model is only understood once it has been seen to fail as well as succeed.',
          ],
        },
        {
          heading: 'Legal, social, ethical and professional issues',
          paragraphs: [
            'Reproducibility is a professional obligation, not only a technical one. The multi-layer notebook’s published outputs depend on a variable that its code never creates, and its random starting weights are not seeded, so nobody can regenerate the exact result. In teaching material this causes confusion. In a deployed system it would mean that a model’s reported performance could not be audited. The BCS Code of Conduct asks members not to misrepresent the quality of their work (BCS, 2022). Publishing code, seeds and data alongside a result, as I have done with the scripts for this entry, is how that claim can be checked.',
            'The seed experiments also show that two runs of the same network on the same data can give different results: one classifies every case correctly, and another leaves a case at 0.5. If a network deciding on people’s applications gave different answers depending on its random initialisation, the decision for an individual would partly depend on chance. Where such systems make decisions with legal or similarly significant effects, UK GDPR Article 22 and the ICO’s guidance on explaining AI decisions require organisations to be able to justify them (ICO and The Alan Turing Institute, 2022). Even this small network’s reasoning had to be reconstructed from its trained weights, and larger networks are much harder to explain. That is a reason to document how each model was trained and to test its stability before relying on it.',
          ],
        },
      ],
      references: [
        'BCS, The Chartered Institute for IT (2022) BCS Code of Conduct. Swindon: BCS.',
        'Goodfellow, I., Bengio, Y. and Courville, A. (2016) Deep learning. Cambridge, MA: MIT Press.',
        'Information Commissioner’s Office and The Alan Turing Institute (2022) Explaining decisions made with AI. Wilmslow: ICO.',
        'Minsky, M. and Papert, S. (1969) Perceptrons: an introduction to computational geometry. Cambridge, MA: MIT Press.',
        'Rosenblatt, F. (1958) ‘The perceptron: a probabilistic model for information storage and organization in the brain’, Psychological Review, 65(6), pp. 386–408.',
        'Rumelhart, D.E., Hinton, G.E. and Williams, R.J. (1986) ‘Learning representations by back-propagating errors’, Nature, 323(6088), pp. 533–536.',
      ],
    },
  ],
};
