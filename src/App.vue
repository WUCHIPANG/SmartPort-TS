<template>
  <div class="h-full">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, type RouteRecordName } from 'vue-router'

const route = useRoute()
const routeName = ref<RouteRecordName | null | undefined>(route.name)

watch(() => route.name,
  (name) => { routeName.value = name },
  { immediate: true } // 一開始就同步一次
)
</script>
<style scoped>

</style>
