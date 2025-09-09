import "./globals.css";
import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer, FloatingQuickNav } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { WebGLProvider } from "@/components/WebGLManager";
import { QueryProvider } from "@/components/QueryProvider";

// Optimized font loading with display=swap for better Core Web Vitals
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap", 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4B7BEC" },
    { media: "(prefers-color-scheme: dark)", color: "#50A6FF" },
  ],
};

export const metadata = {
  title: {
    default: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer & ETL Specialist | Portfolio",
    template: "%s | Ida Bagus Purwa - Data Engineer"
  },
  description:
    "Experienced Data Engineer specializing in cloud platforms, Apache Spark, Kafka, and modern data pipelines. 5+ years building scalable ETL solutions at Bank Central Asia. Expert in Python, SQL, Scala, GCP, Azure, AWS. View my projects, skills, and professional experience.",
  keywords: [
    "Ida Bagus Gede Purwa Manik Adiputra",
    "Ida Bagus Purwa", 
    "data engineer",
    "ETL specialist",
    "cloud platforms",
    "Apache Spark",
    "Apache Kafka",
    "data pipelines",
    "business intelligence",
    "GCP", "Azure", "AWS",
    "Python", "SQL", "Scala", "PySpark",
    "data engineering portfolio",
    "Indonesia data engineer",
    "Bina Nusantara University",
    "Bank Central Asia",
    "Jakarta data engineer",
    "data engineer",
    "data architecture",
    "real-time analytics"
  ],
  authors: [{ name: "Ida Bagus Gede Purwa Manik Adiputra" }],
  creator: "Ida Bagus Gede Purwa Manik Adiputra",
  publisher: "Ida Bagus Gede Purwa Manik Adiputra",
  metadataBase: new URL("https://idabaguspurwa.com"),
  alternates: {
    canonical: "https://idabaguspurwa.com",
  },
  openGraph: {
    title: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer & ETL Specialist",
    description: "Experienced Data Engineer with 5+ years at Bank Central Asia. Specializing in Apache Spark, Kafka, cloud platforms (GCP, Azure, AWS), and scalable ETL pipelines. View my portfolio showcasing real-world data engineering projects and expertise.",
    url: "https://idabaguspurwa.com",
    siteName: "Ida Bagus Purwa - Data Engineer Portfolio",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer Portfolio",
      },
    ],
    locale: "en_US",
    type: "profile",
    profile: {
      firstName: "Ida Bagus Gede Purwa Manik",
      lastName: "Adiputra",
      username: "idabaguspurwa",
      gender: "male"
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Ida Bagus Purwa - Data Engineer | ETL & Cloud Specialist",
    description: "5+ years experience building scalable data pipelines at Bank Central Asia. Expert in Apache Spark, Kafka, Python, and cloud platforms. Explore my data engineering portfolio.",
    images: ["/logo.jpg"],
    creator: "@idabaguspurwa",
    site: "@idabaguspurwa",
  },
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", type: "image/x-icon" },
      { url: "/favicon/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ida Bagus Portfolio",
  },
  formatDetection: {
    telephone: false,
  },
  category: "technology",
  classification: "portfolio",
  subject: "Data Engineering Portfolio",
  language: "en",
  geo: {
    region: "ID",
    country: "Indonesia",
    locality: "Tangerang",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon ICO for all browsers */}
        <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
        {/* PNG favicons for different sizes */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        {/* Apple touch icon for iOS devices */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        {/* Android Chrome icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon/android-chrome-512x512.png" />
        {/* Web app manifest */}
        <link rel="manifest" href="/favicon/site.webmanifest" />
        
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preload" href="/logo.jpg" as="image" type="image/jpeg" />
        
        {/* Prevent layout shift with critical CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body { font-family: system-ui, -apple-system, sans-serif; }
            .hero-section { min-height: 80vh; }
            .navbar { height: 64px; }
          `
        }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ida Bagus Gede Purwa Manik Adiputra",
              "alternateName": "Ida Bagus Purwa",
              "jobTitle": "Data Engineer & ETL Specialist",
              "description": "Data Engineer specializing in cloud platforms, Apache Spark, Kafka, and modern data pipelines",
              "url": "https://idabaguspurwa.com",
              "image": "https://idabaguspurwa.com/logo.jpg",
              "sameAs": [
                "https://github.com/idabaguspurwa",
                "https://linkedin.com/in/idabaguspurwa"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "PT Bank Central Asia Tbk"
              },
              "alumniOf": {
                "@type": "Organization",
                "name": "Bina Nusantara University"
              },
              "knowsAbout": [
                "Data Engineering",
                "ETL Pipelines",
                "Apache Spark",
                "Apache Kafka",
                "Cloud Platforms",
                "Python",
                "SQL",
                "Scala",
                "Business Intelligence"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Tangerang",
                "addressCountry": "ID"
              },
              "nationality": "Indonesian"
            })
          }}
        />
      </head>
      <body className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 ${inter.variable} ${poppins.variable}`}>
        <QueryProvider>
          <ThemeProvider>
            <WebGLProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
                <FloatingQuickNav />
              </div>
            </WebGLProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
