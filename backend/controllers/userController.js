import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import mongoose from 'mongoose'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username })

	if (user && (await user.matchPassword(password))) {
		res.status(200).json({
			_id: user._id,
			firstname: user.firstname,
			lastname: user.lastname,
			username: user.username,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		})
	} else {
		res.status(401)
		throw new Error('Invalid username or password')
	}
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
	const { username, password, isAdmin } = req.body

	const userExists = await User.findOne({ username })

	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await User.create({
		username,
		password,
		isAdmin,
	})

	if (user) {
		res.status(201).json({
			_id: user._id,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
// export const listUsers = asyncHandler(async (req, res) => {
// 	const allUsers = await User.find({}, { username: 1, isAdmin: 1 })

// 	if (allUsers?.length) {
// 		res.status(400)
// 		throw new Error('No Users Found')
// 	}

// 	if (allUsers?.length) {
// 		res.status(200).json(allUsers)
// 	} else {
// 		res.status(400)
// 		throw new Error('Server Error while getting users')
// 	}
// })

// export const getUserById = asyncHandler(async (req, res) => {
// 	const userId = req.params.userId
// 	const userInfo = await User.findOne({ _id: mongoose.Types.ObjectId(userId) })

// 	if (!userInfo) {
// 		res.status(400)
// 		throw new Error('No User Found')
// 	}

// 	if (userInfo) {
// 		res.status(200).json({
// 			username: userInfo.username,
// 		})
// 	} else {
// 		res.status(400)
// 		throw new Error('Server Error while getting users')
// 	}
// })
