# SmartProt · Vue 3 + Vite + TypeScript

前端專案範本，整合 **Vue 3 / Vite / TypeScript**、**Element Plus**、**vue-i18n**（全域注入 + 自訂 helper）、自動匯入（unplugin-auto-import / unplugin-vue-components），並提供環境變數與 Proxy 設定。可選用 **Tailwind CSS**。

> 建議 Node 版本：**20 LTS**

---

## ✨ Features

- ⚡️ Vite + Vue 3 + TypeScript  
- 🧩 Element Plus（自動匯入元件與樣式）  
- 🌍 vue-i18n v9（全域 `$t`，自訂 `t()/setLocale()`）  
- 🧭 Path alias：`@ → src`、`@locales → /locales`  
- 🔐 `utils/storage`：local/session 封裝、TTL、可選 AES  
- 🧰 可擴充的環境變數與 Proxy  
- 🎨 Tailwind CSS（可選；與 Vite 整合）

---

## 📦 安裝與啟動

```bash
# 安裝
npm i

# 本機開發
npm run dev

# 打包
npm run build

# 本機預覽打包結果
npm run preview
``` 


## 📁 專案結構（節錄）

```bash
.
├─ .vscode/                     # 編輯器設定（可選）
├─ locales/                     # ★ i18n 中心（放在專案根）
│  ├─ index.ts                  # createI18n + t()/setLocale() helper
│  └─ lang/
│     ├─ zh-TW.json
│     ├─ en-US.json
│     └─ zh-CN.json
├─ public/                      # 靜態資源（原樣拷貝）
├─ src/
│  ├─ assets/                   # 圖片/字型等
│  ├─ components/               # 共用元件
│  ├─ config/
│  │  └─ index.ts               # 環境設定（API_URL、LANG…）
│  ├─ router/                   # Vue Router
│  ├─ stores/                   # Pinia
│  ├─ types/                    # 全域型別宣告
│  ├─ utils/
│  │  ├─ crypto.ts              # BASE64 / AES（CryptoJS）
│  │  └─ storage.ts             # session/local 封裝 + TTL + AES
│  ├─ views/                    # 頁面
│  ├─ App.vue
│  ├─ main.ts
│  ├─ style.css                 # 全域樣式（含 Tailwind 指令）
│  ├─ auto-imports.d.ts         # unplugin-auto-import 產生
│  ├─ components.d.ts           # unplugin-vue-components 產生
│  └─ vite-env.d.ts             # Vite/環境變數型別
├─ .env                         # 預設環境變數（本機）
├─ .env.development             # 開發環境覆蓋
├─ .env.production              # 正式環境覆蓋
├─ .eslintrc-auto-import.json   # 自動匯入 ESLint 支援
├─ .gitignore
├─ index.html
├─ package.json
├─ package-lock.json
├─ postcss.config.js            # Tailwind + Autoprefixer
├─ tailwind.config.js           # Tailwind 設定（v3）
├─ tsconfig.base.json           # TS 路徑別名
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ vite.config.ts               # Vite 設定（alias/auto-import/components/proxy）
└─ README.md
``` 