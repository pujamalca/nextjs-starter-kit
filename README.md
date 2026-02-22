# Next.js Starter Kit 🚀

Production-ready Next.js starter kit dengan authentication, database, security, dan **AI-friendly documentation**.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Email/Password + Google OAuth dengan Better Auth |
| 🗄️ **Database** | Drizzle ORM dengan MySQL/MariaDB, full type-safe |
| 🎨 **UI Components** | Shadcn/ui + TailwindCSS + Framer Motion |
| 🌓 **Dark Mode** | Theme toggle dengan next-themes |
| 🛡️ **Security** | Rate limiting, CSRF, validation, audit logs |
| 📁 **File Upload** | Upload handler dengan validation |
| 📊 **Logging** | Structured logging untuk development & production |
| 🔍 **SEO** | Meta tags, Open Graph, robots.txt ready |
| 📝 **Validation** | Zod schemas untuk semua input |
| 🤖 **AI-Friendly** | Detailed comments & documentation |

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS 4 + Shadcn/ui
- **Database:** MySQL/MariaDB + Drizzle ORM
- **Auth:** Better Auth
- **Validation:** Zod
- **Animations:** Framer Motion
- **Icons:** Lucide React

## 📁 Project Structure

```
nextjs-starter-kit/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, register, forgot)
│   │   ├── (dashboard)/        # Dashboard pages (protected)
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── theme-provider.tsx  # Dark mode provider
│   │   └── theme-toggle.tsx    # Theme toggle button
│   │
│   ├── lib/                    # Libraries & utilities
│   │   ├── auth/               # Better Auth config
│   │   ├── db/                 # Drizzle ORM config & schema
│   │   ├── utils/              # Utilities (validators, logger, etc)
│   │   ├── auth-client.ts      # Client-side auth helper
│   │   └── middleware.ts       # Auth + rate limiting middleware
│   │
│   └── types/                  # TypeScript type definitions
│
├── public/                     # Static files
├── drizzle.config.ts           # Drizzle Kit config
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## 🚀 Getting Started

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd nextjs-starter-kit

# Install dependencies
npm install
```

### 2. Setup Database

Buat database MySQL/MariaDB:

```sql
CREATE DATABASE nextjs_starter;
```

### 3. Environment Variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/nextjs_starter"

# Better Auth
BETTER_AUTH_SECRET="your-super-secret-key-min-32-characters"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Run Migrations

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Or push directly (development)
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema directly to DB |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run clean` | Clean build artifacts |
| `npm run reinstall` | Clean reinstall dependencies |

## 🔐 Authentication

### Email/Password

```typescript
// Login
await authClient.signIn.email({
  email: "user@example.com",
  password: "password123",
});

// Register
await authClient.signUp.email({
  email: "user@example.com",
  password: "password123",
  name: "User Name",
});
```

### Google OAuth

```typescript
await authClient.signIn.social({
  provider: "google",
  callbackUrl: "/dashboard",
});
```

### Protected Routes

Gunakan `useSession` hook:

```typescript
import { useSession } from "@/lib/auth-client";

export default function ProtectedPage() {
  const { data: session, isPending } = useSession();
  
  if (isPending) return <Loading />;
  if (!session) redirect("/login");
  
  return <Dashboard user={session.user} />;
}
```

## 🗄️ Database

### Schema Location

Semua schema di `src/lib/db/schema.ts`

### Tables

- `users` - User accounts
- `sessions` - User sessions
- `accounts` - OAuth accounts
- `verifications` - Email verification tokens
- `roles` - User roles
- `permissions` - Granular permissions
- `role_permissions` - Role-permission mapping
- `user_roles` - User-role mapping
- `audit_logs` - Activity logging
- `files` - Uploaded files metadata

### Query Example

```typescript
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Select
const user = await db.select().from(users).where(eq(users.id, "user-id"));

// Insert
await db.insert(users).values({
  id: "user-id",
  name: "John Doe",
  email: "john@example.com",
});

// Update
await db.update(users)
  .set({ name: "Jane Doe" })
  .where(eq(users.id, "user-id"));

// Delete
await db.delete(users).where(eq(users.id, "user-id"));
```

## 🛡️ Security

### Rate Limiting

Middleware otomatis rate limit API routes:

- Auth routes: 5 requests/minute
- API routes: 100 requests/minute
- Upload routes: 10 requests/minute

### CSRF Protection

Better Auth handles CSRF secara otomatis.

### Input Validation

Semua input divalidasi dengan Zod:

```typescript
import { loginSchema } from "@/lib/utils/validators";

const result = loginSchema.safeParse({
  email: "user@example.com",
  password: "password123",
});

if (!result.success) {
  console.log(result.error.errors);
}
```

### Security Headers

Middleware menambahkan headers:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` (production)

## 📁 File Upload

### Upload File

```typescript
const formData = new FormData();
formData.append("file", file);

const response = await fetch("/api/files", {
  method: "POST",
  body: formData,
});

const { file } = await response.json();
```

### Allowed Types

- Images: jpeg, png, gif, webp
- Documents: pdf, doc, docx, txt
- Spreadsheets: xls, xlsx

Max file size: 5MB (configurable via `MAX_FILE_SIZE` env)

## 📊 Logging

### Usage

```typescript
import { logger, auditLog } from "@/lib/utils/logger";

// Debug
logger.debug("User logged in", { userId: "user-id" });

// Info
logger.info("File uploaded", { fileName: "file.pdf" });

// Warning
logger.warn("Rate limit approaching", { ip: "127.0.0.1" });

// Error
logger.error("Database error", error, { query: "SELECT * FROM users" });

// Audit Log
auditLog("USER_LOGIN", "auth", {
  userId: "user-id",
  ipAddress: "127.0.0.1",
  status: "success",
});
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push ke GitHub
2. Import di Vercel
3. Set environment variables
4. Deploy

### VPS / Self-hosted

1. Build: `npm run build`
2. Start: `npm run start`
3. Gunakan PM2 atau systemd untuk process management

### Environment Variables (Production)

```env
DATABASE_URL="mysql://user:password@host:3306/database"
BETTER_AUTH_SECRET="production-secret-min-32-characters"
BETTER_AUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"
```

## 🤖 AI Development Guide

Starter kit ini dirancang untuk memudahkan development dengan AI assistants.

### Key Files for AI Context

1. **`src/lib/db/schema.ts`** - Database schema dengan comments
2. **`src/lib/utils/validators.ts`** - Zod schemas untuk validation
3. **`src/types/index.ts`** - Type definitions
4. **`src/middleware.ts`** - Auth & security logic
5. **`src/lib/utils/constants.ts`** - App constants & config

### Tips untuk AI Development

1. **Baca schema dulu** - AI perlu tahu struktur database
2. **Gunakan types** - TypeScript strict mode membantu AI
3. **Ikuti patterns** - Lihat contoh di auth pages & API routes
4. **Validasi input** - Selalu gunakan Zod validators

### Common AI Prompts

```
"Create a new API route for [feature] following the pattern in /api/auth"
"Add a new table to the database schema for [entity]"
"Create a new page in dashboard with [description]"
"Add validation for [input] using existing Zod patterns"
```

## 📝 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Credits

- [Next.js](https://nextjs.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://better-auth.com/)
- [TailwindCSS](https://tailwindcss.com/)
