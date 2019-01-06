//pg-promise options; required
var options = {};

//import pg promise, and connect to the db
var pgp = require('pg-promise')(options);
//this db connection string should use an environment variable rather than being hard coded
var connectionString = 'postgres://postgres:example@postgres:5432/governet';
var db = pgp(connectionString);

//Get all candidates
function getAllCandidates(req, res, next) {
    db.any('SELECT * FROM candidates')
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL candidates'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

//get a candidate based on their ID
function getSingleCandidate(req, res, next) {
    var candID = req.params.id;
    db.one('SELECT * FROM candidates WHERE CAND_ID = $1', candID)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE candidate'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

//get candidates running for a given office
function getCandidatesByOffice(req, res, next) {
    var candOffice = req.params.office;
    db.any("SELECT * FROM candidates WHERE CAND_OFFICE = $1;", candOffice)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE candidate'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

  //Get candidates where a given column has a given value
  function getCandidateByField(req, res, next) {
    var queryColumn = req.params.queryField;
    var queryValue = req.params.queryValue;
    var query = "SELECT * FROM candidates WHERE " + queryColumn + " = '" + queryValue + "';"
    console.log(query)
    db.any(query)
      .then(function (data) {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE candidate'
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }

//Export the queries
module.exports = {
  getAllCandidates: getAllCandidates,
  getSingleCandidate: getSingleCandidate,
  getCandidatesByOffice: getCandidatesByOffice,
  getCandidateByField: getCandidateByField
};
