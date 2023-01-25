import pandas as pd
import datetime


# FIXME isUpTrendの値が正しくない。このコードでは全日のトレンドしか反映出来ない

year = 2022

for i in range(0, 1):
    year = int(year)
    year += i
    year = str(year)

    dir_path = r"C:\Users\steel\dev\AI\datasets\exchange_rate\labeled_1h/"
    file_name = f"USDJPY_1H_{year}.csv"
    path = dir_path + file_name

    save_dir_path = r"C:\Users\steel\dev\AI\datasets\exchange_rate\new_1h/"
    save_path = save_dir_path + file_name

    df = pd.read_csv(path, index_col=["date", "time"])

    months = list(range(1, 13))
    days = list(range(1, 31))

    new_df = pd.DataFrame()

    for month in months:
        month = str(month)
        if len(month) == 1:
            month = "0" + month
        for day in days:
            day = str(day)
            if len(day) == 1:
                day = "0" + day
            try:
                date = datetime.date(year=int(year), month=int(month), day=int(day))
                # 5以上の時、土日
                if date.weekday() <= 4:
                    date = year + "." + month + "." + day
                    date_df = df[date:date]
                    open = date_df['open'].values[0]
                    high = date_df['high'].max()
                    low = date_df['low'].min()
                    close = date_df['close'].values[-1]
                    if close > open: 
                        date_df = date_df.replace({'isUpTrend': {False: True}})
                    new_df = pd.concat([new_df, date_df])
                    print(new_df)
            except:
                print(f"{year}.{month}.{day}は存在しません。") 
    new_df.to_csv(save_path)
        
