import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createError } from '../error.js'


/**
 * User registration endpoint
 */
export const signup = async (req, res, next) => {
  try {
    // Check if email and password are provided
    if (!req.body.email || !req.body.password) {
      return next(createError(400, 'Email and password are required for registration...'))
    }

    const user = await User.findOne({ email: req.body.email })
    // Check if user with the same email already exists
    if (user) {
      return next(createError(409, 'User with this email already exists...'))
    }

    // Hash the password before saving the new user
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)

    const newUser = new User({ ...req.body, password: hash })
    await newUser.save()

    res.status(201).send('User registered!')

  } catch (err) {
    next(err)
  }
}


/**
 * User login endpoint
 */
export const login = async (req, res, next) => {
  try {
    // Check if email and password are provided
    if (!req.body.email || !req.body.password) {
      return next(createError(400, 'Email and password are required for registration...'))
    }

    const user = await User.findOne({ email: req.body.email })

    // Check if the user exists
    if (!user) {
      return next(createError(404, 'User not found...'))
    }

    // Compare the provided password with the hashed password in the database
    const isCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    )

    // If the passwords don't match, return an error
    if (!isCorrect) {
      return next(createError(400, 'Wrong credentials...'))
    }

    // Assign a JWT token to the user
    const token = jwt.sign({ id: user._id }, process.env.JWT)

    // Omit the password and send the user data along with the token in a cookie
    const { password, ...others } = user.toJSON()

    res.cookie('access_token', token, {
      httpOnly: true,
    }).json(others)

  } catch (err) {
    next(err)
  }
}


/**
 * User logout endpoint
 */
export const logout = async (req, res, next) => {
  try {
    // Clear the access_token cookie to log the user out
    res.clearCookie('access_token')
    res.send('Logged out successfully!')

  } catch (err) {
    next(err)
  }
}
