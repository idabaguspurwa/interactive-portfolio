/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Your refined friendly scheme
        primary: {
          light: '#4B7BEC',     // Cornflower Blue - approachable and friendly
          dark: '#50A6FF',      // Brighter blue for dark mode visibility
          DEFAULT: '#4B7BEC'
        },
        secondary: {
          light: '#6C757D',     // Slate Gray - maintained for neutrality
          dark: '#9AA5B1',      // Lighter, cooler gray for better visibility
          DEFAULT: '#6C757D'
        },
        accent: {
          light: '#FF6F61',     // Coral - lively and energetic
          dark: '#FF8A5C',      // Subdued orange for dark mode warmth
          DEFAULT: '#FF6F61'
        },
        
        // Background colors - Refined gradients
        background: {
          light: '#FFFFFF',     // Pure white base
          'light-secondary': '#F2F2F7',  // Subtle gradient end
          dark: '#2C2C2E',      // Radial gradient start
          'dark-secondary': '#1C1C1E',   // Radial gradient end
        },
        surface: {
          light: '#FFFFFF',     // Pure white for cards/surfaces
          dark: '#343A40',      // Elevated surface in dark mode
        },
        
        // Text colors - Refined readability
        text: {
          primary: {
            light: '#212529',   // Dark Gray for readability
            dark: '#E0E0E0',    // Soft off-white, less harsh
          },
          secondary: {
            light: '#6C757D',   // Slate Gray for secondary text
            dark: '#9AA5B1',    // Lighter, cooler gray
          },
          muted: {
            light: '#868E96',   // Muted gray for less important text
            dark: '#B0B8C1',    // Slightly brighter for dark mode
          }
        },
        
        // Border colors
        border: {
          light: '#E5E5EA',     // Subtle border for light mode
          dark: '#48484A',      // Medium border for dark mode
        },
        
        // shadcn/ui required colors
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        
        // Enhanced gray scale for refined design system
        gray: {
          50: '#F2F2F7',
          100: '#E5E5EA',
          200: '#D1D1D6',
          300: '#C7C7CC',
          400: '#AEAEB2',
          500: '#8E8E93',
          600: '#6D6D70',
          700: '#48484A',
          800: '#2C2C2E',
          900: '#1C1C1E',
        },
        
        // Additional semantic colors with playful accents
        success: {
          light: '#34C759', // iOS-style green
          dark: '#30D158',  // Bright green for dark mode
        },
        warning: {
          light: '#FF9F0A', // Warm orange
          dark: '#FFB340',  // Lighter orange for dark mode
        },
        error: {
          light: '#FF3B30', // iOS-style red
          dark: '#FF6961',  // Softer red for dark mode
        },
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink-caret': 'blink-caret .75s step-end infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'currentColor' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { transform: 'translateY(20px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
