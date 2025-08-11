# SmartProt · Vue 3 + Vite + TypeScript

前端專案範本，整合 **Vue 3 / Vite / TypeScript**、**Element Plus**、**vue-i18n**（全域注入 + 自訂 helper）、自動匯入（unplugin-auto-import / unplugin-vue-components），含環境變數與 Proxy 設定。

> Node LTS 建議： 20

---

## ✨ Features

- ⚡️ Vite + Vue 3 + TypeScript
- 🧩 Element Plus（自動匯入元件與樣式）
- 🌍 vue-i18n v9（全域 `$t`，自訂 `t()/setLocale()`）
- 🧭 Path alias：`@ → src`、`@locales → /locales`
- 🔐 `utils/storage`（local/session 封裝、TTL、可選 AES）
- 🧰 可擴充的環境變數與 Proxy

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