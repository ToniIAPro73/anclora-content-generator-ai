# 🔐 Neon Credentials - Quick Reference

**Project**: neon-content-generator-ai
**Branch**: main
**Region**: EU Central 1 (Frankfurt)
**Status**: ✅ Active

---

## 📋 Your Neon URLs

### Database Connection
You'll need to get your full connection string from Neon Dashboard → Connection Details

**Format should be:**
```
postgresql://[user]:[password]@ep-polished-base-agpnzxqf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

### Neon Auth URLs (Available)
```
Auth URL:
https://ep-polished-base-agpnzxqf.neonauth.c-2.eu-central-1.aws.neon.tech/neondb/auth

JWKS URL:
https://ep-polished-base-agpnzxqf.neonauth.c-2.eu-central-1.aws.neon.tech/neondb/auth/.well-known/jwks.json

Data API:
https://ep-polished-base-agpnzxqf.apirest.c-2.eu-central-1.aws.neon.tech/neondb/rest/v1
```

---

## ⚠️ IMPORTANT: Auth Configuration

I see you have **Neon Auth** enabled. However, our application is currently configured to use **Supabase Auth**, not Neon Auth.

### You have 2 options:

### Option 1: Use Supabase Auth (Recommended - Already Implemented)
✅ **This is what's currently built**
- Keep Neon for database only
- Create Supabase project for authentication
- No code changes needed
- **Action**: Create Supabase account → https://app.supabase.com

### Option 2: Switch to Neon Auth (Requires Code Changes)
⚠️ **Would need refactoring**
- Use Neon Auth instead of Supabase
- Requires changing auth implementation in code
- Would use Neon's Better Auth integration
- **Action**: Not recommended unless you specifically want this

---

## ✅ Recommended Next Steps

Since the app is built for Supabase Auth, I recommend:

### 1. Get Database Connection String
In Neon Console:
1. Go to: **Dashboard** → **Connection Details**
2. Select: **Connection string**
3. Copy the full string (includes username and password)
4. It should look like:
   ```
   postgresql://username:password@ep-polished-base-agpnzxqf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Enable pgvector Extension
In Neon Console:
1. Go to: **SQL Editor**
2. Run this query:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Verify with:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'vector';
   ```

### 3. Create Supabase Account (For Auth)
1. Go to: https://app.supabase.com
2. Sign up with GitHub
3. Create new project: "anclora-auth"
4. Get:
   - Project URL: `https://xxxxx.supabase.co`
   - Anon Key: `eyJxxx...`

### 4. Update Local Environment
```bash
# Add to .env.local
DATABASE_URL="postgresql://username:password@ep-polished-base-agpnzxqf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Push Database Schema
```bash
npm run db:push
```

---

## 🔧 About Neon Auth

You have Neon Auth enabled with these settings:
- ✅ Allow Localhost (good for development)
- ✅ Sign-up with Email
- ✅ Sign-in with Email
- ❌ Verify at Sign-up (disabled)

**Note**: Since our app uses Supabase Auth, these Neon Auth settings won't be used. You can disable Neon Auth if you want, or leave it for future use.

---

## 📊 Database Setup Checklist

Once you have the connection string:

- [ ] Copy DATABASE_URL from Neon
- [ ] Add DATABASE_URL to `.env.local`
- [ ] Run `npm run db:push` to create tables
- [ ] Verify tables in Neon SQL Editor
- [ ] Create Supabase account for Auth
- [ ] Get Supabase credentials
- [ ] Add Supabase vars to `.env.local`
- [ ] Test local development with `npm run dev`

---

## 🚀 After Local Testing Works

Once everything works locally, you'll deploy to Vercel:

1. Push code to GitHub (if not already done)
2. Import repository in Vercel
3. Add all environment variables to Vercel
4. Deploy!

---

## 💡 Quick Tips

**Finding your connection string:**
- Neon Dashboard → "Connection Details" button (top right)
- Choose "Pooled connection" for better performance
- Always add `?sslmode=require` at the end

**Testing database connection:**
```bash
# After adding DATABASE_URL to .env.local
npm run db:push
# Should show: ✅ Tables created successfully
```

**Neon Free Tier Limits:**
- 512 MB storage
- 1 project
- 10 branches
- More than enough to start!

---

**Next Step**: Get your DATABASE_URL from Neon Dashboard and add it to `.env.local`
