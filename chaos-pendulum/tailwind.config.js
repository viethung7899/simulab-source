module.exports = {
  purge: {
    enabled: true,
    content: [
      './src/**/*.ts',
      './src/**/*.tsx',
      './src/**/*.html',
      './src/**/*.scss',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
