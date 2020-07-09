import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import camelCase from 'lodash.camelcase'
import typescript from 'rollup-plugin-typescript2'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import pkg from './package.json'
import {terser} from 'rollup-plugin-terser'

const libraryName = pkg.name
const filePath = 'dist/'+pkg.name+'.';

console.log(pkg.name)

export default {
  input: `src/index.ts`,
  output: [
    {
      file: pkg.main,
      name: camelCase(libraryName),
      format: 'umd',
      sourcemap: true
    },
    {
      file: filePath+'umd.min.js',
      format: 'umd',
      sourcemap: true,
      name: 'version',
      plugins: [terser()]
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    },
    {
      file: pkg.cjsmodule,
      format: `cjs`
    }

  ],
  watch: {
    include: 'src/**',
  },
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({
      useTsconfigDeclarationDir: true,
      clean: true,
      abortOnError: true,
      // Used to exclude the 'test folder' during the build process
      tsconfigOverride: {
        "exclude": ["test"]
      }
    }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // Resolve source maps to the original source
    sourceMaps(),
    babel({
      babelrc: false,
      exclude: 'node_modules/**'
    })
  ],
}
