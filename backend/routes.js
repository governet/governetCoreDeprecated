// define all of the routes for the api, and export them for use by app.js
var express = require('express');
var router = express.Router();

var db = require('./queries');
var healthCheck = require('./health');

// Administrative Routes
router.get('/', healthCheck.checkHealth);
router.get('/health', healthCheck.checkhealth);

// Candidate Routes
router.get('/api/candidates', db.getAllCandidates);
router.get('/api/candidates/:id', db.getSingleCandidate);
router.get('/api/candidates/:id/contributions', db.getContributionsByCandidate);
router.get('/api/candidates/office/:office', db.getCandidatesByOffice);
router.get('/api/candidates/select/:queryField/:queryValue', db.getCandidateByField);

//Committee Routes
router.get('/api/committees/:id', db.getCommittee);
router.get('/api/committees/:id/contributions', db.getContributionsByCommittee);

module.exports = router;