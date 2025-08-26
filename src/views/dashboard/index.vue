<template>
  <div v-if="deviceType === 'web'" class="w-[1280px] m-auto py-2 custom-dashboard">
    <div class="flex justify-between">
      <template v-if="userRole===0">
        <!-- 天氣面版資訊 -->
        <WeatherPanel class="min-w-[360px] mr-2" />
        <!-- 載具狀態 -->
        <div class="min-w-[904px]">
          <TabsPanel :tabs-list="categoryTabs" @active-tab-id="activeUVTab">
            <template #tabsTitle>
              <span class="text-base font-semibold">{{ $t('dashboard.vehicleStatus.title') }}</span>
            </template>
            <template #tabsContent>
              <div
                v-for="item in uvStatusInfo"
                v-show="item.typeID===activeUVID"
                :id="item.typeID"
                :key="item.typeID"
                class="p-6"
              >
                <div class="grid grid-cols-5 gap-0">
                  <template v-for="statusStyle in uvStatusMap" :key="statusStyle.type">
                    <div :class="statusStyle.type!=='Total'? 'min-w-2/3 h-full':'w-full h-full border-2 rounded'">
                      <div class="flex items-center py-2" :class="statusStyle.type==='Total'?'justify-center':''">
                        <div v-if="statusStyle.type!=='Total'" class="w-3.5 h-3.5 rounded mr-2" :class="statusStyle.labelColor" />
                        <span class="text-sm font-normal">{{ statusStyle.label }}</span>
                      </div>
                      <div class="text-2xl font-medium text-center">{{ item.status[statusStyle.type] }}</div>
                    </div>
                  </template>
                </div>
                <div>
                  <!-- 條型圖 -->
                  <div class="flex justify-between w-full mt-3">
                    <template v-if="item.status['Total']!==0">
                      <template
                        v-for="(value,key) in item.status"
                        :key="key"
                      >
                        <div
                          v-if="String(key)!=='Total'&& value!==0"
                          class="h-8 border rounded felx"
                          :class="getBarColor(key)"
                          :style="{width: `${(value / item.status.Total) * 100}%`}"
                        />
                      </template>
                    </template>
                    <template v-else>
                      <div class="w-full h-8 bg-[#FBFBFB] rounded" />
                    </template>ㄋ
                  </div>
                </div>
              </div>
            </template>
          </TabsPanel>
        </div>
      </template>
      <template v-else>
        <!-- 客戶狀態 -->
        <div class="min-w-[964px] p-4 text-center bg-white rounded">
          <span class="text-base font-semibold">{{ $t('dashboard.customerStatus.title') }}</span>
          <div class="grid w-full grid-cols-4 gap-5 place-items-center">
            <template v-for="statusInfo in customerStatus" :key="statusInfo.status">
              <div class="flex-col w-full text-center text-white border divide-y rounded" :class="statusInfo.bgColor">
                <div class="flex items-center justify-center h-12 text-base font-medium rounded-t">
                  <span><i class="mr-2" :class="statusInfo.icon" />{{ $t('statusInfo.title') }}</span>
                </div>
                <div class="flex items-center justify-center h-20 text-center rounded-b" :class="statusInfo.bgColor">
                  <span class="text-3xl font-bold mr-0.5">{{ statusInfo.count }}</span>
                </div>
              </div>
            </template>
            <div class="w-[140px] h-[140px] rounded-full border divide-y flex-col">
              <div class="rounded-t-full h-1/2 bg-[#E5EAF5] text-xl font-medium flex justify-center items-center">
                {{ $t('dashboard.customerStatus.total') }}
              </div>
              <div class="flex items-center justify-center text-3xl font-medium rounded-b-full h-1/2">
                {{ customerTotoCount }}
              </div>
            </div>
          </div>
        </div>
        <!-- 支援載具 -->
        <div class="min-w-[300px] bg-white rounded p-4 text-center">
          <span class="text-base font-semibold">{{ $t('dashboard.supportedDevices.title') }}</span>
          <div class="mt-4">
            <div class="border bg-[#FBFCFC] py-3 items-center flex justify-center">
              <span class="mr-6 text-sm font-normal">{{ $t('dashboard.supportedDevices.totalBrand') }}</span>
              <span class="text-2xl font-medium">{{ supportUVInfo.TotalBrand }}</span>
            </div>
            <div class="border bg-[#FBFCFC] py-3 mt-3 items-center flex justify-center">
              <span class="mr-6 text-sm font-normal">{{ $t('dashboard.supportedDevices.totalModel') }}</span>
              <span class="text-2xl font-medium">{{ supportUVInfo.TotalModel }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="w-full my-2 bg-white rounded min-h-[20%]">
      <template v-if="userRole===0">
        <!-- 巡檢統計 -->
        <TabsPanel :tabs-list="categoryTabs" @active-tab-id="activeInfoTab">
          <template #tabsTitle>
            <span class="text-base font-semibold">{{ $t('dashboard.inspectionStatistics.title') }}</span>
          </template>
          <template #otherOptions>
            <el-select v-model="searchDateRange" @change="getInspectionInfo">
              <el-option
                v-for="item in dateRangeDDL"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              />
            </el-select>
          </template>
          <template #tabsContent>
            <div
              v-for="item in inspectionInfo"
              v-show="item.typeID===activeInfoID"
              :id="item.typeID"
              :key="item.typeID"
              class="px-6 py-4"
            >
              <div class="grid grid-cols-5 gap-5 ">
                <template v-for="cardStyle in infoCardStyle" :key="cardStyle.id">
                  <div class="flex-col text-center text-white border divide-y rounded" :class="cardStyle.color">
                    <div class="flex items-center justify-center h-12 text-base font-medium rounded-t">
                      <span><i class="mr-2" :class="cardStyle.icon" />{{ cardStyle.title }}</span>
                    </div>
                    <div class="flex items-center justify-center h-20 text-center rounded-b" :class="cardStyle.color">
                      <div class="flex items-end">
                        <span class="text-3xl font-bold mr-0.5">{{ item.info[cardStyle.id] }}</span>
                        <span class="text-sm">{{ cardStyle.suffixUnit }}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </TabsPanel>
      </template>
      <template v-else>
        <!-- 資源統計 -->
        <div class="w-full bg-white divide-y rounded">
          <div class="p-3 text-base font-semibold text-center">{{ $t('dashboard.resourceStatistics.title') }}</div>
          <div class="grid w-full grid-cols-5 p-5">
            <template v-for="resource in resourceInfo" :key="resource.mame">
              <div class="flex flex-col items-center">
                <div class="bg-[#F5F7FA] rounded-full w-[167px] h-[167px]">
                  <el-progress
                    type="circle"
                    :percentage="resource.useInfo.Percentage"
                    :color="getChartStyle(resource.name)?.color"
                    :width="167"
                    :stroke-width="12"
                  >
                    <template #default>
                      <div class="flex flex-col items-center justify-center">
                        <span class="p-1 mb-2 text-sm text-center text-white rounded w-fit" :class="`bg-[${getChartStyle(resource.name)?.color}]`">{{ getChartStyle(resource.name)?.label }}</span>
                        <span class="mb-2 text-2xl font-medium">{{ resource.useInfo.Usage }}</span>
                        <span class="text-sm">{{ getChartStyle(resource.name)?.suffixUnit }}</span>
                      </div>
                    </template>
                  </el-progress>
                </div>
                <div class="mt-5">
                  <span class="text-sm">{{ $t('dashboard.resourceStatistics.aboutTotal') }}</span>
                  <span class="p-1 mx-2 text-2xl font-medium bg-[#F2F9FF] rounded">{{ resource.useInfo.Allocate }}</span>
                  <span class="text-sm">{{ getChartStyle(resource.name)?.suffixUnit }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
    <!-- 系統訊息 -->
    <div class="w-full h-[350px] rounded bg-white divide-y">
      <div class="p-3 text-base font-semibold text-center h-[15%]">
        {{ $t('dashboard.systemMessage.title') }}
      </div>
      <div class="h-[85%] px-6 pt-4 overflow-y-auto">
        <template v-if="msgList.length>0">
          <div
            v-for="(msg,idx) in msgList"
            :key="idx"
            class="flex items-center justify-between px-5 py-3 mb-3 border rounded"
            :class="msg.CustomStyle"
          >
            <a
              v-if="msg.Url!==null"
              :href="msg.Url"
              :target="msg.Target"
              class="flex items-center justify-between w-full text-base font-medium"
            > {{ msg.Msg }}<i class="icon-arrow-forward" /></a>
            <span v-else class="items-center w-full text-base font-medium">{{ msg.Msg }}</span>
          </div>
        </template>
        <template v-else>
          <el-empty :description="$t('dashboard.systemMessage.noData')" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch, defineEmits } from 'vue'
import { storageLocal } from '@/utils/storage'
import { useUserStore } from '@/stores'
import api from '@/api'
import WeatherPanel from './components/weatherPanel.vue'
import TabsPanel from './components/tabsPanel.vue'
import { langList } from '@/utils/commonParams.js'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
// i18n
const { t, locale } = useI18n()

// Loading
const emit = defineEmits(['loadingMask'])

// 監聽 userInfo 並辨別當下角色，有異動就重新取資料渲染
const userStore = useUserStore()

type DeviceType = 'web' | 'mobile' | string
interface UserInfo { isSystem: number }

const deviceType = computed<DeviceType>(() => userStore.deviceType as DeviceType)
const userInfo = computed<UserInfo>(() => userStore.userInfo as UserInfo)
const userRole = ref<number>(userInfo.value.isSystem)
watch(userInfo, () => {
  userRole.value = userInfo.value.isSystem
  if (deviceType.value === 'web') {
    initDashBoard()
  }
})

// 初始化
const initDashBoard = () => {
  emit('loadingMask', true)
  apiFinishedArray.value.length = 0
  isLoading.value = true
  // 企業使用者
  if (userRole.value === 0) {
    getUVStatus()
    getInspectionInfo()
    getEmpSysMsg()
  } else {
    customerInfo()
    getAdminSysMsg()
    getSupportUV()
    getResourceInfo()
  }
}

// 控制 Loading 開關，監聽apiFinishedCount,等所有api都呼叫完成以後才關閉loading
const isLoading = ref<boolean>(false)
const apiFinishedArray = ref<string[]>([])
watch(apiFinishedArray.value, () => {
  // 不同角色Dashboard呼叫的api數量不同
  const closeCount = userInfo.value.isSystem === 1 ? 4 : 3
  if (apiFinishedArray.value.length === closeCount) {
    isLoading.value = false
    emit('loadingMask', isLoading.value)
  }
}, { deep: true })


// ---- 生命周期 ----
onMounted(() => {
  if (deviceType.value === 'web') {
    initDashBoard()
  }
})

// ----- 管理者 Board 資訊 -----
// 客戶狀態

type CustomerStatusKey = 'InUse' | 'Expire' | 'WillExpire' | 'Total'
type CustomerStatusRes = Record<CustomerStatusKey, number>

type CustomerCard = {
  status: string
  count: number
  title?: string
  icon?: string
  bgColor?: string
}

const customerStatus = ref<CustomerCard[]>([])
const customerTotoCount = ref<number>(0)
const customerInfo = async() => {
  try {
    customerStatus.value.length = 0
    const res: any = await api.dashboard.sys.customer.get()
    const entries = Object.entries(res) as [CustomerStatusKey, number][]

    let mapData = entries.map(([status, count]) => ({ status, count }))
    entries.forEach(([status, count]) => {
      if (status !== 'Total') {
        // 建立新物件（型別完整），再 push
        const card: CustomerCard = {
          status,
          count,
          title:
            status === 'InUse'
              ? 'dashboard.customerStatus.inUse'
              : status === 'Expire'
              ? 'dashboard.customerStatus.expired'
              : 'dashboard.customerStatus.willExpire',
          icon:
            status === 'InUse'
              ? 'icon-artist'
              : status === 'Expire'
              ? 'icon-user-forbid'
              : 'icon-user-warning',
          bgColor:
            status === 'InUse'
              ? 'bg-[#73A3D3]'
              : status === 'Expire'
              ? 'bg-[#CB8585]'
              : 'bg-[#D5AB84]',
        }
        customerStatus.value.push(card)
      } else {
        customerTotoCount.value = count
      }
    })

    apiFinishedArray.value.push('cust')
  } catch (err) {
    console.log(err)
  }
}
// 支援載具
const supportUVInfo = ref<Record<string, unknown>>({})
const getSupportUV = async() => {
  try {
    const res: any = await api.dashboard.sys.uv.get()
    supportUVInfo.value = res

    apiFinishedArray.value.push('uv')
  } catch (err) {
    console.log(err)
  }
}
// 資源統計
// 環型圖style mapping
const doughnutChartStyle = computed(() => ([
  { name: 'Storage', label: t('dashboard.resourceStatistics.storage'), color: '#8FA6CD', suffixUnit: 'TB' },
  { name: 'Gpu', label: t('dashboard.resourceStatistics.gpu'), color: '#8296C8', suffixUnit: t('unit.points') },
  { name: 'Account', label: t('dashboard.resourceStatistics.account'), color: '#8C8AC0', suffixUnit: t('unit.accounts') },
  { name: 'Group', label: t('dashboard.resourceStatistics.group'), color: '#A187B7', suffixUnit: t('unit.groups') },
  { name: 'Uv', label: t('dashboard.resourceStatistics.uv'), color: '#76ACCB', suffixUnit: t('unit.devices') },
]))

const getChartStyle = (key: string)  => {
  return doughnutChartStyle.value.find(i => i.name === key)
}
// 取得資產用統計用量
type ResourceUsage = { Usage: number; Allocate: number; Percentage?: number }
type ResourceRes = Record<string, ResourceUsage>
const resourceInfo = ref<Array<{ name: string; useInfo: ResourceUsage }>>([])

type SysResourceApi = {
  resource: { get: <T = unknown, Q = unknown>(params?: Q) => Promise<T> }
}

const getResourceInfo = async() => {
  try {
    const res: any = await api.dashboard.sys.resource.get()

    const entries = Object.entries(res) as [string, ResourceUsage][]
    const parseData = entries.map(([name, useInfo]) => ({ name, useInfo }))
    parseData.forEach(item => {
      item.useInfo.Percentage = (item.useInfo.Usage / item.useInfo.Allocate) * 100
    })
    resourceInfo.value = parseData

    apiFinishedArray.value.push('res')
  } catch (err) {
    console.log(err)
  }
}

// ----- 企業 Board 資訊 -----
const categoryTabs = ref<Array<{ id: string; label: string; icon: string }>>([
  { id: 'All', label: 'uvType.all', icon: 'icon-view-module' }, // 全部
  { id: 'Uav', label: 'uvType.uav', icon: 'icon-copter' }, // 無人機
  { id: 'Usv', label: 'uvType.usv', icon: 'icon-ship' }, // 無人船
  { id: 'Amr', label: 'uvType.amr', icon: 'icon-robot' }, // 機器人
  { id: 'Other', label: 'uvType.other', icon: 'icon-push-pin' }, // 其他
])

// ---- 載具狀態 ----
const uvStatusMap = computed(() => (
  [
    { type: 'Run', label: t('vehicleStatus.run'), labelColor: 'bg-[#5D9FE3]' },
    { type: 'StandBy', label: t('vehicleStatus.standby'), labelColor: 'bg-[#79BBFF]' },
    { type: 'Offline', label: t('vehicleStatus.offline'), labelColor: 'bg-[#A8ABB2]' },
    { type: 'Abnormal', label: t('vehicleStatus.abnormal'), labelColor: 'twill-style' },
    { type: 'Total', label: t('dashboard.vehicleStatus.total'), labelColor: '', textAlign: 'text-center' },
  ]
))

// 查詢載具狀態清單
const uvStatusInfo = ref<Array<{ typeID: string; status: any }>>([])
const getUVStatus = async() => {
  try {
    const res: any = await api.dashboard.emp.uv.get()
    // 轉換資料結構
    const entries = Object.entries(res)
    uvStatusInfo.value = entries.map(([typeID, status]) => ({ typeID, status }))

    apiFinishedArray.value.push('uv')
  } catch (err) {
    console.log(err)
  }
}
// 載具狀態作用中tab
const activeUVID = ref(categoryTabs.value[0].id)
const activeUVTab = (id: string) => {
  activeUVID.value = id
}
// 長條圖顏色
const getBarColor = (key: string | number): string => {
  return uvStatusMap.value.find(e => e.type === key)?.labelColor ?? ''
}

// ---- 巡檢統計 ----
// 查詢區間DDL
const searchDateRange = ref<number>(1)
const dateRangeDDL = ref<Array<{ value: number; label: string }>>([
  { value: 1, label: 'dashboard.inspectionStatistics.dateRangeDDL.thisMonth' }, // 本月
  { value: 2, label: 'dashboard.inspectionStatistics.dateRangeDDL.pastThreeMonth' }, // 近三月
  { value: 3, label: 'dashboard.inspectionStatistics.dateRangeDDL.thisYear' }, // 今年
  { value: 4, label: 'dashboard.inspectionStatistics.dateRangeDDL.pastYear' }, // 近一年
])
const infoCardStyle = computed(() => ([
  { id: 'TotalMission', title: t('dashboard.inspectionStatistics.totalMission'), icon: 'icon-map', color: 'bg-[#8FA6CD]', suffixUnit: t('unit.cases') },
  { id: 'TotalInspection', title: t('dashboard.inspectionStatistics.totalInspection'), icon: 'icon-flag-check', color: 'bg-[#8296C8]', suffixUnit: t('unit.inspection') },
  { id: 'Odometer', title: t('dashboard.inspectionStatistics.odometer'), icon: 'icon-share-location', color: 'bg-[#8C8AC0]', suffixUnit: t('unit.mileage') },
  { id: 'TotalTime', title: t('dashboard.inspectionStatistics.totalTime'), icon: 'icon-chronic', color: 'bg-[#A187B7]', suffixUnit: t('unit.hours') },
  { id: 'TotalEvent', title: t('dashboard.inspectionStatistics.totalEvent'), icon: 'icon-overview', color: 'bg-[#76ACCB]', suffixUnit: t('unit.events') },
]))

// 查詢區間
const setDateRange = (option: number): [string, string] => {
  let sDate = ''
  let eDate = ''
  switch (option) {
    case 1: // 本月
      sDate = dayjs().startOf('month').format('YYYY-MM-DD')
      eDate = dayjs().endOf('month').format('YYYY-MM-DD')
      break
    case 2: // 近三個月
      sDate = dayjs().subtract(3, 'months').format('YYYY-MM-DD')
      eDate = dayjs().format('YYYY-MM-DD')
      break
    case 3: // 今年
      sDate = dayjs().startOf('year').format('YYYY-MM-DD')
      eDate = dayjs().endOf('year').format('YYYY-MM-DD')
      break
    case 4: // 近一年
      sDate = dayjs().subtract(12, 'months').format('YYYY-MM-DD')
      eDate = dayjs().format('YYYY-MM-DD')
      break
  }
  return [sDate, eDate]
}
// 巡檢統計作用中tab
const activeInfoID = ref<string>(categoryTabs.value[0].id)
const activeInfoTab = (id: string) => {
  activeInfoID.value = id
}
// 取得巡檢統計資訊
const inspectionInfo = ref<Array<{ typeID: string; info: any }>>([])
const getInspectionInfo = async() => {
  try {
    let dateRange = setDateRange(searchDateRange.value)
    const payload = {
      StartDate: dateRange[0],
      ExpDate: dateRange[1],
    }
    const res: any = await api.dashboard.emp.insp.get(payload)
    // 轉換資料結構
    const entries = Object.entries(res)
    inspectionInfo.value = entries.map(([typeID, info]) => ({ typeID, info }))

    apiFinishedArray.value.push('insp')
  } catch (err) {
    console.log(err)
  }
}
// ---- 查詢系統訊息 ----
type SysMsgItem = {
  Level: string
  Msg: string
  Url?: string
  Target?: string
  CustomStyle?: string
  [k: string]: any
}
type SysMsgRes  = { Msg: SysMsgItem[] }
const msgList = ref<SysMsgItem[]>([])
// 企業
const getEmpSysMsg = async() => {
  try {
    const payload = {
      Language: apiLanguage.value,
    }
    const res: any = await api.dashboard.emp.msg.get(payload)

    msgList.value.length = 0
    if (res.Msg.length > 0) {
      res.Msg.forEach((item: { [x: string]: unknown; Level: string; CustomStyle?: string | undefined }) => {
        item.Level = item.Level.toLowerCase()
        item.CustomStyle = item.Level === 'critical' ? 'bg-[#FEF0F0] text-[#C45656] border-[#FAB6B6]' : item.Level === 'warning' ? 'bg-[#FFFBEF] text-[#F99A14] border-[#F3D19E]' : 'bg-[#F7FFEC] text-[#67C23A] border-[#B3E09C]'
        msgList.value.push(item)
      })
    }
    apiFinishedArray.value.push('msg')
  } catch (err) {
    console.log(err)
  }
}
// 系統管理者
const getAdminSysMsg = async() => {
  try {
    const payload = {
      Language: apiLanguage.value,
    }
    const res: any = await api.dashboard.sys.sysMsg.get(payload)

    msgList.value.length = 0
    if (res.Msg.length > 0) {
      res.Msg.forEach((item: { [x: string]: unknown; Level: string; CustomStyle?: string | undefined }) => {
        item.Level = item.Level.toLowerCase()
        item.CustomStyle = item.Level === 'critical' ? 'bg-[#FEF0F0] text-[#C45656] border-[#FAB6B6]' : item.Level === 'warning' ? 'bg-[#FFFBEF] text-[#F99A14] border-[#F3D19E]' : 'bg-[#F7FFEC] text-[#67C23A] border-[#B3E09C]'
        msgList.value.push(item)
      })
    }
    apiFinishedArray.value.push('msg')
  } catch (err) {
    console.log(err)
  }
}

// ---- API 語系相關 ----
const storageLocale = ref<string | null>(storageLocal.getItem('APP_LANG'))
const apiLanguage = ref<string>('')
// 從語系清單取得對應的api參數
const parseLangParam = () => {
  const match = (langList as Array<{ value: string | null; langSetting: string }>).find(item => item.value === storageLocale.value)
  const parseValue = match?.langSetting
  // 目前不支援簡中，所以語系是簡中時，帶zh-TW
  apiLanguage.value = parseValue !== undefined && parseValue !== 'zh-CN' ? parseValue : 'zh-TW'
}
parseLangParam()

// 當語系切換時，重新取得系統訊息
watch(locale, () => {
  storageLocale.value = locale.value
  parseLangParam()
  nextTick(() => {
    if (userRole.value === 0) {
      getEmpSysMsg()
    } else {
      getAdminSysMsg()
    }
  })
})
</script>
<style>
.custom-dashboard{
  height: calc(100dvh - 48px);
}
.twill-style{
  background-color: #FEF0F0;
  background-image: repeating-linear-gradient(-45deg,#FEF0F0, #FEF0F0 10%,#F87171 10%,#F87171 15%);
 }
 .el-empty{
  padding:unset;
 }
</style>
