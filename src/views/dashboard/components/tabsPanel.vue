<template>
  <div class="w-full h-full bg-white rounded">
    <div class="flex items-center justify-center w-full py-3 text-center border-b">
      <slot name="tabsTitle" />
    </div>
    <div class="relative w-full">
      <ul class="grid items-center justify-center grid-flow-col mx-auto border-b">
        <li v-for="item in categoryTabs" :key="item.id">
          <a
            href="#"
            class="flex items-center p-2 text-sm font-medium text-center w-fit"
            :class="activeTab===item.id?'border-b-[3px] border-b-primary':''"
            @click.prevent="handleClick(item.id)"
          >
            <i :class="item.icon" class="mr-2 text-lg" />
            {{ $t(item.label) }}
          </a>
        </li>
        <div class="absolute items-center right-6 top-1">
          <slot name="otherOptions" />
        </div>
      </ul>
      <div>
        <slot name="tabsContent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const emit = defineEmits(['activeTabId'])

interface TabItem {
  id: string
  label: string
  icon: string
}

const props = withDefaults(defineProps<{ tabsList?: TabItem[] }>(), {
  tabsList: () => [],
})


const categoryTabs = props.tabsList
const activeTab = ref(categoryTabs[0].id)
const handleClick = (id: string) => {
  activeTab.value = id
  emit('activeTabId', activeTab.value)
}
</script>
