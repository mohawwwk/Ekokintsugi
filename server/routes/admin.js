const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth');

router.post('/create-user', authMiddleware, adminMiddleware, adminController.createUser);
router.get('/users', authMiddleware, adminMiddleware, adminController.getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, adminController.getUserById);

module.exports = router;
