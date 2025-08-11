import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// i18n
// import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'


// 取代 __dirname 的做法
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const r = (p: string) => resolve(__dirname, p)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return{
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true,
        },
        dts: 'src/auto-imports.d.ts', // ✅ 開啟型別提示
      }),
      Components({
        dirs: ['src/components'],     // ✅ 自動引入你的元件
        deep: true,
        extensions: ['vue'],
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',   // ✅ 產生元件型別提示
      }),
      // VueI18nPlugin({
      //   // 只處理 /locales/lang 下的資源檔
      //   include: [resolve(__dirname, './locales/lang/**/*.{json,json5,yaml,yml}')]
      //   // 若未來移進 src，再改成 './src/locales/**'
      // }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'), // ✅ 正確解析 @ 到 src
        '@locales': resolve(__dirname, './locales'),
      },
    },
    build: {
      sourcemap: false,
      brotliSize: false,
      chunkSizeWarningLimit: 2500,
      rollupOptions: {
        output: {
          // 依套件名稱分包（node_modules 的第一層資料夾）
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.split('node_modules/')[1].split('/')[0]
            }
          },
          // 統一輸出檔名
          entryFileNames: 'static/js/[name]-[hash].js',
          chunkFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },

    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT) || 5173,
      open: true,
      proxy: {
        '/apis': {
          target: env.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: p => p.replace(/^\/apis/, ''),
        },
      },
    },

    preview: {
      host: '0.0.0.0',
      port: Number(env.VITE_APP_PORT) || 5173,
      cors: true,
      open: true,
      proxy: {
        '/apis': {
          target: env.VITE_APP_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: p => p.replace(/^\/apis/, ''),
        },
      },
    },
  }
  
})