const express = require('express');
const statisticsController = require('../controllers/statisticsController'); // Adjust path as needed

const router = express.Router();

// Route for fetching statistics
router.get('/', statisticsController.getStatistics);

module.exports = router;
