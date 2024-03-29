import configparser
import argparse
import subprocess
import glob
import os
import zipfile
import datetime
import logging
import csv
import json
import psycopg2

class loaderConfiguration:
    def __init__(self, configuration, profile="DEFAULT"):
        self.loaded = configuration[profile]

class dataFetcher:
    def __init__(self, configuration):

        # Loading the configuration from a file
        self.configuration = configuration.loaded
        self.fecUri = self.configuration["url"]
        self.outPath = self.configuration["outPath"]
        
        # Databse connection information
        logging.warn(os.environ)
        self.database = os.environ['DATABASE']
        self.databaseuser = os.environ['DATABASEUSER']
        self.databasepassword = os.environ['DATABSEPASSWORD']
        self.databasehost = os.environ['DATABASEHOST']

        # the range of years this data set is concerned with
        self.startYear = int(self.configuration["startYear"])
        self.endYear = int(self.configuration["endYear"])
        self.years = [str(year) for year in range(self.startYear, self.endYear+1) if year %2 == 0]

        # the specific data types this is concerned with
        self._dataTypes = (
            list(
                map(
                    lambda x: {"type":x,"format":".zip","description":""},
                    json.loads(self.configuration["dataTypes"])
                )
            )
        )

    def _connectToDatabase(self):
        conn = psycopg2.connect(f"dbname={self.database} user={self.databaseuser} password={self.databasepassword} host={self.databasehost}")
        return conn

    def _constructFilePath(self, type, format, url, year):
        ''' Generate the URL path of the given file
        '''
        _path = url + year + "/" + type + year[-2:] + format
        logging.info(_path)
        return _path

    def _constructAllFilePaths(self, dataTypes, url, year):
        ''' Generate a list of all file paths associated with the given years and types
        '''
        logging.info("Constructing all file paths...")
        _filePaths = []
        for _dataType in dataTypes:
            _filePaths.append(self._constructFilePath(_dataType["type"], _dataType["format"], url, year))
        return _filePaths

    def _constructHeaderPath(self, type, url):
        ''' Generate the URL path of the given header files
        '''
        _path = url + "data_dictionaries/" + type + "_header_file.csv"
        logging.info(_path)
        return _path

    def _constructAllHeaderPaths(self, dataTypes, url):
        ''' Generate a list of all the header files associated with the given years and types
        '''
        logging.info(f"Constructing all header paths for {dataTypes} from {url}...")
        _headerPaths = []
        for _dataType in dataTypes:
            _headerPaths.append(self._constructHeaderPath(_dataType["type"], url))
        return _headerPaths

    def _fetchFile(self, url, outPath):
        ''' Fetch a file at the given URL with wget, creating the outpath and saving it there
        '''
        logging.info(f"Fetching files from {url}, saving to {outPath}...")
        directory = (outPath.split(outPath.split("/")[-1], 1)[0])
        try:
            subprocess.call(["mkdir", directory])
        except:
            logging.warn('Directory already exists')
        fetchData = subprocess.Popen(["wget", url, "-O", outPath], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        for line in fetchData.stdout:
            logging.info(line)
        fetchData.wait()

    def _fetchFilesInYear(self, year):
        ''' Fetch all of the files for the given year for each data type
        '''
        _allPaths = self._constructAllFilePaths(self._dataTypes, self.fecUri, year)
        for _path in _allPaths:
            self._fetchFile(_path, self.outPath + _path.split(self.fecUri, 1)[1])
        
    def _fetchHeaderFiles(self):
        ''' Fetch all of the header files for all of the data sets
        '''
        _allHeaderPaths = self._constructAllHeaderPaths(self._dataTypes, self.fecUri)
        for _headerPath in _allHeaderPaths:
            self._fetchFile(_headerPath, self.outPath + _headerPath.split(self.fecUri, 1)[1])

    def fetchData(self):
        ''' Fetch all of the files in all of the years
            FEC cycles go by the even year -- so if it's not an even year, don't get it!
        '''
        for year in self.years:
            if int(year) % 2 == 0:
                self._fetchFilesInYear(year)
            self._fetchHeaderFiles()

    def _cleanData(self, file):
        input_file = open(file)
        sanitized_input = input_file.read().replace("\\","/")
        input_file.close

        cleaned_file = open(file, 'w')
        cleaned_file.write(sanitized_input)
        cleaned_file.close

        return(f"Cleaned {file}")

    def loadData(self):
        ''' Create tables and load data into the database
        '''
        try:
            conn = self._connectToDatabase()
        except:
            logging.error(f"Unable to connect to the database {self.database} on host {self.databasehost} as user {self.databaseuser}")

        for year in self.years:
            cur = conn.cursor()

            self._cleanData(f'/srv/data/{year}/cn.txt')
            f = open(f'/srv/data/{year}/cn.txt')

            cur.copy_from(f, 'candidates', sep="|", columns=(
                'CAND_ID', 
                'CAND_NAME',
                'CAND_PTY_AFFILIATION',
                'CAND_ELECTION_YR',
                'CAND_OFFICE_ST',
                'CAND_OFFICE',
                'CAND_OFFICE_DISTRICT',
                'CAND_ICI',
                'CAND_STATUS',
                'CAND_PCC',
                'CAND_ST1',
                'CAND_ST2',
                'CAND_CITY',
                'CAND_ST',
                'CAND_ZIP'
                ))

            self._cleanData(f'/srv/data/{year}/itpas2.txt')
            f = open(f'/srv/data/{year}/itpas2.txt')
            cur.copy_from(f, 'cmte_contributions', sep='|', columns=(
                'CMTE_ID',
                'AMNDT_IND',
                'RPT_TP',
                'TRANSACTION_PGI',
                'IMAGE_NUM',
                'TRANSACTION_TP',
                'ENTITY_TP',
                'NAME',
                'CITY',
                'STATE',
                'ZIP_CODE',
                'EMPLOYER',
                'OCCUPATION',
                'TRANSACTION_DT',
                'TRANSACTION_AMT',
                'OTHER_ID',
                'CAND_ID',
                'TRAN_ID',
                'FILE_NUM',
                'MEMO_CD',
                'MEMO_TEXT',
                'SUB_ID'
            ))

            self._cleanData(f'/srv/data/{year}/cm.txt')
            f = open(f'/srv/data/{year}/cm.txt')

            cur.copy_from(f, 'committees', sep='|', columns=(
                'CMTE_ID', 
                'CMTE_NM', 
                'TRES_NM', 
                'CMTE_ST1', 
                'CMTE_ST2', 
                'CMTE_CITY', 
                'CMTE_ST', 
                'CMTE_ZIP', 
                'CMTE_DSGN', 
                'CMTE_TP', 
                'CMTE_PTY_AFFILIATION', 
                'CMTE_FILING_FREQ', 
                'ORG_TP', 
                'CONNECTED_ORG_NM', 
                'CAND_ID'
            ))

        conn.commit()
        conn.close()

# future functions for cleaning the data and laoding it into the database
def unzipData(path, dest):
    logging.info(f"Unzipping file at {path} to {dest}...")
    with zipfile.ZipFile(path,"r") as zip_ref:
        zip_ref.extractall(dest)
    return

def unzipAllData(dataDirectory):
    logging.info("Unzipping all data...")
    os.chdir(dataDirectory)
    for file in glob.iglob("**/*.zip"):
        unzipData(file, os.path.dirname(file))
        os.remove(file)
    return

def addHeaders(filePrefix, dataDirectory):
    '''Currently does not work
    '''
    logging.info(f'Adding {filePrefix} header files to files in {dataDirectory}...')
    os.chdir(dataDirectory)
    headerFile = "data_dictionaries/"+filePrefix+"_header_file.csv"

    with open(headerFile, 'rt') as headerFile:
        reader = csv.reader(headerFile)
        headers = list(reader)

    for file in glob.iglob(f"**/{filePrefix}.*"):
        with open(file, 'wt') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames = headers, delimiter = '|')
            writer.writeheader()
    return


    

