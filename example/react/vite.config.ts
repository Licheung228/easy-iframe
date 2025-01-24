import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import unocss from 'unocss/vite'
import path from 'node:path'
import process from 'node:process'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }]
          // ['@babel/plugin-proposal-class-properties', { loose: true }]
        ]
      }
    }),
    unocss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), '/src')
    }
  },
  server: {
    port: 8220,
    host: '127.0.0.1'
  }
})
