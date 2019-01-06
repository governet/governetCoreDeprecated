// define all of the routes for the api, and export them for use by app.js
var express = require('express');
var router = express.Router();

var db = require('./queries');

router.get('/api/candidates', db.getAllCandidates);
router.get('/api/candidates/id/:id', db.getSingleCandidate);
router.get('/api/candidates/office/:office', db.getCandidatesByOffice);
router.get('/api/candidates/select/:queryField/:queryValue', db.getCandidateByField);

module.exports = router;