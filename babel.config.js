module.exports = {
  env: {
    test: {
      presets: ['@babel/preset-env']
    },
    build: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            loose: true
          }
        ]
      ],
      plugins: [['@babel/plugin-transform-runtime']],
      ignore: ['node_modules/**']
    }
  }
}
