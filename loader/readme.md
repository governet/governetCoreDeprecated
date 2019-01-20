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


# THE FUTURE
this should be set up to run as a kubernetes cron job, loading the data into a PostGres image, and then the postgres
image is snapshotted and push to a container repository.  That way we can run this just once a day as a k8s job or the like,
load the data up, and have it ready to acces in a more consistent and simpler manner

we also need some kind of readiness check for the other pods to ensure they won't start up until we've loaded the data 