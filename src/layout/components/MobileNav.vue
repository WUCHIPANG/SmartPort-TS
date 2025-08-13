<template>
  <div class="py-6 px-14 nav-menu__pad">
    <div v-if="existMenu" class="fixed right-6"><i class="icon-close" @click="closeNavMenu" /></div>
    <!-- 語系切換 -->
    <div class="flex items-center justify-center w-full language-section" :class="existMenu?' h-[10%]':'h-[30%]'">
      <!-- <div v-if="existMenu">
        <el-dropdown
          class="justify-center w-full"
          trigger="click"
          @command="handleLangSwitch"
        >
          <el-button style="height:48px; width: 177px; font-size: 18px; border-radius: 56px;" type="primary">
            <i class="icon-language el-icon--left" />
            {{ langDisplay }}
            <el-icon class="icon-arrow-expand-more el-icon--right" style="margin-left: 14px;" size="12" />
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <template v-for="(item,index) in langList" :key="index">
                <el-dropdown-item :command="{item}">
                  {{ item.name }}
                </el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div> -->
      <!-- 如果沒有系統選單時顯示icon -->
      <div v-if="!existMenu">
        <div class="bg-[#ECF5FF] border rounded-md border-[#9FCEFF] p-5">
          <i class="text-6xl icon-badge text-[#337ECC]" />
        </div>
      </div>
    </div>
    <div v-if="existMenu" class="menu-section h-[45%]">
      <div class="relative flex items-center text-sm text-[#608FBF] before:flex-1 before:border-t before:border-[#608FBF] before:mr-3 after:flex-1 after:border-t after:border-[#608FBF] after:ml-3">
        {{ $t('changeCompanyGroup.inspectionService') }}
      </div>
      <div class="flex w-full items-center justify-around h-[80%] my-4">
        <el-menu
          :default-active="activeIndex"
          class="w-full custom-menu-style__pad"
          mode="vertical"
          background-color="transparent"
          :router="true"
          @open="handleOpen"
        >
          <template v-for="(list) in menuList" :key="list.name">
            <template v-if="!list.meta.hidden">
              <el-sub-menu
                v-if="list.meta.type ==='menu'"
                :index="list.path"
              >
                <template #title>
                  <el-icon
                    class="el-icon--right"
                    :class="list.meta.icon"
                    style="margin-right: 16px;"
                    size="28"
                  />
                  {{ list.meta.i18nTitle?$t(list.meta.i18nTitle):list.meta.title }}
                </template>
                <template v-for="(childrenList) in list.children" :key="childrenList.name">
                  <el-menu-item
                    v-if="childrenList.meta.hidden!==true"
                    :index="childrenList.path"
                    @click="closeNavMenu()"
                  >
                    {{ childrenList.meta.i18nTitle?$t(childrenList.meta.i18nTitle):childrenList.meta.title }}
                  </el-menu-item>
                </template>
              </el-sub-menu>
              <el-menu-item
                v-else-if="!list.path.includes('serviceManage')"
                :index="list.path"
                @click="closeNavMenu()"
              >
                <el-icon
                  class="el-icon--right"
                  :class="list.meta.icon"
                  style="margin-right: 16px;"
                  size="28"
                />
                {{ list.meta.i18nTitle?$t(list.meta.i18nTitle):list.meta.title }}
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="user-info-section " :class="existMenu?'h-[45%]':'h-[70%]'">
      <div class="relative flex items-center text-sm text-[#608FBF] before:flex-1 before:border-t before:border-[#608FBF] before:mr-3 after:flex-1 after:border-t after:border-[#608FBF] after:ml-3">
        {{ $t('changeCompanyGroup.loginUser') }}
      </div>
      <div class="flex flex-col h-[90%]" :class="existMenu?'justify-around':'mt-8 justify-between'">
        <div>
          <el-select
            v-model="userCompanyID"
            class="w-full my-1 role-select__pad"
            :placeholder="$t('select')"
            size="large"
            :hide-on-click="false"
            @change="updateChildrenValue"
          >
            <template #prefix><span class="text-sm text-white">{{ $t('changeCompanyGroup.company') }}</span></template>
            <el-option
              v-for="item in companyList"
              :key="item.companyID"
              :label="item.companyName"
              :value="item.companyID"
              class="my-1 company-options"
            >
              <div class="flex items-center h-full my-auto">
                <span class="float-left whitespace-pre-wrap w-[75%] leading-normal" :class="item.isExpire?'text-[#E0E0E0]':''">{{ item.companyName }}</span>
                <span v-if="item.isExpire" class="items-center px-1 ml-1 text-center text-white rounded float-rigsht bg-danger">{{ $t('changeCompanyGroup.licenseExpired') }}</span>
              </div>
            </el-option>
          </el-select>
          <el-select
            v-model="userGroupID"
            class="w-full my-1 role-select__pad"
            :placeholder="$t('select')"
            size="large"
            @change="changeRole"
          >
            <template #prefix><span class="text-sm text-white">{{ $t('changeCompanyGroup.group') }}</span></template>
            <el-option
              v-for="item in groupList"
              :key="item.groupID"
              :label="item.groupName"
              :value="item.groupID"
            />
          </el-select>
        </div>
        <div class="bg-[#ECF5FF] border rounded-md border-[#9FCEFF] p-4">
          <div class="flex items-center">
            <el-avatar
              shape="square"
              class="mr-3"
              :src="userAvater"
              referrerpolicy="no-referrer"
            />
            <div class="w-full text-lg font-medium leading-5 text-left">{{ userName }}</div>
          </div>
          <el-button
            class="mt-3"
            type="primary"
            color="#0069AA"
            style="width:100%; height: 52px; color: white; font-size:20px ; font-weight: 500;"
            @click="logout"
          >
            {{ $t('button.signOut') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, nextTick, computed } from 'vue'
import { googleLogout } from 'vue3-google-login'
import { useUserStore, usePermissionStore } from '@/stores'
import { storageLocal, storageSession } from '@/utils/storage'
import config from '@/config'
import { langList } from '@/utils/commonParams.js'
import { useToggleLang } from '@/layout/hooks/useToggleLang'
import { useI18n } from 'vue-i18n'
import { ElMessageBox } from 'element-plus'

const emit = defineEmits(['closeMenu'])
const router = useRouter()
const route = useRoute()

// 系統功能選單
const MENU_KEY = 'MENU'
const menuList = ref(storageSession.getItem(MENU_KEY))
const permissionStore = usePermissionStore()
const existMenu = ref(false)

// user 資訊
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const googleUserInfo = computed(() => userStore.googleUserInfo)
const userName = ref(googleUserInfo.value.userName)
const userAvater = ref(googleUserInfo.value.avaterImg)
// 多國語系 i18n
const { toggleLang } = useToggleLang()
const { t } = useI18n()

onMounted(() => {
  setDropdownBtn()
  setGroupList()
  // 判斷是否有除了dashboard以外的系統功能
  nextTick(() => {
    if (permissionStore.dynmicMenus.length === 1 && permissionStore.dynmicMenus[0].name === 'm-dashboard') {
      existMenu.value = false
    } else {
      existMenu.value = true
    }
  })
})
// ----- 多國語系 i18n 相關 -----
const lang = ref(storageLocal.getItem('APP_LANG'))
const langDisplay = ref('')
const setDropdownBtn = () => {
  if (lang.value !== '' && lang.value !== null && lang.value !== undefined) {
    nextTick(() => {
      let langObj = langList.find(item => lang.value === item.value)
      langDisplay.value = langObj.name
    })
  } else {
    nextTick(() => {
      langDisplay.value = langList.find(item => config.LANG === item.value).name
    })
    toggleLang(config.LANG)
  }
}

const handleLangSwitch = (obj) => {
  langDisplay.value = obj.item.name
  toggleLang(obj.item.value)
  nextTick(() => {
    refreshCompanyGroupList()
  })
}
// ----- 多國語系 i18n 相關 -----

// ---- 系統功能選單相關 ----
const pageTitle = ref()
pageTitle.value = route.meta.title
const activeIndex = computed(() => {
  return router.currentRoute.value.meta.breadcrumb[0].path
})

watch(() => route.name, () => {
  // 當路由名稱改變的時候，換title
  pageTitle.value = route.meta.title
})
// 監聽 store 中的menu，有異動的話就更新選單
watch(() => permissionStore.dynmicMenus, () => {
  menuList.value = storageSession.getItem(MENU_KEY)
  // 判斷是否有除了dashboard以外的系統功能
  nextTick(() => {
    if (permissionStore.dynmicMenus.length === 1 && permissionStore.dynmicMenus[0].name === 'm-dashboard') {
      existMenu.value = false
    } else {
      existMenu.value = true
    }
  })
})

const closeNavMenu = () => {
  emit('closeMenu', false)
}

const openIndex = ref()
const handleOpen = (key) => {
  openIndex.value = key
}
// ---- 系統功能選單相關 ----

// ----- 公司群組切換相關 -----
// 公司選單
const companyList = ref(userInfo.value.companyList)
const userCompanyID = ref(userInfo.value.roleCompany)
// 群組選單
const userGroupID = ref(userInfo.value.roleGroup)
const groupList = ref([])
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
// 監聽 userInfo 來刷新公司群組選單
watch(userInfo, () => {
  companyList.value = userInfo.value.companyList
  setGroupList()
})

const changeRole = () => {
  const payload = {
    companyID: userCompanyID.value,
    groupID: userGroupID.value,
    isMobile: true,
  }
  userStore.changeCompanyGroup(payload).then((res) => {
    if (res.status === 'success') {
      if (res.responseData.methodMenu.length === 0) {
        // 如果選單沒有任何功能可以使用時 去dashboard (顯示公司群組選單)
        router.replace({ path: '/mobile/dashboard' })
      } else {
        let hasTaskMonitorM = router.hasRoute('m-task-monitoring') // 任務監看
        let hasMissionRecoredsM = router.hasRoute('m-inspection-records') // 巡檢記錄

        nextTick(() => {// 如果選單沒有任務監看時，去巡檢記錄，如果都沒有則去dashboard (顯示公司群組選單)
          if (hasTaskMonitorM) {
          // 如果當下 route 與目的route 一樣的話，reload畫面
            if (route.fullPath === '/mobile/taskManage/taskMonitoring') {
              emit('closeMenu', false)
              window.location.reload()
            } else {
              router.replace({ path: '/mobile/taskManage/taskMonitoring' })
              emit('closeMenu', false)
            }
          } else if (hasMissionRecoredsM && hasTaskMonitorM === false) {
            if (route.fullPath === '/mobile/inspectionTasks/records') {
              emit('closeMenu', false)
              window.location.reload()
            } else {
              router.replace({ path: '/mobile/inspectionTasks/records' })
              emit('closeMenu', false)
            }
          } else {
            router.replace({ path: '/mobile/dashboard' })
          }
        })
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
    isMobile: true,
  }
  userStore.changeCompanyGroup(payload).then((res) => {
    if (res.status === 'success') {
      console.log('刷新成功')
    }
  })
}

const logout = () => {
  ElMessageBox.confirm(t('changeCompanyGroup.messages.confirmMessage'), {
    type: 'Confirm',
    center: true,
    cancelButtonText: t('button.cancel'),
    confirmButtonText: t('button.confirm'),
    confirmButtonClass: 'custom-btn',
    cancelButtonClass: 'custom-btn',
    customClass: 'custom-msg-style__pad',
    'show-close': false,
  }).then(() => {
    googleLogout()
    router.replace({ path: '/login' })
  }).catch(() => {
    // 取消
  })
}
// ----- 公司群組切換相關 -----
</script>

<style>
.nav-menu__pad{
  height:100dvh;
  width:100dvw;
}

.role-select__pad .select-trigger .el-input .el-input__wrapper {
  height: 56px;
  background-color: #409EFF;
}
.role-select__pad .select-trigger .el-input .el-input__wrapper .el-input__inner {
  color:white;
  font-size: 20px;
  font-weight: 500;
  text-align:center;
  margin: unset;
}

.custom-msg-style__pad .el-message-box__header {
  display: none;
}
.custom-msg-style__pad .el-message-box__content{
  font-size: 20px !important;
}
.custom-msg-style__pad .el-message-box__btns button{
  font-size: 20px;
  width: 40%;
}

.el-menu{
border: 0 !important;
}
.custom-menu-style__pad li{
  display: flex;
  justify-content: center;
  font-size: 28px;
  font-weight: 500;
  line-height: 40px;
}


</style>
