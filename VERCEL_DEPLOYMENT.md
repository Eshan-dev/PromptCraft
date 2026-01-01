# Vercel Deployment Guide

This guide explains how to deploy this application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your Gemini API key
3. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

**Important**: Make sure `.env` is in `.gitignore` (it should be already).

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will detect the project automatically

### 3. Configure Environment Variables

**Before deploying, you MUST set the environment variable in Vercel:**

1. In the Vercel project settings, go to **Settings** > **Environment Variables**
2. Add a new environment variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual Gemini API key
   - **Environment**: Select all (Production, Preview, Development)
3. Click **Save**

### 4. Deploy

1. Click **Deploy** in Vercel
2. Vercel will:
   - Install dependencies (`npm install`)
   - Run the build script (`npm run build`) which generates `config.js` from environment variables
   - Deploy your application

### 5. Verify Deployment

1. After deployment, visit your Vercel URL
2. The application should work with your API key
3. Test by asking a question

## How It Works

1. **Local Development**:
   - Uses `.env` file with `dotenv` package
   - Run `npm run build` to generate `config.js`

2. **Vercel Production**:
   - Uses environment variables set in Vercel dashboard
   - Build script reads from `process.env.GEMINI_API_KEY`
   - Generates `config.js` during build process
   - Browser loads `config.js` which contains the API key

## Environment Variables in Vercel

The `build-config.js` script automatically detects if it's running in Vercel:
- If `.env` file exists → uses dotenv (local development)
- If `.env` doesn't exist → uses environment variables directly (Vercel/production)

## Troubleshooting

### Build Fails with "GEMINI_API_KEY not found"
- Make sure you've set `GEMINI_API_KEY` in Vercel dashboard
- Check that it's enabled for the correct environment (Production/Preview/Development)

### API Key Not Working
- Verify the API key is correct in Vercel dashboard
- Check Vercel build logs to see if config.js was generated
- Make sure `config.js` is being served (check browser console)

### Configuration Not Updating
- After changing environment variables in Vercel, you need to redeploy
- Go to Deployments > Redeploy

## Security Notes

- ✅ `.env` file is gitignored - never commit it
- ✅ `config.js` is gitignored - auto-generated during build
- ✅ API key is stored securely in Vercel environment variables
- ✅ API key is only exposed in the generated `config.js` (necessary for client-side usage)

## Continuous Deployment

Once set up, Vercel will automatically deploy:
- Every push to main branch → Production deployment
- Every pull request → Preview deployment

Each deployment will:
1. Install dependencies
2. Run build script (generates `config.js` from environment variables)
3. Deploy the updated application

