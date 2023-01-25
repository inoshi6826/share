import random
import mplfinance as mpf
import pandas as pd


def assign(open, high, low, close, border=0.6, small=0.03):

    # 各ローソクの有無 
    isBig = False
    isSmall = False
    isBald = False
    isHair = False
    isBeard = False
    isHammer = False
    isUmbrella = False
    isCross = False
    isDragonfly = False
    isTower = False
    isUpTrend = False
    # above == high or under == lowの場合にTrueにする
    isSkinHead = False

    # 陽線の時
    isPositive = True
    above = close
    under = open
    name = "陽"
    # 陰線の時
    if open > close:
        isPositive = False
        above = open
        under = close
        name = "陰"

    # 全く同じだとZeroDevisionErrorが生じるので微調整
    if above == high:
        high += 0.001
        isSkinHead = True
    if under == low:
        low += 0.001
        isSkinHead = True

    # 大線(0.48以上)
    if abs(above-under)>=0.48:
        print("大" + name + "線")
        isBig = True
    
    # 坊主
    if (abs(high-above)<=small) & (abs(low-under)<=small) & (abs(above-under)>=0.2):
        print(name + "坊主")
        isBald = True

    # 上髭のほうが長い場合
    if abs(under-low)<=abs(high-above):
        # 上影線の場合
        if abs(under-low)/abs(high-above)<=border:
            print("上影" + name + "線")
            isHair = True
            # トンカチの場合
            if (abs(under-low)<=small)&(abs(high-above)>=0.1):
                print(name + "トンカチ")
                isHammer = True
            # トウバ
            if abs(open-close) <= small:
                print(name + "トウバ")
                isTower = True
        # 小線
        else:
            if abs(above-under)<=small:
                print(name + "十字")
                isCross = True
            else:
                print("小" + name + "線")
                isSmall = True
    # 下髭のほうが長い場合
    elif abs(under-low) > abs(high-above):
        # 下影線の場合
        if abs(high - above) / abs(under - low) <= border:
            print("下影" + name + "線")
            isBeard = True
            # カラカサの場合
            if (abs(high-above)<=small) & (abs(under-low)>=0.1):
                print(name + "カラカサ")
                isUmbrella = True
            # トンボ
            if abs(above-under)<=small:
                print(name + "トンボ")
                isDragonfly = True
        # 小線の場合
        else:
            if abs(above-under)<=small:
                print(name + "十字")
                isCross = True
            else:
                print("小" + name + "線")
                isSmall = True
    if isSkinHead:
        open = round(open, 3)
        high = round(high, 3)
        low = round(low, 3)
        close = round(close, 3)
    data = [open, high, low, close, isPositive, isBig, isSmall, isBald, isHair, isBeard, isHammer, isUmbrella, isCross, isDragonfly, isTower, isUpTrend]
    return data


# ls = [128+random.random(), 128+random.random()]
# ls = sorted(ls)
# low = ls[0]
# high = ls[1]

# open = random.uniform(low, high)
# close = random.uniform(low, high)

# ls = [[open, high, low, close]]
# for item in ls:
#     open = item[0]
#     high = item[1]
#     low = item[2]
#     close = item[3]
#     res = assign(open, high, low, close)

# df = pd.DataFrame(ls, columns=['Open', 'High', 'Low', 'Close'])
# dates = ["20230121"]
# df['date'] = pd.to_datetime(dates)
# df = df.set_index('date')

# mpf.plot(df, type='candle', style='yahoo', figratio=(12, 4), )
