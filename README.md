# 📘 Exam API Backend

Backend service for the **Training & Exam System**.  
Built with **Express v5**, **TypeScript**, **Drizzle ORM**, and **MySQL**.  
Supports exam creation, AI-assisted question generation, timed exam attempts, and result tracking.

---

## 🚀 Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express v5
- **Database:** MySQL + Drizzle ORM
- **Validation:** Zod
- **Auth:** JWT (with cookies) + bcrypt
- **Storage:** AWS S3 (object storage for training images/files)
- **AI:** OpenAI API (for question generation)
- **Cron Jobs:** `node-cron` for expiring exam attempts
- **Logging:** Pino
- **Linting/Formatting:** ESLint + Prettier + Husky + lint-staged

---

## 📂 Project Structure

```
.
├── bruno/ # Bruno API collections (for testing endpoints)
├── src/
│ ├── controllers/ # Route handlers (business entrypoints)
│ ├── crons/ # Scheduled jobs (e.g., exam expiry)
│ ├── database/ # Drizzle schema & connection
│ ├── middlewares/ # Express middlewares (auth, validation, logging, etc.)
│ ├── prompts/ # AI prompt templates
│ ├── routes/ # Express route definitions
│ ├── services/ # Core business logic
│ ├── types/ # Type declarations / extensions
│ ├── utils/ # Utility functions (S3, JWT, logger, etc.)
│ ├── app.ts # Express app configuration
│ └── index.ts # Application entrypoint
└── drizzle.config.ts # Drizzle ORM config
```

---

## ⚙️ Setup

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Configure Environment

- Create a .env file in the project root.
- Environment variables are validated via Zod (`src/env.ts`):

---

### 3. Database Setup

```bash
# Generate migrations
npm run db:generate

# Apply schema
npm run db:push

# Run migrations
npm run db:migrate

# Optional: open Drizzle Studio
npm run db:studio
```

---

### 4. Run the Server

```bash
# Development (with watch mode)
npm run dev

# Build and run
npm run build
npm start
```

---

## 🧪 API Testing

This repo includes [Bruno](https://www.usebruno.com) collections (/bruno) for testing endpoints.

Examples:

- `Auth/Register.bru` → Register user
- `Auth/Login.bru` → Login
- `Trainings/Create.bru` → Create training
- `Exams/Start Exam.bru` → Start exam attempt
- `Exams/Submit Question.bru` → Submit answers
- `AI/Generate Question.bru` → AI-powered question generation

---

## 🛠 Development Notes

### Error Handling

- Centralized in `middlewares/exception.middleware.ts`
- Consistent JSON error responses

---

### Auth

- JWT stored in HTTP-only cookies
- Middleware: `auth.middleware.ts`

---

### Validation

- Zod schemas in `utils/schema.util.ts` (used in controllers with `validation.middleware.ts`)

---

### Exam Expiry

- Each attempt has an `expiresAt` timestamp
- Checked on submit (with a small grace window)
- Background cron (`crons/exam.cron.ts`) ensures stale attempts are auto-expired

---

## 📦 Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `npm run dev`         | Run server in dev mode (with watch) |
| `npm run build`       | Build project with TypeScript       |
| `npm start`           | Start built server                  |
| `npm run db:generate` | Generate migrations from schema     |
| `npm run db:push`     | Push schema to DB                   |
| `npm run db:migrate`  | Run DB migrations                   |
| `npm run db:studio`   | Open Drizzle Studio                 |

---

### ✅ Best Practices Followed

- Separation of concerns (controllers → services → DB)
- Centralized validation & error handling
- Only S3 keys stored in DB (URLs generated dynamically)
- Configurable env with strong validation
- Automated exam attempt expiry (cron + request-time check)
- Linting & formatting enforced with Husky

---
