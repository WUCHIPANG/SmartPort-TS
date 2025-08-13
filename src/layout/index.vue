<template>
  <div>
    <main
      v-loading="isLoading"
      class="w-full"
      :class="[{'overflow-hidden': isLoading,'bg-[#F5F7FA]':isDashboard,'bg-white':!isDashboard,'overflow-y-auto':isDashboard}]"
    >
      <Header id="headerModel" class="bg-white" />
      <router-view
        :key="route.fullPath"
        @loading-mask="handlerLoading"
      />
    </main>
  </div>
</template>

<script setup>
// 使用 Store
import { useBaseMapStore, useAppStore } from '@/stores'
const baseMapStore = useBaseMapStore()
const appStore = useAppStore()

import Header from '@/layout/components/TheHeader.vue'

const router = useRouter()
const route = useRoute()

const goDashboard = () => {
  router.push({ name: 'dashboard', params: {}})
}
const goMapView = () => {
  router.push({ name: 'map-view', params: {}})
}
const bakeToLogin = () => {
  router.replace({ path: '/login' })
}
const isLoading = ref(false)
const handlerLoading = (val) => {
  isLoading.value = val
}

const isDashboard = ref(false)
watch(() => route.name, () => {
  if (route.name === 'dashboard') {
    isDashboard.value = true
  } else {
    isDashboard.value = false
  }
})
watch(() => appStore.loadingMask, () => {
  isLoading.value = appStore.loadingMask.status
})
onMounted(() => {
  const windowHeight = window.innerHeight
  const headerHeight = document.getElementById('headerModel').offsetHeight
  baseMapStore.mapHeight = windowHeight - headerHeight
  // 判斷是否在Dashboard 畫面
  isDashboard.value = route.name === 'dashboard'
})

</script>

