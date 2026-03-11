# ProfilCraft 🚀

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-latest-indigo?style=for-the-badge)](https://better-auth.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-latest-C5F74F?style=for-the-badge&logo=drizzle)](https://orm.drizzle.team/)

**ProfilCraft** is a premium, full-stack resume builder designed for modern professionals. Built with a focus on aesthetics, speed, and ATS compatibility, it empowers developers and job seekers to craft high-impact career narratives in minutes.

---

## ✨ Features

- 🔐 **Secure Authentication**: Enterprise-grade auth via **Better Auth**, supporting both Email/Password and Google OAuth.
- 📝 **Live Professional Editor**: Intuitive, real-time editing experience with instant visual feedback.
- 🎨 **Modern Design System**: A sleek, indigo-themed interface featuring frosted glass effects, smooth transitions, and a mobile-first philosophy.
- 📄 **Smart PDF Export**: High-fidelity PDF generation optimized for both browser and mobile printing.
- 🔗 **Instant Sharing**: Publish your resume with a single click and share a professional public URL with recruiters.
- 🎯 **ATS-Ready Templates**: Multiple curated templates designed to bypass modern Applicant Tracking Systems.
- 💾 **Robust Auto-save**: Never lose your progress with seamless, background state persistence.
- 📱 **Fully Responsive**: Edge-to-edge perfection on mobile, tablet, and desktop.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router & Route Groups)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom **Indigo-Violet** professional theme
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **API**: [tRPC](https://trpc.io/) for end-to-end type safety
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)

## 🏗️ Architecture

The project follows a modern, scalable architecture using **Next.js Route Groups** to logically separate application concerns:

```text
src/
├── app/
│   ├── (marketing)/        # High-conversion landing page
│   ├── (auth)/             # Reusable Login/Register shells
│   ├── (dashboard)/        # Main user workspace
│   ├── (editor)/           # Specialized resume editing environment
│   └── (public)/           # Public-facing sharable resumes
├── components/
│   ├── common/             # Reusable UI primitives (Container, PageHeader, etc.)
│   ├── layout/             # Shared AppHeader and MarketingFooter
│   ├── dashboard/          # Specialized workspace components
│   └── templates/          # Professional resume logic (Indigo-themed)
├── lib/
│   ├── auth-client.ts      # Better Auth client config
│   └── trpc/               # Type-safe API client
└── utils/                  # Smart PDF and utility scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: 18.x or higher
- **PostgreSQL**: A local instance or managed service (e.g., Neon, Railway)
- **Package Manager**: `pnpm` (highly recommended)

### Installation

1. **Clone & Enter**
   ```bash
   git clone <your-repo-url>
   cd profilcraft
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   *Update your `.env` with your `DATABASE_URL` and Auth secrets.*

4. **Initialize Database**
   ```bash
   pnpm db:push
   ```

5. **Launch**
   ```bash
   pnpm dev
   ```

## 📜 Key Scripts

| Script | description |
| :--- | :--- |
| `pnpm dev` | Starts development server with Turbopack |
| `pnpm build` | Compiles a production-ready build |
| `pnpm db:studio` | Opens the GUI for database management |
| `pnpm lint` | Performs static code analysis |

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

Built with 💜 by the ProfilCraft Team.
