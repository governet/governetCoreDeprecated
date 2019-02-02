# Governet Core
## Version 0.2
Governet provides an interface to FEC election data.
Governet acts as a facade over the FEC bulk data, allowing for local maniuplation and management of the data.
This repository contains the core governet services, including the database, api, batch processor, and soon the UI and cache.

## Getting Started with Development
### Dependencies: 
Install [Docker & Docker Compose](https://docs.docker.com/install/).  Docker Community Edition for Mac and Windows comes pre-packaged with Docker Compose. 

### Setup:
1. Copy the file `.env.example`, renaming it to `.env`.

   The application relies on environment variables to understand how to connect to the database. Docker Compose looks for those environment variables stored in a `.env` file in the root of the project.  As this file can contain sensitive information it's gitignored.  However, we've included a working example.  Simply rename the `.env.example` file in the root to `.env` and docker compose will pick it up

2. Run `docker-compose up` in the root directory of the project

   This will stand up the database, the loader, fetch the data from the FEC and load it into the DB, and stand up the API, connecting it to the database.  

3. check out the data

   `127.0.0.1:5000`

   `127.0.0.1:3000/api/candidates`

# The Governet Services
## Frontend
[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/danbudris/governet%2FgovernetCore%2FgovernetCoreFrontend?type=cf-1)]( https://g.codefresh.io/public/accounts/danbudris/pipelines/governet/governetCore/governetCoreFrontend)

React frontend for the system

## Database
[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/danbudris/governet%2FgovernetCore%2FgovernetCoreDatabase?type=cf-1)]( https://g.codefresh.io/public/accounts/danbudris/pipelines/governet/governetCore/governetCoreDatabase)

Postgres database

Exposes port 5324

Base database is `governet`.

## API
[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/danbudris/governet%2FgovernetCore%2FgovernetCoreBackend?type=cf-1)]( https://g.codefresh.io/public/accounts/danbudris/pipelines/governet/governetCore/governetCoreBackend)

Node.js + Express API

Exposes port 3000

See the file `/backend/routes.js` in this directory for the available routes

## Loader
Python batch processer

Exposes port 5000, for a simple config/health check

At startup reads the configuration file from the loader directory, and fetchs + loads the requested years and data sets from the FEC bulk data server. 

#### Author
Dan Budris


### TO DO and FEATURES
Feature: jaccard index for candidate similarity based on contributions
Feature: jaccard index for committes with similarity based on candidates they've contributed to
Feature: contribution co-occurence heat-map
Feature: contribution map for candidate -- use coloration or node size to indicate the co-occurance of individual donors
Feature: candidate map for contributions -- use coloration or node size to indidicate the co-occurance of candidates a donor or PAC has contirbutied to in a given area
Feature: candidate contribution timeline