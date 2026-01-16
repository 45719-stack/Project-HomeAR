/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          DEFAULT: '#0ea5e9',
        },
        secondary: {
          DEFAULT: '#64748b',
        },
        // Soft pastel palette extras
        pastelBlue: '#A7C7E7',
        pastelGreen: '#C1E1C1',
        pastelYellow: '#FDFD96',
        pastelPink: '#F4C2C2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
