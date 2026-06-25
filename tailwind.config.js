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
        andes: {
          forest: '#113220', // Verde bosque profundo
          slate: '#4A5568',  // Gris pizarra
          bone: '#FAF9F5',   // Blanco hueso xd
          gold: '#C5A059',   // Oro envejecido
          goldHover: '#B89047'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
