# Deployment Guide for GrowGuide

This guide will walk you through deploying your Next.js application so others can access it online.

## Prerequisites

- A GitHub account (for version control)
- A Supabase account (you already have this)
- Choose a hosting platform (recommended: Vercel)

---

## Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is made by the creators of Next.js and offers the simplest deployment experience.

### Step 1: Prepare Your Code

1. **Create a `.env.local` file** (if you don't have one):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Test your build locally**:
   ```bash
   npm run build
   ```
   If this succeeds, you're ready to deploy!

### Step 2: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (don't initialize with README)
   - Copy the repository URL

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy to Vercel

1. **Sign up/Login to Vercel**:
   - Go to https://vercel.com
   - Sign up with your GitHub account (recommended)

2. **Import your project**:
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**:
   - In the project settings, go to "Environment Variables"
   - Add these variables:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - Make sure to select "Production", "Preview", and "Development" environments

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

5. **Custom Domain (Optional)**:
   - In project settings, go to "Domains"
   - Add your custom domain (e.g., `growguide.com`)
   - Follow DNS configuration instructions

### Step 4: Configure Supabase for Production

1. **Add your Vercel URL to Supabase**:
   - Go to your Supabase project dashboard
   - Navigate to Authentication > URL Configuration
   - Add your Vercel URL to "Site URL" and "Redirect URLs"
   - Example: `https://your-project-name.vercel.app`

---

## Option 2: Deploy to Netlify

### Step 1: Prepare Your Code
Same as Vercel - ensure `.env.local` exists and build works.

### Step 2: Push to GitHub
Same as Vercel.

### Step 3: Deploy to Netlify

1. **Sign up/Login**:
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Create new site**:
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository

3. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Environment Variables**:
   - Go to Site settings > Environment variables
   - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Deploy**:
   - Click "Deploy site"
   - Your app will be live at `https://random-name.netlify.app`

---

## Option 3: Deploy to Railway

### Step 1: Prepare Your Code
Same as above.

### Step 2: Deploy to Railway

1. **Sign up**: Go to https://railway.app
2. **New Project** > "Deploy from GitHub repo"
3. **Select your repository**
4. **Add Environment Variables** in the Variables tab
5. **Deploy** - Railway will automatically detect Next.js and deploy

---

## Option 4: Self-Hosted (Advanced)

If you want to host on your own server:

### Using Docker

1. **Create a `Dockerfile`**:
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   ENV NEXT_TELEMETRY_DISABLED 1
   RUN npm run build
   
   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   ENV NEXT_TELEMETRY_DISABLED 1
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Update `next.config.ts`**:
   ```typescript
   module.exports = {
     output: 'standalone',
   }
   ```

3. **Build and run**:
   ```bash
   docker build -t growguide .
   docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... growguide
   ```

---

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase URLs are configured with your production domain
- [ ] Test authentication (sign up/login)
- [ ] Test all major features
- [ ] Check console for any errors
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set up monitoring/analytics (optional)

---

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Ensure `npm run build` works locally first
- Check build logs in your hosting platform

### Authentication Not Working
- Verify Supabase URL configuration includes your production domain
- Check that environment variables are set correctly
- Ensure `NEXT_PUBLIC_` prefix is used for client-side variables

### Database Connection Issues
- Verify Supabase project is active
- Check API keys are correct
- Ensure database migrations have been run

---

## Recommended: Vercel

**Why Vercel?**
- Made by Next.js creators
- Zero configuration needed
- Automatic HTTPS
- Free tier is generous
- Easy custom domains
- Automatic deployments on git push
- Built-in analytics

**Free Tier Limits:**
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for most projects

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Supabase Docs: https://supabase.com/docs
