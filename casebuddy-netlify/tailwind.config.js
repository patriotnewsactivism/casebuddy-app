/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#6ca3ff', dark: '#4F7CD6' } }
    }
  },
  plugins: []
}
