const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

router.get('/:userId', qrController.generateQR);

module.exports = router;
