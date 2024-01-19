import User from '../models/User.js'
import { createError } from '../error.js'
import jwt from 'jsonwebtoken'


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


export const addTransaction = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id })

    const newTransaction = {
      amount: req.body.amount,
      target: req.body.target,
    }

    user.transactions.push(newTransaction)

    await user.save()

    const { password, ...others } = user.toJSON()

    res.send(others)

  } catch (err) {
    next(err)
  }
}


export const deleteTransaction = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.id })

    user.transactions.pull({ _id: req.params.transaction_id })

    await user.save()

    const { password, ...others } = user.toJSON()

    res.send(others)

  } catch (err) {
    next(err)
  }
}
