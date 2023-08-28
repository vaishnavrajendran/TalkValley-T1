/** @type {import('tailwindcss').Config} */
export default {
  content: [    
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        custom: {
          primary: '#3A244A',
          secondary:'#D72638'
        }
      }
    },
  },
  plugins: [],
}

