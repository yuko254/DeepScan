import { gmailTransporter, sgMail, isProd, createGmailTransporter } from '../config/email.js';

export async function sendPasswordResetEmail(email: string, token: string) {
  const subject = 'Password Reset Code';
  const html = `
    <p>You requested a password reset.</p>
    <h2 style="letter-spacing: 4px">${token}</h2>
    <p>This code expires in 1 hour. Do not share it with anyone.</p>
    <p>If you did not request this, ignore this email.</p>
  `;

  if (isProd) {
    await sgMail.send({
      to: email,
      from: `${process.env.APP_NAME} <${process.env.SENDGRID_FROM_EMAIL}>`,
      subject,
      html,
    });
  } else {
    await gmailTransporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html,
    });
  } 
  // else {
  //   const transporter = await createGmailTransporter();
  //   await transporter.sendMail({
  //     from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
  //     to: email,
  //     subject,
  //     html,
  //   });
  // }
}