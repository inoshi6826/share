import mplfinance as mpf
import pandas as pd


ls = [[108.701, 108.731, 108.637 ,108.659]]

df = pd.DataFrame(ls, columns=['Open', 'High', 'Low', 'Close'])
dates = ["20230121"]
df['date'] = pd.to_datetime(dates)
df = df.set_index('date')

mpf.plot(df, type='candle', style='yahoo', figratio=(12, 4), )
