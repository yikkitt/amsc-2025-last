# DDCON 2025 Exhibitor Manual

This is a Next.js application designed to provide a web portal for exhibitors at the DDCON 2025 conference. Exhibitors can register, log in, and manage their exhibition details through this portal.

## Features

- User authentication (sign up, sign in, password reset)
- Dashboard with exhibitor information
- Form submission for various exhibition requirements
- Document management and uploads
- Live form validation
- Responsive design for all devices

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel

## Deployment

### GitHub Deployment

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. Make sure your repository contains:
   - `next.config.js` - Configured for Vercel deployment
   - `vercel.json` - Containing build and environment settings
   - `clean-build.js` - Script to clean build artifacts
   - Custom Supabase client implementation in `src/lib/supabase.ts`

### Vercel Deployment

This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy using the following settings:
   - Build Command: `npm run vercel-build`
   - Output Directory: `.next`

See the [VERCEL.md](./VERCEL.md) file for more detailed deployment instructions.

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/ddcon-2025-exhibitor-manual.git
cd ddcon-2025-exhibitor-manual
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key


4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Form Types

1. Fascia Name Form for Shell Scheme
2. Contractor Pass Application Form
3. Electrical & Lighting Order Form
4. Furniture Order Form
5. Printing Order Form
6. Non-Official Contractor Form
7. Non-Official Contractor Form (Admin Fees)
8. Letter of Indemnity for Non-Official Contractor 