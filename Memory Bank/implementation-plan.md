# DDCON 2025 Exhibitor Manual Website - Design Document
*Version: 1.1 (Updated 2025-04-11)*

## 1. Overview

* **Goal:** Develop a secure, dedicated web application for DDCON 2025 exhibitors. The application requires login for access and provides a dashboard with event information, order form submission capabilities (limited to one submission per form type per exhibitor), PDF downloads of submitted forms, and contact details. Admin email notifications are triggered upon form submission. User account creation and management are handled manually outside the application.
* **Target Audience:** Registered Exhibitors participating in the DDCON 2025 event.

## 2. Core Features (Exhibitor Experience)

* **Secure Login:** The website's entry point (`/`) is a dedicated login page. Access to any other part of the application requires successful authentication (Email/Password).
* **Dashboard:** Upon successful login, exhibitors land on a central dashboard (`/dashboard`) which serves as the main hub.
* **Navigation:** A clear and consistent navigation menu (e.g., sidebar or top navigation bar) is always visible within the dashboard, providing links to:
    * **Home:** The main dashboard view, potentially showing key details like company name and booth number.
    * **Information:** Displays essential event information (e.g., rules & regulations, setup/dismantle schedules, venue details). Content will be based on provided screenshots.
    * **Order Forms:** A section listing all available order forms (Forms 1-8). Exhibitors can see the status of each form (submitted or pending) and access them.
    * **Appendix:** Contains supplementary documents or information relevant to exhibitors. Content will be based on provided screenshots.
    * **Contact Us:** Displays contact information for event organizers or support personnel.
* **Order Form Submission:**
    * Exhibitors can view and fill out specific order forms (Forms 1-8).
    * Forms are unique but may share common sections/components (details to be provided).
    * Each form type can only be submitted *once* per exhibitor. Once submitted, the form should ideally become read-only or indicate its submitted status clearly, preventing re-submission.
* **PDF Download:**
    * Immediately after successfully submitting an order form, a PDF copy of the submitted data will be **automatically downloaded** to the exhibitor's browser for their records.
    * The PDF filename will follow the convention: `[CompanyName]_[SubmissionDate]_[FormType].pdf`.
* **Admin Notifications:** Upon successful submission of any order form, the system automatically sends an email notification to a designated administrative email address (`daniel@bcpgroup.com.my`).
* **Contact Information:** A dedicated page or section displaying relevant contact details for exhibitor support.

## 3. Design Style & User Experience (UX)

* **Login Page:** Minimalist design, focused solely on the email and password input fields and login button. Clean and professional.
* **Post-Login Pages (Dashboard & Sections):**
    * **Aesthetic:** Clean, sleek, modern, and user-friendly, drawing inspiration from Apple's design principles. Emphasis on white space, clear typography (sans-serif fonts), and intuitive layout.
    * **Consistency:** Maintain a consistent layout, navigation pattern, and styling across all pages within the logged-in experience.
    * **Visual Elements:** Use subtle gradients for page titles or section headers to add visual interest without clutter. Ensure high contrast for readability.
    * **Responsiveness:** The application must be fully responsive and provide a seamless experience on desktop, tablet, and mobile devices.
    * **User Feedback:** Provide clear visual feedback for actions (e.g., loading indicators during form submission, success/error messages, confirmation of PDF download initiation). 