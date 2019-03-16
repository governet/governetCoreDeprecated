//pg-promise options; required
let options = {};

//import pg promise, and connect to the db
const pgp = require('pg-promise')(options);

//this db connection string should use an environment variable rather than being hard coded
const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
const db = pgp(connectionString);

//Get all candidates
function getAllCandidates(req, res, next) {
    db.any('SELECT * FROM candidates')
      .then((data) => {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ALL candidates'
          });
      })
      .catch((err) => {
        return next(err);
      });
  }

//get a candidate based on their ID
function getSingleCandidate(req, res, next) {
    var candID = req.params.id;
    db.one('SELECT * FROM candidates WHERE CAND_ID = $1', candID)
      .then((data) => {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE candidate'
          });
      })
      .catch((err) => {
        return next(err);
      });
  }

//get candidates running for a given office
function getCandidatesByOffice(req, res, next) {
    var candOffice = req.params.office;
    db.any("SELECT * FROM candidates WHERE CAND_OFFICE = $1;", candOffice)
      .then((data) => {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'Retrieved ONE candidate'
          });
      })
      .catch((err) => {
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
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ONE candidate'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

function getContributionsByCandidate(req, res, next) {
//get candidates running for a given office
  var candID = req.params.id;
  db.any("SELECT * FROM cmte_contributions WHERE CAND_ID = $1;", candID)
    .then((data) => {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved Contributions for Candidate'
        });
    })
    .catch((err) => {
      return next(err);
    });
}

  function getCommittee(req, res, next) {
    //get candidates running for a given office
      let cmteID = req.params.id;
      db.any("SELECT * FROM committees WHERE CMTE_ID = $1;", cmteID)
        .then((data) => {
          res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved Info about Committee'
            });
        })
        .catch((err) => {
          return next(err);
        });
    }
  
  function getContributionsByCommittee(req, res, next) {
    //get candidates running for a given office
      let cmteID = req.params.id;
      db.any("SELECT * FROM cmte_contributions WHERE CMTE_ID = $1;", cmteID)
        .then((data) => {
          res.status(200)
            .json({
              status: 'success',
              data: data,
              message: 'Retrieved Contributions from Committee'
            });
        })
        .catch((err) => {
          return next(err);
        });
    }

    function getContributionsByCandidateList(req, res, next) {
      //get candidates running for a given office
        let candidateList = req.query.id;
        db.any("SELECT cmte_id, cand_id FROM cmte_contributions WHERE cand_id IN ($1:csv);", [candidateList])
          .then((data) => {
            res.status(200)
              .json({
                status: req.query.id,
                data: data,
                message: 'Retrieved Contributions from Committee'
              });
          })
          .catch((err) => {
            return next(err);
          });
      }

      function generateCandidateLinksByCommittee(req, res, next){
        let candidateList = req.query.id;
        db.any("SELECT DISTINCT a.cand_id AS source, b.cand_id AS target, 5 as value FROM cmte_contributions a, cmte_contributions b WHERE a.cand_id IN ($1:csv) AND b.cand_id in ($1:csv) AND a.cmte_id = b.cmte_id AND a.cand_id != b.cand_id ;", [candidateList]) //ND a.cmte_id = b.cmte_id
          .then((data) => {
            res.status(200)
              .json({
                status: req.query.id,
                data: data,
                message: 'Retrieved Contributions from Committee'
              });
          })
          .catch((err) => {
            return next(err);
          });
      }

//        db.any("SELECT cmte_id, cand_id FROM cmte_contributions WHERE cand_id IN (${candidateList});", {candidateList: candidateList})


//Export the queries
module.exports = {
  getAllCandidates: getAllCandidates,
  getSingleCandidate: getSingleCandidate,
  getCandidatesByOffice: getCandidatesByOffice,
  getCandidateByField: getCandidateByField,
  getContributionsByCandidate: getContributionsByCandidate,
  getContributionsByCanddiateList: getContributionsByCandidateList,
  getContributionsByCommittee: getContributionsByCommittee,
  getCommittee: getCommittee,
  getCandCmtelinks: generateCandidateLinksByCommittee
};
