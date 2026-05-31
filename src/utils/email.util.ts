import { gmailTransporter, sgMail, isProd } from '../config/email.js';
import * as env from '../config/env.js';

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail({ to, subject, html }: EmailOptions) {
  if (isProd) {
    await sgMail.send({
      to,
      from: `${env.APP_NAME} <${process.env.SENDGRID_FROM_EMAIL}>`,
      subject,
      html,
    });
  } else {
    await gmailTransporter.sendMail({
      from: `"${env.APP_NAME}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });
  }
}

// Password Reset
export async function sendPasswordResetEmail(email: string, token: string) {
  const html = `
    <p>You requested a password reset.</p>
    <h2 style="letter-spacing: 4px">${token}</h2>
<<<<<<< HEAD
    <p>This code expires in ${env.PASSWORD_RESET_TOKEN_IN_SECONDS/60} mins. Do not share it with anyone.</p>
    <p>If you did not request this, ignore this email.</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Code',
    html,
  });
=======
    <p>This code expires in ${env.PASSWORD_RESET_TOKEN_IN_SECONDS / 60} mins. Do not share it with anyone.</p>
    <p>If you did not request this, ignore this email.</p>
  `;

  await sendEmail({ to: email, subject: 'Password Reset Code', html });
>>>>>>> dev
}

// Password Reset Success
export async function sendPasswordResetSuccessEmail(email: string) {
  const html = `
    <p>Your password has been successfully reset.</p>
    <p>If you did not perform this action, please contact support immediately.</p>
    <p>For security reasons, all your active sessions have been logged out.</p>
  `;

<<<<<<< HEAD
  await sendEmail({
    to: email,
    subject: 'Password Reset Successful',
    html,
  });
=======
  await sendEmail({ to: email, subject: 'Password Reset Successful', html });
>>>>>>> dev
}

// Login Detection
export async function sendLoginAlertEmail(email: string, userAgent: string, ip: string, location?: string) {
  const html = `
    <p>We detected a new login to your account.</p>
    <ul>
      <li><strong>Device:</strong> ${userAgent}</li>
      <li><strong>IP Address:</strong> ${ip}</li>
      ${location ? `<li><strong>Location:</strong> ${location}</li>` : ''}
      <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
    </ul>
    <p>If this was you, you can ignore this email.</p>
    <p>If this wasn't you, please reset your password immediately.</p>
  `;

<<<<<<< HEAD
  await sendEmail({
    to: email,
    subject: 'New Login Detected',
    html,
  });
=======
  await sendEmail({ to: email, subject: 'New Login Detected', html });
>>>>>>> dev
}

// Account Banned
export async function sendAccountBannedEmail(email: string, reason?: string) {
  const html = `
    <p>Your account has been banned.</p>
    ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
    <p>If you believe this is a mistake, please contact support.</p>
  `;

<<<<<<< HEAD
  await sendEmail({
    to: email,
    subject: 'Account Banned',
    html,
  });
=======
  await sendEmail({ to: email, subject: 'Account Banned', html });
>>>>>>> dev
}

// Account Unbanned
export async function sendAccountUnbannedEmail(email: string) {
  const html = `
    <p>Your account has been reinstated.</p>
    <p>You can now log in again.</p>
  `;

<<<<<<< HEAD
  await sendEmail({
    to: email,
    subject: 'Account Restored',
    html,
  });
=======
  await sendEmail({ to: email, subject: 'Account Restored', html });
>>>>>>> dev
}

// Account Deactivated
export async function sendAccountDeactivatedEmail(email: string) {
  const html = `
    <p>Your account has been deactivated.</p>
    <p>If you wish to reactivate, please contact support.</p>
  `;

<<<<<<< HEAD
  await sendEmail({
    to: email,
    subject: 'Account Deactivated',
    html,
  });
=======
  await sendEmail({ to: email, subject: 'Account Deactivated', html });
>>>>>>> dev
}

// Account Reactivated
export async function sendAccountReactivatedEmail(email: string) {
  const html = `
    <p>Your account has been reactivated.</p>
    <p>You can now log in again.</p>
  `;

<<<<<<< HEAD
  await sendEmail({
    to: email,
    subject: 'Account Reactivated',
    html,
  });
=======
  await sendEmail({ to: email, subject: 'Account Reactivated', html });
}

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${env.ClientOrigin}/verify-email?token=${token}`;

  const html = `
    <h1>Verify Your Email</h1>
    <p>Click the link below to verify your email address:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>This link expires in 24 hours.</p>
  `;

  await sendEmail({ to: email, subject: 'Verify Your Email', html });
}

export async function sendAccountDeletedEmail(email: string) {
  const html = `
    <p>Your account has been permanently deleted by an administrator.</p>
    <p>If you believe this is a mistake, please contact support.</p>
  `;

  await sendEmail({ to: email, subject: 'Account Deleted', html });
>>>>>>> dev
}