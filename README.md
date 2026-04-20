# DeepScan Backend

A modern, scalable backend for an Instagram‑like social media platform built with Node.js, TypeScript, Express, Prisma ORM, and PostgreSQL.

## 🚀 Tech Stack

| Technology   | Purpose                    |
| ------------ | -------------------------- |
| Node.js      | JavaScript runtime         |
| TypeScript   | Type‑safe development      |
| Express      | REST API framework         |
| graphQL      | graphQL API framework      |
| Prisma       | Type‑safe database ORM     |
| PostgreSQL   | Relational database        |
| JWT          | Authentication             |

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm**
- **PostgreSQL** v14 or higher (running locally)
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yuko254/DeepScan.git
cd DeepScan
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# ── App ───────────────────────────────
APP_NAME=DeepScan
PORT = 4000
NODE_ENV = development

# ── Database ───────────────────────────────
DB_PORT=5000
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5000/DeepScan?schema=public"

# ── JWT ───────────────────────────────
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# ── Dev (Gmail) ───────────────────────────────
# Go to myaccount.google.com → Security
# Enable 2-Step Verification if not already on
# Search "App Passwords" in the search bar
# Select app: Mail, device: Other → type "Backend Dev" → Generate
# Copy the 16-character password into GMAIL_APP_PASSWORD

GMAIL_USER=you@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Go to console.cloud.google and search how to enable OAuth2 and get a refresh token
GMAIL_REFRESH_TOKEN=xxxxxxxxxxxxxxxxxxxxx
WEB_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxx
WEB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxx

# ── Prod (SendGrid) ───────────────────────────
# Sign up at sendgrid.com — free tier is 100 emails/day
# Go to Settings → API Keys → Create API Key → Full Access
# Copy into SENDGRID_API_KEY
# Go to Settings → Sender Authentication → verify your sending domain or a single sender email
# Put that verified email in SENDGRID_FROM_EMAIL
# Set NODE_ENV=production in your prod environment
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

> Replace `USERNAME` and `PASSWORD` with your PostgreSQL credentials. Adjust the port if PostgreSQL runs elsewhere. Adjust other variables.

### 4. Create and initialize the database and ORM

Using `prisma`:

```bash
npx prisma migrate reset
npx prisma db pull
npx prisma generate
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

The server will be available at `http://localhost:PORT`.

## 📁 Project Structure

```
src/
├── config/          # app config singletons
├── dao/             # Data Access Objects
├── graphql/         # graphQL configs
├── dtos/            # Zod validation schemas & types
├── middlewares/     # Express middlewares (auth, error, rate‑limit)
├── routes/          # Express route handlers
├── services/        # Business logic layer
├── types/           # Custom error classes & TypeScript types
├── utils/           # Helper functions (JWT, etc.)
├── validations/     # Zod individual validation fields
├── app.ts           # Express app setup
└── server.ts        # Entry point
```

## 🔐 Authentication

The API uses JWT‑based authentication with access & refresh tokens.

- **Access token** – short‑lived (15 min), used for API requests.
- **Refresh token** – long‑lived (7 days), stored hashed in the database, used to obtain new access tokens.

Protected routes require a `Bearer` token in the `Authorization` header.

## 📡 API Documentation

> *Detailed endpoint documentation can be found in the [API Docs](./docs/api.md) (coming soon).*

### Public Endpoints

| Method | Path                      | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| POST   | `/auth/register`          | Register a new user                |
| POST   | `/auth/login`             | Login                              |
| POST   | `/auth/refresh`           | Refresh tokens                     |
| POST   | `/auth/logout`            | Logout                             |
| POST   | `/auth/reset-password`    | Reset password using emailed token |
| POST   | `/auth/forgot-password`   | Request reset password token email |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
