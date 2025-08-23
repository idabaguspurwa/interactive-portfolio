# Interactive Developer Portfolio

[![CI/CD Pipeline](https://github.com/idabaguspurwa/interactive-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/idabaguspurwa/interactive-portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/idabaguspurwa/interactive-portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/idabaguspurwa/interactive-portfolio/actions/workflows/codeql.yml)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000.svg?style=flat&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, interactive portfolio website built with Next.js, featuring smooth animations, 3D elements, AI-powered data analysis tools, and a robust Python FastAPI backend with Snowflake integration. This portfolio demonstrates advanced full-stack development skills and modern technologies.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, React 18, TypeScript
- **AI-Powered Data Tools**: Interactive CSV analysis with Google Gemini AI
- **Data Lakehouse Visualization**: Bronze/Silver/Gold pipeline demonstration
- **GitHub Events Dashboard**: Real-time GitHub activity monitoring with Snowflake
- **Integrated Playground**: Data Lakehouse and GitHub Events in unified interface
- **Stunning Animations**: Framer Motion for fluid, physics-based animations
- **3D Graphics**: React Three Fiber & Three.js for interactive 3D elements
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Smooth theme switching with system preference detection
- **Performance Optimized**: SSR, SSG, and optimized images
- **Contact Form**: Enhanced contact form with email integration
- **CI/CD Pipeline**: Automated testing, linting, and deployment
- **Security Scanning**: CodeQL analysis and dependency auditing
- **SEO Friendly**: Optimized meta tags and structured data
- **Professional Favicon**: Custom data engineering themed browser icon
- **WebGL Management**: Optimized 3D rendering with error handling
- **Page Transitions**: Smooth, modern navigation animations
- **Memory Optimization**: Efficient resource management for better performance

## 🎮 Interactive Data Playground

The playground provides a unified interface for exploring data engineering concepts with two main sections:

### Data Lakehouse Tab
- **Interactive ETL Pipeline**: Bronze → Silver → Gold data transformation workflow
- **Real Data Processing**: Upload CSV files or use sample datasets
- **Live ETL Pipeline**: Watch data flow through Extract, Transform, and Load stages
- **Performance Metrics**: Monitor processing speed, success rates, and data quality
- **Apache Spark Simulation**: Experience data processing concepts in action

### GitHub Events Tab
- **Live Production Data**: Real-time connection to Snowflake database
- **Integrated Dashboard**: GitHub Events data displayed directly in the tab
- **Production Pipeline**: Completed GitHub Events data pipeline with real repository activity
- **Advanced Analytics**: Complex aggregations, timeline analysis, and repository insights
- **No Navigation Required**: See live data immediately when switching tabs

### Performance Optimizations
- **Instant Loading**: Playground main page loads without backend dependencies
- **Isolated Cold Starts**: Only GitHub Events tab waits for Python backend warmup
- **Dynamic Rendering**: Optimized for Vercel deployment with proper build configuration
- **Efficient Component Loading**: Lazy loading with proper loading states

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber, Three.js
- **Icons**: Lucide React
- **Type Safety**: TypeScript

### Backend

- **Language**: Python (FastAPI) + Next.js API Routes
- **Database**: Snowflake (Data Warehouse)
- **Deployment**: Fly.io (Python Backend - Recommended), Render (Python Backend), Vercel (Frontend + API Routes)
- **API**: RESTful API with automatic documentation + Next.js serverless functions

### AI & Data Processing

- **AI Model**: Google Gemini 2.5 Flash & 1.5 Flash fallback
- **Data Analysis**: CSV processing and intelligent insights
- **Visualization**: Interactive data lakehouse pipeline
- **Error Handling**: Robust AI service with fallback mechanisms
- **Data Integration**: Real-time GitHub events and metrics

### DevOps & Deployment

- **Platform**: Vercel (Frontend), Fly.io (Python Backend - Recommended), Render (Python Backend)
- **CI/CD**: GitHub Actions with automated testing
- **Security**: CodeQL analysis, dependency auditing
- **Performance**: Lighthouse CI, build optimization
- **Environment**: Node.js 18+, Python 3.9+

## 🆚 Features Comparison

| Feature                        | Traditional Portfolio      | This Portfolio                   |
| ------------------------------ | -------------------------- | -------------------------------- |
| **Data Analysis**        | ❌ None                    | ✅ AI-powered CSV analysis       |
| **Dashboard Generation** | ❌ Manual creation         | ✅ Automatic AI generation       |
| **Export Options**       | ❌ Limited formats         | ✅ PNG, HTML export              |
| **Responsiveness**       | ⚠️ Basic mobile support  | ✅ Mobile-optimized design       |
| **AI Integration**       | ❌ No AI features          | ✅ Google Gemini AI powered      |
| **Data Visualization**   | ❌ Static charts           | ✅ Dynamic D3.js charts          |
| **ETL Pipeline**         | ❌ No data processing      | ✅ Bronze→Silver→Gold workflow |
| **Performance**          | ⚠️ Standard optimization | ✅ Advanced performance tuning   |
| **3D Graphics**          | ❌ Basic animations        | ✅ React Three Fiber 3D          |
| **Real-time Updates**    | ❌ Static content          | ✅ Live dashboard refresh        |

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+ (for backend development)
- Git

### Clone Repository

```bash
git clone https://github.com/idabaguspurwa/interactive-portfolio.git
cd interactive-portfolio
```

### Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (for backend)
cd python-backend
pip install -r requirements.txt
cd ..
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Resend Configuration (for contact form)
RESEND_API_KEY=your-resend-api-key
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=your-email@gmail.com

# Google Gemini AI (for data analysis features)
GEMINI_API_KEY=your-gemini-api-key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
```

Create a `.env` file in the `python-backend` directory:

```env
# Snowflake Configuration
SNOWFLAKE_ACCOUNT=your_snowflake_account
SNOWFLAKE_USERNAME=your_snowflake_username
SNOWFLAKE_PASSWORD=your_snowflake_password
SNOWFLAKE_DATABASE=your_database_name
SNOWFLAKE_SCHEMA=your_schema_name
SNOWFLAKE_WAREHOUSE=your_warehouse_name
```

### Development Server

```bash
# Start Next.js development server
npm run dev

# Start Python FastAPI server (in another terminal)
cd python-backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# The app will be available at http://localhost:3000
# The API will be available at http://localhost:8000
```

## ⚡ Quick Start Guide

Get your first AI-powered dashboard running in under 5 minutes!

### 1. **Clone & Setup** (1 min)

```bash
git clone https://github.com/idabaguspurwa/interactive-portfolio.git
cd interactive-portfolio
npm install
```

### 2. **Configure AI Services** (1 min)

Create `.env.local` and add your API keys:

```env
GEMINI_API_KEY=your-gemini-api-key
RESEND_API_KEY=your-resend-api-key
```

### 3. **Start Development** (1 min)

```bash
npm run dev
# Open http://localhost:3000
```

### 4. **Create Your First Dashboard** (2 min)

- Navigate to **Playground** section
- Upload any CSV file (sales data, user analytics, etc.)
- Watch AI analyze your data in real-time
- Generate professional dashboard automatically
- Export as PNG or HTML

**🎯 Result**: You'll have a professional, AI-generated dashboard with insights, charts, and key metrics!

## 📸 Screenshots & Demos

### 🧠 AI-Powered Dashboard

![AI Dashboard](./public/intelligent_dashboard.png)
*Professional dashboard automatically generated by AI from your CSV data*

### 🎯 Key Features in Action

- **Real-time AI Analysis**: Watch as AI processes your data step-by-step
- **Professional Layout**: Automatically generated key metrics and visualizations
- **Export Quality**: High-resolution PNG export with full background coverage
- **Mobile Responsive**: Optimized for all devices and screen sizes

### 🚀 Interactive Elements

- **Data Playground**: Upload any CSV and get instant insights
- **ETL Pipeline**: Visual progress tracking through Bronze→Silver→Gold
- **Dynamic Charts**: D3.js powered interactive visualizations
- **Theme Switching**: Smooth dark/light mode transitions

### Test Contact Form Locally

```bash
# Run Python API server locally
cd python-backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# API will be available at http://localhost:8000
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### **CSV Upload Problems**

- **❌ File not uploading**: Ensure file is under 10MB and in CSV format
- **❌ Encoding issues**: Use UTF-8 encoding for international characters
- **❌ Empty data**: Check if CSV has headers and at least 2 rows of data

#### **AI Analysis Issues**

- **❌ Analysis stuck**: Refresh page and try with smaller CSV files
- **❌ No insights generated**: Ensure CSV has numeric columns for analysis
- **❌ API errors**: Verify your `GEMINI_API_KEY` is valid and has quota

#### **Dashboard Export Problems**

- **❌ PNG background issues**: Ensure dashboard is fully loaded before export
- **❌ Export fails**: Check browser console for errors, try refreshing
- **❌ Low quality**: PNG export uses 2x scale for high resolution

#### **Performance Issues**

- **❌ Slow loading**: Use smaller CSV files (< 1000 rows) for faster analysis
- **❌ Memory errors**: Close other browser tabs, refresh page
- **❌ Mobile lag**: Enable "Reduce Motion" in system preferences

#### **API & Backend Issues**

- **❌ Contact form fails**: Verify `RESEND_API_KEY` is set correctly
- **❌ Next.js API errors**: Check browser console for API route errors
- **❌ Build failures**: Clear `node_modules` and reinstall dependencies

### Getting Help

- **GitHub Issues**: [Create an issue](https://github.com/idabaguspurwa/interactive-portfolio/issues)
- **Documentation**: Check this README and component documentation
- **Performance**: Use browser dev tools to identify bottlenecks

## 🔄 CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline with GitHub Actions:

### Automated Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`):

   - ✅ **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
   - 🔍 **Code Quality**: ESLint, TypeScript checking
   - 🏗️ **Build Verification**: Ensures successful builds
   - 🛡️ **Security Audit**: npm audit for vulnerabilities
   - 💡 **Lighthouse CI**: Performance testing on PRs
2. **Security Analysis** (`.github/workflows/codeql.yml`):

   - 🔒 **CodeQL Scanning**: Automated security vulnerability detection
   - 📅 **Scheduled Scans**: Weekly security audits
   - 🚨 **Pull Request Analysis**: Security checks on every PR

### Local CI Commands

```bash
# Run full CI pipeline locally
npm run ci

# Individual checks
npm run lint          # ESLint checking
npm run type-check     # TypeScript validation
npm run test          # Run tests
npm run build         # Production build
```

### Setting Up CI/CD

1. **Fork/Clone** the repository
2. **Enable GitHub Actions** in your repository settings
3. **Set Repository Secrets** in GitHub:
   - `GEMINI_API_KEY`
   - Other environment variables as needed

The pipeline automatically runs on:

- 🔄 Push to `main` and `develop` branches
- 📝 Pull requests to `main`
- 📅 Weekly scheduled security scans

## 🚀 Deployment

### Deploy to Vercel (Frontend)

1. **Connect to Vercel**:

   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```
2. **Set Environment Variables**:
   In your Vercel dashboard, add the environment variables:

   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `TO_EMAIL`
3. **Deploy**:

   ```bash
   vercel --prod
   ```
### Deploy Python Backend to Fly.io

1. **Install Fly CLI**:

   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex

   # Or download from: https://fly.io/docs/hands-on/install-flyctl/
   ```
2. **Login and Launch**:

   ```bash
   cd python-backend
   fly auth login
   fly launch
   # Follow prompts, choose free tier, app name: events-backend
   ```
3. **Set Environment Variables**:

   ```bash
   fly secrets set SNOWFLAKE_ACCOUNT="your_snowflake_account"
   fly secrets set SNOWFLAKE_USERNAME="your_snowflake_username"
   fly secrets set SNOWFLAKE_PASSWORD="your_snowflake_password"
   fly secrets set SNOWFLAKE_DATABASE="your_database_name"
   fly secrets set SNOWFLAKE_SCHEMA="your_schema_name"
   fly secrets set SNOWFLAKE_WAREHOUSE="your_warehouse_name"
   ```
4. **Deploy**:

   ```bash
   fly deploy
   ```
5. **Update Frontend Configuration**:
   Once deployed, update `lib/python-api.js` with your Fly.io URL:

   ```javascript
   const PYTHON_API_BASE_URL = process.env.NODE_ENV === 'production' 
     ? 'https://events-backend.fly.dev'  // Your Fly.io URL
     : 'http://localhost:8000'
   ```
## 🎨 Customization

### Personal Information

Update the following files with your information:

- `app/page.jsx` - Hero section content
- `app/about/page.jsx` - About page content
- `app/projects/page.jsx` - Projects data
- `app/skills/page.jsx` - Skills and technologies
- `app/experience/page.jsx` - Work experience
- `app/playground/page.jsx` - Data playground customization
- `components/Footer.jsx` - Contact information

### Styling

- **Colors**: Modify `tailwind.config.js` for color scheme
- **Fonts**: Update Google Fonts imports in `app/globals.css`
- **Animations**: Customize Framer Motion variants in components

### 3D Elements

- 3D models and animations can be customized in respective page components
- Add new 3D elements using React Three Fiber components
- WebGL context management is handled automatically by `WebGLManager.jsx`
- Error boundaries provide graceful fallbacks for 3D rendering issues

### Favicon & Branding

- Custom favicon in `public/favicon.svg` with data engineering theme
- Update colors and design in the SVG file to match your brand
- PWA manifest in `public/manifest.json` for mobile app-like experience

## 📁 Project Structure

```
interactive-portfolio/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── experience/        # Work experience
│   ├── projects/          # Portfolio projects
│   ├── skills/            # Skills showcase
│   ├── playground/        # Interactive data playground
│   │   ├── page.jsx       # Main playground with integrated tabs
│   │   └── github-events/ # Dedicated GitHub events page
│   ├── publications/      # Research publications
│   ├── globals.css        # Global styles & dashboard CSS
│   ├── layout.jsx         # Root layout component
│   └── page.jsx           # Homepage
├── app/api/               # Next.js API routes
│   ├── ai-dashboard/      # AI dashboard generation
│   ├── ai-clean-csv/      # AI-powered CSV cleaning
│   ├── analyze-csv/       # CSV analysis with Gemini AI
│   ├── process-csv/       # CSV processing & ETL
│   ├── contact/           # Contact form handling (Next.js API)
│   ├── github-metrics-python/    # GitHub metrics via Python backend
│   ├── github-timeline-python/   # GitHub timeline via Python backend
│   └── github-repositories-python/ # GitHub repos via Python backend
├── python-backend/        # Python FastAPI backend
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── fly.toml           # Fly.io deployment config
│   ├── Dockerfile         # Docker container config
│   ├── .dockerignore      # Docker ignore file
│   ├── runtime.txt        # Python runtime version
│   ├── venv/              # Python virtual environment
│   └── README.md          # Backend documentation
├── components/            # React components
│   ├── ui/                # UI component library
│   │   └── Button.jsx     # Reusable button component
│   ├── DataDashboard.jsx  # AI-powered dashboard component
│   ├── InteractiveDataPlayground.jsx # CSV analysis interface
│   ├── GitHubEventsLiveDemo.jsx # GitHub events dashboard
│   ├── EnhancedContactForm.jsx # Enhanced contact form
│   ├── InteractiveSkills.jsx # Interactive skills display
│   ├── MobileOptimizations.jsx # Mobile-specific optimizations
│   ├── PerformanceOptimizer.jsx # Performance optimization utilities
│   ├── ResponsiveComponents.jsx # Responsive design utilities
│   ├── ScrollAnimations.jsx # Scroll-triggered animations
│   ├── ThemeProvider.jsx  # Theme management
│   ├── TypewriterEffect.jsx # Typewriter text effects
│   ├── WebGLManager.jsx   # WebGL context management
│   ├── PageTransition.jsx # Page transition animations
│   ├── Navbar.jsx         # Navigation component
│   └── Footer.jsx         # Footer component
├── lib/                   # Utility functions
│   ├── utils.js           # Common utility functions
│   └── python-api.js      # Python backend API client
├── public/                # Static assets
│   ├── favicon.svg        # Custom data engineering favicon
│   ├── favicon.ico        # Browser favicon
│   ├── favicon-16x16.png  # Small favicon
│   ├── favicon-32x32.png  # Large favicon
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   ├── robots.txt         # SEO robots file
│   ├── sitemap.xml        # SEO sitemap
│   ├── logo.jpg           # Portfolio logo
│   ├── portfolioimg.png   # Portfolio images
│   ├── CV.pdf             # Resume/CV
│   ├── fonts/             # Custom fonts directory
│   ├── 3dportfolio.png    # 3D portfolio showcase
│   ├── intelligent_dashboard.png # AI dashboard example
│   ├── dataplatform.png   # Data platform project
│   ├── airflow-pipeline.png # Airflow project
│   ├── basketball-detection.png # ML project
│   ├── beritau_mobile.png # Mobile app project
│   ├── champions-league.png # Sports analytics project
│   ├── f1analytics.png    # F1 analytics project
│   ├── fakenewsDetection.png # AI detection project
│   ├── football-streaming.png # Streaming project
│   ├── mail_deletion.jpg  # Email automation project
│   ├── mtgraphy.png       # Photography project
│   ├── nyctaxi.png        # NYC taxi analysis
│   ├── reactporto.png     # React portfolio
│   ├── stockmarket.png    # Stock market analysis
│   └── viewContractor.png # Contractor platform
├── __tests__/             # Test files
│   └── example.test.js    # Example test
├── .github/               # GitHub configuration
│   └── workflows/         # CI/CD workflows
├── .vscode/               # VS Code configuration
├── .git/                  # Git repository
├── node_modules/          # Node.js dependencies
├── .next/                 # Next.js build output
├── LICENSE                # MIT License
├── next.config.js         # Next.js configuration
├── next-env.d.ts          # Next.js TypeScript types
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest testing configuration
├── jest.setup.js          # Jest setup configuration
├── .eslintrc.json         # ESLint configuration
├── postcss.config.js      # PostCSS configuration
├── package.json           # Node.js dependencies
├── package-lock.json      # Locked dependencies
└── README.md              # Project documentation
```

## 🔧 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic with Next.js App Router
- **Bundle Analysis**: Run `npm run analyze` to check bundle size
- **3D Model Optimization**: Use low-poly models and lazy loading
- **Animation Performance**: Use `transform` and `opacity` for smooth animations
- **WebGL Context Management**: Optimized 3D rendering with memory management
- **Page Transition Optimization**: Efficient animations with minimal resource usage
- **Memory Budget Compliance**: Will-change CSS properties optimized for performance

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- **Code Style**: Follow existing ESLint and Prettier configurations
- **Performance**: Ensure animations and 3D elements are optimized
- **Accessibility**: Maintain WCAG compliance for all interactive elements
- **Testing**: Test on multiple devices and browsers before submitting PRs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design Inspiration**: Modern portfolio websites and design systems
- **3D Models**: Three.js community and examples
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion documentation and examples
- **AI Integration**: Google Gemini AI for intelligent data analysis
- **Performance**: WebGL optimization techniques and best practices

## 📞 Contact

Ida Bagus Gede Purwa Manik Adiputra - ida.adiputra@outlook.com

Project Link: [https://github.com/idabaguspurwa/interactive-portfolio](https://github.com/idabaguspurwa/interactive-portfolio)

Live Demo: [https://idabaguspurwa.com](https://idabaguspurwa.com)

## 🔧 Recent Updates & Improvements

### Performance & Stability

### Playground Integration & Performance
- **Unified Playground Interface**: Integrated Data Lakehouse and GitHub Events in single tabbed interface
- **Direct Data Access**: GitHub Events data now displays immediately in playground tabs
- **Eliminated Navigation**: No more button clicking to see live data
- **Optimized Loading**: Playground main page loads instantly, isolated backend cold starts
- **Vercel Build Fixes**: Added dynamic rendering configuration to prevent build errors
- **Component Architecture**: Cleaner separation of concerns with proper dynamic imports

### User Experience

- ✅ **Professional Favicon**: Custom data engineering themed browser icon
- ✅ **Smooth Navigation**: Eliminated stuck page transitions
- ✅ **Mobile Optimization**: Better performance on low-end devices
- ✅ **Accessibility**: Improved reduced motion support
- ✅ **Loading Animations**: Enhanced AI analysis and ETL pipeline progress indicators
- ✅ **Theme Consistency**: Improved light/dark mode support across all components

### AI & Data Features

- ✅ **Robust AI Integration**: Fallback mechanisms for AI service failures
- ✅ **Data Playground**: Interactive CSV analysis and cleaning tools
- ✅ **Performance Monitoring**: Smart detection of device capabilities
- ✅ **Intelligent Dashboard**: AI-powered professional dashboard generation
- ✅ **PNG Export**: High-quality dashboard export with full background coverage
- ✅ **Data Lakehouse Pipeline**: Interactive ETL workflow with real-time progress tracking
- ✅ **CSV Analysis**: Enhanced AI analysis with step-by-step progress indicators

### Backend Architecture

- ✅ **Python FastAPI Backend**: Modern, fast Python backend for data processing
- ✅ **Snowflake Integration**: Enterprise-grade data warehouse connectivity
- ✅ **GitHub Events API**: Real-time GitHub activity monitoring
- ✅ **Render Deployment**: Scalable cloud deployment for Python backend
- ✅ **Next.js API Routes**: Serverless functions for contact form and AI features
- ✅ **API Documentation**: Automatic OpenAPI/Swagger documentation
- ✅ **Performance Monitoring**: Backend performance tracking and optimization

---

Built with ❤️ using Next.js and Python FastAPI
