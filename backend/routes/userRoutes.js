import express from 'express';

import {
    registerUser,
    authUser,
    logoutUser,
    verifyEmail,
    resetPassword,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUser,
    updateUser
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers).post(registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/verifyemail').post(verifyEmail);
router.route('/resetpassword').put(resetPassword);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').get(protect, admin, getUserById).put(protect, admin, updateUser).delete(protect, admin, deleteUser);

export default router;