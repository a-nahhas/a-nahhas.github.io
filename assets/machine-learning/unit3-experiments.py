import numpy as np, pandas as pd
from numpy.random import randn, seed
from scipy import stats
from sklearn import linear_model
from sklearn.metrics import r2_score
print("== 1 covariance/pearson")
def run(n=1000, a=1, noise=10, s=1):
    seed(s); d1 = 20*randn(n)+100; d2 = a*d1 + (noise*randn(n)+50)
    return d1,d2
for label,kw in [("baseline",{}),("noise 0",dict(noise=0)),("noise 5",dict(noise=5)),("noise 20",dict(noise=20)),("noise 40",dict(noise=40)),("noise 80",dict(noise=80)),("negative a=-1",dict(a=-1)),("a=0 (independent)",dict(a=0))]:
    d1,d2=run(**kw); print(f"{label:22s} cov={np.cov(d1,d2)[0][1]:9.3f} r={stats.pearsonr(d1,d2)[0]:.3f}")
for n in [5,10,30,100,1000]:
    rs=[]
    for s in range(200):
        d1,d2=run(n=n,s=s); rs.append(stats.pearsonr(d1,d2)[0])
    d1,d2=run(n=n); r,p=stats.pearsonr(d1,d2)
    print(f"n={n:5d} seed1 r={r:.3f} p={p:.2e}  over 200 seeds r range {min(rs):.3f}-{max(rs):.3f}")
d1,d2=run(); 
print("scale data1 x10: cov=%.3f r=%.3f"%(np.cov(d1*10,d2)[0][1], stats.pearsonr(d1*10,d2)[0]))
d1,d2=run(n=30)
print("n=30 r=%.3f"%stats.pearsonr(d1,d2)[0])
d1o=np.append(d1,[200]); d2o=np.append(d2,[40])
print("n=30 + one outlier (200,40) r=%.3f"%stats.pearsonr(d1o,d2o)[0])
seed(1); x=20*randn(1000)+100; y=(x-100)**2+10*randn(1000)
print("quadratic y=(x-100)^2: r=%.3f spearman=%.3f"%(stats.pearsonr(x,y)[0], stats.spearmanr(x,y)[0]))
print("== 2 linear regression")
x=[5,7,8,7,2,17,2,9,4,11,12,9,6]; y=[99,86,87,88,111,86,103,87,94,78,77,85,86]
def lr(x,y,label):
    s,i,r,p,se=stats.linregress(x,y); print(f"{label:30s} n={len(x)} slope={s:.3f} int={i:.2f} r={r:.3f} r2={r*r:.3f} p={p:.4f} pred10={i+s*10:.2f}")
lr(x,y,"original")
xi=[a for a,b in zip(x,y) if a!=17]; yi=[b for a,b in zip(x,y) if a!=17]; lr(xi,yi,"drop (17,86)")
xj=[a for a,b in zip(x,y) if b!=111]; yj=[b for a,b in zip(x,y) if b!=111]; lr(xj,yj,"drop (2,111)")
lr(x+[20],y+[110],"add (20,110)")
lr(x[:5],y[:5],"first 5 points only")
lr(x+[3,13,15,1],y+[100,76,72,108],"add 4 on-trend points")
print("extrapolate x=40 original:", stats.linregress(x,y).intercept+stats.linregress(x,y).slope*40)
print("== 3 multiple")
df=pd.read_csv("unit3-cars.csv")
def mr(cols,d=df,label=""):
    X=d[cols].values; yy=d["CO2"].values; m=linear_model.LinearRegression().fit(X,yy)
    print(f"{label:28s} {cols} coef={np.round(m.coef_,5)} int={m.intercept_:.2f} R2={m.score(X,yy):.3f}", end=" ")
    return m
m=mr(["Weight","Volume"],label="original"); print("pred2300/1300=%.3f pred3300/1300=%.3f"%(m.predict([[2300,1300]])[0],m.predict([[3300,1300]])[0]))
print("  pred 2300kg 1300cm3 within data range? weight max",df.Weight.max(),"min",df.Weight.min())
m=mr(["Weight","Volume"],d=df[df.Weight<1500],label="cars <1500kg"); print()
m=mr(["Weight","Volume"],d=df.iloc[:18],label="first 18 cars"); print()
m=mr(["Weight"],label="weight only"); print()
m=mr(["Volume"],label="volume only"); print()
print("  corr weight-volume r=%.3f"%stats.pearsonr(df.Weight,df.Volume)[0])
print("  corr weight-co2 r=%.3f volume-co2 r=%.3f"%(stats.pearsonr(df.Weight,df.CO2)[0],stats.pearsonr(df.Volume,df.CO2)[0]))
d2=pd.concat([df,pd.DataFrame([dict(Car="X",Model="EV",Volume=0,Weight=2100,CO2=0)])]);m=mr(["Weight","Volume"],d=d2,label="add an EV (vol0,co2 0)"); print()
d3=df.copy(); d3["WeightT"]=d3.Weight/1000; m=mr(["WeightT","Volume"],d=d3,label="weight in tonnes"); print()
from sklearn.preprocessing import StandardScaler
Xs=StandardScaler().fit_transform(df[["Weight","Volume"]]); ms=linear_model.LinearRegression().fit(Xs,df.CO2); print("standardised coef",ms.coef_)
print("== 4 polynomial")
x=[1,2,3,5,6,7,8,9,10,12,13,14,15,16,18,19,21,22]; y=[100,90,80,60,60,55,60,65,70,70,75,76,78,79,90,99,99,100]
for deg in [1,2,3,4,6,10]:
    m=np.poly1d(np.polyfit(x,y,deg)); print(f"deg {deg:2d} r2={r2_score(y,m(x)):.3f} pred17={m(17):.2f} pred30={m(30):.1f} pred0={m(0):.1f}")
# hold-out: leave-one-out
for deg in [1,2,3,4,6,10]:
    errs=[]
    for k in range(len(x)):
        xt=[v for j,v in enumerate(x) if j!=k]; yt=[v for j,v in enumerate(y) if j!=k]
        m=np.poly1d(np.polyfit(xt,yt,deg)); errs.append((m(x[k])-y[k])**2)
    print(f"deg {deg:2d} LOOCV RMSE={np.sqrt(np.mean(errs)):.2f}")
# remove morning points
xs=x[5:]; ys=y[5:]; m=np.poly1d(np.polyfit(xs,ys,3)); print("deg3 without first 5 points r2=%.3f pred17=%.2f pred2=%.1f(actual 90)"%(r2_score(ys,m(xs)),m(17),m(2)))
seed(1); yr=list(np.random.randint(50,100,len(x))); m=np.poly1d(np.polyfit(x,yr,3)); print("random y deg3 r2=%.3f"%r2_score(yr,m(x)))
