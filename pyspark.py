#!/usr/bin/python

import numpy
import datetime

def createKey(row):
  key     = int(row[0])
  value   = int(row[1])
  date    = datetime.fromtimestamp(key / 1000)
  weekday = date.weekday()
  
  if (weekday == 1) or (weekday == 2):
    return (date.hour * 60 + date.minute, value)
  
  else:
    return (0, 0)

lines = sc.textFile("file:///home/racl/yi63hes/output.log") \
			.map(lambda x: x.split())                       \
			.map(createKey)                                 \
			.groupByKey()                                   \
			.map(lambda x : (x[0], numpy.mean(list(x[1])))) \
			.sortByKey(False)
        
lines.take(1440)