import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  title: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer & ETL Specialist",
  description:
    "Portfolio of Ida Bagus Gede Purwa Manik Adiputra, a Data Engineer specializing in cloud platforms, Apache Spark, Kafka, and modern data pipelines. Expertise in ETL, cloud architecture, and business intelligence.",
  keywords:
    "data engineer, ETL specialist, cloud platforms, Apache Spark, Kafka, data pipelines, business intelligence, GCP, Azure, AWS",
  authors: [{ name: "Ida Bagus Gede Purwa Manik Adiputra" }],
  creator: "Ida Bagus Gede Purwa Manik Adiputra",
  metadataBase: new URL("https://idabaguspurwa.vercel.app"),
  openGraph: {
    title:
      "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer & ETL Specialist",
    description:
      "Transforming raw data into actionable insights through robust ETL pipelines, cloud-native architectures, and cutting-edge data engineering solutions.",
    url: "https://idabaguspurwa.vercel.app",
    siteName: "Ida Bagus Portfolio",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ida Bagus Gede Purwa Manik Adiputra - Data Engineer",
    description:
      "Data Engineer specializing in cloud platforms and modern ETL pipelines",
    images: ["/logo.jpg"],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ida Bagus Portfolio",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
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
            </div>
          </WebGLProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
