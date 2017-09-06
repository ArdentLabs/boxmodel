import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2'
import replace from 'rollup-plugin-replace'
import { minify } from 'uglify-es'

const env = process.env.NODE_ENV
const isProduction = env === 'production'

const destBase = 'dist/boxmodel'
const destExtension = `${isProduction ? '.min' : ''}.js`

export default {
  name: 'boxmodel',
  input: 'src/index.ts',
  output: [
    { file: `${destBase}${destExtension}`, format: 'cjs' },
    { file: `${destBase}.umd${destExtension}`, format: 'umd' },
    { file: `${destBase}.amd${destExtension}`, format: 'amd' },
    { file: `${destBase}.es5${destExtension}`, format: 'es' },
    { file: `${destBase}.iife${destExtension}`, format: 'iife' }
  ],
  plugins: [
    typescript(),
    resolve({
      jsnext: true,
      browser: true,
    }),
    commonjs({
      include: "node_modules/**",
      namedExports: {
        'node_modules/react/react.js': ['cloneElement'],
        'node_modules/pluralize/pluralize.js': ['plural'],
      },
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    isProduction && uglify({}, minify),
    filesize()
  ].filter((plugin) => !!plugin)
}
