/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#409EFF',
        success: '#67C23A',
        danger: '#F56C6C',
        info: '#909399',
        warming: '#E6A23C',
        purple: '#2C00A8',
        grey: {
          10: '#F5F7FA',
          20: '#DDDDDD',
          30: '#E4E7ED',
          60: '#A8ABB2',
          70: '#AAAAAA',
          90: '#333333',
        },
      },
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        '.el-button': {
          'background-color': 'var(--el-button-bg-color,var(--el-color-white))', // 解決 tailwindCSS element-plus el-button衝突
        },

      })
    },
  ],
}

