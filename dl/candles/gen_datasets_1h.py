import pandas as pd
import numpy as np
import hour_candle_classify as hcc


data_path = r"C:\Users\steel\dev\AI\datasets\exchange_rate\1h"
year = 2021
for i in range(0, 2):
    year = int(year)
    year += i

    dir_path = r"C:\Users\steel\dev\AI\datasets\exchange_rate\labeled_1h"
    sfn = f"/USDJPY_1H_{year}.csv"
    save_path = dir_path + sfn

    year = str(year)
    file_name = f"/DAT_MT_USDJPY_1H_{year}.csv"
    path = data_path + file_name

    res = pd.read_csv(path)

    df = res[['date', 'time', 'open', 'high', 'low', 'close']].values

    ls = []
    for data in df:
        date = data[0]
        time = data[1]
        open = data[2]
        high = data[3]
        low = data[4]
        close = data[5]
        res = hcc.assign(open, high, low, close)
        res.insert(0, date)
        res.insert(1, time)
        ls.append(res)

    data = np.array(ls)
    print(data)

    df = pd.DataFrame(data, columns=['date', 'time', 'open', 'high', 'low', 'close', 'isPositive','isBig', 'isSmall', 'isBald', 'isHair', 'isBeard', 'isHammer', 'isUmbrella', 'isCross', 'isDragonfly', 'isTower', 'isUpTrend',])
    print(df)

    df.to_csv(save_path, index=False)
