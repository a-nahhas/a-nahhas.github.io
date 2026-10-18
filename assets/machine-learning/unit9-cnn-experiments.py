# Unit 9: CNN object recognition (CIFAR-10). This script reruns the notebook's model and the experiments in the e-portfolio entry.
# Notebook fixes: predict_classes() was removed in TF 2.6 (use argmax of predict()); array_to_img now lives in keras.utils.
import json, random, sys
import numpy as np
import tensorflow as tf
import keras
from keras.datasets import cifar10
from keras.models import Sequential
from keras.layers import Dense, Conv2D, MaxPool2D, Flatten, Input
from keras.callbacks import EarlyStopping
from keras.utils import to_categorical
from sklearn.metrics import classification_report, confusion_matrix

tf.config.experimental.enable_op_determinism()   # same seeds -> same run on this machine
LABEL_NAMES = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
INDICES = list(range(1, 17))                      # x_test[1] .. x_test[16]; 16 is the notebook's own example

(x_train_all, y_train_all), (x_test, y_test) = cifar10.load_data()
x_train_all = x_train_all / 255.0
x_test = x_test / 255.0
y_cat_train_all = to_categorical(y_train_all, 10)
y_cat_test = to_categorical(y_test, 10)
VALIDATION_SIZE = 10000
x_val, y_val_cat = x_train_all[:VALIDATION_SIZE], y_cat_train_all[:VALIDATION_SIZE]
x_train, y_cat_train = x_train_all[VALIDATION_SIZE:], y_cat_train_all[VALIDATION_SIZE:]

def build():
    model = Sequential([
        Input((32, 32, 3)),
        Conv2D(32, (4, 4), activation='relu'), MaxPool2D((2, 2)),
        Conv2D(32, (4, 4), activation='relu'), MaxPool2D((2, 2)),
        Flatten(),                                # 5 x 5 x 32 = 800 values, not 3,072 as the notebook comment says
        Dense(256, activation='relu'),
        Dense(10, activation='softmax'),
    ])
    model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

def run(np_seed, tf_seed, restore_best=False):
    random.seed(np_seed); np.random.seed(np_seed); tf.random.set_seed(tf_seed)
    model = build()
    early_stop = EarlyStopping(monitor='val_loss', patience=2, restore_best_weights=restore_best)
    history = model.fit(x_train, y_cat_train, epochs=25, validation_data=(x_val, y_val_cat),
                        callbacks=[early_stop], verbose=2)
    loss, acc = model.evaluate(x_test, y_cat_test, verbose=0)
    probs = model.predict(x_test, verbose=0)
    predictions = np.argmax(probs, axis=-1)
    report = classification_report(y_test, predictions, target_names=LABEL_NAMES, output_dict=True)
    singles = []
    for i in INDICES:
        p = probs[i]; top = np.argsort(p)[::-1]
        singles.append(dict(index=i, true=LABEL_NAMES[y_test[i][0]], pred=LABEL_NAMES[top[0]],
                            conf=float(p[top[0]]), second=LABEL_NAMES[top[1]], second_conf=float(p[top[1]]),
                            true_conf=float(p[y_test[i][0]])))
    wrong = predictions != y_test[:, 0]
    maxp = probs.max(axis=1)
    return dict(seeds=[np_seed, tf_seed], restore_best=restore_best, epochs=len(history.history['loss']),
                history=history.history, test_loss=loss, test_acc=acc,
                per_class={k: report[k] for k in LABEL_NAMES},
                confusion=confusion_matrix(y_test, predictions).tolist(),
                singles=singles,
                wrong_conf_mean=float(maxp[wrong].mean()), right_conf_mean=float(maxp[~wrong].mean()),
                wrong_over_90=int((maxp[wrong] > 0.9).sum()), n_wrong=int(wrong.sum()))

results = []
for np_seed, tf_seed in [(888, 112), (1, 1), (2, 2)]:
    results.append(run(np_seed, tf_seed))
results.append(run(888, 112, restore_best=True))
json.dump(results, open(sys.argv[1] if len(sys.argv) > 1 else 'unit9-results.json', 'w'), indent=1)

for r in results:
    print(f"\nseeds={r['seeds']} restore_best={r['restore_best']} epochs={r['epochs']} test_acc={r['test_acc']:.4f}")
    print('  recall: ' + ', '.join(f"{k} {v['recall']:.2f}" for k, v in r['per_class'].items()))
    print(f"  mean confidence right={r['right_conf_mean']:.3f} wrong={r['wrong_conf_mean']:.3f}; wrong with >90% confidence: {r['wrong_over_90']}/{r['n_wrong']}")
    for s in r['singles']:
        mark = 'OK ' if s['true'] == s['pred'] else 'XX '
        print(f"  {mark}x_test[{s['index']:2d}] true={s['true']:10s} pred={s['pred']:10s} {s['conf']:.2f}  2nd={s['second']} {s['second_conf']:.2f}")
