import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { google } from 'googleapis';
import * as env from "./env.js";

export const isProd = env.NODE_ENV === 'production';

if (isProd) {
  sgMail.setApiKey(env.SENDGRID_API_KEY!);
}
export { sgMail };

export const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_PASS,
  },
});

const oauth2Client = new google.auth.OAuth2(
  env.GMAIL_CLIENT_ID,
  env.GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: env.GMAIL_REFRESH_TOKEN!,
});

export async function createGmailTransporter() {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: env.GMAIL_USER!,
      clientId: env.GMAIL_CLIENT_ID!,
      clientSecret: env.GMAIL_CLIENT_SECRET!,
      refreshToken: env.GMAIL_REFRESH_TOKEN!,
      accessToken: accessToken.token!,
    },
  });
}