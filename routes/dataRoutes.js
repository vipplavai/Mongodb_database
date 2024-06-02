const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const { isAuthenticatedUser } = require('../middleware/auth.js'); // Corrected the typo

router.post('/assign/:userId', isAuthenticatedUser, dataController.assignDataChunks);
router.post('/clean/:userId',isAuthenticatedUser, dataController.cleanData);
router.get('/assigned/:userId',isAuthenticatedUser, dataController.getAssignedChunks);

module.exports = router;
        