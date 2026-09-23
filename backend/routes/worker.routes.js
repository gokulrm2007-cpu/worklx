const express = require('express');
const router = express.Router();
const workerController = require('../controllers/worker.controller');

router.get('/categories/all', workerController.getCategories);
router.get('/', workerController.getWorkers);
router.get('/:id', workerController.getWorkerById);

module.exports = router;
