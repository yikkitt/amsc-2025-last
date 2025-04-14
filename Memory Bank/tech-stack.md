# AMSC 2025 Exhibitor Manual Website - Technology Stack
*Version: 1.1 (Updated 2025-04-11)*

This document outlines the core technologies, libraries, services, and key configurations for the AMSC 2025 Exhibitor Manual Website.

* **Framework:** **Next.js** (v13+ with App Router recommended)
    * Handles UI rendering (React), routing, server-side logic, API routes.

* **Backend as a Service (BaaS):** **Supabase**
    * **Database:** Managed PostgreSQL instance.
    * **Authentication:** Supabase Auth (Email/Password).
    * **Edge Functions:** Serverless functions (Deno runtime) for backend logic (form processing, PDF generation, email).
    * **Storage (Optional):** Supabase Storage (Not planned for initial PDF strategy but available if needed later).

* **Database:** **PostgreSQL**
    * Managed via Supabase. Utilizes Row Level Security (RLS).

* **Deployment Platform:** **Vercel**
    * Optimized hosting for Next.js. Handles CI/CD, environment variables.

* **Styling:** **Tailwind CSS**
    * Utility-first CSS framework for UI development.

* **PDF Generation Library:** **`pdf-lib`** (or similar JavaScript PDF library)
    * Used within Supabase Edge Functions.
    * *Output Format Example:* PDF files named `[CompanyName]_[SubmissionDate]_[FormType].pdf`.

* **Transactional Email Service:** **Resend / SendGrid** (or equivalent)
    * Integrated via Supabase Edge Functions.
    * *Admin Recipient Configuration:* Initial notifications sent to `daniel@bcpgroup.com.my` (to be stored securely, e.g., in Supabase secrets or Vercel env vars).

* **Programming Language:** **TypeScript**
    * Used across the stack (Next.js, Edge Functions).

* **Package Manager:** **npm** (or Yarn / pnpm)
    * Manages project dependencies.

* **Version Control:** **Git**
    * Source code management (hosted on GitHub, GitLab, etc.). 