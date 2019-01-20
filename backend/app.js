const express = require('express')
const app = express()
const port = 3000
//import the routes for the api, from routes.js
const routes = require('./routes.js')

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

app.use('/', routes)
app.listen(port, () => console.log(`Governet app listening on port ${port}!`))