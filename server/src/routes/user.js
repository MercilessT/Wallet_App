import express from 'express'
import { updateUserToken, addTransaction, deleteTransaction } from '../controllers/user.js'
import { verifyToken } from '../middlewares/verifyToken.js'


const router = express.Router()


router.put('/update_token', updateUserToken)
router.post('/add_transaction', verifyToken, addTransaction)
router.delete('/delete_transaction/:transaction_id', verifyToken, deleteTransaction)


export default router
