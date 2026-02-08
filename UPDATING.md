# How to Update Your Deployed App

After your app is deployed, here's how to make updates and push them live.

## Quick Update Workflow

### 1. Make Changes Locally
Edit your code files as usual on your computer.

### 2. Test Locally (Recommended)
```bash
npm run dev
```
Test your changes in the browser at `http://localhost:3000`

### 3. Commit Your Changes
```bash
git add .
git commit -m "Description of your changes"
```

### 4. Push to GitHub
```bash
git push
```

### 5. Automatic Deployment (Vercel/Netlify)
If you connected your GitHub repo to Vercel or Netlify, **deployment happens automatically!**
- Every time you push to GitHub, your app rebuilds and deploys
- Usually takes 1-2 minutes
- You'll get a notification when it's done

---

## Detailed Steps

### Option A: Using Vercel (Automatic Deployments)

**If you deployed via Vercel and connected GitHub:**

1. **Make your code changes** locally
2. **Test locally**: `npm run dev`
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push
   ```
4. **That's it!** Vercel automatically:
   - Detects the push to GitHub
   - Builds your app
   - Deploys the new version
   - Your live site updates automatically

**Check deployment status:**
- Go to https://vercel.com/dashboard
- Click on your project
- See deployment history and status

**Preview deployments:**
- Vercel creates a preview URL for every push
- Test changes before they go to production
- Merge to `main` branch = production deployment

---

### Option B: Manual Deployment

**If you need to deploy manually (or using other platforms):**

1. **Make and test changes locally**
2. **Build your app**:
   ```bash
   npm run build
   ```
   Make sure it builds without errors!

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Your update description"
   git push
   ```

4. **Deploy**:
   - **Vercel**: Usually automatic, but you can trigger manually in dashboard
   - **Netlify**: Usually automatic, or click "Trigger deploy" in dashboard
   - **Railway**: Usually automatic, or click "Redeploy" in dashboard

---

## Common Update Scenarios

### Adding a New Feature
```bash
# 1. Create your feature files
# 2. Test locally
npm run dev

# 3. Commit
git add .
git commit -m "Add new feature: [feature name]"
git push

# 4. Wait for auto-deployment (or deploy manually)
```

### Fixing a Bug
```bash
# 1. Fix the bug in your code
# 2. Test the fix locally
npm run dev

# 3. Commit
git add .
git commit -m "Fix: [description of bug fix]"
git push

# 4. Deployment happens automatically
```

### Updating Environment Variables
1. Go to your hosting platform (Vercel/Netlify/etc.)
2. Navigate to **Project Settings** > **Environment Variables**
3. Add or update variables
4. **Redeploy** your app (usually automatic, or trigger manually)

### Updating Dependencies
```bash
# 1. Install new package
npm install package-name

# 2. Test locally
npm run dev

# 3. Commit (package.json and package-lock.json)
git add package.json package-lock.json
git commit -m "Add package-name dependency"
git push

# 4. Platform rebuilds with new dependencies automatically
```

---

## Best Practices

### ✅ Do This:
- **Test locally first** before pushing
- **Write clear commit messages** describing your changes
- **Push to a branch** first, then merge to main (for team projects)
- **Check deployment logs** if something goes wrong

### ❌ Avoid This:
- Don't push broken code (test first!)
- Don't commit `.env.local` files (they're gitignored for a reason)
- Don't skip testing locally

---

## Troubleshooting Updates

### Build Fails After Update
1. Check the build logs in your hosting platform
2. Look for error messages
3. Test `npm run build` locally to reproduce
4. Fix errors and push again

### Changes Not Showing Up
1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check deployment status - is it still building?
3. Verify you pushed to the correct branch (usually `main` or `master`)
4. Check browser cache - try incognito mode

### Environment Variables Not Updating
- Environment variables are set at build time
- After changing them, you need to **redeploy**
- In Vercel: Settings > Environment Variables > Save > Redeploy

---

## Workflow Summary

```
┌─────────────────┐
│  Make Changes   │
│   Locally       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Test Locally   │
│  npm run dev    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Commit & Push  │
│  git push       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auto-Deploy    │
│  (Vercel/etc)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Live Updated!  │
│  🎉             │
└─────────────────┘
```

---

## Quick Reference Commands

```bash
# Start local development
npm run dev

# Build for production (test locally)
npm run build

# Run production build locally
npm start

# Git workflow
git status                    # See what changed
git add .                     # Stage all changes
git commit -m "Your message"  # Commit changes
git push                      # Push to GitHub

# Check if everything is committed
git status                    # Should say "nothing to commit"
```

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Git Basics**: https://git-scm.com/doc
- **Next.js Deployment**: https://nextjs.org/docs/deployment
