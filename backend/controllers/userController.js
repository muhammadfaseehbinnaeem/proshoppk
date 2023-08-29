import jwt from 'jsonwebtoken';

import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc        Register user
// @route       POST /api/users
// @access      Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        phoneNumber,
        password
    });

    if (user) {
        generateToken(res, user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }

    res.send('register user');
});

// @desc        Auth user & get token
// @route       POST /api/users/login
// @access      Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc        Logout user & clear cookie
// @route       POST /api/users/logout
// @access      Private
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: 'Logged out' });
});

// @desc        Verify email
// @route       POST /api/users/verifyemail
// @access      Public
const verifyEmail = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (user) {
        res.status(200).json({ email: user.email });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc        Reset password
// @route       PUT /api/users/resetpassword
// @access      Public
const resetPassword = asyncHandler(async (req, res) => {
    console.log('here');
    const user = await User.findOne({ email: req.body.email });

    if (user) {
        user.password = req.body.password || user.password;

        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc        Get user profile
// @route       GET /api/users/profile
// @access      Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAdmin: user.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc        Update user profile
// @route       PUT /api/users/profile
// @access      Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        
        if (req.body.password) {
            user.password = req.body.password || user.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phoneNumber: user.phoneNumber,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc        Get users
// @route       GET /api/users
// @access      Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const size = Number(req.query.pageSize);
    const page = Number(req.query.pageNumber) || 1;

    const query = req.query.keyword ? {
        $or: [
            {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            },
            {
                email: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            },
            {
                phoneNumber: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            }
        ]
    } : {};
    
    const limit = size;
    const offset = limit * (page - 1);

    const count = await User.countDocuments({ ...query });

    const users = await User
        .find({ ...query })
        .skip(offset)
        .limit(limit);

    res.status(200).json({
        users,
        page,
        pages: Math.ceil(count / limit)
    });
});

// @desc        Get user by ID
// @route       GET /api/users/:id
// @access      Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc        Delete user
// @route       DELETE /api/users/:id
// @access      Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error('Cannot delete admin');
        }

        await User.deleteOne({ _id: user._id });

        res.status(200).json({ message: 'User deleted successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc        Update user
// @route       PUT /api/users/:id
// @access      Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phoneNumber: user.phoneNumber,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export {
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
};