const assetPath = '../../assets/machine-learning';

export default {
  label: 'CNNs: Object Recognition and Facial Recognition Ethics',
  text: 'Unit 9 · Two activities: read Wall (2019) and record my thoughts on the ethical and social implications of CNN technology, then run the CIFAR-10 object recognition notebook, review its sections and change the prediction image from x_test[16] to other values between 1 and 15. The sub-entries cover the reading, my review of the notebook and the prediction experiment. I wrote the reflection after running the model, because the experiment changed how I read the article. The last one links the results to earlier units and the module’s learning outcomes.',
  sections: [
    {
      heading: 'Setup',
      paragraphs: [
        'I ran the notebook in a local Python 3.12 environment (TensorFlow 2.21, Keras 3.15, scikit-learn 1.9) on CPU. Two cells no longer run on current versions. model.predict_classes() was removed in TensorFlow 2.6, so I replaced it with np.argmax(model.predict(...)), as the notebook already does for the full test set. array_to_img has moved from keras.preprocessing.image to keras.utils. I kept the notebook’s seeds (888 for NumPy, 112 for TensorFlow) and turned on TensorFlow’s deterministic operations, so the same seeds always produce the same model on this machine.',
        'To see how much the results depend on chance, I trained the same model three times with different seed pairs (888/112, 1/1 and 2/2). I then trained it once more with the original seeds, this time keeping the weights from the epoch with the lowest validation loss. The script below reproduces every figure and number in this entry.',
      ],
      links: [
        { href: `${assetPath}/unit9-cnn-experiments.py`, label: 'Download the experiment script (Python)' },
        { href: `${assetPath}/unit9-figures.py`, label: 'Download the figure script (Python)' },
        { href: `${assetPath}/unit9-results.json`, label: 'Download the raw results (JSON)' },
      ],
    },
  ],
  children: [
    {
      label: 'Reading: Wall (2019) on facial recognition',
      sections: [
        {
          heading: 'The article',
          paragraphs: [
            'Wall (2019) opens with a thought experiment. Facial recognition (FR) spots a suspected suicide bomber in a crowd and armed officers stop him before he can act. Then Wall asks what happens if the match was wrong and the person was just someone who looked similar. The article goes on to report Buolamwini and Gebru’s finding that commercial systems struggle more with darker skin. It quotes Gebru’s warning that the original datasets are “mostly white and male”. It notes San Francisco’s ban, UK police trials in South Wales, London, Manchester and Leicester, the University of Essex finding that matches in the Metropolitan Police trials were wrong 80% of the time, and Ed Bridges’ legal challenge. It also sets Amazon’s position that it is not responsible for how customers use Rekognition against Salesforce’s view that some uses of AI should not happen at all.',
          ],
        },
        {
          heading: 'Error has a victim, and the victim did not choose the system',
          paragraphs: [
            'What stayed with me most is that the thought experiment is not really about accuracy. It is about who pays when the system is wrong. In most of the models I have built in this module, an error is a number in a table. In live FR, a false match means a real person is stopped, searched or, in Wall’s extreme case, killed, and that person never agreed to be scanned. The benefits of FR go to the institution that deploys it, while the cost of its errors falls on people who had no say in it. That asymmetry is the core ethical problem, and no improvement in accuracy fully removes it.',
          ],
        },
        {
          heading: 'A single accuracy figure hides who bears the errors',
          paragraphs: [
            'Gebru’s point about training data became concrete when I ran the CIFAR-10 model. Its overall test accuracy was 61.2%, but that one figure hid recall ranging from 50% for dogs to 76% for ships. The model labelled many dogs, deer and birds as cats, so when it said “cat” it was right only 36% of the time. Buolamwini and Gebru (2018) found the same pattern in commercial gender classifiers, with error rates of up to 34.7% for darker-skinned women and 0.8% for lighter-skinned men. A system can look accurate overall while failing badly for one group. The network has no concept of fairness: it minimises average loss, so the groups that are rarer or harder in the training data absorb more of the error. Unless someone measures and publishes results for each group, nobody will notice.',
            'The second thing my experiment showed was that the unevenness is not even stable. Retraining the identical model with different random seeds changed overall accuracy by only 2.9 points (61.2% to 64.1%), but horse recall moved by 22 points and cat recall by 17. A supplier could truthfully report almost the same headline accuracy for two versions of a system while the error burden had shifted sharply between groups. Subgroup testing would therefore have to be repeated for every model update, not done once at procurement.',
          ],
        },
        {
          heading: 'Why “wrong 80% of the time” can come from an accurate system',
          paragraphs: [
            'The Essex figure (Fussey and Murray, 2019) is often read as proof that the software is bad, but it partly reflects base rates. Suppose 1 in 10,000 people passing a camera is on a watchlist and the system wrongly flags only 1 in 1,000 innocent people. For every 10,000 faces it would still raise about ten false alerts for each genuine one, so roughly 90% of its alerts would be wrong. Scanning crowds for rare individuals means false matches will outnumber true ones unless the system is extraordinarily precise. For me, the lesson is that a vendor’s accuracy claim says little about what will happen on a street. What matters is the expected number of innocent people stopped per deployment, broken down by group, and that is the figure the public should be given.',
          ],
        },
        {
          heading: 'A CNN always gives an answer, often with confidence',
          paragraphs: [
            'A softmax classifier always chooses one of the classes it knows and gives no option for “none of these” or “not sure”. In my runs, 374 of the 3,879 wrong predictions were made with over 90% confidence, and one frog image (x_test[4]) was classified as a deer by all four models, once with 94% confidence. In FR, a confident score could lead an officer to trust a match they should question, which is a form of automation bias. That makes the match threshold a policy decision, not a technical setting. Wilding and Boffey (2025) report that the National Physical Laboratory found the Police National Database’s FR search produced false positives for Black women almost 100 times more often than for white women at some settings. A higher threshold that reduced the bias was ordered in September 2024 and then reversed a month later, after forces complained that it produced fewer investigative leads. Six years after Wall wrote, the trade-off he described is still being made, out of public view, in favour of operational convenience.',
          ],
        },
        {
          heading: 'Responsibility cannot be passed to the customer',
          paragraphs: [
            'Amazon’s position that it is not responsible for how customers use its product does not satisfy me. The BCS Code of Conduct asks members to have due regard for the privacy and wellbeing of others and to work without discrimination (BCS, 2022). A developer who knows a system performs worse for some groups, and sells it for a high-stakes use anyway, is not neutral. Salesforce’s question, whether AI should be used at all in a given scenario, is the one I would want a project team to ask before asking how accurate the model is. It also applies to training data. CIFAR-10 is a subset of the 80 Million Tiny Images collection, which its creators withdrew in 2020 after an audit found offensive labels and images collected without consent (Prabhu and Birhane, 2020). Even a benchmark as ordinary as the one I trained on rests on images of people and property that nobody agreed to contribute.',
          ],
        },
        {
          heading: 'What has changed since 2019, and my position',
          paragraphs: [
            'Some of the questions Wall raised have since been tested. In R (Bridges) v Chief Constable of South Wales Police [2020] the Court of Appeal found the force’s use of live FR unlawful. It held that the legal framework left officers too much discretion, that the data protection impact assessment was deficient, and that the force had not done enough to check whether the software was biased by race or sex. The EU AI Act now prohibits real-time remote biometric identification in public spaces for law enforcement, apart from narrow exceptions (Regulation (EU) 2024/1689, Article 5). The UK has not adopted a similar ban, and the 2025 NPL findings show that the bias problem has not gone away.',
            'My view is that FR is not acceptable or unacceptable in itself. Matching a passport photo to its holder with consent is very different from scanning everyone in a shopping street. For the second kind of use, I would accept deployment only under specific conditions: a clear legal basis; independent testing with results published for each demographic group; disclosure of the threshold and of how many false alerts each deployment produced; a human reviewer who is trained to challenge matches rather than confirm them; and a route for anyone stopped to find out why and contest it. Running the CNN showed me how easily a model can be confidently and unevenly wrong, which is why I think these safeguards should be treated as requirements, not optional extras.',
          ],
        },
      ],
      references: [
        'BCS, The Chartered Institute for IT (2022) BCS Code of Conduct. Swindon: BCS.',
        'Buolamwini, J. and Gebru, T. (2018) ‘Gender shades: intersectional accuracy disparities in commercial gender classification’, Proceedings of the 1st Conference on Fairness, Accountability and Transparency, PMLR 81, pp. 77–91.',
        'Fussey, P. and Murray, D. (2019) Independent Report on the London Metropolitan Police Service’s Trial of Live Facial Recognition Technology. Colchester: University of Essex Human Rights Centre.',
        'Prabhu, V.U. and Birhane, A. (2020) ‘Large image datasets: a pyrrhic win for computer vision?’, arXiv:2006.16923.',
        'R (Bridges) v Chief Constable of South Wales Police [2020] EWCA Civ 1058.',
        'Regulation (EU) 2024/1689 of the European Parliament and of the Council laying down harmonised rules on artificial intelligence (Artificial Intelligence Act), Article 5.',
        'Wall, M. (2019) ‘Biased and wrong? Facial recognition tech in the dock’, BBC News, 8 July. Available at: https://www.bbc.co.uk/news/business-48842750 (Accessed: 18 October 2026).',
        'Wilding, M. and Boffey, D. (2025) ‘UK police forces lobbied to use biased facial recognition technology’, Liberty Investigates, 10 December.',
      ],
    },
    {
      label: 'Reviewing the notebook',
      sections: [
        {
          heading: 'Data and preprocessing',
          paragraphs: [
            'The notebook loads CIFAR-10: 50,000 training and 10,000 test images, each 32 × 32 pixels with three colour channels and one of ten labels (Krizhevsky, 2009). Pixel values are divided by 255 to scale them to between 0 and 1, and the labels are one-hot encoded with to_categorical. The first 10,000 training images become a validation set, leaving 40,000 for training. Keeping validation and test data separate is good practice: early stopping uses the validation set to decide when to stop, so the test set stays untouched until the final evaluation.',
            'Two notebook comments are inaccurate. A comment says the first training image “corresponds to Automobile”, but the next cell shows its label is frog. A markdown cell recommends a 60/20/20 split, while the code actually uses 40,000/10,000/10,000 out of 60,000 images, roughly 67/17/17.',
          ],
        },
        {
          heading: 'The model',
          paragraphs: [
            'The network has two convolution-and-pooling blocks followed by two dense layers. Each convolutional layer slides 32 learned 4 × 4 filters over its input, so early filters respond to simple edges and colour patches and later ones to combinations of them. Each max-pooling layer halves the width and height, keeping the strongest response in each 2 × 2 patch. This reduces computation and makes the features less sensitive to exactly where an object appears. The comment above Flatten says it flattens 32 × 32 × 3 = 3,072 values, but by that point the data is 5 × 5 × 32, so Flatten produces 800. The input_shape argument on the second Conv2D is ignored, because Keras only uses it on the first layer.',
          ],
          tables: [
            {
              headers: ['Layer', 'Output shape', 'Parameters', 'What it does'],
              rows: [
                ['Conv2D, 32 filters 4 × 4', '29 × 29 × 32', '1,568', 'Learns low-level features such as edges'],
                ['MaxPool2D 2 × 2', '14 × 14 × 32', '0', 'Halves the resolution'],
                ['Conv2D, 32 filters 4 × 4', '11 × 11 × 32', '16,416', 'Combines features into larger patterns'],
                ['MaxPool2D 2 × 2', '5 × 5 × 32', '0', 'Halves the resolution again'],
                ['Flatten', '800', '0', 'Turns the feature maps into one vector'],
                ['Dense, ReLU', '256', '205,056', 'Combines features into class evidence'],
                ['Dense, softmax', '10', '2,570', 'Outputs a probability for each class'],
              ],
              caption: 'Table 1. The notebook’s architecture (225,610 parameters in total). The figures match the notebook’s model.summary() output.',
            },
          ],
        },
        {
          heading: 'Training and evaluation',
          paragraphs: [
            'The convolutional layers hold only 8% of the parameters; 91% are in the first dense layer. Most of the model’s capacity is therefore in the part that discards spatial structure, which helps explain why it overfits quickly. Training accuracy kept rising to 74.7%, but validation loss stopped improving after epoch 6 (Figure 1). EarlyStopping with patience = 2 halted training at epoch 8. Because restore_best_weights is not set, though, the model it returns has the weights from epoch 8, two epochs after the best point. My original-seed run reached 61.2% test accuracy, below the notebook’s 67.0%. The notebook’s own output shows it ran for nine epochs on a different TensorFlow version and hardware, so an exact match was not expected.',
            'Restoring the best weights with the same seeds raised test accuracy to 62.5% and cut the number of wrong predictions made with over 90% confidence from 374 to 219. The extra epochs had made the model more confident without making it more accurate.',
          ],
          figures: [
            {
              src: `${assetPath}/unit9-training-and-recall.png`,
              alt: 'Left: training loss falls steadily from 1.61 to 0.73 over eight epochs, while validation loss falls to 1.12 at epoch 6 and then rises to 1.22. Right: recall for each class across three training runs with different seeds. Overall accuracy stays between 61.2% and 64.1%, but recall varies by up to 22 points for horse, 17 for cat and 16 for dog; dog and cat have the lowest recall and frog and ship the highest.',
              caption: 'Figure 1. Left: loss for the original-seed run. Right: recall per class for the same model trained with three different seed pairs.',
            },
          ],
        },
        {
          heading: 'Classification report and confusion matrix',
          paragraphs: [
            'The classification report showed what the overall accuracy hides. In the original-seed run, vehicles and ships were easier than animals: ship recall was 76%, while dog recall was 50% and deer recall 53%. Cat precision was only 36%. The model labelled 307 dogs, 150 deer and 135 birds as cats, so “cat” had become a fallback label for small, furry or brown images. The most common confusion in all four runs was dog predicted as cat. This is reasonable at 32 × 32 pixels, where the features that separate the two are only a few pixels wide. Across seeds, overall accuracy varied by less than three points, but recall for some classes varied by up to 22 points. Two models with almost the same headline score can therefore fail on different things.',
          ],
        },
      ],
      references: [
        'Krizhevsky, A. (2009) Learning Multiple Layers of Features from Tiny Images. Technical report. Toronto: University of Toronto.',
      ],
    },
    {
      label: 'Changing the prediction image',
      sections: [
        {
          heading: 'What I changed',
          paragraphs: [
            'The notebook predicts a single image, x_test[16], which is a dog, and the model gets it right. I replaced the index with every value from 1 to 15, and for each one I recorded the predicted class, the model’s confidence, its second choice and whether the prediction was correct. To check whether a given result was a property of the image or of one particular trained model, I repeated the same predictions with the three other trained models.',
          ],
          code: `i = 4                                   # tried every value from 1 to 15
plt.imshow(x_test[i])
my_image = x_test[i]

# SHAPE --> (num_images, width, height, color_channels)
probs = model.predict(my_image.reshape(1, 32, 32, 3))   # predict_classes() no longer exists
print(LABEL_NAMES[np.argmax(probs)], probs.max())
print(LABEL_NAMES[y_test[i][0]])`,
          figures: [
            {
              src: `${assetPath}/unit9-predictions-grid.png`,
              alt: 'Sixteen CIFAR-10 test images, x_test[1] to x_test[16], each labelled with its true class and the model’s prediction. Thirteen are correct. The three errors are a frog predicted as deer with 80% confidence, a white car on a red background predicted as dog with 36%, and an airplane against a blue sky predicted as cat with 24%.',
              caption: 'Figure 2. Predictions from the original-seed model. A green border means correct and an orange border means wrong; the percentage is the model’s confidence in its prediction.',
            },
          ],
          tables: [
            {
              headers: ['Index', 'True label', 'Prediction', 'Confidence', 'Second choice', 'Other models correct'],
              rows: [
                ['1', 'ship', 'ship ✓', '90%', 'airplane 9%', '3 of 3'],
                ['2', 'ship', 'ship ✓', '98%', 'truck 1%', '3 of 3'],
                ['3', 'airplane', 'airplane ✓', '79%', 'ship 20%', '1 of 3'],
                ['4', 'frog', 'deer ✗', '80%', 'cat 15%', '0 of 3'],
                ['5', 'frog', 'frog ✓', '50%', 'dog 37%', '3 of 3'],
                ['6', 'automobile', 'dog ✗', '36%', 'airplane 24%', '1 of 3'],
                ['7', 'frog', 'frog ✓', '56%', 'bird 41%', '3 of 3'],
                ['8', 'cat', 'cat ✓', '74%', 'dog 17%', '3 of 3'],
                ['9', 'automobile', 'automobile ✓', '70%', 'truck 30%', '2 of 3'],
                ['10', 'airplane', 'cat ✗', '24%', 'ship 24%', '0 of 3'],
                ['11', 'truck', 'truck ✓', '99%', 'automobile 1%', '3 of 3'],
                ['12', 'dog', 'dog ✓', '57%', 'cat 16%', '1 of 3'],
                ['13', 'horse', 'horse ✓', '94%', 'dog 6%', '3 of 3'],
                ['14', 'truck', 'truck ✓', '86%', 'automobile 14%', '3 of 3'],
                ['15', 'ship', 'ship ✓', '40%', 'airplane 39%', '1 of 3'],
                ['16 (notebook)', 'dog', 'dog ✓', '66%', 'cat 34%', '3 of 3'],
              ],
              caption: 'Table 2. Single-image predictions from the original-seed model, and how often the other three models (seeds 1/1, seeds 2/2 and the original seeds with the best weights restored) also got each image right.',
            },
          ],
        },
        {
          heading: 'What I observed',
          paragraphs: [
            'The original model classified 12 of the 15 new images correctly, which is better than its 61% test accuracy would suggest. With only 15 images, though, a run of good or bad luck is easy. The other three models scored 9, 10 and 11 out of 15 on the same images, so the result of this exercise depends heavily on which trained model happens to be used.',
            'The errors made sense once I looked at the images. The frog in x_test[4] sits among green grass and leaves, the kind of natural background that deer images usually have, and every model called it a deer. The airplane in x_test[10] is a fighter jet against a plain blue sky, but each model gave a different wrong answer (cat, deer or ship), and the original model put only 24% on its choice. The car in x_test[6] is set against a bright red background, which threw the original model off. These cases suggest the network relies heavily on background and colour, not only on the object’s shape. With 32 × 32 images and two convolutional layers, the background is a large share of the evidence it has to work with.',
            'Confidence was a useful but imperfect signal. The two wrong answers with the lowest confidence (24% and 36%) were warnings worth acting on. Yet the frog was misclassified with 80% confidence, more than several correct predictions such as x_test[5] at 50% and x_test[15] at 40%. Across the whole test set, wrong predictions averaged 61% confidence against 81% for correct ones. The two groups overlap, so a confidence threshold would filter out some errors but never all of them.',
            'Changing a single index made the difference between a correct prediction and a confident error visible in a way the summary metrics did not. Seeing that the same frog was a “deer” to every model, while other images flipped between right and wrong depending on the random seed, is what led me to the argument in my reflection on Wall (2019). In a high-stakes system, the question is not only how often the model is wrong, but which inputs it gets wrong, how consistently, and with how much confidence.',
          ],
        },
      ],
    },
    {
      label: 'Reflection and learning outcomes',
      sections: [
        {
          heading: 'What this activity adds to the earlier units',
          paragraphs: [
            'Several lessons from earlier activities came back at a larger scale. In Unit 3, polynomial regression showed that training R² kept rising while held-out error got worse. Here, training accuracy kept rising to 74.7% while validation loss had already turned upwards, and the notebook’s early stopping returned the weights from two epochs after the best point. In Unit 7, the multi-layer perceptron gave different results depending on its random starting weights. Here, the same CNN trained with three seed pairs gave nearly the same overall accuracy but very different results for individual classes and images. In Unit 8, the cost curve was the only reliable way to tell a run that was converging from one that was not. Here, the loss curves were what showed the model was overfitting, because the training output never warned about it.',
            'What is new is the scale of the evidence a model can hide. A two-variable regression can be checked by plotting it. A CNN with 225,610 parameters cannot, so it has to be judged through its outputs, and the overall accuracy alone said little. For the learning outcome on applying and evaluating machine learning algorithms, the practices I would now apply to any classifier are: report precision and recall for each class, not only accuracy; read the confusion matrix to find where the errors go; train with more than one seed and report the spread; restore the best validation weights instead of the last ones; and inspect individual wrong predictions, especially confident ones. Each of these found something the headline figure of 61.2% did not show.',
            'The activity also showed how a dataset’s challenges carry into the model. At 32 × 32 pixels, cats and dogs differ by only a few pixels, and backgrounds strongly predict the class, so the model learned that green grass means “deer” and could not unlearn it for a frog. A model can only learn what its training data makes easy to learn, which is the same issue Gebru raises about face datasets in Wall (2019), at a lower level of risk.',
          ],
        },
        {
          heading: 'Legal, social, ethical and professional issues',
          paragraphs: [
            'My reflection on Wall (2019) covers the ethics of facial recognition in detail, so here I focus on what the notebook itself shows about professional practice. Its saved output reports 67.0% test accuracy, but two of its cells no longer run, and its seeds do not make training deterministic on their own, so the reported figure cannot be reproduced exactly. As in Unit 7, a published result that cannot be regenerated cannot be audited. The BCS Code of Conduct asks members not to misrepresent the quality of their work (BCS, 2022). Publishing the script, the library versions and the raw results, as I have done for this entry, is the minimum that makes a performance claim checkable.',
            'The per-class results also suggest how such a model should be documented. Mitchell et al. (2019) propose model cards: short reports that state a model’s intended use and give its performance separately for the groups it will be used on. Applied to this CNN, a model card would show that one in two dogs is misclassified and that a “cat” prediction is wrong almost two times in three. For a system that classifies people, the same breakdown by demographic group is what would show who bears the errors. It is also the information that the police facial recognition deployments discussed in my reflection did not make public.',
          ],
        },
      ],
      references: [
        'BCS, The Chartered Institute for IT (2022) BCS Code of Conduct. Swindon: BCS.',
        'Mitchell, M., Wu, S., Zaldivar, A., Barnes, P., Vasserman, L., Hutchinson, B., Spitzer, E., Raji, I.D. and Gebru, T. (2019) ‘Model cards for model reporting’, Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT* ’19), pp. 220–229.',
      ],
    },
  ],
};
