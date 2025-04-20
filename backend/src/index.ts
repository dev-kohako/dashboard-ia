import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRoutes } from './routes/auth.ts';
import { userRoutes } from './routes/user.ts';

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`)
})
