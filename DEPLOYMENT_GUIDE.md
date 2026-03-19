# Deployment Guide - Anclora Content Generator AI

**Target Platform**: Vercel (Recommended)
**Database**: Neon PostgreSQL
**Auth**: Supabase Auth
**Estimated Time**: 30-45 minutes

---

## 🚀 Quick Start

```bash
# 1. Verify build passes
npm run build

# 2. Set up Neon database
# 3. Configure environment variables in Vercel
# 4. Deploy to Vercel
# 5. Run database migrations
```

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] **Neon Account**: https://console.neon.tech (Free tier available)
- [ ] **Supabase Account**: https://app.supabase.com (For authentication)
- [ ] **Vercel Account**: https://vercel.com (Free tier available)
- [ ] **Anthropic API Key** (Optional): https://console.anthropic.com
- [ ] **Groq API Key** (Optional): https://console.groq.com
- [ ] **GitHub Repository**: Code pushed to GitHub

---

## Step 1: Database Setup (Neon)

### 1.1 Create Neon Project

1. Go to https://console.neon.tech
2. Click **"Create Project"**
3. Enter project details:
   - **Name**: `anclora-content-ai`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 16 (latest)
4. Click **"Create Project"**

### 1.2 Enable pgvector Extension

In the Neon SQL Editor, run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Click **"Run"** to execute.

### 1.3 Get Connection String

1. In your Neon project dashboard
2. Go to **"Dashboard"** → **"Connection Details"**
3. Copy the connection string (format: `postgresql://user:password@...`)
4. **Important**: Make sure `?sslmode=require` is at the end

Example:
```
postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### 1.4 Apply Database Schema

**Option A: Using Drizzle (Recommended)**

```bash
# Set your DATABASE_URL locally
export DATABASE_URL="postgresql://username:password@..."

# Push schema to database
npm run db:push
```

**Option B: Using SQL Files**

```bash
# Run migrations in order
psql $DATABASE_URL -f supabase/migrations/002_rag_schema.sql
psql $DATABASE_URL -f supabase/migrations/003_rls_policies.sql
psql $DATABASE_URL -f supabase/migrations/004_seed_data.sql
```

### 1.5 Verify Schema

In Neon SQL Editor, run:

```sql
-- Should show 8 tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Should show vector extension
SELECT * FROM pg_extension WHERE extname = 'vector';
```

---

## Step 2: Authentication Setup (Supabase)

### 2.1 Create Supabase Project

1. Go to https://app.supabase.com
2. Click **"New Project"**
3. Enter details:
   - **Name**: `anclora-auth`
   - **Database Password**: (save this securely)
   - **Region**: Same as Neon if possible
4. Wait for project to initialize (~2 minutes)

### 2.2 Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbG...` (long string)

### 2.3 Configure Authentication Providers

1. Go to **Authentication** → **Providers**
2. Enable **Email** authentication (enabled by default)
3. (Optional) Configure social providers (Google, GitHub, etc.)

### 2.4 Create Test User

1. Go to **Authentication** → **Users**
2. Click **"Add User"** → **"Create New User"**
3. Enter:
   - **Email**: your@email.com
   - **Password**: (secure password)
4. Confirm creation

---

## Step 3: Vercel Deployment

### 3.1 Connect Repository

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the `anclora-content-generator-ai` repo

### 3.2 Configure Project

**Framework Preset**: Next.js
**Root Directory**: `./` (default)
**Build Command**: `npm run build`
**Output Directory**: `.next` (default)
**Install Command**: `npm install`

### 3.3 Set Environment Variables

Click **"Environment Variables"** and add:

#### Required Variables

```bash
# Database (Neon)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Next.js
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### Optional Variables (Add for AI features)

```bash
# Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Groq (Fast inference)
GROQ_API_KEY=gsk_xxxxx

# Ollama (If using local/custom endpoint)
# OLLAMA_BASE_URL=https://your-ollama-instance.com/v1
```

**Important**: For all variables, select **"All Environments"** (Production, Preview, Development)

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Check build logs for any errors

---

## Step 4: Post-Deployment Configuration

### 4.1 Verify Deployment

Once deployed, verify:

1. **Homepage loads**: Visit your Vercel URL
2. **Login works**: Go to `/login` and sign in
3. **Dashboard loads**: After login, verify `/dashboard` appears
4. **Database connection**: Check that metrics load in dashboard

### 4.2 Update Supabase Redirect URLs

1. Go to Supabase → **Authentication** → **URL Configuration**
2. Add your Vercel URL:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add:
     - `https://your-app.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback` (for local dev)

### 4.3 Test Critical Flows

Test the following in production:

- [ ] User login/logout
- [ ] Dashboard overview loads metrics
- [ ] Knowledge Base (RAG) page loads
- [ ] Content Studio renders (even without API keys)
- [ ] Settings page loads

### 4.4 Configure Custom Domain (Optional)

1. In Vercel project settings → **Domains**
2. Add your custom domain
3. Update DNS records as shown
4. Update `NEXT_PUBLIC_APP_URL` to your domain
5. Update Supabase redirect URLs

---

## Step 5: Database Seed Data

### 5.1 Run Seed Migration

If you used Option A (Drizzle), seed data should be included.

If you used Option B (SQL files), ensure you ran:

```bash
psql $DATABASE_URL -f supabase/migrations/004_seed_data.sql
```

### 5.2 Verify Seed Data

In Neon SQL Editor:

```sql
-- Should show 2 templates
SELECT COUNT(*) FROM content_templates;

-- Should show 3 micro-zones
SELECT COUNT(*) FROM micro_zones;
```

### 5.3 Create Workspace (Manual)

For now, workspaces need to be created manually:

```sql
-- Create your first workspace
INSERT INTO workspaces (name, slug, owner_id, settings)
VALUES (
  'My Workspace',
  'my-workspace',
  'your-user-id-from-supabase',  -- Get from Supabase Auth → Users
  '{}'::jsonb
)
RETURNING id;
```

Save the returned `id` - you'll need it for testing.

---

## 🧪 Testing the Deployment

### Test Checklist

1. **Authentication**
   ```
   ✓ Can access /login
   ✓ Can login with test user
   ✓ Redirected to /dashboard after login
   ✓ Can logout
   ✓ Unauthenticated users redirected to /login
   ```

2. **Dashboard Pages**
   ```
   ✓ /dashboard - Overview loads
   ✓ /dashboard/studio - Content Studio loads
   ✓ /dashboard/metrics - Analytics loads
   ✓ /dashboard/settings - Settings loads
   ✓ /dashboard/rag - Knowledge Base loads
   ```

3. **API Routes** (if AI keys configured)
   ```
   ✓ Can generate content in Studio
   ✓ Metrics API returns data
   ✓ RAG ingestion works
   ```

4. **Responsive Design**
   ```
   ✓ Mobile view works
   ✓ Tablet view works
   ✓ Desktop view works
   ```

---

## 🔧 Troubleshooting

### Build Fails

**Error**: "Type error in..."
- **Solution**: Run `npm run build` locally first
- Check TypeScript errors
- Verify all dependencies installed

**Error**: "Module not found"
- **Solution**: Check `package.json` dependencies
- Run `npm install` locally
- Push updated `package-lock.json`

### Database Connection Issues

**Error**: "Connection refused"
- **Solution**: Verify `DATABASE_URL` is correct
- Check Neon project is not paused (free tier pauses after inactivity)
- Ensure `?sslmode=require` is at the end

**Error**: "Relation does not exist"
- **Solution**: Run migrations
- Verify schema was applied: `npm run db:push`

### Authentication Issues

**Error**: "Redirect URL not allowed"
- **Solution**: Add your Vercel URL to Supabase redirect URLs
- Format: `https://your-app.vercel.app/auth/callback`

**Error**: "Invalid API key"
- **Solution**: Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
- Check it's the **anon public** key, not service key

### Runtime Errors

**Error**: "workspace_id required"
- **Solution**: Create a workspace in database (see Step 5.3)
- Update API calls with valid workspace ID

**Error**: "AI model not available"
- **Solution**: Check API keys are set
- Verify keys have credits/quota
- Test with Groq (has free tier)

---

## 📊 Monitoring & Maintenance

### Recommended Tools

1. **Error Tracking**: Sentry
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

2. **Analytics**: Vercel Analytics (built-in)
   - Enable in Vercel dashboard
   - Free for hobby projects

3. **Uptime Monitoring**: UptimeRobot
   - Set up ping to your homepage
   - Get alerts if site goes down

### Regular Maintenance

- **Weekly**: Check error logs in Vercel
- **Monthly**: Review Neon database size (free tier: 512MB)
- **Quarterly**: Update dependencies
  ```bash
  npm outdated
  npm update
  ```

---

## 🔐 Security Best Practices

### Before Production

- [ ] Rotate all API keys
- [ ] Use environment-specific keys (dev/staging/prod)
- [ ] Enable RLS policies on Supabase tables
- [ ] Set up rate limiting (Vercel Edge Config)
- [ ] Review CORS settings
- [ ] Enable Vercel security headers

### Recommended .env Structure

**Local (.env.local)**:
```bash
DATABASE_URL=postgresql://...neon.tech/neondb_dev
ANTHROPIC_API_KEY=sk-ant-test-key
```

**Production (Vercel)**:
```bash
DATABASE_URL=postgresql://...neon.tech/neondb_prod
ANTHROPIC_API_KEY=sk-ant-prod-key
```

---

## 🎯 Performance Optimization

### Vercel Settings

1. **Enable Edge Runtime** where possible
2. **Configure caching headers**
3. **Enable compression**
4. **Use Image Optimization** (Next.js built-in)

### Neon Optimizations

1. **Connection Pooling**: Built-in with Neon
2. **Autoscaling**: Enable in project settings
3. **Read Replicas**: Consider for high traffic

### Next.js Optimizations

```javascript
// next.config.js already configured
// Verify these settings:
export default {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
}
```

---

## 📞 Support & Resources

### Documentation
- **Neon Docs**: https://neon.tech/docs
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs

### Community
- **Neon Discord**: https://discord.gg/neon
- **Supabase Discord**: https://discord.supabase.com
- **Next.js Discussions**: https://github.com/vercel/next.js/discussions

### Getting Help
- Check `TROUBLESHOOTING.md` in this repo
- Review build logs in Vercel dashboard
- Check Neon query logs in console
- Supabase logs in dashboard

---

## ✅ Deployment Checklist

Print this and check off as you go:

### Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] `npm run build` passes locally
- [ ] `.env.example` updated
- [ ] All sensitive data removed from code

### Neon Setup
- [ ] Neon project created
- [ ] pgvector extension enabled
- [ ] Connection string obtained
- [ ] Schema applied (via Drizzle or SQL)
- [ ] Seed data loaded
- [ ] Test workspace created

### Supabase Setup
- [ ] Supabase project created
- [ ] API credentials obtained
- [ ] Test user created
- [ ] Redirect URLs configured

### Vercel Setup
- [ ] Repository imported
- [ ] Environment variables set
- [ ] Initial deployment successful
- [ ] Production URL obtained

### Post-Deployment
- [ ] Login tested
- [ ] Dashboard pages load
- [ ] Database connection verified
- [ ] Redirect URLs updated in Supabase
- [ ] Custom domain configured (if applicable)

### Optional
- [ ] AI API keys configured
- [ ] Error tracking set up
- [ ] Analytics enabled
- [ ] Monitoring configured

---

## 🎉 Success!

Your Anclora Content Generator AI is now live!

**Next Steps**:
1. Share with team for testing
2. Gather user feedback
3. Monitor usage and errors
4. Plan FASE 3 features

**Access your app**:
- Production: `https://your-app.vercel.app`
- Vercel Dashboard: `https://vercel.com/dashboard`
- Neon Console: `https://console.neon.tech`
- Supabase Dashboard: `https://app.supabase.com`

---

**Need help?** Check the troubleshooting section or open an issue in the repository.

**Ready to scale?** Review the performance optimization section.

**Built with** ❤️ **by the Anclorabot Multi-Agent System**
