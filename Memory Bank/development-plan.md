# AMSC 2025 Exhibitor Manual Website - Implementation Plan
*Version: 1.1 (Updated 2025-04-11)*

This document details the phased development approach and coding guidelines for building the AMSC 2025 Exhibitor Manual Website.

## Part 1: Implementation Phases

**Phase 1: Foundation & Supabase Setup (Est. Time: 1-2 days)**

1.  **Supabase Project:** Create project, store keys securely.
2.  **Database Schema Design:**
    * `amsc_2025_user`: Execute SQL (columns: `user_id`, `company_name`, `contact_person`, `address`, `booth_number`, `telephone`, `fax`, `email`). Enable RLS (`"Users can view own data"`).
    * `form_submissions`: Create table (columns: `submission_id`, `user_id`, `form_type`, `submitted_at`, `submission_data` (JSONB), `pdf_generated_key` (nullable)). Add `UNIQUE` constraint on (`user_id`, `form_type`). Enable RLS (`"Users can view own submissions"`, `"Users can insert own submissions"`).
    * (Optional) `content_sections`: Table deferred for now. Content will be hardcoded initially.
3.  **Authentication Setup:** Configure Supabase Auth (Email/Password), disable public sign-ups. Document Admin manual user creation process.
4.  **Next.js Project Setup:** Initialize Next.js (App Router, TS, Tailwind). Install `@supabase/supabase-js`. Set up `.env.local` vars.
5.  **Email Service Integration:** Select service, get API key, store securely (Supabase secrets).

**Phase 2: Frontend Development & Core Logic (Est. Time: 5-7 days)**

1.  **Routing & Layout (App Router):** Set up routes (`/`, `/dashboard`, `/dashboard/information`, `/dashboard/order-forms`, `/dashboard/order-forms/[formType]`, `/dashboard/appendix`, `/dashboard/contact-us`) and corresponding layouts. Implement auth protection for `/dashboard` routes.
2.  **Component Development:**
    * Create reusable components (`LoginForm`, `DashboardNav`, `PageHeader`, `ContentDisplay`, `FormWrapper`, `SubmissionStatusIndicator`, `PdfDownloadButton`, `ui/` elements).
    * Create placeholder files for `components/forms/Form[X].tsx` (X=1 to 8).
    * **[Action Required]** Implementation of specific form fields and shared components requires detailed specifications from the user.
3.  **State Management:** Use Context API/Zustand (global auth/profile), `useState`/`react-hook-form` (forms).
4.  **API Integration & Backend Logic (Supabase Edge Functions):**
    * **Data Fetching:** Use Supabase client SDK in Server/Client Components.
    * **Edge Function `submit-form`:**
        * Handles POST requests. Authenticates user. Inserts `form_type`, `submission_data` into `form_submissions` (DB handles uniqueness).
        * On success, triggers `generate-pdf` and `send-notification` asynchronously. Returns success/error status.
    * **Edge Function `generate-pdf`:**
        * Fetches submission data.
        * **[Action Required]** Requires PDF template/layout details from the user before implementing content generation.
        * Generates PDF using `pdf-lib`.
        * Constructs filename: `[CompanyName]_[SubmissionDate]_[FormType].pdf`.
        * Returns PDF blob to the client.
    * **Edge Function `send-notification`:**
        * Fetches necessary details (Company Name, Booth # from `amsc_2025_user`; Form Type, Time from `form_submissions`).
        * Uses email service SDK with API key.
        * Sends formatted email (HTML suggested) to admin: `daniel@bcpgroup.com.my` (configured securely).
        * Includes: Company Name, Booth #, Form Type Submitted, Time of Submission in email body. Clear subject line.
5.  **Content Implementation:**
    * **Strategy:** Initial implementation will **hardcode content** directly into Next.js page components (`Information`, `Appendix` pages).
    * **[Action Required]** Requires content screenshots from the user to proceed with implementation.
6.  **Styling:** Apply Tailwind CSS consistently. Configure `tailwind.config.js` for the custom Apple-inspired theme.
7.  **Frontend PDF Download Logic:** Implement client-side logic: On successful form submission response, call the `generate-pdf` endpoint, receive the PDF blob, create a temporary URL/link, and trigger the browser's download mechanism with the correct filename.

**Phase 3: Testing, Deployment & Refinement (Est. Time: 2-3 days)**

1.  **Testing:** Unit (Jest/Vitest), Integration (Supabase interactions, RLS), E2E (Cypress/Playwright), Manual (cross-browser, cross-device, email verification, PDF download verification).
2.  **Vercel Deployment:** Connect repo, configure Vercel env vars (`NEXT_PUBLIC_...`), configure Supabase secrets (`EMAIL_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL_RECIPIENT`). Set up CI/CD.
3.  **Final Review & Refinement:** Code review, performance (Lighthouse), accessibility (a11y), final production testing.

## Part 2: AI Developer Coding Rules & Guidelines

1.  **General Principles:** Clarity, Documentation (JSDoc), Best Practices (React, Next.js), Version Control (Git, Conventional Commits).
2.  **Architecture & Modularity:** Small, reusable components. Logical directory structure (`app/`, `components/`, `lib/`, `hooks/`, `types/`, `supabase/functions/`).
3.  **Security & Supabase Practices:** Supabase Auth, RLS on all user data tables, Edge Functions for sensitive ops/secrets, Server-side input validation, Secure environment variable handling.
4.  **Development Workflow & Quality:**
    * **Proactive Communication:** Explicitly request necessary assets or specifications (PDF templates, content, form details) before implementing dependent features.
    * **Typing:** Consistent TypeScript usage.
    * **Linting & Formatting:** ESLint & Prettier integration.
    * **Testing:** Implement unit, integration, and E2E tests.
    * **Responsiveness:** Ensure UI adapts to all screen sizes.
    * **Accessibility (a11y):** Semantic HTML, alt text, contrast, keyboard navigation.
    * **Performance:** Bundle size optimization, `next/image`, Server Components. 