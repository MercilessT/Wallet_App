import mongoose from 'mongoose'


/** 
 * Schema for user transactions 
 */
const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    target: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

/**
 * Schema for user information, including an array of transactions
 */
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
    },
    transactions: [TransactionSchema],
  },
  { timestamps: true },
)

export default mongoose.model('User', UserSchema)
