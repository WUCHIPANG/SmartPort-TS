<template>
  <div ref="elBtn" class="bg_btn">
    <button
      class="px-2 py-1 mx-[2px] border border-red-800 rounded"
      :style="dynamicStyle"
      @mouseover="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <slot name="icon" />
      <slot name="label" />
    </button>
  </div>
</template>
<script setup>
import { ref, defineProps, onMounted } from 'vue'
const props = defineProps({
  color: {
    type: String,
    default: '',
  },

  isDisabled: {
    type: Boolean,
    default: false,
  },
})
const isHovered = ref(false)
const dynamicStyle = computed(() => ({
  background: isHovered.value ? props.color : '',
  border: 'none', // 移除預設邊框
  color: isHovered.value ? 'white' : props.color,
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
}))
const elBtn = ref(null)
</script>
<style>
.el-button{
  padding:8px 10px;
}
</style>


