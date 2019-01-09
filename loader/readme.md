# Loader
Batch processer and loader for FEC data.

## Startup Script
The startup script loads the configuration from the loader.conf file in this directory.  It then uses the loader class to download the data from the specified years, unzips it, connects to the database and loads it into the postgres database.

### Loader.conf
Configuration file for the loader.  Determines which years of data it loads, FEC endpoint, and logging settings. 

## Loader
A class and set of functions for downloading data from the FEC bulk data server, processing it, and loading it into the database.  Currently the data sets which are fetched are controlled by the loader class.

## API
A very simple flask API which shows the configuration values the loads is currently using.
