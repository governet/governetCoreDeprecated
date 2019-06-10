from collections import defaultdict
from collections import deque
from datetime import datetime

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
        recordTable[record[0]] = record

    return(recordTable)

def processExpenditureData(inputRecords):
    recordTable = []
    for record in inputRecords:
        record = record.split('|')
        recordTable.append(record)

    return(recordTable)

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

def expendituresByMonth(committeeFile="./cm.txt", expenditureFile="./itpas220.txt"):
    #Load the data from files
    committees = processCommitteeData(readFile(committeeFile))
    expenditures = processExpenditureData(readFile(expenditureFile))

    # Generate a dictionary of {date: expenditureCount} for each date
    dateSum = sumTypes(expenditures, 13, processKey=(lambda x: datetime.strptime(x, "%m%d%Y")))
    
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
    expendituresByMonth()

