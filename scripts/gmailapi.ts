import 'dotenv/config';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.WEB_CLIENT_ID,
  process.env.WEB_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'// web redirect
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://mail.google.com/'],
});

console.log('Visit this URL:', authUrl);


const { tokens } = await oauth2Client.getToken('PASTE_CODE_HERE');
console.log('Refresh token:', tokens.refresh_token);