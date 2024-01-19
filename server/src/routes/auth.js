import express from 'express'
import { signup, login, logout } from '../controllers/auth.js'
import { verifyToken } from '../middlewares/verifyToken.js'


const router = express.Router()


router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', verifyToken, logout)


export default router

