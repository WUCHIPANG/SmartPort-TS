import config from '@/config'

// 系統路由
const routes = [
  {
    name: 'layout',
    path: '/',
    component: () => import('../layout/index.vue'),
    redirect: config.DASHBOARD_URL || '/dashboard',
    children: [],
  },
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
    meta: {
      title: '登入',
      i18nTitle: 'systemNavMenu.login',
    },
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    hidden: true,
    component: () => import('@/layout/other/page_404.vue'),
  },
]

export default routes
