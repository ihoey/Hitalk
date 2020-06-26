const config = {
  input: 'src/Hitalk.js',
  banner: true,
  output: {
    dir: 'lib',
    format: ['cjs', 'es'],
    moduleName: 'Hitalk',
    sourceMap: false
  },
  babel: {
    minimal: true
  }
}

export default config
