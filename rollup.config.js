import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize'
import uglify from 'rollup-plugin-uglify'
import typescript from 'rollup-plugin-typescript2'
import { minify } from 'uglify-es'

const isProduction = process.env.NODE_ENV === 'production'

const destBase = 'dist/boxmodel'
const destExtension = `${isProduction ? '.min' : ''}.js`

export default {
  name: 'boxmodel',
  input: 'src/index.ts',
  output: [

    { file: `${destBase}${destExtension}`, format: 'cjs' },
    { file: `${destBase}.umd${destExtension}`, format: 'umd' },
    { file: `${destBase}.amd${destExtension}`, format: 'amd' },
    { file: `${destBase}.browser${destExtension}`, format: 'iife' }
  ],
  plugins: [
    typescript(),
    babel({ babelrc: false, presets: [ 'es2015-rollup', 'stage-1' ] }),
    isProduction && uglify({}, minify),
    filesize()
  ].filter((plugin) => !!plugin)
}
