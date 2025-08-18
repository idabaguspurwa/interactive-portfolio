import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer, FloatingQuickNav } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { WebGLProvider } from "@/components/WebGLManager";

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
  title: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer & ETL Specialist | Portfolio",
  description:
    "Portfolio of Ida Bagus Gede Purwa Manik Adiputra, a Data Engineer specializing in cloud platforms, Apache Spark, Kafka, and modern data pipelines. Expertise in ETL, cloud architecture, and business intelligence. View projects, skills, and experience.",
  keywords:
    "Ida Bagus Gede Purwa Manik Adiputra, Ida Bagus Purwa, data engineer, ETL specialist, cloud platforms, Apache Spark, Apache Kafka, data pipelines, business intelligence, GCP, Azure, AWS, Python, SQL, Scala, PySpark, data engineering, portfolio, Indonesia, Bina Nusantara University, Bank Central Asia",
  authors: [{ name: "Ida Bagus Gede Purwa Manik Adiputra" }],
  creator: "Ida Bagus Gede Purwa Manik Adiputra",
  publisher: "Ida Bagus Gede Purwa Manik Adiputra",
  metadataBase: new URL("https://idabaguspurwa.com"),
  alternates: {
    canonical: "https://idabaguspurwa.com",
  },
  openGraph: {
    title: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer & ETL Specialist",
    description: "Transforming raw data into actionable insights through robust ETL pipelines, cloud-native architectures, and cutting-edge data engineering solutions. View my portfolio, projects, and expertise.",
    url: "https://idabaguspurwa.com",
    siteName: "Ida Bagus Purwa Portfolio",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer Portfolio",
    description: "Data Engineer specializing in cloud platforms, Apache Spark, and modern ETL pipelines. View my portfolio and projects.",
    images: ["/logo.jpg"],
    creator: "@idabaguspurwa",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon.ico?v=2", type: "image/x-icon" },
      { url: "/favicon-16x16.png?v=2", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png?v=2", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml", sizes: "180x180" },
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
        {/* Modern SVG favicon for all modern browsers */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        {/* Fallback ICO for older browsers */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        {/* PNG fallbacks for different sizes */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        {/* Apple touch icon for iOS devices */}
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg?v=2" />
        {/* Android Chrome icons */}
        <link rel="icon" type="image/svg+xml" sizes="192x192" href="/favicon.svg?v=2" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/favicon.svg?v=2" />
        {/* Web app manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
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
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
      </body>
    </html>
  );
}
