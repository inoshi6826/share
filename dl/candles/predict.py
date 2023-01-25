
import pandas as pd
import sys


year = 2021

for i in range(0, 1):
    year = int(year)
    year += i
    year = str(year)

    dir_path = r"C:\Users\steel\dev\AI\datasets\exchange_rate\1h_weekday_only/"
    file_name = f"USDJPY_1H_{year}.csv"
    path = dir_path + file_name

    df = pd.read_csv(path, index_col=["date", "time"])

    months = list(range(1, 13))
    days = list(range(1, 31))

    only_weekday_df = pd.DataFrame()

    for month in months:
        month = str(month)
        if len(month) == 1:
            month = "0" + month
        for day in days:
            day = str(day)
            if len(day) == 1:
                day = "0" + day
            date = year + "." + month + "." + day
            date_df = df[date:date]
            if date_df.__len__() != 0:
                print(date_df)
                print(date_df.__len__())
                for i in range(0, date_df.__len__()):
                    print(i, date_df[i:i+1])
                    data = date_df[i:i+1]
                    isPositive = data['isPositive'].values[0]
                    isBig = data['isBig'].values[0]
                    isSmall = data['isSmall'].values[0]
                    isBald = data['isBald'].values[0]
                    isHair = data['isHair'].values[0]
                    isBeard = data['isBeard'].values[0]
                    isHammer = data['isHammer'].values[0]
                    isTower = data['isTower'].values[0]
                    isUmbrella = data['isUmbrella'].values[0]
                    isDragonfly = data['isDragonfly'].values[0]
                    isCross = data['isCross'].values[0]
# NOTE isBig,isSmall,isBald,isHair,isBeard,isHammer,isUmbrella,isCross,isDragonfly,isTower,isUpTrend
                    # 陽の場合
                    if isPositive:
                        if isBig:
                            print('大陽線')
                        if isBald:
                            print('陽坊主')
                        if isHair:
                            print('上影陽線')
                            if isHammer:
                                print('陽トンカチ')
                            if isTower:
                                print('陽トウバ')
                        if isBeard:
                            print('下影陽線')
                            if isUmbrella:
                                print('陽カラカサ')
                            if isDragonfly:
                                print('陽トンボ')
                        if isSmall:
                            print('小陽線')
                        if isCross:
                            print('陽十字')
                    # 陰の場合
                    else:
                        if isBig:
                            print('大陰線')
                        if isBald:
                            print('陰坊主')
                        if isHair:
                            print('上影陰線')
                            if isHammer:
                                print('陰トンカチ')
                            if isTower:
                                print('陰トウバ')
                        if isBeard:
                            print('下影陰線')
                            if isUmbrella:
                                print('陰カラカサ')
                            if isDragonfly:
                                print('陰トンボ')
                        if isSmall:
                            print('小陰線')
                        if isCross:
                            print('陰十字')
                sys.exit()
        
