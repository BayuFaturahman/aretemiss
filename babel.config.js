module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  env: {
    production: {},
  },
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    ["@babel/plugin-proposal-optional-catch-binding"],
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@components': './app/components',
          '@config': './app/config',
          '@models': './app/models',
          '@navigators': './app/navigators',
          '@screens': './app/screens',
          '@services': './app/services',
          '@styles': './app/styles',
          '@theme': './app/theme',
          '@utils': './app/utils',
          '@assets': './assets',
        },
      },
    ],
  ],
}
