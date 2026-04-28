const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.post('/', authMiddleware, reviewController.createReview);
router.get('/:userId', authMiddleware, reviewController.getReviewsByUser);
router.get('/', authMiddleware, adminMiddleware, reviewController.getAllReviews);

module.exports = router;
