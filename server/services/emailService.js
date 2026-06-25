const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST || 'smtp-relay.brevo.com',
  port: process.env.BREVO_PORT || 587,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_PASSWORD,
  },
})

const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
    text,
  }
  await transporter.sendMail(mailOptions)
}

// Email templates
const emailTemplates = {
  verifyEmail: (name, url) => ({
    subject: 'Verify Your Lumina Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #8B5CF6); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Lumina</h1>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F172A;">Hello, ${name}!</h2>
          <p style="color: #6b7280;">Thanks for joining Lumina. Please verify your email address to get started.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background: #2563EB; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">This link expires in 24 hours. If you didn't create an account, ignore this email.</p>
        </div>
      </div>
    `,
  }),

  forgotPassword: (name, url) => ({
    subject: 'Reset Your Lumina Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #8B5CF6); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Lumina</h1>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F172A;">Password Reset Request</h2>
          <p style="color: #6b7280;">Hi ${name}, click the button below to reset your password.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background: #2563EB; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px;">This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `,
  }),

  orderConfirmation: (name, order) => ({
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #8B5CF6); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Lumina</h1>
        </div>
        <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #0F172A;">Order Confirmed! 🎉</h2>
          <p style="color: #6b7280;">Hi ${name}, your order has been confirmed.</p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p style="margin: 0 0 8px 0;"><strong>Total:</strong> ₹${order.total}</p>
            <p style="margin: 0;"><strong>Payment:</strong> ${order.paymentMethod.toUpperCase()}</p>
          </div>
          <p style="color: #6b7280;">We'll send you another email when your order ships.</p>
        </div>
      </div>
    `,
  }),

  orderShipped: (name, order, trackingNumber) => ({
    subject: `Your Lumina Order Has Shipped! 🚚`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Your order is on its way, ${name}!</h2>
        <p>Order #${order._id.toString().slice(-8).toUpperCase()} has been shipped.</p>
        ${trackingNumber ? `<p><strong>Tracking Number:</strong> ${trackingNumber}</p>` : ''}
      </div>
    `,
  }),
}

module.exports = { sendEmail, emailTemplates }
