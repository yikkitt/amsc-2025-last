# AMSC 2025 Exhibitor Manual

A web application for AMSC 2025 exhibitors to view information, submit forms, and download PDFs of their submissions.

## Features

- User authentication system
- Dashboard with event information
- Multiple form types for exhibitor submissions
- PDF generation for form submissions
- Email notifications for form submissions

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **PDF Generation**: jsPDF, html2canvas
- **Email Service**: SendGrid

## Deployment

The application is deployed on Vercel:
[AMSC 2025 Exhibitor Manual](https://amsc-2025.vercel.app)

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/amsc-2025.git
   cd amsc-2025
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
   SENDGRID_API_KEY=your-sendgrid-api-key
   ```

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