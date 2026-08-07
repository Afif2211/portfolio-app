import { Router } from 'express'
import Message from '../models/Message.js'
import { sendContactNotification } from '../config/mailer.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const saved = await Message.create({ name, email, message })

    try {
      await sendContactNotification({ name, email, message })
    } catch (mailErr) {
      console.error('Email notification failed:', mailErr.message)
    }

    res.status(201).json(saved)
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' })
  }
})

export default router