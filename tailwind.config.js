module.exports = {
  mode: 'jit',
  // content: [
  //   './src/renderer/**/*.{ts,tsx,js,jsx}',
  //   './src/**/*.{ts,tsx,js,jsx}',
  // ],
  purge: ['./src/renderer/**/*.{ts,tsx,js,jsx}', './src/**/*.{ts,tsx,js,jsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
