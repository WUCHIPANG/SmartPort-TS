<template>
  <div class="flex flex-col items-center">
    <!-- title -->
    <div class="w-full h-[56px] header-border flex justify-center items-center ">
      <div class="w-[1280px] relative text-center">
        <!-- <BackList class="absolute left-2" /> -->
        <PageTitle>
          {{ route.matched[1].meta.i18nTitle?$t(route.matched[1].meta.i18nTitle): route.matched[1].meta.title }} {{ $t('list') }}
        </PageTitle>
        <el-button
          type="primary"
          class="absolute transform right-2 yCenter"
          style="height:40px;"
          @click="addTask"
        >
          {{ $t('button.addTask') }}
        </el-button>
      </div>
    </div>
    <!-- 搜尋 表格 -->
    <div class="w-[1280px] p-2 mb-16">
      <!-- 搜尋 -->
      <div class="h-[100px] w-full flex justify-start items-center space-x-6">
        <div>
          <div>
            <span> {{ $t('imageTask.missionTime') }}</span>
          </div>
          <el-date-picker
            v-model="searchDate"
            type="daterange"
            class="mt-2"
            style="width:330px; height:48px;"
            @change="setDateRangeAndQuery"
          />
        </div>
        <div>
          <div>
            <span>{{ $t('imageTask.taskStatus') }}</span>
          </div>
          <el-select
            v-model="missionStatus"
            class="mt-2 custom-select-h"
            style="width:250px;"
            :placeholder="$t('imageTask.placeholder.taskStatus')"
            clearable
            @change="getImageAnalysisList"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </div>
        <div>
          <div>
            <span>{{ $t('imageTask.missionType') }}</span>
          </div>
          <el-select
            v-model="missionType"
            class="mt-2 custom-select-h"
            style="width:250px;"
            :placeholder="$t('imageTask.placeholder.missionType')"
            clearable
            @change="getImageAnalysisList"
          >
            <el-option
              v-for="item in missionAnalysisList"
              :key="item.authCode"
              :label="item.authName"
              :value="item.authCode"
            />
          </el-select>
        </div>
        <div>
          <div>
            <span>{{ $t('imageTask.imageResource') }}</span>
          </div>
          <el-select
            v-model="missionSource"
            class="mt-2 custom-select-h"
            style="width:250px;"
            :placeholder="$t('imageTask.placeholder.imageResource')"
            clearable
            @change="getImageAnalysisList"
          >
            <el-option
              v-for="item in sourceOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <!-- 表格 -->
      <div>
        <el-table
          :data="analysisList"
          border
          stripe
          style="width: 100%"
          :header-row-style="{ height: '50px' }"
          :header-cell-style="{ backgroundColor: '#F5F7FA' }"
          :row-style="{ height: '50px' }"
        >
          <el-table-column
            prop="TaskDateTime"
            :label="$t('imageTask.missionTime')"
            align="center"
            width="180"
          />
          <el-table-column prop="TaskName" :label="$t('imageTask.missionName')" />
          <el-table-column
            prop="TaskType"
            :label="$t('imageTask.missionType')"
            width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseTaskType(scope.row.TaskType) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="Progress"
            :label="$t('imageTask.progress')"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-progress :text-inside="true" :stroke-width="26" :percentage="scope.row.Progress" />
            </template>
          </el-table-column>
          <el-table-column
            prop="SourceType"
            :label="$t('imageTask.imageResource')"
            width="120"
            align="center"
          >
            <template #default="scope">
              {{ getSourceType(scope.row.SourceType) }}
              <!-- {{ scope.row.SourceType }} -->
            </template>
          </el-table-column>
          <el-table-column
            prop="Status"
            :label="$t('imageTask.taskStatus')"
            width="130"
            align="center"
          >
            <template #default="scope">
              <el-tag
                :color="getImplementStatus(scope.row.Status).color"
                disable-transitions
                size="large"
                round
                effect="light"
                :style="{
                  color: scope.row.Status === 'WAITING'
                    ? '#606266'
                    : (scope.row.Status === 'RUNNING'
                      ? '#A8ABB2' // 當 Status 為 'RUNNING' 時的顏色
                      : (scope.row.Status !== 'CANCEL' ? 'white' : '#AAAAAA')),
                  border: 'none'
                }"
                class="border-none"
              >
                <div class="text-sm">
                  <!-- <i :class="getImplementStatus(scope.row.Status).icon" class="inline-block align-middle " /> -->
                  {{ getImplementStatus(scope.row.Status).label }}
                </div>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="manage"
            :label="$t('management')"
            width="270"
            align="center"
          >
            <template #default="scope">
              <div v-if="scope.row.Status === 'WAITING' || scope.row.Status === 'FAILED'" class="flex">
                <Button :color="'#514EE0'" @click="editTask(scope.row.TaskID)">
                  <template #icon><i class="mr-1 icon-edit" /></template>
                  <template #label>{{ $t('button.edit') }}</template>
                </Button>
                <Button :color="'#F56C6C'" @click="cancelTip(scope.row.TaskID, scope.row.Timestamp)">
                  <template #icon><i class="mr-1 icon-delete-forever" /></template>
                  <template #label>{{ $t('button.delete') }}</template>
                </Button>
                <Button :color="'#2C00A8'" @click="implementTask(scope.row.TaskID)">
                  <template #icon><i class="mr-1 icon-check" /></template>
                  <template #label>{{ $t('button.execute') }}</template>
                </Button>
              </div>
              <div v-else class="flex">
                <Button :color="'#409EFF'" @click="viewTask(scope.row.TaskID)">
                  <template #icon><i class="mr-1 icon-visibility" /></template>
                  <template #label>{{ $t('button.view') }}</template>
                </Button>
                <Button
                  :color="scope.row.Status === 'COMPLETED' || scope.row.Status === 'CANCEL' ? '#F56C6C' : '#A8ABB2'"
                  @click="cancelTip(scope.row.TaskID, scope.row.Timestamp)"
                >
                  <template #icon>
                    <i
                      :class="scope.row.Status === 'COMPLETED' || scope.row.Status === 'CANCEL'
                        ? 'mr-1 icon-delete-forever'
                        : 'mr-1 icon-tab-close-right'"
                    />
                  </template>
                  <template #label>
                    {{ scope.row.Status === 'COMPLETED' || scope.row.Status === 'CANCEL' ? $t('button.delete') : $t('button.cancel') }}
                  </template>
                </Button>
                <Button v-if="scope.row.Status === 'COMPLETED'" :color="'#67C23A'" @click="resultTask(scope.row.TaskID)">
                  <template #icon><i class="mr-1 icon-how-to-reg" /></template>
                  <template #label>{{ $t('button.result') }}</template>
                </Button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分頁 -->
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        background
        small
        layout="prev, pager, next"
        :total="total"
        class="justify-center mt-5"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import api from '@/api'
import dayjs from 'dayjs'
import { ElMessageBox, ElMessage } from 'element-plus'
import Button from '@/components/BaseListButton.vue'

// 共用顏色/
import useStatusColor from '@/utils/useStatusColor'
import { useSearchDataStore } from '@/stores'
import { imageStatus, imageSource } from '@/utils/commonParams.js'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
const searchData = useSearchDataStore()
const { implementStatus, sourceType } = useStatusColor()
const router = useRouter()
const route = useRoute()

const sourceOptions = ref(imageSource())
const statusOptions = ref(imageStatus())

// 監聽i18n 語系切換
watch(locale, () => {
  sourceOptions.value = imageSource()
  statusOptions.value = imageStatus()
})

// 狀態Tag
const getImplementStatus = (status: string) => {
  const implement = implementStatus().find(item => item.id === status)
  return {
    color: implement?.color,
    icon: implement?.icon,
    label: implement?.label,
  }
}
// 影像來源
const getSourceType = (type: string) => {
  const source = sourceType(type)
  return source
}
// 任務類型
const parseTaskType = (type: undefined) => {
  let typeRes = type !== undefined && missionAnalysisList.value !== undefined ? missionAnalysisList.value.find((item: { authCode: any }) => item.authCode === type) : ''
  return typeRes !== undefined && typeRes !== '' ? typeRes.authName : ''
}

const addTask = () => {
  // console.log('新增影像')
  router.push({ name: 'imaging-task-add', params: {}})
}
const editTask = (TaskID: string) => {
  // console.log('編輯影像')
  storeSearchData()
  router.push({ name: 'imaging-task-edit', params: { id: TaskID }})
}
const viewTask = (TaskID: string) => {
  // console.log('檢視影像')
  storeSearchData()
  router.push({ name: 'imaging-task-view', params: { id: TaskID }})
}
// 01cf44a3-ee23-496e-a8e7-b7706c767845 (開發用 ID)
const resultTask = (TaskID: string) => {
  storeSearchData()
  router.push({ name: 'imaging-task-result', params: { id: TaskID, mission: 'imagin' }})
  // router.push({ name: 'imaging-task-result', params: { id: '01cf44a3-ee23-496e-a8e7-b7706c767845', mission: 'imagin' }})
}
// 執行任務
const implementTask = async(TaskID: string) => {
  // console.log('執行任務', TaskID)
  try {
    const res = await api.imt.exec.post(TaskID)
    ElMessage({
      message: t('imageTask.messages.execTaskSuccess'),
      type: 'success',
    })
    getImageAnalysisList()
  } catch (err) {
    console.log(err)
    ElMessage({
      message: t('imageTask.messages.execTaskFail'),
      type: 'danger',
    })
  }
}

// 儲存搜尋條件 進入管理頁面返回時使用
interface StoreSearch {
  searchDate?: string,
  missionStatus?: string,
  missionSource?: string,
  missionType?: string,
  page?: number,
  routeName?: string,
}
const storeSearchData = () => {
  const storeSearch: StoreSearch = {}
  if (searchDate.value) {
    storeSearch.searchDate = searchDate.value
  }
  if (missionStatus.value) {
    storeSearch.missionStatus = missionStatus.value
  }
  if (missionSource.value) {
    storeSearch.missionSource = missionSource.value
  }
  if (missionType.value) {
    storeSearch.missionType = missionType.value
  }
  if (currentPage.value) {
    storeSearch.page = currentPage.value
  }
  if (typeof route.name === 'string') {
    storeSearch.routeName = route.name
  }
  searchData.addData(storeSearch)
}
const today = dayjs() // 取得當天日期
const endDate = ref(dayjs(today).format('YYYY-MM-DD')) // 結束是今日
// 開始日期是今天往前三個月的日期
const startDate = ref(dayjs(today).subtract(3, 'months').format('YYYY-MM-DD'))
// 分頁
const currentPage = ref(1) // 當前頁
const total = ref(0) // 總數量
const pageSize = ref(10) // 一頁幾筆
const pageSizes = ref([10, 20, 30, 40, 50])
const analysisList = ref()

const searchDate = ref()
const missionStatus = ref()
const missionSource = ref()
const missionType = ref()

interface Params {
  StartDate: string,
  EndDate: string,
  Sort: string,
  Order: string,
  Page: number,
  NumPerPage: number,
  Status?: string,
  SourceType?: string,
  TaskType?: string,
  [key: string]: unknown
}
const getImageAnalysisList = async() => {
  try {
    let params: Params = {
      StartDate: startDate.value,
      EndDate: endDate.value,
      Sort: 'StartDate',
      Order: 'desc',
      Page: currentPage.value,
      NumPerPage: pageSize.value,
    }
    if (missionStatus.value) {
      params.Status = missionStatus.value
    }
    if (missionSource.value) {
      params.SourceType = missionSource.value
    }
    if (missionType.value) {
      params.TaskType = missionType.value
    }
    const res: any = await api.imt.list.get(params)
    analysisList.value = res.Data
    total.value = res.Total
    // console.log('查詢影像任務清單', analysisList.value)
  } catch (err) {
    console.log(err)
  }
}

// 刪除提示
const cancelTip = (TaskID: string, Timestamp: string) => {
  ElMessageBox.confirm(t('imageTask.messages.deleteCancelMission'), {
    type: 'warning',
    confirmButtonText: t('button.confirm'),
    confirmButtonClass: 'el-button--danger',
  }).then(() => {
    // 取得Timestamp
    cancelTask(TaskID, Timestamp)
  }).catch(() => {
    console.log('取消刪除')
  })
}

// 刪除/取消任務
const cancelTask = async(TaskID: string, Timestamp: string) => {
  try {
    let params = {
      TaskID: TaskID,
      Timestamp: Timestamp,
    }
    const res = await api.imt.delete.delete(params)
    ElMessage({
      message: t('imageTask.messages.deleteMissionSuccess'),
      type: 'success',
    })
    getImageAnalysisList()
  } catch (err) {
    console.log(err)
  }
}
// 切換當前頁面
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getImageAnalysisList()
}

const setDateRangeAndQuery = () => {
  if (searchDate.value === null || searchDate.value === undefined) {
    let eDate = dayjs().format('YYYY-MM-DD') // 結束是今日
    // 預設開始日期是今天往前三個月的日期
    let sDate = dayjs().subtract(3, 'months').format('YYYY-MM-DD')
    startDate.value = sDate
    endDate.value = eDate
    // 將預設查詢區間帶回小月曆顯示
    searchDate.value = [sDate, eDate]
  } else {
    startDate.value = dayjs(searchDate.value[0]).format('YYYY-MM-DD')
    endDate.value = dayjs(searchDate.value[1]).format('YYYY-MM-DD')
  }
  // 如果 沒有儲存搜尋條件 資料則將分頁條件重置回第一頁
  if (isEmptyObject(searchData.data)) {
    currentPage.value = 1
  }
  getImageAnalysisList()
}
const storeData = ref(searchData.data)

function isEmptyObject(obj: object) {
  // 使用 Reflect.ownKeys 來取得所有屬性
  return Reflect.ownKeys(obj).length === 0
}
// 取得影像分析功能清單
const missionAnalysisList = ref()
const getAnalysisList = async() => {
  try {
    let params = {
      authSetKind: 2,
      // isQueryComp: 1,
      isEnable: 1,
      page: currentPage.value,
      pageSize: 100,
    }
    const res: any = await api.feature.list.get(params)
    missionAnalysisList.value = res.responseData
    // console.log('查詢功能權限清單', res)
  } catch (err) {
    console.log(err)
  }
}
onMounted(() => {
  // 取得影像分析功能清單
  getAnalysisList()
  // 判斷有無之前的搜尋條件
  if (!isEmptyObject(storeData.value)) {
    if (route.name === storeData.value.routeName) {
      searchDate.value = storeData.value.searchDate
      missionStatus.value = storeData.value.missionStatus
      missionSource.value = storeData.value.missionSource
      missionType.value = storeData.value.missionType
      currentPage.value = storeData.value.page
    } else {
      searchDate.value = [startDate.value, endDate.value]
    }
    setDateRangeAndQuery()
    searchData.deleteData()
  } else {
    searchDate.value = [startDate.value, endDate.value]
    setDateRangeAndQuery()
  }
})
</script>


