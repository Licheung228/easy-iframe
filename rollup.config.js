import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import del from 'rollup-plugin-delete'

const extensions = ['.js', '.ts']

const isProd = process.env.NODE_ENV === 'production'

const plugins = [
  del({
    targets: 'dist',
    runOnce: true, // 只执行一次，防止多模块化规范打包，例如 cjs, mjs, min.js。如果为 false 会导致 cjs 和 mjs 在min.js 打包前删除
  }),
  typescript({
    useTsconfigDeclarationDir: true,
  }),
  resolve({ extensions }),
  commonjs(),
  json(),
  isProd &&
    terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
]
const input = 'index.ts'
export default [
  {
    input,
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: !isProd,
    },
    plugins,
  },
  {
    input,
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: !isProd,
    },
    plugins,
  },
]
