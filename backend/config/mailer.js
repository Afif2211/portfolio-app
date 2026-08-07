import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

export async function sendContactNotification({ name, email, message }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email not configured — skipping notification email')
    return
  }

  await transporter.sendMail({
    from: `"Portfolio contact form" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    text: `From: ${name} (${email})\n\n${message}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p>${message.replace(/\n/g, '<br />')}</p>
    `
  })
}