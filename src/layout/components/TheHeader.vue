<template>
  <!-- 當 條件是mobile 且 螢幕是橫向的時候 header隱藏 -->
  <div v-if="!(deviceType === 'mobile' && orientation === 'landscape')" class="w-full h-12 flex justify-center  border-b-[1px] border-[#E4E7ED]">
    <div class="w-[1280px] h-full flex justify-between items-center">
      <!-- Logo -->
      <i v-if="deviceType === 'mobile' && isDetailPage === true" class="ml-3 cursor-pointer icon-arrow-back" @click="mobileBack" />
      <div
        v-else
        class="flex cursor-pointer h-[34px] items-center "
        :class="deviceType === 'mobile'? ' ml-3':''"
        @click="goHome"
      >
        <img src="@/assets/svg/cht_logo.svg" class="pr-2">
        <div class="items-center text-center banner-text">
          <p class="font-extrabold text-[19px] leading-[20px]">無人載具智慧巡檢服務</p>
          <p class="text-[9px] leading-[10px]">Unmanned Vehicle Smart Inspection Service</p>
        </div>
      </div>
      <!-- Menu -->
      <Menu v-if="deviceType === 'web'" />
      <!-- User -->
      <div v-if="deviceType === 'web'" class="flex items-center justify-between web-user-menu">
        <el-avatar
          shape="square"
          size="small"
          class="mr-3"
          :src="userAvater"
          referrerpolicy="no-referrer"
        />

        <el-dropdown
          ref="operationDropdownMenuRef"
          trigger="click"
          :hide-on-click="false"
        >
          <div class="flex items-center mr-3">
            <div class="leading-9 text-center truncate w-28">{{ userName }}</div>
            <i class="text-xs icon-arrow-drop-down " style="line-height:50px;zoom:0.7;" />
          </div>
          <template #dropdown>
            <el-dropdown-menu class="w-[263px]">
              <div class="w-full px-3 mb-2">
                <div class="my-2 text-[#A8ABB2] text-xs">
                  <span>{{ $t('changeCompanyGroup.corporateManagement') }}</span>
                </div>
                <div class="relative">
                  <el-select
                    v-model="userCompanyID"
                    class="w-full my-1 roleSelect"
                    :placeholder="$t('select')"
                    size="large"
                    style="width:100%"
                    :hide-on-click="false"
                    @change="updateChildrenValue"
                  >
                    <template #prefix><span class="text-xs text-white">{{ $t('changeCompanyGroup.company') }}</span></template>
                    <el-option
                      v-for="item in companyList"
                      :key="item.companyID"
                      :label="item.companyName"
                      :value="item.companyID"
                      class="company-options "
                    >
                      <div class="flex items-center h-full my-auto">
                        <span class="float-left whitespace-pre-wrap w-[75%] leading-normal" :class="item.isExpire?'text-[#E0E0E0]':''">{{ item.companyName }}</span>
                        <span v-if="item.isExpire" class="items-center px-1 ml-1 text-center text-white rounded float-rigsht bg-danger">{{ $t('changeCompanyGroup.licenseExpired') }}</span>
                      </div>
                    </el-option>
                  </el-select>
                </div>
                <div class="relative">
                  <el-select
                    v-model="userGroupID"
                    class="w-full my-1 roleSelect"
                    :placeholder="$t('select')"
                    style="width:100%"
                    size="large"
                    @change="changeRole"
                  >
                    <template #prefix><span class="text-xs text-white">{{ $t('changeCompanyGroup.group') }}</span></template>
                    <el-option
                      v-for="item in groupList"
                      :key="item.groupID"
                      :label="item.groupName"
                      :value="item.groupID"
                    />
                  </el-select>
                </div>
                <div class="w-full logoutTip">
                  <el-divider style="margin: 10px 0;" />
                  <el-popconfirm
                    width="220"
                    :confirm-button-text="$t('button.confirm')"
                    :cancel-button-text="$t('button.cancel')"
                    icon-color="#626AEF"
                    :title="$t('changeCompanyGroup.messages.confirmMessage')"
                    hide-after
                    @confirm="logout"
                  >
                    <template #reference>
                      <el-button type="primary" color="#121212" style="width:100%; color: white">{{ $t('button.signOut') }}</el-button>
                    </template>
                  </el-popconfirm>
                </div>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- 語系切換 -->
        <!-- <el-dropdown class="mx-1" trigger="click" @command="handleLangSwitch">
          <div class="p-2 font-bold rounded hover:bg-grey-10">{{ langDisplay }}</div>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="(item,index) in langList" :key="index">
                <el-dropdown-item :command="{item}">
                  {{ item.name }}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
        <!-- 服務選單 -->
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            <i v-if="haveService" class="text-lg cursor-pointer icon-settings" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="(item, index) in serviceMenu" :key="index">
                <el-dropdown-item v-if="index !== 0" divided :command="item.path">
                  {{ item.meta.i18nTitle?$t(item.meta.i18nTitle):item.meta.title }}
                </el-dropdown-item>
                <el-dropdown-item v-else :command="item.path">
                  {{ item.meta.i18nTitle?$t(item.meta.i18nTitle):item.meta.title }}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 行動裝置 選單 -->
      <div v-if="deviceType === 'mobile'" class="mr-3">
        <div v-if="showMenuIcon===true" class="cursor-pointer">
          <i class="icon-menu" @click="openMobileNav=!openMobileNav" />
        </div>
        <MNavMenu class="fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out bg-white shadow-lg " :class="openMobileNav ? 'translate-x-0' : '-translate-x-full'" @close-menu="handleNavClose" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { googleLogout } from 'vue3-google-login'
import { useUserStore, usePermissionStore } from '@/stores'
import { storeToRefs } from 'pinia'
import Menu from '@/layout/components/NavMenu.vue'
import MNavMenu from '@/layout/components/MobileNav.vue'
import { langList } from '@/utils/commonParams.js'
import { ElMessageBox, ElNotification } from 'element-plus'
import { storageLocal, storageSession } from '@/utils/storage'
import { useToggleLang } from '@/layout/hooks/useToggleLang'
import { useI18n } from 'vue-i18n'

// 判斷有沒有 服務管理 顯示齒輪
const haveService = ref(false)
const serviceMenu = ref([])

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const googleUserInfo = computed(() => userStore.googleUserInfo)
const deviceType = computed(() => userStore.deviceType)
const permissionStore = usePermissionStore()
// 服務管理選單
const { settingMenu } = storeToRefs(permissionStore)
// 多國語系 i18n
const { toggleLang } = useToggleLang()
const { t } = useI18n()
// 公司選單
const companyList = ref(userInfo.value.companyList)
const userCompanyID = ref(userInfo.value.roleCompany)
// 群組選單
const userGroupID = ref(userInfo.value.roleGroup)
const groupList = ref([])
// 讓Dropdown 保持不關閉的狀態用的
const operationDropdownMenuRef = ref(null)

// user 名稱
const userName = ref(googleUserInfo.value.userName)
const userAvater = ref(googleUserInfo.value.avaterImg)

const menu = ref([])
const nextMenu = ref([])
const pmenu = ref([])

// ----- router 與系統選單相關 ----
onMounted(() => {
  setGroupList()
  // 有服務管理 就把選單放入
  if (settingMenu.value.length > 0) {
    haveService.value = true
    serviceMenu.value = settingMenu.value[0].children || []
  }
  if (!deviceType.value) {
    deviceType.value = storageLocal.getItem('DEVICE_TYPE')
  }
  menu.value = filterUrl(permissionStore.wholeMenus)
  showThis()
  setDropdownBtn() // i18n 語系切換
  // 資源用量告警
  if (router.currentRoute.value.fullPath === '/dashboard') {
    showUsageNotify()
  }
})

const showThis = () => {
  haveChildren.value = route.matched[1].meta.breadcrumb.length
  pmenu.value = route.meta.breadcrumb ? route.meta.breadcrumb[0] : {}
  nextMenu.value = filterUrl(pmenu.value.children)
}

const isDetailPage = ref(route.meta?.hidden)
const haveChildren = ref()
watch(() => route.name, () => {
  // 當路由名稱改變的時候，有無子選單
  haveChildren.value = route.matched[1].meta.breadcrumb.length
  // 手機版用來判斷是否要顯示 返回icon
  isDetailPage.value = route.meta?.hidden
})
watch(() => permissionStore.settingMenu, (newValue) => {
  haveService.value = newValue.length > 0
  // 更新 服務管理選單內容
  serviceMenu.value = newValue.length > 0 ? newValue[0].children || [] : []
})

const goHome = () => {
  router.push({ name: 'dashboard' })
}
const logout = () => {
  googleLogout()
  router.replace({ path: '/login' })
}

const handleCommand = (path) => {
  router.push({ path: path })
}
// 轉換外部鏈接的路由
function filterUrl(map) {
  let newMap = []
  map && map.forEach(item => {
    item.meta = item.meta ? item.meta : {}
    // 處理隱藏
    if (item.meta.hidden || item.meta.type === 'button') {
      return false
    }
    // 處理http
    if (item.meta.type === 'iframe') {
      item.path = `/i/${item.name}`
    }
    // 遞歸循環
    if (item.children && item.children.length > 0) {
      item.children = filterUrl(item.children)
    }
    newMap.push(item)
  })
  return newMap
}

// ----- 公司群組切換相關 -----
const setGroupList = () => {
  const selectedCompany = companyList.value.find(item => item.companyID === userCompanyID.value)
  if (selectedCompany && selectedCompany.groupList) {
    groupList.value = selectedCompany.groupList
  } else {
    groupList.value = []
    userGroupID.value = null
  }
}
const updateChildrenValue = () => {
  const expireStatus = companyList.value.find(item => item.companyID === userCompanyID.value).isExpire
  operationDropdownMenuRef.value.popperRef.onOpen() // 讓Dropdown 保持不關閉的狀態
  if (expireStatus) {
    userCompanyID.value = userInfo.value.roleCompany // 如果選擇的公司已過期，則將已選的userCompanyID 改回預設登入的companyid
  } else {
    setGroupList()
    if (userCompanyID.value === userInfo.value.roleCompany) {
      userGroupID.value = userInfo.value.roleGroup // 下拉選單選回當下公司時，顯示當下群組
    } else {
      userGroupID.value = null // 下拉選單選擇其他公司之後，群組選項顯示 請選擇
    }
  }
}
watch(userCompanyID, () => {
  updateChildrenValue()
})
// 監聽 userInfo 來刷新公司群組選單及顯示資源用量警示訊息
const sessionNotifyData = ref(storageSession.getItem('USAGE_NOTIFY'))
watch(userInfo, () => {
  companyList.value = userInfo.value.companyList
  setGroupList()

  // 當userInfo變更的時候，重新從 session裡面取 sessionNotifyData
  nextTick(() => {
    sessionNotifyData.value = storageSession.getItem('USAGE_NOTIFY')
    showUsageNotify()
  })
})

const changeRole = () => {
  const payload = {
    language: storageLocal.getItem('APP_LANG'),
    companyID: userCompanyID.value,
    groupID: userGroupID.value,
    isMobile: deviceType.value !== 'web',
  }
  userStore.changeCompanyGroup(payload).then((res) => {
    if (res.status === 'success') {
      if (deviceType.value === 'mobile') {
        if (res.responseData.methodMenu.length === 0) {
          // 如果選單沒有任何功能可以使用時 去dashboard (顯示公司群組選單)
          router.replace({ path: '/mobile/dashboard' })
        } else {
          let hasTaskMonitorM = router.hasRoute('m-task-monitoring') // 任務監看
          let hasMissionRecoredsM = router.hasRoute('m-inspection-records') // 巡檢記錄

          // 如果選單沒有任務監看時，去巡檢記錄，如果都沒有則去dashboard (顯示公司群組選單)
          if (hasTaskMonitorM) {
            router.replace({ path: '/mobile/taskManage/taskMonitoring' })
          } else if (hasMissionRecoredsM) {
            router.replace({ path: '/mobile/inspectionTasks/records' })
          } else {
            router.replace({ path: '/mobile/dashboard' })
          }
        }
      } else {
        router.replace({ path: '/dashboard' })
      }
    } else {
      ElMessageBox.alert(t('systemNotification.changeCompanyError'), t('systemNotification.systemError'), {
        type: 'error',
        center: true,
      })
    }
  })
}

const refreshCompanyGroupList = () => {
  const payload = {
    language: storageLocal.getItem('APP_LANG'),
    companyID: userCompanyID.value,
    groupID: userGroupID.value,
    isMobile: deviceType.value !== 'web',
  }
  userStore.changeCompanyGroup(payload).then((res) => {
    if (res.status === 'success') {
      console.log('刷新成功')
    }
  })
}
// ----- 多國語系 i18n 相關 -----
// 語系選單
const langDisplay = ref('繁')
const setDropdownBtn = () => {
  let lang = storageLocal.getItem('APP_LANG')
  let displayStr = langList.find(item => lang === item.value).abbreviation
  langDisplay.value = displayStr
}
// i18n語系切換
const handleLangSwitch = (obj) => {
  langDisplay.value = obj.item.abbreviation
  toggleLang(obj.item.value)
  refreshCompanyGroupList()
}
// ---- 多國語系 i18n 相關 ----
// ---- 資源用量警示相關 ---
const notifyPromise = ref(Promise.resolve()) // 解決Notify元件會重疊問題
const showUsageNotify = () => {
  const notifyArray = ref([])
  if (deviceType.value === 'web' && sessionNotifyData.value.isNotify) {
    if (sessionNotifyData.value.isCompanyExpireAlarm !== 0) {
      notifyArray.value.push({ type: 'warning', message: t('systemNotification.imminentExpireLicense') })
    }
    if (sessionNotifyData.value.isStorageOverAlarm !== 0) {
      notifyArray.value.push({ type: 'warning', message: sessionNotifyData.value.isStorageOverAlarm === 1 ? t('systemNotification.storageSpaceInsufficient') : t('systemNotification.storageSpaceAbnormal') })
    }
    if (sessionNotifyData.value.isGPUOverAlarm !== 0) {
      notifyArray.value.push({ type: 'warning', message: sessionNotifyData.value.isGPUOverAlarm === 1 ? t('systemNotification.gpuUsageInsufficient') : t('systemNotification.gpuUsageAbnormal') })
    }

    notifyArray.value.forEach((item) => {
      notifyPromise.value = notifyPromise.value.then(() => {
        ElNotification({
          type: item.type,
          message: item.message,
          offset: 60,
        })
      })
    })
  }
  sessionNotifyData.value.isNotify = false // 顯示一次後就關閉不再顯示
  storageSession.setItem('USAGE_NOTIFY', sessionNotifyData.value) // 更新session資訊
}
// ---- 資源用量警示相關 ---

// ---- 手機版 相關 ----
// 判斷Mobile 螢幕方向
const orientation = ref('')
// 偵測螢幕方向
const detectOrientation = () => {
  let currentOrientation = null

  if ('orientation' in screen && screen.orientation.type) {
    const type = screen.orientation.type
    if (type.includes('portrait')) {
      currentOrientation = 'portrait' // 直向
    } else if (type.includes('landscape')) {
      currentOrientation = 'landscape' // 橫向
    }
    // console.log('螢幕方向 (screen.orientation):', currentOrientation)
  } else {
    // console.warn('無法檢測螢幕方向')
    return null
  }

  orientation.value = currentOrientation
}

// 當螢幕方向改變時
const onOrientationChange = () => {
  detectOrientation()
  // console.log('螢幕方向改變:', orientation.value)
}

// 返回上頁
const RELOAD_TAG_KEY = 'RELOAD_FINISH'
const mobileBack = () => {
  // 如果有session中有儲存前次查詢條件時，加個tag 以防被刪除
  sessionStorage.setItem(RELOAD_TAG_KEY, false)
  router.back()
  // 強制刷新畫面防止行動裝置版本可能由快取載入頁面
  setTimeout(() => reloadFunc(), 100)
}
const reloadFunc = () => {
  window.location.reload()
  sessionStorage.setItem(RELOAD_TAG_KEY, true)
}

// 漢堡選單開關
const openMobileNav = ref(false)
const handleNavClose = (val) => {
  openMobileNav.value = val
}
// 判斷是否有除了dashboard以外的系統功能
const showMenuIcon = ref(false)
watch(() => permissionStore.dynmicMenus, () => {
  nextTick(() => {
    if (permissionStore.dynmicMenus.length === 1 && permissionStore.dynmicMenus[0].name === 'm-dashboard') {
    // 不顯示Menu icon
      showMenuIcon.value = false
      // 打開系統選單
      openMobileNav.value = true
    } else {
      showMenuIcon.value = true
    }
  })
})

// 初始化和卸載處理
onMounted(() => {
  // console.log('第一次監聽螢幕方向...')
  // 初次偵測
  detectOrientation()

  // 監聽螢幕方向變化
  if ('orientation' in screen) {
    screen.orientation.addEventListener('change', onOrientationChange)
  }

  //  判斷是否有除了dashboard以外的系統功能，來控制畫面 Menu 開關
  if (permissionStore.dynmicMenus.length === 1 && permissionStore.dynmicMenus[0].name === 'm-dashboard') {
    // 不顯示Menu icon
    showMenuIcon.value = false
    // 打開系統選單
    openMobileNav.value = true
  } else {
    showMenuIcon.value = true
  }
})

onUnmounted(() => {
  // console.log('移除監聽螢幕方向...')
  // 移除監聽
  if ('orientation' in screen) {
    screen.orientation.removeEventListener('change', onOrientationChange)
  }
})


</script>
<style scoped>
/* 取消 下拉選單 Hover 黑色邊框 */
.el-dropdown-link:focus-visible {
  outline: unset;
}
.el-select-dropdown__item.company-options{
  min-height: 38px;
  max-width: 320px;
  padding-right: 20px !important;
  align-items:center;
}


</style>
