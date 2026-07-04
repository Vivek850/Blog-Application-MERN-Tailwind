/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    sreen:{
       xs: "320px",   // extra small devices (mobiles)
      sm: "640px",   // small devices (default Tailwind)
      md: "768px",   // medium devices
      lg: "1024px",  // large devices
      xl: "1280px",  // extra large
      "2xl": "1536px" // very large
    },
    extend: {},
  },
  plugins: [typography],
}

