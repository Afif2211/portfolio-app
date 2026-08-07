import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import contactRoutes from './routes/contact.routes.js'
import projectRoutes from './routes/projects.routes.js'

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())

app.get('/', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/contact', contactRoutes)
app.use('/api/projects', projectRoutes)

const PORT = process.env.PORT || 8000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message)
    process.exit(1)
  })
