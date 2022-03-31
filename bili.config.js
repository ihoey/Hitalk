const config = {
  input: 'src/Hitalk.js',
  banner: true,
  output: {
    dir: 'lib',
    format: ['cjs', 'es', 'umd', 'umd-min', 'iife'],
    moduleName: 'Hitalk',
    sourceMap: false,
    extractCSS: false
  },
  babel: {
    minimal: true
  }
}

export default config
