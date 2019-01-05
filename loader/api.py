from flask import Flask, render_template
import logging

def runApp(configPath, configProfile, loadedConfig, dataLoadTimestamp):
    app = Flask(__name__)

    @app.route('/')
    def basic_status():
        return f'Governet FEC Data Loader.  Last data load: { dataLoadTimestamp }'
    
    @app.route('/health')
    # add in actual application status health check here
    def health_check():
        return "200"

    @app.route('/config')
    #load the application configuration
    # use fecDataImport.config
    def read_config():
        try:
            return render_template('config.html', 
                                    configPath = configPath,
                                    profile = configProfile,
                                    url = loadedConfig["url"], 
                                    outPath = loadedConfig["outPath"],
                                    dataYears = loadedConfig["startYear"] + '-' + loadedConfig["endYear"],
                                    logLevel = loadedConfig["logLevel"],
                                    timeStamp = dataLoadTimestamp,
                                    dataDirs = " ".join(str(x)+"\n" for x in os.listdir(loadedConfig["outPath"])))
        except Exception as e:
            return e

    app.run(host='0.0.0.0')