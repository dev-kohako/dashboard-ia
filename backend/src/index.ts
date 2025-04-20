import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { authRoutes } from './routes/auth.ts';

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
  console.log(`🔥 Server running at http://localhost:${PORT}`)
})
