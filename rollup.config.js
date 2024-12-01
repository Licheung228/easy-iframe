import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import babel from '@rollup/plugin-babel'
import terser from '@rollup/plugin-terser'
import del from 'rollup-plugin-delete'

const extensions = ['.js', '.ts']
const input = 'src/index.ts'

// 共用插件配置
const commonPlugins = [
  // del({ targets: 'dist' }),
  typescript({
    useTsconfigDeclarationDir: true,
  }),
  resolve({ extensions }),
  commonjs(),
  json(),
]

// 生产环境判断
const isProd = process.env.NODE_ENV === 'production'
console.log(isProd)

// 压缩配置
const minifyPlugin = isProd
  ? terser({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    })
  : null

const configs = [
  // CommonJS
  {
    input,
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: !isProd,
    },
    plugins: [...commonPlugins, minifyPlugin].filter(Boolean),
  },
  // ESM
  {
    input,
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: !isProd,
    },
    plugins: [...commonPlugins, minifyPlugin].filter(Boolean),
  },
  // IIFE
  {
    input,
    output: {
      file: 'dist/index.min.js',
      format: 'iife',
      name: 'easyIframe',
      sourcemap: !isProd,
    },
    plugins: [
      ...commonPlugins,
      babel({
        exclude: 'node_modules/**',
        extensions,
        babelHelpers: 'bundled',
        presets: [
          [
            '@babel/preset-env',
            {
              targets: '> 0.25%, not dead',
            },
          ],
        ],
      }),
      minifyPlugin,
    ].filter(Boolean),
  },
]

export default configs
