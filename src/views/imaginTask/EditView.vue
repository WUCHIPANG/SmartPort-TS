<template>
  <div class="flex flex-col items-center pb-16">
    <div class="w-[1280px] relative text-center px-4 ">
      <!-- title -->
      <div class="w-full h-[56px] flex justify-between items-center mt-auto">
        <PageTitle />
      </div>
      <!-- 內容 -->
      <div class="flex w-full px-3">
        <div class="w-full space-y-4 text-left ">
          <el-form
            ref="formRef"
            :model="taskForm"
            :rules="formRules"
            label-position="top"
            size="large"
            hide-required-asterisk
          >
            <el-form-item :label="$t('imageTask.form.missionName')" prop="TaskName">
              <el-input
                v-model="taskForm.TaskName"
                :placeholder="$t('imageTask.placeholder.missionName')"
                style="width:50%"
                class="h-12"
                :disabled="inputStatus"
              />
            </el-form-item>
            <el-form-item :label="$t('imageTask.form.imageTaskSetting')" prop="TaskType">
              <el-radio-group v-model="taskForm.TaskType">
                <el-radio
                  v-for="item in analysisList"
                  :key="item.authCode"
                  :value="item.authCode"
                  class="border border-grey-30 w-[145px] m-2 px-3 py-1 rounded-sm"
                  style="height:48px; margin-right:0px;"
                  :label="item.authCode"
                  :disabled="inputStatus"
                >
                  {{ item.authName }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="inputStatus" :label="$t('imageTask.form.imageSource')" prop="SourceType">
              <el-input
                v-model="taskForm.SourceType"
                :placeholder="$t('imageTask.placeholder.imageResource')"
                style="width:50%"
                class="h-12"
                :disabled="inputStatus"
              />
            </el-form-item>
          </el-form>

          <div v-if="!inputStatus" class="flex flex-col">
            <span class="text-sm">{{ $t('imageTask.form.imageSource') }}</span>
            <div class="mt-2">
              <Switch
                :model-value="switchValue"
                :label1="enableLabel"
                :label2="disableLabel"
                @update:model-value="updateSwitch"
              />
            </div>
          </div>
          <div class="flex flex-col h-[420px]">
            <div v-if="switchValue && MediaID" class="w-full h-[420px] flex justify-center items-center border border-[#E4E7ED] bg-[#F5F7FA]">
              <DropZone :task-media-id="MediaID" :remove-all-files="removeAll" @show-button-group="showButtonGroup" />
              <div v-if="showDelBtn" class="z-[9999] p-2 rounded-md bg-[#00000080] absolute bottom-2 xCenter transform flex justify-center items-center">
                <el-button type="success" @click="downloadFiles">{{ $t('button.downloadAll') }}</el-button>
                <el-button v-if="!inputStatus" type="danger" @click="clearTip">{{ $t('button.deleteAll') }}</el-button>
              </div>
            </div>
            <div v-else-if="taskForm.SourceType === 'Record' || !switchValue" class="w-full h-[420px] border border-[#E4E7ED] rounded px-4 pt-4 overflow-y-auto">
              <div class="flex space-x-6">
                <div>
                  <div>
                    <span>{{ $t('imageTask.form.inspectionDate') }}</span>
                  </div>
                  <el-date-picker
                    v-model="searchDate"
                    type="daterange"
                    class="mt-2"
                    style="width:280px; height:48px;"
                    start-placeholder="YYYY-MM-DD"
                    end-placeholder="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <div>
                    <span>{{ $t('imageTask.form.missionName') }}</span>
                  </div>
                  <el-input
                    v-model="missionName"
                    class="h-12 mt-2 "
                    :placeholder="$t('imageTask.placeholder.missionName')"
                    style="width:260px;"
                    @blur="onSearch"
                    @keyup.enter="onSearch"
                  >
                    <template #prefix>
                      <i class="text-base text-black icon-search" />
                    </template>
                  </el-input>
                </div>
                <div>
                  <div>
                    <span>{{ $t('imageTask.form.uvID') }}</span>
                  </div>
                  <el-input
                    v-model="droneNum"
                    class="h-12 mt-2 "
                    :placeholder="$t('imageTask.placeholder.uvID')"
                    style="width:260px;"
                    @blur="onSearch"
                    @keyup.enter="onSearch"
                  >
                    <template #prefix>
                      <i class="text-base text-black icon-search" />
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="my-4 ">
                <el-table
                  ref="singleTableRef"
                  :data="historyData"
                  border
                  highlight-current-row
                  stripe
                  style="width: 100%"
                  :header-row-style="{ height: '50px' }"
                  :header-cell-style="{ backgroundColor: '#F5F7FA' }"
                  :row-style="{ height: '50px' }"
                >
                  <el-table-column label="" width="50" align="center">
                    <template #default="scope">
                      <el-radio v-model="currentRadio" :label="scope.row.RecordID">
                        {{ '' }}
                      </el-radio>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                    property="id"
                    label="申請單號"
                    width="100"
                    align="center"
                  /> -->
                  <el-table-column property="MissionName" :label="$t('imageTask.form.missionName')" />
                  <el-table-column
                    property="UVName"
                    :label="$t('imageTask.form.uvName')"
                  />
                  <el-table-column
                    property="UVID"
                    :label="$t('imageTask.form.uvID')"
                    width="200"
                  />
                  <el-table-column prop="date" width="280" :label="$t('imageTask.form.inspectionDate')">
                    <template #default="scope">
                      {{ scope.row.RecordStartTime }}
                    </template>
                  </el-table-column>
                </el-table>
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
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!inputStatus" class="flex items-center justify-center w-full h-16 border-t border-grey-30">
    <div class="w-[1280px]  flex justify-end px-1">
      <el-button class="w-[92px]" @click="back">{{ $t('button.cancel') }}</el-button>
      <el-button class="w-[92px]" type="primary" @click="submit">{{ $t('button.save') }}</el-button>
      <el-button class="w-[92px]" color="#2C00A8" @click="implementTask">{{ $t('button.executeMission') }}</el-button>
    </div>
  </div>
  <div v-else class="flex items-center justify-center w-full h-16 border-t border-grey-30">
    <div class="w-[1280px]  flex justify-end px-1">
      <el-button class="w-[92px]" @click="back">{{ $t('button.cancel') }}</el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import BackList from '@/components/BaseBackList.vue'
import PageTitle from '@/components/BasePageTitle.vue'
import Switch from '@/components/BaseSwitch.vue'
import api from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
// import vueDropzone from 'vue2-dropzone-vue3'
import DropZone from '@/components/DropZone.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useUserStore } from '@/stores'
import config from '@/config'
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const userCompanyID = ref(userInfo.value.roleCompany)
const router = useRouter()
const route = useRoute()
const taskForm = ref({
  TaskName: '',
  TaskType: '',
  SourceType: null,
})
// form rule
const formRules = computed(() => ({
  TaskName: [{ required: true, message: t('imageTask.formRules.missionName'), trigger: ['change', 'blur'] }],
  TaskID: [{ required: true, message: t('imageTask.formRules.imageTaskSetting'), trigger: ['change', 'blur'] }],
}))
const inputStatus = computed(() => route.name === 'imaging-task-view')

const showButtonGroup = (val) => {
  showDelBtn.value = val
}

const taskID = ref(route.params.id)
const MediaID = ref(null)
const task = ref()
// 取得詳細資料
const getTaskDetail = async() => {
  try {
    const res = await api.imt.detail.get(taskID.value)
    if ((res.MediaID === null && res.MediaID === '' && res.SourceType === 'Media') || (res.SourceType === 'Live' && route.name !== 'imaging-task-view')) {
      getMedia()
    } else {
      if (res.SourceType === 'Record') {
        switchValue.value = false
        searchDate.value = [startDate.value, endDate.value]
        currentRadio.value = res.RecordID
      } else {
        MediaID.value = res.MediaID
      }
    }
    task.value = res
    Object.assign(taskForm.value, res)
  } catch (err) {
    console.log(err)
  }
}

const getMedia = async() => {
  try {
    const res = await api.rsrc.add.post(userCompanyID.value)
    MediaID.value = res.MediaID
  } catch (err) {
    console.log(err)
  }
}
const switchValue = ref(true)
const enableLabel = t('imageTask.form.uploadFile')
const disableLabel = t('imageTask.form.fromInspecitonRecords')

const updateSwitch = (value) => {
  switchValue.value = value
  if (!value) {
    searchDate.value = [startDate.value, endDate.value]
    showDelBtn.value = false
    return
  }
  if (MediaID.value === null) {
    getMedia()
  }
}

// 取得記錄清單
const today = dayjs() // 取得當天日期
const endDate = ref(today.format('YYYY-MM-DD')) // 結束是今日
// 開始日期是今天往前三個月的日期
const startDate = ref(today.subtract(3, 'months').format('YYYY-MM-DD'))
const historyData = ref([])
const currentPage = ref(1) // 當前頁
const total = ref(0) // 總數量
const pageSize = ref(10) // 一頁幾筆
const pageSizes = ref([10, 20, 30, 40, 50])

const droneNum = ref()
const missionName = ref()
const searchDate = ref()
// API: 取得記錄清單
const getRecordList = async() => {
  try {
    let params = {
      StartDate: startDate.value,
      EndDate: endDate.value,
      Page: currentPage.value,
      NumPerPage: pageSize.value,
    }
    if (missionName.value) {
      params.MissionName = missionName.value
    }
    if (droneNum.value) {
      params.UVID = droneNum.value
    }
    const res = await api.ipm.records.list.get(params)
    const filteredData = res.Data.filter(item => item.RecordEndTime !== '')
    historyData.value = filteredData
    // console.log('巡檢歷史紀錄三個月', historyData.value)
    total.value = res.Total
  } catch (err) {
    console.log(err)
  }
}
// Input 搜尋
const onSearch = () => {
  // 輸入查詢時將分頁條件重置回第一頁
  handleCurrentChange(1)
}
// 切換當前頁面
const handleCurrentChange = (val) => {
  currentPage.value = val
  // CALL api
  getRecordList()
}
// 監聽查詢日期
watch(searchDate, () => {
  if (searchDate.value === null) {
    let eDate = dayjs().format('YYYY-MM-DD') // 結束是今日
    // 預設開始日期是今天往前三個月的日期
    let sDate = dayjs().subtract(3, 'months').format('YYYY-MM-DD')
    startDate.value = sDate
    endDate.value = eDate
  } else {
    startDate.value = searchDate.value[0]
    endDate.value = searchDate.value[1]
  }
  getRecordList()
})

const singleTableRef = ref()
const currentRadio = ref(null)
watch(MediaID, (newMediaID) => {
  // 當沒有MediaID時 建立
  if (newMediaID === null || newMediaID === '') {
    getMedia()
  }
})

const showDelBtn = ref(false)
const clearTip = () => {
  ElMessageBox.confirm(t('imageTask.messages.confirmDeleteAll'), {
    type: 'warning',
    confirmButtonText: t('button.confirm'),
    confirmButtonClass: 'el-button--danger',
  }).then(() => {
    clearDropzone()
  }).catch(() => {
    console.log('取消刪除')
  })
}
// 全部刪除
const removeAll = ref(false)
const clearDropzone = async() => {
  try {
    const res = await api.rsrc.delAllFile.delete(MediaID.value)
    ElMessage({
      message: t('imageTask.messages.deleteMediaSuccess'),
      type: 'success',
    })
    removeAll.value = true
    showDelBtn.value = false
  } catch (err) {
    console.log(err)
    ElMessage.error(err.data.detail)
  }
}

const downloadFiles = async() => {
  try {
    const res = await api.rsrc.downloadFileMedia.get(MediaID.value)
    let blob = new Blob([res], { type: 'application/zip' })
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'final.zip'
    document.body.appendChild(link)
    link.click()
    ElMessage({
      message: t('imageTask.messages.downloadAllSuccess'),
      type: 'success',
    })
  } catch (err) {
    console.log(err)
    ElMessage.error(err.data.detail)
  }
}

// 執行任務
const implementTask = async() => {
  try {
    const res = await api.imt.exec.post(taskID.value)
    ElMessage({
      message: t('imageTask.messages.execTaskSuccess'),
      type: 'success',
    })
    router.push({ name: 'imaging-task-view', params: { id: taskID.value }})
  } catch (err) {
    console.log(err)
    ElMessage({
      message: t('imageTask.messages.execTaskFail'),
      type: 'danger',
    })
  }
}

const back = () => {
  router.push({ name: 'imaging-task', params: {}})
}

const formRef = ref(null)
const submit = () => {
  try {
    formRef.value.validate(async(valid) => {
      if (!valid) return // 表單檢核
      const payload = {
        TaskID: task.value.TaskID,
        TaskName: taskForm.value.TaskName,
        TaskType: taskForm.value.TaskType,
        Timestamp: task.value.Timestamp,
      }
      if (taskForm.value.SourceType === 'Live' && currentRadio.value === null) {
        payload.SourceType = 'Live'
      } else {
        if (switchValue.value) {
          payload.SourceType = 'Media'
          payload.MediaID = MediaID.value
        } else {
          payload.SourceType = 'Record'
          payload.RecordID = currentRadio.value
        }
      }
      // console.log('編輯影像任務資料', payload)
      const res = await api.imt.update.put(payload)
      ElMessage({
        message: t('imageTask.messages.editTaskSuccess'),
        type: 'success',
      })
      router.push({ name: 'imaging-task', params: {}})
    })
  } catch (err) {
    console.log('編輯影像任務發生問題：', err)
  }
}
const analysisList = ref()
const getImageAnalysisList = async() => {
  try {
    let params = {
      authSetKind: 2,
      isEnable: 1,
      isQueryComp: 1, // 是否撈取登入企業的功能清單
      page: 1,
      pageSize: 100,
    }
    const res = await api.feature.list.get(params)
    analysisList.value = res.responseData
    // console.log('查詢功能權限清單', analysisList.value)
  } catch (err) {
    console.log(err)
  }
}
onMounted(() => {
  getImageAnalysisList()
  getTaskDetail()
})

</script>
<style>
/* .dropzone-custom-title{
  @apply text-gray-600 text-sm
}

.dropzone .dz-preview .dz-error-message{
  @apply top-[100px] opacity-100 !important
}
.dropzone .dz-preview .dz-success-mark{
  background: none !important;
}
.dropzone .dz-preview:hover{
  @apply z-30 !important
}
.dz-preview{
  @apply mx-5 my-4
}
.dz-error-mark{
  display: none !important;
} */
</style>

