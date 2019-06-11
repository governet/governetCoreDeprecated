from collections import defaultdict
from collections import deque

from datetime import datetime
from datetime import timedelta
from datetime import date

import plotly
import plotly.graph_objs as go

def readFile(inputFile):
    with open(inputFile, "r") as file:
        contents = (file.read().split("\n"))

    return(contents)

def processCommitteeData(inputRecords):
    recordTable = {}
    for record in inputRecords:
        record = record.split('|')
        if len(record) == 15:
            recordTable[record[0]] = record

    return(recordTable)

def processExpenditureData(inputRecords):
    recordTable = []
    for record in inputRecords:
        record = record.split('|')
        if len(record) == 22:
            recordTable.append(record)

    return(recordTable)

def generateDataset(inputData, dataField=7, dataFilter=(lambda x: x), processKey=(lambda x: x), processValue=(lambda x: 1)):
    returnTable = defaultdict(int)
    inputData = filter(dataFilter, inputData)
    for record in inputData:
        try:
            returnTable[processKey(record[dataField])] += processValue(1)
        except (IndexError, ValueError):
            pass
    return(returnTable)

def sumTypes(expenditureData, recordField=7, processKey=(lambda x: x), processValue=(lambda x: 1)):
    returnTable = defaultdict(int)
    for record in expenditureData:
        try:
            returnTable[processKey(record[recordField])] += processValue(1)
        except (IndexError, ValueError):
            pass
    return(returnTable)

def genPlot(xData, yData, graphTitle="A graph!"):
    plotly.offline.plot({
        "data":[go.Scatter(x=xData, y=yData)],
        "layout": go.Layout(title=graphTitle)
        }, auto_open=True
    )

'''
return a dict default dict, of date: Value
for each date in the year:
    add that date to the x
    add that index from list 1 to values 1
    add that index from list 2 to values 2
'''

def dateComparisonGraph():
    returnList = []
    d1 = datetime(2018, 12, 1, 0, 0)  # start date
    d2 = datetime(2019, 6, 1, 0, 0)  # end date

    delta = d2 - d1         # timedelta

    for i in range(delta.days + 1):
        returnList.append(d1 + timedelta(days=i))

    return(returnList)


def graphDataSets(committeeFile="./cm.txt", expenditureFile="./itpas220.txt"):
    # Set up the shared x axis, which will contain all the dates in a given range.
    # without this, the plots merge weirdly
    xAxis1 = dateComparisonGraph()

    #Load the data from files
    committees = processCommitteeData(readFile(committeeFile))
    expenditures = processExpenditureData(readFile(expenditureFile))

    # Generate a dictionary of {date: expenditureCount} for each date
    dateSum = generateDataset(expenditures, dataFilter=(lambda x: x if x[9] == "PA" else None), dataField=13, processKey=(lambda x: datetime.strptime(x, "%m%d%Y")))
    dateSum2 = generateDataset(expenditures, dataFilter=(lambda x: x if x[9] == "MA" else None), dataField=13, processKey=(lambda x: datetime.strptime(x, "%m%d%Y")))
    dateSum3 = generateDataset(expenditures, dataFilter=(lambda x: x if x[9] == "FL" else None), dataField=13, processKey=(lambda x: datetime.strptime(x, "%m%d%Y")))
    dateSum4 = generateDataset(expenditures, dataFilter=(lambda x: x if x[9] == "TX" else None), dataField=13, processKey=(lambda x: datetime.strptime(x, "%m%d%Y")))


    yAxis1 = []
    yAxis2 = []
    yAxis3 = []
    yAxis4 = []

    for dateObj in xAxis1:
        yAxis1.append(dateSum[dateObj])
        yAxis2.append(dateSum2[dateObj])
        yAxis3.append(dateSum3[dateObj])
        yAxis4.append(dateSum4[dateObj])

    # generate the plot!
    plotly.offline.plot({
        "data":[go.Scatter(x=xAxis1, y=yAxis1, name="MA"), go.Scatter(x=xAxis1, y=yAxis2, name="PA"), go.Scatter(x=xAxis1, y=yAxis3, name="FL"), go.Scatter(x=xAxis1, y=yAxis4, name="TX")],
        "layout": go.Layout(title="TESTING")
        }, auto_open=True
    )

def expendituresByMonth(committeeFile="./cm.txt", expenditureFile="./itpas220.txt"):
    #Load the data from files
    committees = processCommitteeData(readFile(committeeFile))
    expenditures = processExpenditureData(readFile(expenditureFile))

    # Generate a dictionary of {date: expenditureCount} for each date
    dateSum = sumTypes(expenditures, recordField=13, processKey=(lambda x: datetime.strptime(x, "%m%d%Y")))
    print(dateSum)

    # Temporary list for processing and sorting the dates
    list1 = []
    # Run through the dict, and get each date in the temporary list
    for k, v in dateSum.items():
        list1.append(k)

    # Sort the temporary list, so we can generate matched lists for input to plotly
    list1.sort()

    # These will be used as data inputs to plotly; the 1st value in x corresponds to the 1st value in y, and so on; 
    # These must match up for the data to be displayed correctly
    xlist = []
    ylist = []

    # Go through the temporary list, format the time, and append it to the xlist; in the same pass, append the sum of expenditures for that date to the same index in the corresponding y list.
    for item in list1:
        xlist.append(item.strftime("%m/%d/%Y"))
        ylist.append(dateSum[item])

    # generate the plot!
    genPlot(xlist, ylist, graphTitle="Expenditures by Month")


if __name__ == "__main__":
    #expendituresByMonth()

    expenditureFile="./itpas220.txt"
    expenditures = processExpenditureData(readFile(expenditureFile))

    graphDataSets()

    #print(dateComparisonGraph())