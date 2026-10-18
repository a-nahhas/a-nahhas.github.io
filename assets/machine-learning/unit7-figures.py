import io, contextlib
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# reuse the models from the experiment script without rerunning its experiments
src = open("unit7-experiments.py", encoding="utf-8").read().split('print("-- lecture')[0]
with contextlib.redirect_stdout(io.StringIO()):
    exec(src)

BG, GRID, INK, MUTED = "#1b1b1a", "#333331", "#e8e6e1", "#b5b2ab"
BLUE, ORANGE, GREEN, PURPLE = "#3b8be0", "#e0592a", "#1f9d6f", "#a070e0"
plt.rcParams.update({
    "figure.facecolor": BG, "axes.facecolor": BG, "savefig.facecolor": BG,
    "axes.edgecolor": GRID, "axes.labelcolor": MUTED, "axes.titlecolor": INK,
    "xtick.color": MUTED, "ytick.color": MUTED, "text.color": INK,
    "axes.grid": True, "grid.color": GRID, "grid.linewidth": 0.8,
    "axes.spines.top": False, "axes.spines.right": False,
    "legend.frameon": False, "legend.labelcolor": MUTED, "font.size": 11,
    "axes.titlesize": 13, "lines.linewidth": 2,
})

# Figure 1: the perceptron's decision line and what rescaling the inputs does
fig, axes = plt.subplots(1, 2, figsize=(12, 5.2))
ax = axes[0]
xs = np.linspace(-6, 60, 200)
for w, colour in [((0.7, 0.1), BLUE), ((-0.7, 0.1), ORANGE)]:
    ax.plot(xs, (1 - w[0] * xs) / w[1], color=colour, label=f"w = [{w[0]}, {w[1]}]: sum = 1")
ax.scatter([45], [25], s=70, color=INK, edgecolor=BG, linewidth=2, zorder=3)
ax.annotate("(45, 25)", (45, 25), xytext=(8, 8), textcoords="offset points", color=MUTED)
ax.set_xlim(-6, 60); ax.set_ylim(-6, 60); ax.set_xlabel("x1"); ax.set_ylabel("x2")
ax.set_title("Both weight sets, original inputs"); ax.legend(loc="upper right")
ax = axes[1]
xs = np.linspace(0, 2, 200)
ax.fill_between(xs, (1 - 0.7 * xs) / 0.1, 3.5, color=BLUE, alpha=0.12, linewidth=0, label="output 1 for w = [0.7, 0.1]")
ax.plot(xs, (1 - 0.7 * xs) / 0.1, color=BLUE, label="sum = 1")
for (x1, x2), label in [((0.45, 0.25), "(0.45, 0.25): sum 0.34, output 0"), ((1, 3), "(1, 3): sum 1.00, output 1")]:
    ax.scatter([x1], [x2], s=70, color=INK, edgecolor=BG, linewidth=2, zorder=3)
    ax.annotate(label, (x1, x2), xytext=(10, -4), textcoords="offset points", color=MUTED)
ax.set_xlim(0, 2); ax.set_ylim(0, 3.5); ax.set_xlabel("x1"); ax.set_ylabel("x2")
ax.set_title("w = [0.7, 0.1], inputs divided by 100"); ax.legend(loc="upper left")
fig.suptitle("The step function splits the input space with a straight line", color=INK, fontsize=14)
fig.tight_layout(); fig.savefig("unit7-perceptron-boundary.png", dpi=100); plt.close(fig)

# Figure 2: lines learned by the corrected perceptron for four logic gates
fig, axes = plt.subplots(1, 4, figsize=(12, 3.6), sharey=True)
xs = np.linspace(-0.5, 1.5, 50)
for ax, (gate, y) in zip(axes, GATES.items()):
    e, w, b, p = train_signed(y)
    for (x1, x2), t in zip(X, y):
        ax.scatter([x1], [x2], s=110, color=GREEN if t else ORANGE, edgecolor=BG, linewidth=2, zorder=3)
    if e is not None:
        ax.plot(xs, -(w[0] * xs + b) / w[1], color=BLUE)
        ax.set_title(f"{gate}: learned in {e} epochs")
    else:
        ax.set_title(f"{gate}: no line after 1,000 epochs")
    ax.set_xlim(-0.5, 1.5); ax.set_ylim(-0.5, 1.5); ax.set_xticks([0, 1]); ax.set_yticks([0, 1])
    ax.set_xlabel("x1")
axes[0].set_ylabel("x2")
axes[0].scatter([], [], color=GREEN, s=60, label="target 1"); axes[0].scatter([], [], color=ORANGE, s=60, label="target 0")
axes[0].plot([], [], color=BLUE, label="learned line"); axes[0].legend(loc="lower left", fontsize=9)
fig.tight_layout(); fig.savefig("unit7-logic-gates.png", dpi=100); plt.close(fig)

# Figure 3: training the XOR network from the lecture's starting weights
w0, w1 = LECTURE_W0.copy(), LECTURE_W1.copy()
epochs, rec = [], []
for epoch in range(400_000):
    h = sigmoid(X.dot(w0)); o = sigmoid(h.dot(w1)); e = Y_XOR - o
    if epoch % 200 == 0:
        epochs.append(epoch); rec.append(np.r_[np.mean(abs(e)), o.ravel()])
    d_out = e * o * (1 - o); d_hid = d_out.dot(w1.T) * h * (1 - h)
    w1 = w1 + h.T.dot(d_out) * 0.6; w0 = w0 + X.T.dot(d_hid) * 0.6
rec = np.array(rec); epochs = np.array(epochs)
fig, axes = plt.subplots(1, 2, figsize=(12, 5.2))
ax = axes[0]
ax.plot(epochs, rec[:, 0], color=BLUE, label="mean error, every 200 epochs")
nb = [0, 100_000, 200_000, 300_000]
ax.plot(nb, rec[[np.searchsorted(epochs, n) for n in nb], 0], color=ORANGE, marker="o", markersize=8,
        label="the notebook's plot (every 100,000 epochs)")
ax.set_xlabel("epoch"); ax.set_ylabel("mean absolute error"); ax.set_title("Mean error")
ax.legend(loc="upper right")
ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{int(v/1000)}k"))
ax = axes[1]
for i, (label, colour) in enumerate(zip(["(0,0) target 0", "(0,1) target 1", "(1,0) target 1", "(1,1) target 0"],
                                        [GREEN, BLUE, PURPLE, ORANGE])):
    ax.plot(epochs, rec[:, i + 1], color=colour, label=label, linestyle="--" if i == 2 else "-")
ax.axhline(0.5, color=MUTED, linewidth=1, linestyle=":")
ax.set_xlim(0, 150_000); ax.set_xlabel("epoch"); ax.set_ylabel("network output"); ax.set_title("Output for each input (first 150,000 epochs)")
ax.xaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{int(v/1000)}k"))
ax.legend(loc="center right")
fig.suptitle("XOR from the lecture's starting weights: input (1,1) sits at 0.5 for about 90,000 epochs", color=INK, fontsize=14)
fig.tight_layout(); fig.savefig("unit7-xor-training.png", dpi=100); plt.close(fig)
print("figures written")
