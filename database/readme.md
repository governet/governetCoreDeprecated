# Governet Database
Postgres database which acts as the primary data store to the postgresql database.
Ideally any connections to this databse from the API are masked behind a facade, so that we can switch it out for any relational
data store without breaking the API