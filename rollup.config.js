import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import { uglify } from 'rollup-plugin-uglify'

const extensions = ['.js', '.ts']

export default [
  // CommonJS
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs'
    },
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true
      }),
      resolve({ extensions }),
      uglify(),
      commonjs(),
      json()
    ]
  },
  // ESM
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es'
    },
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true
      }),
      resolve({ extensions }),
      commonjs(),
      json(),
      uglify()
    ]
  },
  // Browser-compatible
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.iffe.js',
      format: 'iife',
      name: 'easyIframe'
    },
    plugins: [
      typescript({
        useTsconfigDeclarationDir: true
      }),
      resolve({ extensions }),
      commonjs(),
      json(),
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'bundled',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: '> 0.25%, not dead'
            }
          ]
        ]
      }),
      uglify()
    ]
  }
]
