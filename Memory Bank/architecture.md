# DDCON 2025 Exhibitor Manual Website - Architecture Documentation

## Project Structure

```
amsc-2025-last/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication-related routes
│   │   │   ├── login/         # Login page
│   │   │   └── layout.tsx     # Auth layout
│   │   ├── dashboard/         # Dashboard routes
│   │   │   ├── information/   # Information sections
│   │   │   ├── order-forms/   # Order form pages
│   │   │   ├── appendix/      # Appendix content
│   │   │   ├── contact-us/    # Contact information
│   │   │   └── layout.tsx     # Dashboard layout
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Root page (redirects to login)
│   ├── components/            # Reusable React components
│   │   ├── auth/             # Authentication components
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # UI components
│   ├── lib/                  # Utility functions and configurations
│   │   ├── supabase/        # Supabase client and helpers
│   │   ├── constants.ts     # Constants and configurations
│   │   └── utils.ts         # Utility functions
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global styles
├── public/                  # Static assets
├── docs/                    # Documentation
│   ├── progress.md         # Implementation progress
│   └── architecture.md     # Architecture documentation
└── Memory Bank/            # Project requirements and specifications
```

## Key Components

### Authentication
- Uses Supabase Auth for email/password authentication
- Protected routes under `/dashboard/*`
- Manual user creation through Supabase dashboard

### Database Schema
1. Users Table (Supabase Auth)
   - Extended with company information
   - RLS policies for data access

2. Form Submissions
   - Stores all form submissions
   - Includes calculation history
   - RLS policies for submission access

3. Form Configurations
   - Stores form structures and rules
   - Manages deadlines and late charges

### Frontend Architecture
1. Layouts
   - Root layout: Base HTML structure
   - Auth layout: Login page structure
   - Dashboard layout: Navigation and user interface

2. Components
   - Form components: Reusable form elements
   - UI components: Buttons, inputs, etc.
   - Layout components: Navigation, headers, etc.

### State Management
- Server Components for static content
- Client Components for interactive elements
- Form state managed with react-hook-form
- Global state with Context API

### API Routes
- API routes for form submissions
- Protected routes with authentication
- PDF generation endpoints
- Email notification handlers

## Security Considerations
1. Authentication
   - Protected routes
   - Session management
   - No public sign-ups

2. Database
   - Row Level Security (RLS)
   - Prepared statements
   - Input validation

3. API
   - Rate limiting
   - Request validation
   - Error handling

## Development Guidelines
1. Code Organization
   - Feature-based directory structure
   - Shared components in `/components`
   - Type definitions in `/types`

2. Naming Conventions
   - PascalCase for components
   - camelCase for functions and variables
   - kebab-case for files and directories

3. State Management
   - Server Components by default
   - Client Components when needed
   - Clear prop interfaces 