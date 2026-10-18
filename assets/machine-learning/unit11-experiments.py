# Unit 11: parameter experiments on model_Performance_Measurement.ipynb (AUC and R²).
# Tested with Python 3.12, scikit-learn 1.9.1, NumPy 2.5.
import sys
import warnings
import numpy as np
from sklearn import datasets, svm
from sklearn.datasets import load_breast_cancer, load_diabetes, make_classification
from sklearn.linear_model import LinearRegression, LogisticRegression, Ridge
from sklearn.metrics import (accuracy_score, auc, f1_score, mean_absolute_error, mean_squared_error,
                             r2_score, roc_auc_score, roc_curve)
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.multiclass import OneVsRestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler, label_binarize

warnings.filterwarnings("ignore", category=FutureWarning)
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")


def iris_roc(noise_mult=200, test_size=0.5, kernel="linear", C=1.0, seed=0):
    """The notebook's ROC cell with its settings exposed as arguments."""
    iris = datasets.load_iris()
    X, y = iris.data, label_binarize(iris.target, classes=[0, 1, 2])
    rs = np.random.RandomState(seed)
    n_samples, n_features = X.shape
    X = np.c_[X, rs.randn(n_samples, noise_mult * n_features)]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size, random_state=seed)
    # probability=True is deprecated in 1.9 and does not affect decision_function, so it is dropped
    clf = OneVsRestClassifier(svm.SVC(kernel=kernel, C=C, random_state=rs))
    score = clf.fit(X_train, y_train).decision_function(X_test)
    res = {}
    for i in range(3):
        fpr, tpr, _ = roc_curve(y_test[:, i], score[:, i])
        res[i] = auc(fpr, tpr)
    fpr, tpr, _ = roc_curve(y_test.ravel(), score.ravel())
    res["micro"] = auc(fpr, tpr)
    res["acc"] = accuracy_score(y_test.argmax(1), score.argmax(1))
    return res


def fmt(r):
    return f"class0={r[0]:.3f} class1={r[1]:.3f} class2={r[2]:.3f} micro={r['micro']:.3f} acc={r['acc']:.3f}"


def spread(fn, seeds=range(20)):
    rs = [fn(s) for s in seeds]
    m = {k: np.mean([r[k] for r in rs]) for k in rs[0]}
    sd = {k: np.std([r[k] for r in rs]) for k in rs[0]}
    return m, sd


print("== A1 notebook ROC cell, unchanged settings (seed 0)")
print(fmt(iris_roc()))

print("== A2 number of noise features (multiplier x 4 original features); seed 0, then mean ± sd over 20 seeds")
for k in [0, 1, 5, 25, 50, 100, 200, 500]:
    m, sd = spread(lambda s: iris_roc(noise_mult=k, seed=s))
    print(f"noise={k * 4:5d} seed0: {fmt(iris_roc(noise_mult=k))} | 20 seeds micro={m['micro']:.3f}±{sd['micro']:.3f} "
          f"class1={m[1]:.3f}±{sd[1]:.3f} acc={m['acc']:.3f}")

print("== A3 test_size (800 noise features); mean ± sd over 20 seeds")
for ts in [0.2, 0.3, 0.5, 0.7, 0.9]:
    m, sd = spread(lambda s: iris_roc(test_size=ts, seed=s))
    print(f"test_size={ts} train n={round(150 * (1 - ts))}: micro={m['micro']:.3f}±{sd['micro']:.3f} "
          f"class1={m[1]:.3f}±{sd[1]:.3f} seed0 {fmt(iris_roc(test_size=ts))}")

print("== A4 kernel and C (800 noise features); mean over 20 seeds")
for kernel, C in [("linear", 0.001), ("linear", 1.0), ("linear", 100.0), ("rbf", 1.0), ("rbf", 100.0)]:
    m, sd = spread(lambda s: iris_roc(kernel=kernel, C=C, seed=s))
    print(f"{kernel:6s} C={C:<6}: micro={m['micro']:.3f}±{sd['micro']:.3f} class1={m[1]:.3f} acc={m['acc']:.3f}")
for kernel, C in [("linear", 1.0), ("rbf", 1.0)]:
    m, sd = spread(lambda s: iris_roc(noise_mult=0, kernel=kernel, C=C, seed=s))
    print(f"no noise {kernel:6s} C={C}: micro={m['micro']:.3f} class1={m[1]:.3f} acc={m['acc']:.3f}")

print("== B1 breast cancer: notebook scores the training data")
X, y = load_breast_cancer(return_X_y=True)
clf = LogisticRegression(solver="liblinear", random_state=0).fit(X, y)
print(f"training AUC={roc_auc_score(y, clf.predict_proba(X)[:, 1]):.4f}")
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)

print("== B2 breast cancer: regularisation C, with and without scaling (held-out 30%, and 10-fold CV)")
for scale in [False, True]:
    for C in [0.0001, 0.001, 0.01, 0.1, 1, 10, 100, 1000]:
        model = LogisticRegression(solver="liblinear", C=C, random_state=0)
        if scale:
            model = make_pipeline(StandardScaler(), model)
        model.fit(X_tr, y_tr)
        p = model.predict_proba(X_te)[:, 1]
        cv = cross_val_score(model, X, y, cv=10, scoring="roc_auc")
        print(f"scaled={scale!s:5} C={C:<7} train AUC={roc_auc_score(y_tr, model.predict_proba(X_tr)[:, 1]):.4f} "
              f"test AUC={roc_auc_score(y_te, p):.4f} test acc={accuracy_score(y_te, p > 0.5):.3f} "
              f"CV AUC={cv.mean():.4f}±{cv.std():.4f}")

print("== B3 what score is passed to roc_auc_score (default model, held-out 30%)")
model = LogisticRegression(solver="liblinear", random_state=0).fit(X_tr, y_tr)
p = model.predict_proba(X_te)[:, 1]
d = model.decision_function(X_te)
print(f"predict_proba={roc_auc_score(y_te, p):.4f} decision_function={roc_auc_score(y_te, d):.4f} "
      f"proba**10={roc_auc_score(y_te, p ** 10):.4f} hard predict()={roc_auc_score(y_te, model.predict(X_te)):.4f}")
for t in [0.1, 0.3, 0.5, 0.7, 0.9]:
    print(f"threshold={t}: acc={accuracy_score(y_te, p > t):.3f} F1={f1_score(y_te, p > t):.3f} AUC unchanged")

print("== C1 class imbalance (make_classification, 5,000 samples, 50% test)")
for minority in [0.5, 0.2, 0.1, 0.05, 0.01]:
    Xi, yi = make_classification(n_samples=5000, weights=[1 - minority], flip_y=0, class_sep=0.8, random_state=0)
    a, b, c, e = train_test_split(Xi, yi, test_size=0.5, random_state=0, stratify=yi)
    m = LogisticRegression(max_iter=1000).fit(a, c)
    pi = m.predict_proba(b)[:, 1]
    print(f"minority={minority:<5} acc={accuracy_score(e, pi > 0.5):.3f} always-majority acc={1 - e.mean():.3f} "
          f"F1={f1_score(e, pi > 0.5, zero_division=0):.3f} AUC={roc_auc_score(e, pi):.3f}")

print("== D1 notebook regression example, with the predictions changed")
y_true = np.array([3, -0.5, 2, 7])
cases = {
    "notebook": [2.5, 0.0, 2, 8],
    "perfect": [3, -0.5, 2, 7],
    "every prediction +1": y_true + 1,
    "errors doubled": y_true + 2 * (np.array([2.5, 0.0, 2, 8]) - y_true),
    "always predict the mean": np.full(4, y_true.mean()),
    "always predict 0": np.zeros(4),
    "one prediction off by 5": [3, -0.5, 2, 12],
    "true and predicted x 10": None,
}
for name, yp in cases.items():
    yt = y_true
    if yp is None:
        yt, yp = y_true * 10, np.array([2.5, 0.0, 2, 8]) * 10
    yp = np.asarray(yp, dtype=float)
    mse = mean_squared_error(yt, yp)
    print(f"{name:26s} MSE={mse:.3f} RMSE={np.sqrt(mse):.3f} MAE={mean_absolute_error(yt, yp):.3f} R2={r2_score(yt, yp):.4f}")
yt2 = np.array([3, 2.5, 3, 3.5])
yp2 = yt2 + (np.array([2.5, 0.0, 2, 8]) - y_true)
print(f"same errors, y_true spread reduced: var={yt2.var():.3f} vs {y_true.var():.3f} R2={r2_score(yt2, yp2):.4f} "
      f"MSE={mean_squared_error(yt2, yp2):.3f}")


def sine_data(n, noise, xmax=1.0, seed=0):
    rs = np.random.RandomState(seed)
    x = rs.uniform(0, xmax, n)
    return x.reshape(-1, 1), np.sin(2 * np.pi * x) + rs.normal(0, noise, n)


def poly_fit(degree, n=30, noise=0.3, seed=0):
    X, y = sine_data(n, noise, seed=seed)
    Xt, yt = sine_data(1000, noise, seed=seed + 100)
    m = make_pipeline(PolynomialFeatures(degree), StandardScaler(), LinearRegression()).fit(X, y)
    return (r2_score(y, m.predict(X)), r2_score(yt, m.predict(Xt)),
            np.sqrt(mean_squared_error(yt, m.predict(Xt))))


print("== E1 polynomial degree (y = sin(2πx) + noise 0.3, 30 training points, 1,000 test points)")
for deg in [0, 1, 2, 3, 4, 5, 7, 9, 12, 15]:
    tr, te, rmse = poly_fit(deg)
    med = np.median([poly_fit(deg, seed=s)[1] for s in range(20)])
    print(f"degree={deg:2d} train R2={tr:.3f} test R2={te:.3f} test RMSE={rmse:.3f} | median test R2 over 20 seeds={med:.3f}")

print("== E2 training set size (degree 9, noise 0.3); median over 20 seeds")
for n in [12, 15, 20, 30, 50, 100, 500]:
    r = np.array([poly_fit(9, n=n, seed=s) for s in range(20)])
    print(f"n={n:4d} train R2={np.median(r[:, 0]):.3f} test R2={np.median(r[:, 1]):.3f} test RMSE={np.median(r[:, 2]):.3f}")

print("== E3 noise level (degree 3, the right model; 500 training points); best possible R2 = 1 - noise²/var(y)")
for noise in [0.0, 0.1, 0.3, 0.5, 1.0, 2.0]:
    tr, te, rmse = poly_fit(3, n=500, noise=noise)
    var_signal = 0.5                                   # variance of sin(2πx) for x uniform on [0, 1]
    print(f"noise={noise:<4} train R2={tr:.3f} test R2={te:.3f} test RMSE={rmse:.3f} "
          f"ceiling={var_signal / (var_signal + noise ** 2):.3f}")

print("== E4 range of x (straight line y = 2x + 1 + noise 1, true model, 1,000 points)")
for xmax in [10, 5, 2, 1, 0.5]:
    rs = np.random.RandomState(0)
    xx = rs.uniform(0, xmax, 2000)
    yy = 2 * xx + 1 + rs.normal(0, 1, 2000)
    m = LinearRegression().fit(xx[:1000, None], yy[:1000])
    pp = m.predict(xx[1000:, None])
    print(f"x in [0, {xmax:<4}] slope={m.coef_[0]:.3f} test R2={r2_score(yy[1000:], pp):.3f} "
          f"RMSE={np.sqrt(mean_squared_error(yy[1000:], pp)):.3f}")

print("== E5 one outlier in the test set (degree 3, noise 0.3, 100 test points)")
X, y = sine_data(100, 0.3, seed=0)
Xt, yt = sine_data(100, 0.3, seed=1)
m = make_pipeline(PolynomialFeatures(3), LinearRegression()).fit(X, y)
pt = m.predict(Xt)
for size in [0, 2, 5, 10]:
    yo = yt.copy()
    yo[0] += size
    print(f"outlier +{size:<2} RMSE={np.sqrt(mean_squared_error(yo, pt)):.3f} MAE={mean_absolute_error(yo, pt):.3f} "
          f"R2={r2_score(yo, pt):.3f}")

print("== F1 diabetes dataset (442 patients, 10 features), held-out 30%, and 10-fold CV R2")
Xd, yd = load_diabetes(return_X_y=True)
Xa, Xb, ya, yb = train_test_split(Xd, yd, test_size=0.3, random_state=0)
for name, cols in [("bmi only", [2]), ("bmi + s5", [2, 8]), ("all 10", list(range(10)))]:
    m = LinearRegression().fit(Xa[:, cols], ya)
    cv = cross_val_score(LinearRegression(), Xd[:, cols], yd, cv=10, scoring="r2")
    print(f"{name:9s} train R2={r2_score(ya, m.predict(Xa[:, cols])):.3f} test R2={r2_score(yb, m.predict(Xb[:, cols])):.3f} "
          f"test RMSE={np.sqrt(mean_squared_error(yb, m.predict(Xb[:, cols]))):.1f} "
          f"CV R2={cv.mean():.3f} (folds {cv.min():.3f} to {cv.max():.3f})")
for deg in [2, 3]:
    m = make_pipeline(PolynomialFeatures(deg), LinearRegression()).fit(Xa, ya)
    print(f"all 10, degree {deg} train R2={r2_score(ya, m.predict(Xa)):.3f} test R2={r2_score(yb, m.predict(Xb)):.3f}")
for alpha in [0.001, 0.01, 0.1, 1, 10]:
    m = make_pipeline(PolynomialFeatures(2), Ridge(alpha=alpha)).fit(Xa, ya)
    print(f"degree 2 + Ridge alpha={alpha:<5} train R2={r2_score(ya, m.predict(Xa)):.3f} test R2={r2_score(yb, m.predict(Xb)):.3f}")
print(f"std of target={yd.std():.1f}")
