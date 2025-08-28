# Deployment Guide

This guide provides step-by-step instructions for deploying your Inventory Management System to GitHub and Vercel.

## Prerequisites

- Node.js 16+ installed on your computer
- A GitHub account
- A Vercel account (free tier available)

## Part 1: GitHub Repository Setup

### Method 1: Using GitHub Web Interface (Recommended for beginners)

1. **Create a new repository on GitHub:**
   - Go to [GitHub.com](https://github.com) and sign in
   - Click the "+" icon in the top right corner
   - Select "New repository"
   - Name your repository: `inventory-management-system`
   - Make it Public (required for free Vercel deployment)
   - Don't initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Upload your project files:**
   - On the new repository page, click "uploading an existing file"
   - Drag and drop ALL project files EXCEPT:
     - `node_modules/` folder (if it exists)
     - `.env` file (if it exists)
     - Any `.log` files
   - Write a commit message: "Initial commit - Inventory Management System"
   - Click "Commit changes"

### Method 2: Using Git Command Line

1. **Initialize Git in your project folder:**
   ```bash
   cd your-project-folder
   git init
   git add .
   git commit -m "Initial commit - Inventory Management System"
   ```

2. **Connect to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/inventory-management-system.git
   git branch -M main
   git push -u origin main
   ```

### Method 3: Using GitHub Desktop

1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Open GitHub Desktop and sign in to your GitHub account
3. Click "Add an Existing Repository from your Hard Drive"
4. Select your project folder
5. Click "Publish repository"
6. Name it `inventory-management-system`
7. Make sure "Keep this code private" is UNCHECKED
8. Click "Publish Repository"

## Part 2: Vercel Deployment

### Step 1: Connect GitHub to Vercel

1. **Sign up/Sign in to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Sign up" or "Log in"
   - Choose "Continue with GitHub"
   - Authorize Vercel to access your GitHub account

### Step 2: Deploy Your Project

1. **Import your repository:**
   - On your Vercel dashboard, click "New Project"
   - Find your `inventory-management-system` repository
   - Click "Import"

2. **Configure deployment settings:**
   - **Project Name:** `inventory-management-system` (or customize)
   - **Framework Preset:** Vite (should be auto-detected)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (should be auto-filled)
   - **Output Directory:** `dist` (should be auto-filled)
   - **Install Command:** `npm install` (should be auto-filled)

3. **Environment Variables (if needed):**
   - Click "Environment Variables" section
   - Add any variables from your `.env.example` file:
     ```
     VITE_APP_NAME=Inventory Management System
     VITE_APP_VERSION=1.0.0
     VITE_STORAGE_PREFIX=inventory_app_
     VITE_ENABLE_ANALYTICS=false
     VITE_ENABLE_DEBUG=false
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-3 minutes)
   - You'll get a live URL like: `https://inventory-management-system-abc123.vercel.app`

### Step 3: Custom Domain (Optional)

1. **Add a custom domain:**
   - In your Vercel project dashboard, go to "Settings" → "Domains"
   - Add your custom domain (e.g., `myinventory.com`)
   - Follow Vercel's DNS configuration instructions

## Part 3: Automatic Deployments

Once connected, every time you push changes to your GitHub repository:
1. Vercel automatically detects the changes
2. Builds your project
3. Deploys the new version
4. Your live site updates automatically

## Part 4: Local Development Setup

For anyone who wants to run this project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/inventory-management-system.git
   cd inventory-management-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Go to `http://localhost:5173`

## Troubleshooting

### Common Issues:

1. **Build fails on Vercel:**
   - Check that all dependencies are in `package.json`
   - Ensure no TypeScript errors
   - Check build logs in Vercel dashboard

2. **Environment variables not working:**
   - Make sure they start with `VITE_`
   - Redeploy after adding environment variables

3. **404 errors on page refresh:**
   - This is handled by `vercel.json` configuration
   - Make sure the file is included in your repository

4. **Large bundle size warnings:**
   - The app should build successfully despite warnings
   - Consider code splitting for production optimization

### Getting Help:

- Check Vercel's [documentation](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Check GitHub repository for any missing files

## Files You Must Upload to GitHub

✅ **Include these files:**
- `src/` folder and all contents
- `public/` folder and all contents
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.js`
- `index.html`
- `.gitignore`
- `.env.example`
- `vercel.json`
- `README.md`
- `DEPLOYMENT_GUIDE.md`

❌ **Do NOT upload:**
- `node_modules/` folder
- `.env` file (contains secrets)
- `dist/` folder (build output)
- `.DS_Store` files
- Any `.log` files

## Success! 🎉

Your Inventory Management System is now live and accessible worldwide. Share your Vercel URL with others to showcase your project!

**Your deployment URL will look like:**
`https://inventory-management-system-abc123.vercel.app`