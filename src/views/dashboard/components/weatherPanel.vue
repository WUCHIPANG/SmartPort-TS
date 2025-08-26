<template>
  <div class="bg-white rounded weather-panel">
    <div class="grid items-center justify-center grid-cols-3 gap-0 p-2 text-center">
      <div />
      <div>
        <span class="text-base font-semibold">{{ t('weather.title',0) }}</span>
      </div>
      <div class="flex justify-end">
        <div class="flex flex-col text-center w-fit">
          <span class="text-[13px] font-normal text-[#606266]">{{ currentDate }}</span>
          <span class="bg-[#E3EAF1] py-0.5 px-1 rounded text-[13px] font-normal">{{ currentTime }}</span>
        </div>
      </div>
    </div>
    <div class="border-y-[0.5px] flex justify-center items-center p-2">
      <div class="items-center w-1/5 text-center">
        <i v-if="selTown!==''" class="text-3xl" :class="weatherIconSrc" />
        <sapn v-else> -- </sapn>
      </div>
      <div class="grid w-4/5 grid-cols-2 gap-1">
        <div>
          <el-popover
            placement="bottom"
            :width="200"
            :visible="cityListVisible"
            trigger="click"
            popper-class="popover-custom-style"
          >
            <template #reference>
              <button class="flex items-center justify-between w-full px-2 py-1 text-gray-600 border rounded min-h-14 hover:border-grey-60 focus:border-primary" @blur="cityListVisible=false" @click="cityListVisible = !cityListVisible">
                {{ selCity }}
                <i class="pl-2 text-xs icon-arrow-expand-more" />
              </button>
            </template>
            <div class="h-[250px] overflow-y-auto">
              <ul>
                <li
                  v-for="item in cityList"
                  :key="item.countyID"
                  :label="item.county"
                  :value="item.county"
                  class="py-1 text-base list-option hover:bg-[#ecf5ff]"
                  @click="setTownList(item.county)"
                >
                  {{ item.county }}
                </li>
              </ul>
            </div>
          </el-popover>
        </div>
        <div>
          <el-popover
            placement="bottom"
            :width="200"
            :visible="townListVisible"
            trigger="click"
            popper-class="popover-custom-style"
          >
            <template #reference>
              <button class="flex items-center justify-between w-full px-2 py-1 text-gray-600 border rounded min-h-14 hover:border-grey-60 focus:border-primary" @click="townListVisible = !townListVisible" @blur="townListVisible=false">
                {{ `${selTown!==''?selTown: t('select')}` }}
                <i class="pl-2 text-xs icon-arrow-expand-more" />
              </button>
            </template>
            <div class="h-[250px] overflow-y-auto">
              <ul>
                <li
                  v-for="(town,idx) in townList"
                  :key="idx"
                  :label="town"
                  :value="town"
                  class="py-1 text-base list-option hover:bg-[#ecf5ff]"
                  @click="getLocationWeather(town)"
                >
                  {{ town }}
                </li>
              </ul>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap w-full">
      <div class="w-1/2 h-[72px] p-2 border-b-[0.5px] border-r-[0.5px] border-[#E4E7ED]">
        <div class="flex flex-col items-center justify-center w-full h-full">
          <span>{{ $t('weather.rainfall') }}</span>
          <div class="flex items-end">
            <p class="text-xl"> {{ weatherData.rainfallRate && selTown!=='' ? weatherData.rainfallRate : '--' }} </p>
            <p class="ml-1">%</p>
          </div>
        </div>
      </div>
      <div class="w-1/2 h-[72px] p-2 border-b-[0.5px] border-[#E4E7ED]">
        <div class="flex flex-col items-center justify-center w-full h-full">
          <span>{{ $t('weather.temp') }}</span>
          <div class="flex items-end">
            <p class="text-xl"> {{ weatherData.temp && selTown!=='' ? weatherData.temp : '--' }}  </p>
            <p class="ml-1">°C</p>
          </div>
        </div>
      </div>
      <div class="w-1/2 h-[72px] p-2 border-r-[0.5px] border-[#E4E7ED]">
        <div class="flex flex-col items-center justify-center w-full h-full">
          <span>{{ $t('weather.windSpeed') }}</span>
          <div class="flex items-end">
            <p class="text-xl"> {{ weatherData.windSpeed && selTown!=='' ? weatherData.windSpeed : '--' }}  </p>
            <p class="ml-1">m/s</p>
          </div>
        </div>
      </div>
      <div class="w-1/2 h-[72px] p-2 ">
        <div class="flex flex-col items-center justify-center w-full h-full">
          <span>{{ $t('weather.windDire') }}</span>
          <div class="flex items-end">
            <p class="text-xl"> {{ weatherData.windDire && selTown!=='' ? weatherData.windDire : '--' }} </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { storageLocal } from '@/utils/storage'
import api from '@/api'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { langList, weatherIcon } from '@/utils/commonParams.js'
import { useI18n } from 'vue-i18n'

interface LangItem {
  value: string
  langSetting: string
}

interface County {
  countyID: string | number
  county: string
  town: string[]
}

interface WeatherResponse {
  weatherPicIndex?: number | string
  [key: string]: unknown
}

interface WeatherIcon {
  id: number | string
  icon: string
}

interface LocationMemory {
  city: string
  town: string
  lang: string
}
// ---- 日期時間 ----
dayjs.extend(customParseFormat) // 確保 Day.js 支援自訂格式
// 初始化日期
const currentDate = ref<string>(dayjs().format('YYYY/MM/DD'))
// 初始化時間
const currentTime = ref<string>(dayjs().format('A hh:mm'))
let timer: ReturnType<typeof setInterval> | undefined
// ---- 日期時間 ----

// ---- 語系相關 ----
const { locale, t } = useI18n()
const storageLocale = ref<string | null>(storageLocal.getItem('APP_LANG'))
const apiLanguage = ref<string>('')
// 從語系清單取得對應的api參數
const parseLangParam = () => {
  // let parseValue = langList.find(item => item.value === storageLocale.value).langSetting
  const match = (langList as LangItem[]).find(item => item.value === storageLocale.value)
  const parseValue = match?.langSetting
  // 目前不支援簡中，所以語系是簡中時，帶zh-TW
  apiLanguage.value = parseValue !== undefined && parseValue !== 'zh-CN' ? parseValue : 'zh-TW'
}
parseLangParam()

// 當語系切換時，重新取得天氣資訊
watch(locale as Ref<string>, () => {
  storageLocale.value = locale.value
  parseLangParam()
  // 清空 cityList 與 townList 以便重新初始化
  cityList.value = []
  townList.value = []

  // 語系切換後給預設值
  const d = defCityTownData.find(item => item.lang === storageLocale.value) ?? defCityTownData[0]
  selCity.value = d.city
  selTown.value = d.town

  getCountyAndTownList()
  nextTick(() => {
    getWeatherInfo()
  })
})
// ---- 語系相關 ----

// ---- 氣象資訊 ----
// 控制城市選單開關
const cityListVisible = ref<boolean>(false)
// 控制鄉市區選單開關
const townListVisible = ref<boolean>(false)
// 預設城市及鄉鎮 BY 語系
const defCityTownData: Array<{ lang: string; city: string; town: string }> = [
  { lang: 'zh', city: '臺北市', town: '大安區' },
  { lang: 'cn', city: '臺北市', town: '大安區' },
  { lang: 'en', city: 'Taipei City', town: 'Da’an Dist.' },
]
// 取得城市、鄉鎮區列表並初始化下拉選單
const areaList = ref<County[]>([])
const cityList = ref<Array<{ countyID: string | number; county: string }>>([])
const townList = ref<string[]>([])

const defLocale = storageLocale.value ?? 'zh'
const defItem = defCityTownData.find(item => item.lang === defLocale) ?? defCityTownData[0]

const selCity = ref<string>(defItem.city)
const selTown = ref<string>(defItem.town)

const getCountyAndTownList = async() => {
  try {
    const payload = {
      language: apiLanguage.value,
    }
    const res: any = await api.weather.getCountyAndTown.post(payload)
    areaList.value = res
    // 初始化 cityList 選單
    areaList.value.forEach(el => {
      cityList.value.push({ countyID: el.countyID, county: el.county })
    })
    // 初始化 townList 選單內容
    if (townList.value.length === 0) {
      setTownList(selCity.value, 'init')
    }
  } catch (error) {
    console.log(error)
  }
}
// 設定TownList by city
const setTownList = (city: string, type: '' | 'init' = '') => {
  selCity.value = city
  if (type === '') {
    selTown.value = ''
  }
  const county = areaList.value.find(item => item.county === selCity.value)
  townList.value = county ? county.town : []
  cityListVisible.value = false
}

const getLocationWeather = (town: string) => {
  selTown.value = town
  townListVisible.value = false // 關閉下拉選單
  getWeatherInfo() // 查詢指定地點天氣
  setLocationInfo() // 將user此次選擇的地點記憶下來
}

// 取得天氣資訊
const weatherData = ref<WeatherResponse>({})
const getWeatherInfo = async() => {
  try {
    const payload = {
      county: selCity.value,
      town: selTown.value,
      language: apiLanguage.value,
    }
    const res: any = await api.weather.bytowns.post(payload)
    weatherData.value = res
  } catch (error) {
    console.log(error)
  }
}
// 根據weatherPicIndex取對應的天氣ICON
const weatherIconSrc = ref<string>('')
watch(() => weatherData.value, () => {
  const weatherIconId = weatherData.value.weatherPicIndex
  const weatherIconObj = (weatherIcon as WeatherIcon[]).find(i => String(i.id) === String(weatherIconId))
  weatherIconSrc.value = weatherIconObj ? weatherIconObj.icon : ''
}, { deep: true })

// 記憶使用者選擇的地區資訊
const LOCATION_KEY = 'WEATHER_LOCATION'
const memoryLocation = ref<LocationMemory | null>(storageLocal.getItem(LOCATION_KEY))
const setLocationInfo = () => {
  memoryLocation.value = {
    city: selCity.value,
    town: selTown.value,
    lang: apiLanguage.value,
  }
  storageLocal.setItem(LOCATION_KEY, memoryLocation.value)
}
// ---- 氣象資訊 ----
// ---- 生命周期 ----
onMounted(() => {
  // 日期時間顯示
  timer = setInterval(() => {
    currentTime.value = dayjs().format('A hh:mm') // 12 小時制 + AM/PM
    currentDate.value = dayjs().format('YYYY/MM/DD')
  }, 1000)

  // 取得城市、鄉鎮區列表並初始化下拉選單
  getCountyAndTownList()

  // 如果有記憶上次使用者選取的地區則帶入 (如果語系與記憶下來的不同則取預設的地點天氣)
  if (memoryLocation.value !== null) {
    if (apiLanguage.value === memoryLocation.value.lang) {
      selCity.value = memoryLocation.value.city
      selTown.value = memoryLocation.value.town
      apiLanguage.value = memoryLocation.value.lang
    }
  }

  // 用預設值取天氣資訊
  getWeatherInfo()
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style>

</style>
