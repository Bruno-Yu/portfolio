import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: ["./index.html", './public/index.html',"./src/**/*.{js,ts,jsx,tsx}", flowbite.content()]
  },
  // content: ["./index.html", './public/index.html',"./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin()],
};
