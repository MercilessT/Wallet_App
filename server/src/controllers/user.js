import User from '../models/User.js'
import { createError } from '../error.js'
import jwt from 'jsonwebtoken'


/** 
 * Update user token endpoint
 */
export const updateUserToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.id })
    if (!user) {
      return next(createError(404, 'User not found...'))
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


/**
 * Add user transaction endpoint
 */
export const addTransaction = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id })

    // Create a new transaction object based on the request body
    const newTransaction = {
      amount: req.body.amount,
      target: req.body.target,
    }

    // Add the new transaction to the user's transactions array and save the user
    user.transactions.push(newTransaction)

    await user.save()

    // Omit the password and send the updated user data
    const { password, ...others } = user.toJSON()

    res.send(others)

  } catch (err) {
    next(err)
  }
}


/**
 * Delete user transaction endpoint
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id })

    // Remove the specified transaction from the user's transactions array and save the user
    user.transactions.pull({ _id: req.params.transaction_id })

    await user.save()

    // Omit the password and send the updated user data
    const { password, ...others } = user.toJSON()

    res.send(others)

  } catch (err) {
    next(err)
  }
}
