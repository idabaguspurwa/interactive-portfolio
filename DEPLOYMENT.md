# Deployment Guide for idabaguspurwa.com

This guide walks you through deploying your interactive portfolio to your custom domain `idabaguspurwa.com` using Vercel and Cloudflare.

## 🚀 Quick Deployment Steps

### Step 1: Push to GitHub (if not done already)

```bash
# Add all files
git add .

# Commit with descriptive message
git commit -m "Initial portfolio setup with CI/CD pipeline"

# Push to your repository
git push origin main
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (if not installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy your project**:
   ```bash
   vercel
   ```
   - Connect to your GitHub repository: `idabaguspurwa/interactive-portfolio`
   - Follow the prompts (accept defaults for Next.js project)

4. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Step 3: Configure Environment Variables in Vercel

In your Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add the following variables:

```env
# Required for contact form
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@idabaguspurwa.com
TO_EMAIL=your-personal-email@gmail.com

# Required for AI data analysis features
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key

# Optional analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Step 4: Add Custom Domain in Vercel

1. In Vercel dashboard → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter: `idabaguspurwa.com`
4. Enter: `www.idabaguspurwa.com`
5. Vercel will show you DNS records to configure

### Step 5: Configure DNS in Cloudflare

1. **Login to Cloudflare Dashboard**
2. **Select your domain**: `idabaguspurwa.com`
3. **Go to DNS** → **Records**
4. **Add/Update these records**:

```dns
Type: CNAME
Name: @ (or idabaguspurwa.com)
Content: cname.vercel-dns.com
Proxy Status: Proxied (Orange Cloud) ✅

Type: CNAME
Name: www
Content: cname.vercel-dns.com  
Proxy Status: Proxied (Orange Cloud) ✅
```

### Step 6: Configure SSL in Cloudflare

1. **SSL/TLS** → **Overview**
2. **Set encryption mode**: Full (strict)
3. **Edge Certificates** → **Always Use HTTPS**: On
4. **HSTS** → Enable

### Step 7: Verify Deployment

1. **Wait 5-10 minutes** for DNS propagation
2. **Visit**: https://idabaguspurwa.com
3. **Check**: https://www.idabaguspurwa.com (should redirect)
4. **Test features**:
   - Contact form
   - Data playground with CSV upload
   - All page navigation

## 🔧 Troubleshooting

### Domain Not Working?
- Wait up to 24 hours for full DNS propagation
- Check Cloudflare DNS records are correct
- Verify Vercel domain configuration

### Contact Form Not Working?
- Check environment variables in Vercel
- Verify SMTP credentials
- Check email app password (not regular password)

### AI Features Not Working?
- Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set
- Check Gemini API quota and billing

### Build Failures?
- Check GitHub Actions logs
- Verify all dependencies in package.json
- Run `npm run ci` locally first

## 📊 Monitoring

After deployment, monitor:

1. **Vercel Analytics**: Performance metrics
2. **Cloudflare Analytics**: Traffic and security
3. **GitHub Actions**: CI/CD pipeline health
4. **Lighthouse Scores**: Core Web Vitals

## 🚀 Future Updates

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main

# Vercel automatically deploys from main branch
# Check deployment status at vercel.com
```

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review Cloudflare DNS settings
3. Verify environment variables
4. Test locally with `npm run dev`

---

**Live Site**: https://idabaguspurwa.com  
**Repository**: https://github.com/idabaguspurwa/interactive-portfolio  
**Vercel Dashboard**: https://vercel.com/dashboard
