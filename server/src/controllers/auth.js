import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createError } from '../error.js'


export const signup = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return next(createError(400, 'Email and password are required for registration...'))
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
      return next(createError(409, 'User with this email already exists...'))
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(req.body.password, salt)

    const newUser = new User({ ...req.body, password: hash })
    await newUser.save()

    res.status(201).send('User registered!')

  } catch (err) {
    next(err)
  }
}


export const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return next(createError(400, 'Email and password are required for registration...'))
    }

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return next(createError(404, 'User not found...'))
    }

    const isCorrect = await bcrypt.compare(
      req.body.password,
      user.password,
    )

    if (!isCorrect) {
      return next(createError(400, 'Wrong credentials...'))
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT)

    const { password, ...others } = user.toJSON()

    res.cookie('access_token', token, {
      httpOnly: true,
    }).json(others)

  } catch (err) {
    next(err)
  }
}


export const logout = async (req, res, next) => {
  try {
    res.clearCookie('access_token')
    res.send('Logged out successfully!')

  } catch (err) {
    next(err)
  }
}