/** @type {import('prettier').Config} */
const config = {
  plugins: ['prettier-plugin-tailwindcss'],

  tailwindFunctions: ['cn'],

  tailwindStylesheet: './app/globals.css',
};

export default config;
