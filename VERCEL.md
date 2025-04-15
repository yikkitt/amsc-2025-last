# Deploying to Vercel

This guide provides instructions for deploying this Next.js application to Vercel.

## Prerequisites

1. A Vercel account
2. Git repository with your project (GitHub, GitLab, or Bitbucket)

## Environment Variables

The following environment variables must be set in your Vercel project:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Steps

1. Push your code to a Git repository
2. Log in to your Vercel account
3. Click "Add New" > "Project"
4. Select your Git repository
5. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
   - Install Command: `npm install`
6. Add your environment variables in the "Environment Variables" section
7. Click "Deploy"

## Troubleshooting

If you encounter issues with the build process:

### Font Loading Issues

Google Fonts loading issues are fixed by:

1. Using local font files instead of Google Fonts
2. Setting `optimizeFonts: false` in `next.config.js`

## Optimizations Made

This project includes several optimizations for Vercel deployment:

1. Local font files to avoid network requests
2. Server-only components for backend services
3. Middleware for proper request handling
4. Custom Vercel configuration file

## Support

If you encounter issues, check the Vercel build logs and refer to the Next.js documentation:
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs) 