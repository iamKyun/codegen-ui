/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // 让 Tailwind 检查 src 目录下的所有文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

