<template>
  <div class="fixed top-0 left-0 w-full h-full -z-10">
    <img src="@/assets/img/loginBG.jpg" class="object-cover w-full h-full">
  </div>
  <div class="z-10 flex items-center justify-center w-full h-screen">
    <div class="text-center">
      <img src="@/assets/img/cht_logo.png" class="m-auto mb-4 w-[200px] h-[244px]">
      <div class="w-[363px] rounded-lg p-8 bg-white mt-8">
        <p class=" text-[28px] font-bold text-[#0072B9] leading-7 font-['PingFang_TC']">無人載具智慧巡檢服務</p>
        <p class=" text-[15px] font-medium text-[#0072B9] leading-6 tracking-tighter">Unmanned Vehicle Smart Inspection Service</p>
        <GoogleLogin :callback="callback" class="mt-3" />
      </div>
      <!-- 語系切換 -->
      <div class="flex w-full">
        <el-dropdown
          v-if=" deviceType=== 'web'"
          class="justify-center w-full "
          trigger="click"
          @command="handleLangSwitch"
        >
          <el-button text>
            {{ langDisplay }}
            <el-icon class="px-2 icon-arrow-drop-down el-icon--right" size="8" />
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
        <button v-else class="w-full h-12 mt-2 border rounded bg-[#FFFFFF80] backdrop-blur-sm relative p-3 items-center" @click="openLangList=true">
          {{ langDisplay }}
          <i class="absolute m-2 text-xs right-2 icon-arrow-expand-more text-grey-60" />
        </button>
      </div>
    </div>
  </div>
  <!-- 手機版語系選單 -->
  <template v-if="openLangList===true">
    <div class="absolute top-0 bottom-0 left-0 right-0 z-30 rounded-lg bg-black/30 backdrop-blur-sm">
      <el-radio-group v-model="lang" class="absolute z-30 translate-x-1/2 translate-y-1/2 bg-white rounded-lg bottom-1/2 right-1/2 max-h-[86dvh] w-[84%] text-center overflow-y-auto divide-y divide-solid" @change="handleMobileLangSwitch">
        <div
          v-for="(item,index) in langList"
          :key="index"
          class="w-full py-6"
        >
          <el-radio
            :label="item.value"
            type="vertical"
          >
            {{ item.name }}
          </el-radio>
        </div>
      </el-radio-group>
    </div>
  </template>
</template>
<script setup lang="ts">
import { useUserStore } from '@/stores'
import { ref, onMounted, nextTick } from 'vue'
import { decodeCredential } from 'vue3-google-login'
import { ElMessageBox } from 'element-plus'
import { storageLocal } from '@/utils/storage'
import config from '@/config'
import { useToggleLang } from '@/layout/hooks/useToggleLang'
import { langList } from '@/utils/commonParams.js'
import { isMobile, isIpad } from '@/utils/device'
import type { LocaleKey } from '@locales'

type DeviceType = 'web' | 'mobile'
type LangItem = { value: string; name: string }
const LANG_KEY = 'APP_LANG'

const router = useRouter()
const userStore = useUserStore()

const deviceType = ref<DeviceType>()
const userInfo = ref<any>(null)

onMounted(() => {
  userStore.resetUserLogin('init')
  // getDeviceType()
  setDropdownBtn()
})

/** 判斷裝置型態 */
const getDeviceType = (): void => {
  if (isMobile()) {
    deviceType.value = isIpad() ? 'web' : 'mobile'
  } else {
    deviceType.value = 'web'
  }
  userStore.deviceType = deviceType.value ?? null
  userStore.SET_DEVICETYPE(deviceType.value ?? null)
  console.log('裝置型態:', deviceType.value)
}

/** Google callback */
const callback = (res: { credential: string }): void => {
  const { credential } = res
  userInfo.value = decodeCredential(credential)
  void login(credential)
}

getDeviceType()

const login = async(credential: string): Promise<void> => {
  const res: any = await userStore.login(credential)
    if (res.status === 'success') {
      // 是否為TL系統管理者
      let isSystem = res.responseData.userInfo.isSystem === 1
      if (deviceType.value === 'mobile') {
        if (isSystem) {
          // 如果登入時 沒有任何功能可以使用時 去dashboard (顯示公司群組選單)
          router.replace({ path: '/mobile/dashboard' })
        } else {
          // 如果登入時 沒有任務監看時，去巡檢記錄，如果都沒有則去dashboard (顯示公司群組選單)
          let hasTaskMonitorM = router.hasRoute('m-task-monitoring') // 任務監看
          let hasMissionRecoredsM = router.hasRoute('m-inspection-records') // 巡檢記錄
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
      ElMessageBox.alert(`${res.messageCode === 'FC003' ? t('systemNotification.licenseExpired') : res.message}`, t('systemNotification.loginFailed'), {
        type: 'error',
        center: true,
      })
      userStore.resetUserLogin('init')
    }
}

// 多國語系 i18n 相關
const openLangList = ref(false)
const lang = ref<string>(
  storageLocal.getItem<string>('APP_LANG') ?? (config.LANG as string)
)
const { t, toggleLang } = useToggleLang()
const langDisplay = ref<string>('')

const list = langList as LangItem[]

const setDropdownBtn = (): void => {
  nextTick(() => {
    if (lang.value) {
      const langObj = list.find(item => item.value === lang.value)
      langDisplay.value = langObj?.name ?? ''
    } else {
      langDisplay.value = list.find(item => item.value === (config.LANG as string))?.name ?? ''
      toggleLang(config.LANG as LocaleKey)
    }
  })
}

const handleLangSwitch = (obj: { item: LangItem }): void => {
  langDisplay.value = obj.item.name
  toggleLang(obj.item.value)
}

const handleMobileLangSwitch = (): void  => {
  // langDisplay.value = langList.find(item => lang.value === item.value).name
  // toggleLang(lang.value)
  // openLangList.value = false // 關閉選單

  const item = list.find(i => i.value === lang.value)
  if (item) {
    langDisplay.value = item.name
    toggleLang(item.value as LocaleKey)
  }
  openLangList.value = false // 關閉選單
}
</script>
