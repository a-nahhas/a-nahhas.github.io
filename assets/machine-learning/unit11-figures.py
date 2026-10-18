# Figures for the Unit 11 entry. Reuses the functions in unit11-experiments.py.
import io, contextlib, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.metrics import roc_curve, r2_score, mean_squared_error
from sklearn.linear_model import LinearRegression

with contextlib.redirect_stdout(io.StringIO()):
    exec(open("unit11-experiments.py", encoding="utf-8").read())
out = sys.argv[1] if len(sys.argv) > 1 else "."

BG, GRID, TEXT, MUTED = "#1a1a19", "#333331", "#ececea", "#bdbdb8"
BLUE, GREEN, ORANGE = "#3885e2", "#1a9a6c", "#e0602a"
plt.rcParams.update({"figure.facecolor": BG, "axes.facecolor": BG, "savefig.facecolor": BG,
                     "text.color": TEXT, "axes.labelcolor": MUTED, "xtick.color": MUTED, "ytick.color": MUTED,
                     "axes.edgecolor": GRID, "grid.color": GRID, "font.size": 11, "axes.titlesize": 12,
                     "axes.spines.top": False, "axes.spines.right": False,
                     "legend.frameon": False, "legend.labelcolor": MUTED})


def micro_roc(noise_mult, seed=0):
    iris = datasets.load_iris()
    X, y = iris.data, label_binarize(iris.target, classes=[0, 1, 2])
    rs = np.random.RandomState(seed)
    X = np.c_[X, rs.randn(X.shape[0], noise_mult * X.shape[1])]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.5, random_state=seed)
    clf = OneVsRestClassifier(svm.SVC(kernel="linear", random_state=rs))
    score = clf.fit(X_train, y_train).decision_function(X_test)
    return roc_curve(y_test.ravel(), score.ravel())


# Figure 1: ROC curves and AUC as noise features are added
fig, (a1, a2) = plt.subplots(1, 2, figsize=(14.3, 5.6))
shades = ["#9cc3f0", "#6aa4e8", BLUE, "#2560a8"]             # one hue, light = few noise features
for k, shade in zip([0, 5, 200, 500], shades):
    fpr, tpr, _ = micro_roc(k)
    a1.plot(fpr, tpr, color=shade, lw=2.2, label=f"{k * 4} noise features (AUC {auc(fpr, tpr):.2f})")
a1.plot([0, 1], [0, 1], color=MUTED, lw=1.2, ls="--")
a1.annotate("chance (AUC 0.5)", (0.62, 0.55), color=MUTED, fontsize=10, rotation=33)
a1.set_xlabel("false positive rate"); a1.set_ylabel("true positive rate")
a1.set_xlim(0, 1); a1.set_ylim(0, 1.02); a1.grid(True, lw=0.8)
a1.legend(loc="lower right", fontsize=10)
a1.set_title("Micro-average ROC curve (seed 0): the curve sinks towards the diagonal", fontsize=12)

levels = [0, 1, 5, 25, 50, 100, 200, 500]
pos = np.arange(len(levels))
for cls, colour, name in [(0, GREEN, "setosa"), (2, ORANGE, "virginica"), (1, BLUE, "versicolor")]:
    rs_ = [[iris_roc(noise_mult=k, seed=s)[cls] for s in range(20)] for k in levels]
    m, sd = np.mean(rs_, 1), np.std(rs_, 1)
    a2.fill_between(pos, m - sd, m + sd, color=colour, alpha=0.15, lw=0)
    a2.plot(pos, m, color=colour, lw=2.2, marker="o", ms=5, label=name)
    a2.annotate(name, (pos[-1], m[-1]), xytext=(8, 0), textcoords="offset points", color=TEXT, fontsize=10, va="center")
a2.axhline(0.5, color=MUTED, lw=1.2, ls="--")
a2.set_xticks(pos, [str(k * 4) for k in levels])
a2.axvline(6, color=GRID, lw=6, alpha=0.6, zorder=0)
a2.annotate("notebook", (6, 0.42), ha="center", color=MUTED, fontsize=10)
a2.set_xlim(-0.3, len(levels) - 0.2)
a2.set_ylim(0.4, 1.02); a2.grid(True, axis="y", lw=0.8)
a2.set_xlabel("number of random noise features added to the 4 iris measurements")
a2.set_ylabel("AUC on the test half")
a2.legend(loc="lower left", fontsize=10)
a2.set_title("AUC per class, mean ± 1 sd over 20 random seeds", fontsize=12)
fig.tight_layout()
fig.savefig(f"{out}/unit11-auc-noise.png", dpi=110)

# Figure 2: R² against model complexity, and against the spread of the data
fig, (a1, a2) = plt.subplots(1, 2, figsize=(14.3, 5.6))
degrees = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]
res = np.array([[poly_fit(d, seed=s)[:2] for s in range(20)] for d in degrees])
med = np.median(res, axis=1)
a1.plot(degrees, med[:, 0], color=BLUE, lw=2.2, marker="o", ms=5, label="training R²")
a1.plot(degrees, med[:, 1], color=ORANGE, lw=2.2, marker="o", ms=5, label="test R²")
a1.annotate("training R²", (15, med[-1, 0]), xytext=(8, 0), textcoords="offset points", color=TEXT, va="center")
a1.annotate("test R²", (15, med[-1, 1]), xytext=(8, 0), textcoords="offset points", color=TEXT, va="center")
a1.axhline(0.847, color=GREEN, lw=1.5, ls="--")
a1.annotate("best possible test R² with noise 0.3 (0.85)", (0.2, 0.93), color=GREEN, fontsize=10)
a1.set_xlim(-0.5, 17.5); a1.set_ylim(-0.1, 1.0); a1.grid(True, lw=0.8)
a1.set_xlabel("polynomial degree"); a1.set_ylabel("R² (median of 20 seeds)")
a1.legend(loc="lower right", fontsize=10)
a1.set_title("y = sin(2πx) + noise, 30 training points: training R² keeps rising", fontsize=12)

xmaxes = [10, 5, 2, 1, 0.5]
r2s, rmses = [], []
for xmax in xmaxes:
    rs = np.random.RandomState(0)
    xx = rs.uniform(0, xmax, 2000)
    yy = 2 * xx + 1 + rs.normal(0, 1, 2000)
    m = LinearRegression().fit(xx[:1000, None], yy[:1000])
    pp = m.predict(xx[1000:, None])
    r2s.append(r2_score(yy[1000:], pp)); rmses.append(np.sqrt(mean_squared_error(yy[1000:], pp)))
pos = np.arange(len(xmaxes))
a2.bar(pos, r2s, width=0.6, color=BLUE)
for p_, r, e in zip(pos, r2s, rmses):
    a2.annotate(f"R² {r:.2f}\nRMSE {e:.2f}", (p_, r), xytext=(0, 6), textcoords="offset points",
                ha="center", color=TEXT, fontsize=10)
a2.set_xticks(pos, [f"0 to {x}" for x in xmaxes])
a2.set_ylim(0, 1.15); a2.grid(True, axis="y", lw=0.8)
a2.set_xlabel("range of x in the data"); a2.set_ylabel("test R²")
a2.set_title("y = 2x + 1 + noise, true model fitted: same RMSE, very different R²", fontsize=12)
fig.tight_layout()
fig.savefig(f"{out}/unit11-r2-complexity-and-range.png", dpi=110)
