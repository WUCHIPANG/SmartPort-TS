<template>
  <el-menu
    ref="target"
    v-click-outside="onClickOutside"
    :default-active="activeIndex"
    class="h-12"
    mode="horizontal"
    :ellipsis="false"
    unique-opened="true"
    menu-trigger="click"
    background-color="transparent"
    @open="handleOpen"
  >
    <template v-for="(list, index) in menuList" :key="list.name">
      <template v-if="!list.meta.hidden">
        <!-- 子選單 不包含服務管理內容-->
        <el-sub-menu
          v-if="!list.path.includes('serviceManage') && list.meta.type ==='menu'"
          :index="index"
          :popper-class="list.meta.title === '特別任務' ? 'task-sub-menu' : ''"
        >
          <template #title>
            {{ list.meta.i18nTitle?$t(list.meta.i18nTitle):list.meta.title }}
          </template>
          <!-- 特別任務專用 -->
          <template v-if="list.meta.title === '特別任務'">
            <div class="flex justify-center w-full px-8 py-4 bg-white">
              <template v-for=" (sub, subIndex) in list.children " :key="subIndex">
                <el-menu-item :index="`${index}-${subIndex}`" style="height:192px;">
                  <el-card
                    v-if="sub.meta.hidden !== true"
                    :key="sub.name"
                    class="box-card w-[239px] h-[192px] cursor-pointer "
                    shadow="never"
                    :style="pageTitle === sub.meta.title ? 'box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);' : 'background:none;border:none;'"
                    @click="goSubPage(sub.name)"
                  >
                    <!-- 對應的圖片 -->
                    <img v-if="sub.name === 'special-mission-drone'" src="@/assets/img/drone_task.jpg" class="m-auto rounded">
                    <img v-if="sub.name === 'special-mission-usv'" src="@/assets/img/usv_task.jpg" class="m-auto rounded">
                    <img v-if="sub.name === 'special-mission-robot'" src="@/assets/img/amr_task.jpg" class="m-auto rounded">
                    <img v-if="sub.name === 'special-mission-iot'" src="@/assets/svg/iot_task.svg" class="m-auto">
                    <div class="px-3 h-[60px]  text-center flex flex-col justify-center items-center align-middle">
                      <span class=" text-base font-normal text-[#303133]">
                        {{ sub.meta.i18nTitle?$t(sub.meta.i18nTitle):sub.meta.title }}
                      </span>
                    </div>
                  </el-card>
                </el-menu-item>
              </template>
            </div>
          </template>
          <template v-else>
            <template v-for="(childrenList, subIndex) in list.children" :key="childrenList.name">
              <el-menu-item
                v-if="childrenList.meta.hidden!==true"
                :index="`${index}-${subIndex}`"
                @click="goSubPage(childrenList.name)"
              >
                {{ childrenList.meta.i18nTitle?$t(childrenList.meta.i18nTitle):childrenList.meta.title }}
              </el-menu-item>
            </template>
          </template>
        </el-sub-menu>
        <el-menu-item
          v-else-if="!list.path.includes('serviceManage')"
          :index="index"
          @click="goPage(list.name)"
        >
          {{ list.meta.i18nTitle?$t(list.meta.i18nTitle):list.meta.title }}
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>
<script setup>
import { ref } from 'vue'
import { storageSession } from '@/utils/storage'
import { usePermissionStore } from '@/stores'
import { onClickOutside } from '@vueuse/core'


const MENU_KEY = 'MENU'
const menuList = ref(storageSession.getItem(MENU_KEY))
const permissionStore = usePermissionStore()

const route = useRoute()
const router = useRouter()

const activeIndex = ref(0)

const pageTitle = ref()
pageTitle.value = route.meta.title
watch(() => route.name, () => {
  // 當路由名稱改變的時候，換title
  pageTitle.value = route.meta.title
})
// 監聽 store 中的menu，有異動的話就更新選單
watch(() => permissionStore.dynmicMenus, () => {
  menuList.value = storageSession.getItem(MENU_KEY)
})


const goPage = (page) => {
  router.push({ name: page, params: {}})
}
const goSubPage = (page) => {
  router.push({ name: page, params: {}})
}

const openIndex = ref()
const handleOpen = (key) => {
  openIndex.value = key
}
const target = ref()
// 點外面關閉選單
onClickOutside(target, () => {
  target.value.close(openIndex.value)
})

</script>
<style scoped>
/* 強制覆寫el-menu 背景色設為透明時，選單hover的background color被一併自動設定為透明的問題 */
 .el-menu--horizontal .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
    outline: 0;
    color: #409eff;
    background-color:#ecf5ff !important;
}
</style>
