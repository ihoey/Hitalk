/*
 * @Author: Ihoey
 * @Email: mail@ihoey.com
 * @Date: 2020-06-26 14:53:53
 * @LastEditors: Ihoey
 * @LastEditTime: 2022-03-31 16:48:50
 */
import babel from 'rollup-plugin-babel'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'
const isDev = process.env.NODE_ENV !== 'production'

const banner =
  '/*!\n' +
  ` * ${pkg.name} ${pkg.version}\n` +
  ` * (c)${new Date().getFullYear()} ${pkg.author}\n` +
  ` * Released under the ${pkg.license} License.\n */`

module.exports = {
  input: './src/Hitalk.js',
  // external: [...Object.keys(pkg.dependencies)],
  plugins: [
    resolve(),
    commonjs(),
    postcss(),
    json(),
    babel({
      // exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    terser()
  ],
  output: {
    banner: banner,
    file: './dist/Hitalk.min.js',
    format: 'umd',
    name: 'Hitalk',
    sourcemap: true,
    globals: {
      Hitalk: 'Hitalk',
      marked: 'marked',
      'blueimp-md5': 'md5'
    }
  }
}
