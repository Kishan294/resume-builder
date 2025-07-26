# ProfilCraft

A modern, full-stack resume builder application built with Next.js, better-auth, and PostgreSQL.

## Features

- 🔐 **Authentication**: Email/password and Google OAuth with better-auth
- 📝 **Resume Editor**: Intuitive form-based editor with live preview
- 🎨 **Multiple Templates**: Modern and Classic resume templates
- 💾 **Auto-save**: Automatic saving of resume data
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔗 **Shareable Links**: Generate public links for your resumes
- 📄 **PDF Export**: Download resumes as PDF (coming soon)
- 🎯 **ATS Optimized**: Templates designed for Applicant Tracking Systems

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: better-auth with Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: TailwindCSS with custom orange theme
- **UI Components**: ShadCN UI (Radix UI + TailwindCSS)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or pnpm package manager

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd profilcraft
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your values:

   - `DATABASE_URL`: Your PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: Generate a secure random string
   - `BETTER_AUTH_URL`: Your domain URL (http://localhost:3000 for development)
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials (optional)

4. **Set up the database**

   ```bash
   # Generate and run migrations
   npm run db:generate
   npm run db:migrate

   # Or push schema directly (for development)
   npm run db:push
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

For production deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── editor/            # Resume editor
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard components
│   ├── editor/            # Resume editor components
│   ├── templates/         # Resume templates
│   └── ui/                # ShadCN UI components
├── lib/                   # Utility libraries
│   ├── auth.ts            # better-auth configuration
│   ├── auth-client.ts     # Client-side auth utilities
│   └── db/                # Database configuration and schema
└── middleware.ts          # Route protection middleware
```

## Database Schema

The application uses the following main tables:

- **users**: User accounts and profiles
- **accounts**: OAuth account connections
- **sessions**: User sessions
- **resumes**: Resume data with JSONB fields for flexible content

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run build:prod` - Build for production with optimizations
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript type checking
- `npm run build:analyze` - Build with bundle analyzer
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run clean` - Clean build cache

## Authentication Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID and Client Secret to your `.env.local`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Node.js:

- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify
- Netlify (with serverless functions)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
