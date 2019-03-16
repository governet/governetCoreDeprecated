// define all of the routes for the api, and export them for use by app.js
var express = require('express');
var router = express.Router();

var db = require('./queries');

// Candidate Routes
router.get('/api/candidates', db.getAllCandidates);
router.get('/api/candidates/:id', db.getSingleCandidate);
router.get('/api/candidates/:id/contributions', db.getContributionsByCandidate);
router.get('/api/candidates/office/:office', db.getCandidatesByOffice);
router.get('/api/candidates/select/:queryField/:queryValue', db.getCandidateByField);

//Committee Routes
router.get('/api/committees/:id', db.getCommittee);
router.get('/api/committees/:id/contributions', db.getContributionsByCommittee);

//Contribution Routes
router.get('/api/contributions/bulk', db.getContributionsByCanddiateList)

//Graph routes
router.get('/api/graph/candidates', db.getCandCmtelinks)

module.exports = router;