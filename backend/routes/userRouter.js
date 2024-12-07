const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware'); // Authenticate user
const { adminMiddleware } = require('../middleware/adminMiddleware'); // Role-based middleware

// Authentication routes
router.post('/login', authController.login); // User login
router.get('/logout', authenticate, authController.logoutUser); // User logout (requires authentication)
router.post('/register', authController.register); // User registration
router.get('/me', authenticate, authController.me); // Get authenticated user details

// User management routes (admin only)
router.post('/', authenticate, adminMiddleware, userController.createUser); // Create a user
router.post(
  '/create-admin',
  authenticate,
  adminMiddleware,
  userController.createAdmin
); // Create an admin
router.get('/', authenticate, adminMiddleware, userController.getUsers); // Get all users
router.get('/:id', authenticate, adminMiddleware, userController.getUserById); // Get a specific user
router.put(
  '/role/:userId',
  authenticate,
  adminMiddleware,
  userController.updateUserRole
);
router.put('/me', authenticate, userController.updateAccount); // Update a user
router.put('/:id', authenticate, adminMiddleware, userController.updateUser);

router.delete('/:id', authenticate, adminMiddleware, userController.deleteUser); // Delete a user
module.exports = router;
