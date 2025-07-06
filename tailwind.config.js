/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}', // Now scans the app directory
        './components/**/*.{js,ts,jsx,tsx,mdx}', // Kept for when you add a components folder
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}