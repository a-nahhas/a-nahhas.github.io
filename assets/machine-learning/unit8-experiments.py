import sys
import numpy as np

# Same data and update rule as gradient_descent_cost_function.ipynb (true line: y = 2x + 3)
x = np.array([1, 2, 3, 4, 5])
y = np.array([5, 7, 9, 11, 13])


def gradient_descent(x, y, iterations=100, learning_rate=0.08):
    m_curr = b_curr = 0
    n = len(x)
    costs = []
    with np.errstate(over="ignore", invalid="ignore"):
        for i in range(iterations):
            y_predicted = m_curr * x + b_curr
            cost = (1 / n) * sum([val ** 2 for val in (y - y_predicted)])
            md = -(2 / n) * sum(x * (y - y_predicted))
            bd = -(2 / n) * sum(y - y_predicted)
            m_curr = m_curr - learning_rate * md
            b_curr = b_curr - learning_rate * bd
            costs.append(cost)
    return m_curr, b_curr, costs


def iters_to(costs, tol):
    return next((i for i, c in enumerate(costs) if c < tol), None)


print("== 1 original notebook (100 iterations, learning rate 0.08)")
m, b, costs = gradient_descent(x, y)
for i in [0, 1, 2, 5, 10, 25, 50, 99]:
    print(f"iteration {i:3d} cost={costs[i]:.6f}")
print(f"final m={m:.4f} b={b:.4f}")

print("== 2 learning rate (100 iterations)")
for lr in [0.0001, 0.001, 0.01, 0.03, 0.05, 0.07, 0.08, 0.084, 0.085, 0.09, 0.1]:
    m, b, costs = gradient_descent(x, y, 100, lr)
    print(f"lr={lr:<7} m={m:.4g} b={b:.4g} final cost={costs[-1]:.4g} first<0.01 at {iters_to(costs, 0.01)}")

print("== 3 iterations (learning rate 0.08)")
for it in [5, 10, 50, 100, 500, 1000, 2000]:
    m, b, costs = gradient_descent(x, y, it, 0.08)
    print(f"iterations={it:5d} m={m:.4f} b={b:.4f} final cost={costs[-1]:.3g}")

print("== 4 iterations needed to bring cost below 1e-6")
for lr in [0.0001, 0.001, 0.01, 0.03, 0.05, 0.07, 0.08, 0.084]:
    m, b, costs = gradient_descent(x, y, 250000, lr)
    print(f"lr={lr:<6} iterations={iters_to(costs, 1e-6)}")

print("== 5 why 0.085 is the limit")
H = (2 / len(x)) * np.array([[np.sum(x * x), np.sum(x)], [np.sum(x), len(x)]])
eig = np.linalg.eigvalsh(H)
print(f"Hessian eigenvalues={eig} stability limit 2/max={2 / eig.max():.4f}")
print(f"best rate 2/(min+max)={2 / eig.sum():.4f} condition number={eig.max() / eig.min():.1f}")

print("== 6 centred x (x - mean)")
xc = x - x.mean()
for lr in [0.08, 0.2, 0.4, 0.5]:
    m, b, costs = gradient_descent(xc, y, 200000, lr)
    print(f"lr={lr:<4} cost<1e-6 at {iters_to(costs, 1e-6)} final cost={costs[-1]:.3g}")

if "--plots" in sys.argv:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(11, 4.2))
    for lr, colour in [(0.001, "#9aa3b5"), (0.01, "#5667ff"), (0.05, "#b15cff"), (0.08, "#ff5364"), (0.09, "#ff9c59")]:
        _, _, c = gradient_descent(x, y, 100, lr)
        ax1.plot(range(100), c, label=f"learning rate {lr}", color=colour, lw=2)
    ax1.set_yscale("log")
    ax1.set_ylim(1e-3, 1e4)
    ax1.set_xlabel("Iteration")
    ax1.set_ylabel("Cost (MSE, log scale)")
    ax1.set_title("Cost over 100 iterations")
    ax1.legend(frameon=False, fontsize=9)

    for lr, colour in [(0.01, "#5667ff"), (0.08, "#ff5364")]:
        _, _, c = gradient_descent(x, y, 3000, lr)
        ax2.plot(range(3000), c, label=f"learning rate {lr}", color=colour, lw=2)
    ax2.axvline(100, color="#666", ls="--", lw=1)
    ax2.text(130, 1e-20, "notebook stops\nat iteration 100", fontsize=9, color="#444")
    ax2.set_yscale("log")
    ax2.set_xlabel("Iteration")
    ax2.set_title("Cost over 3,000 iterations")
    ax2.legend(frameon=False, fontsize=9)
    for ax in (ax1, ax2):
        ax.spines[["top", "right"]].set_visible(False)
        ax.grid(alpha=0.25)
    fig.tight_layout()
    fig.savefig("unit8-cost-curves.png", dpi=150)

    # Paths over the cost surface
    fig, ax = plt.subplots(figsize=(6.5, 5))
    ms = np.linspace(-0.5, 6, 300)
    bs = np.linspace(-2, 8, 300)
    M, B = np.meshgrid(ms, bs)
    Z = np.mean((y[None, None, :] - (M[..., None] * x + B[..., None])) ** 2, axis=-1)
    ax.contour(M, B, Z, levels=np.logspace(-1, 2.5, 18), colors="#b8bcc8", linewidths=0.8)
    for lr, it, colour in [(0.08, 300, "#ff5364"), (0.01, 300, "#5667ff")]:
        mc = bc = 0.0
        path = [(mc, bc)]
        for _ in range(it):
            yp = mc * x + bc
            md = -(2 / len(x)) * np.sum(x * (y - yp))
            bd = -(2 / len(x)) * np.sum(y - yp)
            mc, bc = mc - lr * md, bc - lr * bd
            path.append((mc, bc))
        p = np.array(path)
        ax.plot(p[:, 0], p[:, 1], "-o", ms=2, lw=1, color=colour, label=f"learning rate {lr}, {it} steps")
    ax.plot(2, 3, "k*", ms=12, label="minimum (m = 2, b = 3)")
    ax.set_xlabel("m (slope)")
    ax.set_ylabel("b (intercept)")
    ax.set_title("Paths taken across the cost surface")
    ax.legend(frameon=False, fontsize=9, loc="upper right")
    fig.tight_layout()
    fig.savefig("unit8-cost-surface.png", dpi=150)
