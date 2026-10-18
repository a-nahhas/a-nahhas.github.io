import time
import numpy as np

print("== 1 simple perceptron")
def step(s, threshold=1):
    return 1 if s >= threshold else 0

for inputs, weights in [
    ([45, 25], [0.7, 0.1]),      # notebook, first case
    ([45, 25], [-0.7, 0.1]),     # notebook, second case
    ([0.45, 0.25], [0.7, 0.1]),  # same inputs rescaled to 0-1
    ([1, 3], [0.7, 0.1]),
    ([1, 3], [-0.7, 0.1]),
    ([1, 3], [0.7, 0.2]),
    ([45, 25], [0, 0]),
    ([45, 25], [7, 1]),          # weights x10
]:
    s = np.array(inputs).dot(np.array(weights))
    print(f"inputs={inputs} weights={weights} sum={s:.3f} threshold1={step(s)} threshold0={step(s, 0)}")
# smallest x2 that flips the second case to 1 when x1 = 45
print("x2 needed with w=[-0.7,0.1], x1=45:", (1 + 0.7 * 45) / 0.1)
print("x2 needed with w=[-0.7,0.1], x1=45, threshold 0:", 0.7 * 45 / 0.1)

# loop versus dot product (the notebook's reason for using NumPy)
rng = np.random.default_rng(1)
for n in [2, 1_000, 1_000_000]:
    a = rng.random(n); w = rng.random(n); al = a.tolist(); wl = w.tolist()
    reps = 200_000 if n == 2 else (2_000 if n == 1_000 else 5)
    t = time.perf_counter()
    for _ in range(reps):
        tot = 0
        for i in range(n): tot += al[i] * wl[i]
    loop = (time.perf_counter() - t) / reps
    t = time.perf_counter()
    for _ in range(reps): a.dot(w)
    dot = (time.perf_counter() - t) / reps
    print(f"n={n:>9,} loop={loop*1e6:10.2f}us dot={dot*1e6:8.2f}us ratio={loop/dot:7.1f}")

print("== 2 perceptron AND")
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
GATES = {"AND": [0, 0, 0, 1], "OR": [0, 1, 1, 1], "NAND": [1, 1, 1, 0], "XOR": [0, 1, 1, 0]}

def train_notebook(y, lr=0.1, w0=(0.0, 0.0), max_epochs=1000):
    """The notebook's rule: abs(error), threshold 1, no bias, stop when total error is 0."""
    w = np.array(w0, dtype=float); y = np.array(y)
    for epoch in range(1, max_epochs + 1):
        total = 0
        for i in range(len(y)):
            pred = step(X[i].dot(w))
            err = abs(y[i] - pred)
            total += err
            if err > 0:
                w = w + lr * X[i] * err
        if total == 0:
            return epoch, w, [step(x.dot(w)) for x in X]
    return None, w, [step(x.dot(w)) for x in X]

def train_signed(y, lr=0.1, max_epochs=1000):
    """Corrected rule: signed error and a learned bias, threshold 0."""
    w = np.zeros(2); b = 0.0; y = np.array(y)
    for epoch in range(1, max_epochs + 1):
        total = 0
        for i in range(len(y)):
            pred = step(X[i].dot(w) + b, 0)
            err = y[i] - pred
            total += abs(err)
            w = w + lr * err * X[i]; b += lr * err
        if total == 0:
            return epoch, w, b, [step(x.dot(w) + b, 0) for x in X]
    return None, w, b, [step(x.dot(w) + b, 0) for x in X]

print("-- learning rate (AND, notebook rule)")
for lr in [0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.6, 1.0]:
    e, w, p = train_notebook(GATES["AND"], lr=lr)
    print(f"lr={lr:<5} epochs={e} weights={np.round(w, 3)} preds={p}")
print("-- starting weights (AND, notebook rule)")
for w0 in [(0.0, 0.0), (0.4, 0.4), (0.9, 0.2), (1.0, 0.0), (-1.0, -1.0)]:
    e, w, p = train_notebook(GATES["AND"], w0=w0)
    print(f"w0={w0} epochs={e} weights={np.round(w, 3)} preds={p}")
print("-- other gates, notebook rule")
for g, y in GATES.items():
    e, w, p = train_notebook(y)
    print(f"{g:5s} epochs={e} weights={np.round(w, 3)} preds={p} target={y}")
print("-- other gates, signed error + bias")
for g, y in GATES.items():
    e, w, b, p = train_signed(y)
    print(f"{g:5s} epochs={e} weights={np.round(w, 3)} bias={b:.2f} preds={p} target={y}")

print("== 3 multi-layer perceptron")
def sigmoid(x):
    return 1 / (1 + np.exp(-x))
for v in [0, 1, 2, 5, 40, -20.5]:
    print(f"sigmoid({v}) = {sigmoid(v):.10g}")
with np.errstate(over="raise"):
    try: sigmoid(-1000)
    except FloatingPointError as e: print("sigmoid(-1000):", e)

Y_XOR = np.array([[0], [1], [1], [0]])
LECTURE_W0 = np.array([[-0.424, -0.740, -0.961], [0.358, -0.577, -0.469]])
LECTURE_W1 = np.array([[-0.017], [-0.893], [0.148]])

def solved(o, y=Y_XOR):
    # every output within 0.2 of its target, so an undecided 0.5 never counts
    return bool((abs(y.ravel() - o.ravel()) < 0.2).all())

def train_mlp(y=Y_XOR, epochs=400_000, lr=0.6, hidden=3, seed=None, w0=None, w1=None, record=1000):
    if w0 is None:
        rng = np.random.default_rng(seed)
        w0 = 2 * rng.random((2, hidden)) - 1
        w1 = 2 * rng.random((hidden, 1)) - 1
    w0 = w0.copy(); w1 = w1.copy(); errors = []
    for epoch in range(epochs):
        h = sigmoid(X.dot(w0)); o = sigmoid(h.dot(w1))
        e = y - o
        if epoch % record == 0: errors.append(np.mean(abs(e)))
        d_out = e * o * (1 - o)
        d_hid = d_out.dot(w1.T) * h * (1 - h)   # notebook bug: weights1.T
        w1 = w1 + h.T.dot(d_out) * lr
        w0 = w0 + X.T.dot(d_hid) * lr
    o = sigmoid(sigmoid(X.dot(w0)).dot(w1))
    return o.ravel(), np.mean(abs(y - o)), errors, w0, w1

print("-- lecture's starting weights, notebook settings (400,000 epochs, lr 0.6)")
o, err, errs, w0, w1 = train_mlp(w0=LECTURE_W0, w1=LECTURE_W1, record=100_000)
print("outputs", np.round(o, 4), "error", round(err, 5), "rounded", np.round(o).astype(int), "recorded", np.round(errs, 4))
print("weights_0", np.round(w0, 3).tolist(), "weights_1", np.round(w1, 3).ravel().tolist())

print("-- when does the lecture-weight run escape the plateau?")
o, err, errs, *_ = train_mlp(w0=LECTURE_W0, w1=LECTURE_W1, epochs=120_000, record=100)
print("first recorded epoch with error < 0.1:", 100 * next(i for i, e in enumerate(errs) if e < 0.1))

print("-- learning rate, lecture weights, 20,000 epochs")
for lr in [0.1, 0.3, 0.6, 1.0, 3.0, 10.0]:
    o, err, *_ = train_mlp(w0=LECTURE_W0, w1=LECTURE_W1, epochs=20_000, lr=lr)
    print(f"lr={lr:<5} error={err:.4f} outputs={np.round(o, 3)} solved={solved(o)}")

print("-- hidden neurons x 50 random seeds, 20,000 epochs, lr 0.6")
for hidden in [1, 2, 3, 4, 8]:
    n_solved = 0; errs = []
    for s in range(50):
        o, err, *_ = train_mlp(epochs=20_000, hidden=hidden, seed=s)
        errs.append(err); n_solved += solved(o)
    print(f"hidden={hidden} solved={n_solved}/50 median_error={np.median(errs):.4f} worst={max(errs):.4f}")

def train_mlp_bias(y=Y_XOR, epochs=20_000, lr=0.6, hidden=2, seed=None):
    """The same network with a constant bias input on the input and hidden layers."""
    rng = np.random.default_rng(seed); Xb = np.hstack([X, np.ones((4, 1))])
    w0 = 2 * rng.random((3, hidden)) - 1; w1 = 2 * rng.random((hidden + 1, 1)) - 1
    for _ in range(epochs):
        h = np.hstack([sigmoid(Xb.dot(w0)), np.ones((4, 1))]); o = sigmoid(h.dot(w1))
        d_out = (y - o) * o * (1 - o)
        d_hid = (d_out.dot(w1.T) * h * (1 - h))[:, :hidden]
        w1 = w1 + h.T.dot(d_out) * lr; w0 = w0 + Xb.T.dot(d_hid) * lr
    return o.ravel()

print("-- with bias terms, 50 random seeds, 20,000 epochs, lr 0.6")
for hidden in [1, 2, 3]:
    print(f"hidden={hidden} solved={sum(solved(train_mlp_bias(hidden=hidden, seed=s)) for s in range(50))}/50")

print("-- AND with the same network (3 hidden, lecture weights, 200,000 epochs; random seeds 20,000 epochs)")
o, err, *_ = train_mlp(y=np.array([[0], [0], [0], [1]]), w0=LECTURE_W0, w1=LECTURE_W1, epochs=200_000)
print("lecture weights: outputs", np.round(o, 4), "error", round(err, 4))
Y_AND = np.array([[0], [0], [0], [1]])
print("random seeds solved:", sum(solved(train_mlp(y=Y_AND, epochs=20_000, seed=s)[0], Y_AND) for s in range(50)), "/50")
print("with bias, random seeds solved:", sum(solved(train_mlp_bias(y=Y_AND, hidden=3, seed=s), Y_AND) for s in range(50)), "/50")
