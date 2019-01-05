import datetime
import configparser
import argparse
import logging
import os
import api
import loader

if __name__ == "__main__":
    logging.basicConfig(level="INFO")

    # accept configuration file override as argument
    parser = argparse.ArgumentParser(description='fetch FEC data and save it to the local disk')
    parser.add_argument('config', default="loader.conf", type=str, help='an absolute path to the governet FEC importer configuration file')
    parser.add_argument('profile', default="DEFAULT", type=str, help='the name of the profile in loader.config' )
    args = parser.parse_args()

    # load the configuration file
    logging.info("Loading config file...")
    config = configparser.ConfigParser()
    configPath = os.getcwd() + "/" + args.config
    config.read(configPath)
    configProfile = args.profile
    loadedConfig = config[configProfile]
    logging.info("Config file loaded...")

    # Start logging
    logging.basicConfig(filename=loadedConfig["logFile"], level=loadedConfig["logLevel"])
    logging.getLogger().addHandler(logging.StreamHandler())

    # load the data from the FEC
    logging.info("Fetching data from FEC...")
    dataFetcher = loader.dataFetcher(config)
    dataFetcher.fetchData()
    dataLoadTimestamp = datetime.datetime.now()
    logging.info("Fetched data from FEC...")

    # Unzip all the data into the container
    logging.info("Unzipping fetched data...")
    loader.unzipAllData(loadedConfig["outPath"])

    # Load all of the downloaded, unzipped data into the database
    logging.info("Starting data load to...")
    loader.loadData()

    logging.info("Starting API...")
    api.runApp(configPath, configProfile, loadedConfig, dataLoadTimestamp)
