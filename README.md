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
- **Email**: SMTP integration with HTML templates
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
# SMTP Configuration (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@yourdomain.com
TO_EMAIL=your-email@gmail.com

# Google Gemini AI (for data analysis features)
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
# Alternative: GEMINI_API_KEY (for backward compatibility)

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-ga-id
```

### Development Server

```bash
# Start Next.js development server
npm run dev

# The app will be available at http://localhost:3000
```

### Test Contact Form Locally

```bash
# Run Go API server locally
cd api/contact
go run main.go

# API will be available at http://localhost:8080
```

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

   - `SMTP_HOST`
   - `SMTP_USERNAME`
   - `SMTP_PASSWORD`
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
│   ├── about/
│   ├── contact/
│   ├── experience/
│   ├── projects/
│   ├── skills/
│   ├── playground/         # Interactive data playground
│   ├── globals.css
│   ├── layout.jsx
│   └── page.jsx
├── api/                    # API routes
│   ├── ai-clean-csv/      # AI-powered CSV cleaning
│   ├── analyze-csv/       # CSV analysis with Gemini AI
│   ├── process-csv/       # CSV processing
│   └── contact/           # Go backend API
│       ├── main.go
│       └── go.mod
├── components/             # React components
│   ├── ui/                # UI components
│   ├── WebGLManager.jsx   # WebGL context management
│   ├── PageTransition.jsx # Page transition animations
│   ├── InteractiveDataPlayground.jsx # Data playground
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ThemeProvider.jsx
│   └── TypewriterEffect.jsx
├── lib/                    # Utility functions
│   └── utils.js
├── public/                 # Static assets
│   ├── favicon.svg        # Custom favicon
│   ├── manifest.json      # PWA manifest
│   └── logo.jpg
├── LICENSE                 # MIT License
├── next.config.js
├── tailwind.config.js
├── vercel.json            # Vercel deployment config
└── package.json
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

### User Experience
- ✅ **Professional Favicon**: Custom data engineering themed browser icon
- ✅ **Smooth Navigation**: Eliminated stuck page transitions
- ✅ **Mobile Optimization**: Better performance on low-end devices
- ✅ **Accessibility**: Improved reduced motion support

### AI & Data Features
- ✅ **Robust AI Integration**: Fallback mechanisms for AI service failures
- ✅ **Data Playground**: Interactive CSV analysis and cleaning tools
- ✅ **Performance Monitoring**: Smart detection of device capabilities

---

Built with ❤️ using Next.js and Go
