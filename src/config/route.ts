// 靜態路由配置
// 書寫格式與動態路由格式一致，全部經由框架統一轉換
// 比較動態路由在meta中多加入了role角色權限，為數組類型。一個選單是否有權限顯示，取決於它以及後代選單是否有權限。
// routes 顯示在左側選單中的路由(顯示順序在動態路由之前)
// 示例如下

// const routes = [
//   {
//     name: "demo",
//     path: "/demo",
//     meta: {
//       icon: "el-icon-eleme-filled",
//       title: "演示",
//       role: ["SA"]
//     },
//     children: [{
//       name: "demopage",
//       path: "/demopage",
//       component: "test/autocode/index",
//       meta: {
//         icon: "el-icon-menu",
//         title: "演示頁面",
//         role: ["SA"]
//       }
//     }]
//   }
// ]

import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = []

export default routes
