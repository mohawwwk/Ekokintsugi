const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.post('/request', authMiddleware, returnController.createReturnRequest);
router.put('/update/:id', authMiddleware, adminMiddleware, returnController.updateReturn);
router.get('/', authMiddleware, adminMiddleware, returnController.getAllReturns);
router.get('/user/:userId', authMiddleware, returnController.getReturnsByUser);

module.exports = router;
