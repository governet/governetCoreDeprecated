# Governet
## Version 0.2
GovernNet provides an interface to FEC election data.
GovernNet acts as a facade over the FEC bulk data, allowing for local maniuplation and management of the data.

## Getting Started with Development
Dependencies: 
Install [Docker & Docker Compose](https://docs.docker.com/install/).  Docker Community Edition for Mac and Windows comes pre-packaged with Docker Compose. 

Setup:
1. Copy the file `.env.example`, renaming it to `.env`.

The application relies on environment variables to understand how to connect to the database. Docker Compose looks for those environment variables stored in a `.env` file in the root of the project.  As this file can contain sensitive information it's gitignored.  However, we've included a working example.  Simply rename the `.env.example` file in the root to `.env` and docker compose will pick it up

2. docker-compose up

This will stand up the database, the loader, fetch the data from the FEC and load it into the DB, and stand up the API, connecting it to the database.  

3. check out the data

127.0.0.1:5000 

127.0.0.1:3000/candidates

## The Governet Services
### Database
Postgres database

Exposes port 5324

Base database is `governet`.

### API
Node.js + Express API

Exposes port 3000

See /api/routes.js for the available routes

### Loader
Python batch processer

Exposes port 5000, for a simple config/health check

At startup reads the configuration file from the loader directory, and fetchs + loads the requested years and data sets from the FEC bulk data server. 

#### Author
Dan Budris
