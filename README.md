# Interactive Developer Portfolio

[![CI/CD Pipeline](https://github.com/idabaguspurwa/interactive-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/idabaguspurwa/interactive-portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/idabaguspurwa/interactive-portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/idabaguspurwa/interactive-portfolio/actions/workflows/codeql.yml)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000000.svg?style=flat&logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, interactive portfolio website built with Next.js, featuring smooth animations, 3D elements, AI-powered data analysis tools, and a robust Go backend API. This portfolio demonstrates advanced full-stack development skills and modern technologies.

## 🚀 Features

- **Modern Tech Stack**: Next.js 14 with App Router, React 18, TypeScript
- **AI-Powered Data Tools**: Interactive CSV analysis with Google Gemini AI
- **Data Lakehouse Visualization**: Bronze/Silver/Gold pipeline demonstration
- **Stunning Animations**: Framer Motion for fluid, physics-based animations
- **3D Graphics**: React Three Fiber & Three.js for interactive 3D elements
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Smooth theme switching with system preference detection
- **Performance Optimized**: SSR, SSG, and optimized images
- **Contact Form**: Go backend API with email integration
- **CI/CD Pipeline**: Automated testing, linting, and deployment
- **Security Scanning**: CodeQL analysis and dependency auditing
- **SEO Friendly**: Optimized meta tags and structured data
- **Professional Favicon**: Custom data engineering themed browser icon
- **WebGL Management**: Optimized 3D rendering with error handling
- **Page Transitions**: Smooth, modern navigation animations
- **Memory Optimization**: Efficient resource management for better performance

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

- **Language**: Go (Golang)
- **Email**: Resend integration with HTML templates
- **Validation**: Go Playground Validator
- **Deployment**: Vercel Serverless Functions

### AI & Data Processing

- **AI Model**: Google Gemini 2.5 Flash & 1.5 Flash fallback
- **Data Analysis**: CSV processing and intelligent insights
- **Visualization**: Interactive data lakehouse pipeline
- **Error Handling**: Robust AI service with fallback mechanisms

### DevOps & Deployment

- **Platform**: Vercel
- **CI/CD**: GitHub Actions with automated testing
- **Security**: CodeQL analysis, dependency auditing
- **Performance**: Lighthouse CI, build optimization
- **Environment**: Node.js 18+, Go 1.21+

## 🆚 Features Comparison

See how your AI-powered portfolio stands out from traditional portfolios:

| Feature                        | Traditional Portfolio      | Your AI Portfolio                |
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
- Go 1.21+ (for backend development)
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

# Install Go dependencies (for backend)
cd api/contact
go mod tidy
cd ../..
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

### Development Server

```bash
# Start Next.js development server
npm run dev

# The app will be available at http://localhost:3000
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
# Run Go API server locally
cd api/contact
go run main.go

# API will be available at http://localhost:8080
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
- **❌ Go backend errors**: Check Go version (requires 1.21+)
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
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - Other environment variables as needed

The pipeline automatically runs on:

- 🔄 Push to `main` and `develop` branches
- 📝 Pull requests to `main`
- 📅 Weekly scheduled security scans

## 🚀 Deployment

### Deploy to Vercel (Recommended)

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

### Alternative Deployment Options

#### Netlify

```bash
# Build the static site
npm run build
npm run export

# Deploy the 'out' directory to Netlify
```

#### AWS Amplify

```bash
# Connect your repository to AWS Amplify
# Configure build settings:
# Build command: npm run build
# Publish directory: .next
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
│   ├── publications/      # Research publications
│   ├── globals.css        # Global styles & dashboard CSS
│   ├── layout.jsx         # Root layout component
│   └── page.jsx           # Homepage
├── app/api/               # Next.js API routes
│   ├── ai-dashboard/      # AI dashboard generation
│   ├── ai-clean-csv/      # AI-powered CSV cleaning
│   ├── analyze-csv/       # CSV analysis with Gemini AI
│   ├── process-csv/       # CSV processing & ETL
│   └── contact/           # Contact form handling
├── api/                   # Go backend services
│   ├── contact/           # Go contact API
│   │   ├── main.go        # Main Go server
│   │   ├── go.mod         # Go module file
│   │   └── go.sum         # Go dependencies
│   └── contact-go.go      # Go contact handler
├── components/            # React components
│   ├── ui/                # UI component library
│   │   └── Button.jsx     # Reusable button component
│   ├── DataDashboard.jsx  # AI-powered dashboard component
│   ├── InteractiveDataPlayground.jsx # CSV analysis interface
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
│   └── utils.js           # Common utility functions
├── public/                # Static assets
│   ├── favicon.svg        # Custom data engineering favicon
│   ├── manifest.json      # PWA manifest
│   ├── logo.jpg           # Portfolio logo
│   ├── portfolioimg.png   # Portfolio images
│   ├── CV.pdf             # Resume/CV
│   └── [other assets]     # Various portfolio images
├── grafana/               # Grafana dashboards & provisioning
│   ├── provisioning/      # Grafana configuration
│   │   ├── dashboards/    # Dashboard definitions
│   │   └── datasources/   # Data source configurations
├── __tests__/             # Test files
│   └── example.test.js    # Example test
├── .github/               # GitHub configuration
│   └── workflows/         # CI/CD workflows
├── LICENSE                # MIT License
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── jest.config.js         # Jest testing configuration
├── package.json           # Node.js dependencies
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

- ✅ **Fixed WebGL Context Loss**: Implemented robust WebGL context management
- ✅ **Optimized Page Transitions**: Smooth, memory-efficient navigation animations
- ✅ **Memory Optimization**: Reduced will-change CSS usage for better performance
- ✅ **Error Handling**: Added comprehensive error boundaries for 3D components
- ✅ **Dashboard Layout Optimization**: Fixed desktop grid layouts with mobile responsiveness
- ✅ **Memory Management**: Enhanced resource handling and cleanup for better performance

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

---

Built with ❤️ using Next.js and Go
