# OpsVault 🔐

A private, searchable personal technical knowledge base built for Production Support / DevOps engineers to organize study material, document production incidents, and prepare for interviews.

## 🎯 About

OpsVault converts scattered technical notes (Linux, Shell Scripting, SQL, AWS, Networking, Production Support) into a single, structured, searchable web application — with role-based access control, admin approval workflow, and markdown-based note rendering with syntax highlighting.

## ✨ Features

- **Secure Authentication** — Email/password login with Supabase Auth
- **Admin Approval Workflow** — New signups require admin approval before accessing content (RLS-enforced at the database level)
- **Notes Management** — Full CRUD with categories, favorites, and importance flags
- **Markdown Rendering** — Notes support markdown formatting with syntax-highlighted code blocks
- **Full-Text Search** — Search notes by title or content
- **Category Browsing** — Browse notes organized by topic (Linux, AWS, SQL, Networking, etc.)
- **Interview Prep Mode** — Question/answer format with difficulty levels and revision status tracking, plus a "reveal answer" practice mode
- **Production Issues Knowledge Base** — Structured incident documentation (Symptoms → Commands → Troubleshooting Steps → Root Cause → Resolution)
- **Role-Based Access Control** — Admin vs. regular user permissions enforced via PostgreSQL Row Level Security

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js API routes / Server Components |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth |
| Markdown | react-markdown, remark-gfm, rehype-highlight |
| Hosting | Vercel (planned) |

## 🗄️ Database Schema

- `profiles` — user roles and approval status
- `categories` — topic categories (supports nesting via `parent_id`)
- `notes` — core notes content
- `tags` / `note_tags` — tagging system (many-to-many)
- `interview_questions` — interview Q&A with status tracking
- `production_issues` — structured incident/RCA records

All tables are protected with PostgreSQL Row Level Security (RLS) policies — approved users can read content, only admins can create/edit/delete.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+
- A free [Supabase](https://supabase.com) account

### Installation

```bash
git clone https://github.com/nitinoneview/OpsVault.git
cd OpsVault
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_publishable_key

### Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## 📋 Roadmap

- [ ] Favorites/Pinned quick-access dashboard sections
- [ ] Email template library section
- [ ] Deployment to Vercel
- [ ] Dark mode
- [ ] Image/diagram support in notes

## 👤 Author

**Nitin**
Production Support Engineer | Linux · AWS · Shell Scripting · SQL

Built as a portfolio project to demonstrate full-stack development skills alongside production support expertise.

## 📄 License

This project is for personal/portfolio use.

