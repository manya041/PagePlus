/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
        },
        accent: {
          DEFAULT: '#0F172A',
          subtle: '#475569',
        },
        success: {
          DEFAULT: '#10B981',
          bg: '#ECFDF5',
          border: '#A7F3D0',
        },
        warning: {
          DEFAULT: '#F59E0B',
          bg: '#FFFBEB',
          border: '#FDE68A',
        },
        danger: {
          DEFAULT: '#EF4444',
          bg: '#FEF2F2',
          border: '#FCA5A5',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'input-focus': '0 0 0 4px rgba(37, 99, 235, 0.15)',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}
