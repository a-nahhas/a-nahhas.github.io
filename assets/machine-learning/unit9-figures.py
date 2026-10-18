# Figures for the Unit 9 entry, drawn from unit9-results.json (written by unit9-cnn-experiments.py).
import json, sys
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from keras.datasets import cifar10

out = sys.argv[1]
results = json.load(open('unit9-results.json'))
r = results[0]
(_, _), (x_test, y_test) = cifar10.load_data()

BG, PANEL, GRID, TEXT, MUTED = '#1a1a19', '#2a2a28', '#333331', '#ececea', '#bdbdb8'
BLUE, GREEN, ORANGE = '#3885e2', '#1a9a6c', '#e0602a'
plt.rcParams.update({'figure.facecolor': BG, 'axes.facecolor': BG, 'savefig.facecolor': BG,
                     'text.color': TEXT, 'axes.labelcolor': MUTED, 'xtick.color': MUTED, 'ytick.color': MUTED,
                     'axes.edgecolor': GRID, 'grid.color': GRID, 'font.size': 11,
                     'axes.spines.top': False, 'axes.spines.right': False})

# Figure 1: the sixteen test images and the model's predictions
fig, axes = plt.subplots(2, 8, figsize=(15.75, 6.0))
for ax, s in zip(axes.flat, r['singles']):
    ax.imshow(x_test[s['index']], interpolation='nearest')
    ok = s['true'] == s['pred']
    for sp in ax.spines.values():
        sp.set_visible(True); sp.set_color(GREEN if ok else ORANGE); sp.set_linewidth(3)
    ax.set_xticks([]); ax.set_yticks([])
    ax.set_title(f"x_test[{s['index']}]\ntrue: {s['true']}", fontsize=10, color=TEXT)
    ax.set_xlabel(f"{'✓' if ok else '✗'} {s['pred']} {s['conf']:.0%}", fontsize=10,
                  color=GREEN if ok else ORANGE)
n_ok = sum(s['true'] == s['pred'] for s in r['singles'])
fig.suptitle(f"Predictions for test images 1–16: {n_ok} of 16 correct (label and confidence below each image)", fontsize=14)
fig.tight_layout(h_pad=2.2)
fig.savefig(f'{out}/unit9-predictions-grid.png', dpi=110)

# Figure 2: training curves and per-class recall
fig, (a1, a2) = plt.subplots(1, 2, figsize=(14.3, 5.6))
h = r['history']; ep = np.arange(1, len(h['loss']) + 1)
a1.plot(ep, h['loss'], color=BLUE, lw=2.2, marker='o', ms=4, label='training loss')
a1.plot(ep, h['val_loss'], color=ORANGE, lw=2.2, marker='o', ms=4, label='validation loss')
best = int(np.argmin(h['val_loss'])) + 1
a1.axvline(best, color=GREEN, ls='--', lw=1.5)
a1.annotate(f'lowest validation loss\n(epoch {best})', (best, max(h['loss']) * 0.92), color=GREEN, fontsize=10,
            xytext=(8, 0), textcoords='offset points')
a1.set_xlabel('epoch'); a1.set_ylabel('loss'); a1.grid(True, lw=0.8); a1.set_xticks(ep)
a1.legend(frameon=False, labelcolor=MUTED)
a1.set_title('Training stops two epochs after validation loss stops improving', fontsize=12)

runs = results[:3]                                 # same model, three different seed pairs
order = sorted(runs[0]['per_class'], key=lambda k: np.mean([x['per_class'][k]['recall'] for x in runs]))
accs = [x['test_acc'] for x in runs]
a2.axvspan(min(accs), max(accs), color=PANEL, zorder=0)
a2.text(np.mean(accs), len(order) - 0.35, f"overall accuracy\n{min(accs):.1%}–{max(accs):.1%}", ha='center', va='bottom', color=TEXT, fontsize=10)
for i, k in enumerate(order):
    v = [x['per_class'][k]['recall'] for x in runs]
    a2.plot([min(v), max(v)], [i, i], color=MUTED, lw=1.5, zorder=1)
    for x, c in zip(v, [BLUE, GREEN, ORANGE]):
        a2.scatter(x, i, color=c, s=46, zorder=2, edgecolor=BG, lw=0.8)
    a2.text(max(v) + 0.015, i, f'{(max(v) - min(v)) * 100:.0f} pts apart', va='center', color=MUTED, fontsize=9.5)
for c, x in zip([BLUE, GREEN, ORANGE], runs):
    a2.scatter([], [], color=c, s=46, label=f"seeds {x['seeds'][0]}/{x['seeds'][1]}")
a2.set_yticks(range(len(order)), order); a2.set_xlim(0.3, 1.0); a2.set_ylim(-0.6, len(order) + 0.6)
a2.set_xlabel('recall (share of each class correctly identified)'); a2.grid(True, axis='x', lw=0.8); a2.set_axisbelow(True)
a2.legend(frameon=False, labelcolor=MUTED, loc='lower right', fontsize=9.5)
a2.set_title('Per-class recall moves far more between runs than accuracy does', fontsize=12)
fig.tight_layout()
fig.savefig(f'{out}/unit9-training-and-recall.png', dpi=110)
print('saved')
