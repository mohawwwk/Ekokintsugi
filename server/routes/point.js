const express = require('express');
const router = express.Router();
const pointController = require('../controllers/pointController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.post('/add', authMiddleware, adminMiddleware, pointController.addPoints);
router.put('/redeem', authMiddleware, adminMiddleware, pointController.redeemPoints);
router.get('/:userId', authMiddleware, pointController.getPoints);

module.exports = router;
