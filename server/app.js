import express from 'express'
import './src/config.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './src/middlewares/errorHandler.js'
import authRoutes from './src/routes/auth.js'
import userRoutes from './src/routes/user.js'


const app = express()


app.use(cookieParser())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use(errorHandler)


export default app
