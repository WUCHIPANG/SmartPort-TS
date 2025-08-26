import { t } from '@locales'
export default function() {
  // 狀態燈
  const getCircleClass = {
    1: 'bg-[#67C23A80]',
    2: 'bg-[#409EFF80]',
    3: 'bg-[#FF333380]',
    4: 'bg-[#66666680]',
  }

  // 狀態燈
  const getFillClass = {
    1: '#67C23A',
    2: '#409EFF',
    3: '#FF3333',
    4: '#666666',
  }

  // 狀態Tag
  const getTypeClass = {
    1: 'rounded bg-[#B3E09C33] text-[#95D475] border border-[#95D475] text-[13px] font-semibold flex justify-center items-center',
    2: 'rounded bg-[#ECF5FF] text-[#409EFF] border border-[#87BFF7] text-[13px] font-semibold flex justify-center items-center',
    3: 'rounded bg-[#FFE5E5] text-[#FF3333] border border-[#FF9999] text-[13px] font-semibold flex justify-center items-center',
    4: 'rounded bg-[#F5F5F5] text-[#666666] border border-[#B3B3B3] text-[13px] font-semibold flex justify-center items-center',
  }

  const getTypeText = {
    1: t('vehicleStatus.standby'),
    2: t('vehicleStatus.run'),
    3: t('vehicleStatus.abnormal'),
    4: t('vehicleStatus.offline'),
  }

  // 無人機狀態文字轉換數字
  const convertDroneState = (UVStatus: string) => {
    let stateCode = 0
    switch (UVStatus) {
      case 'StandBy':
        stateCode = 1
        break
      case 'Run':
        stateCode = 2
        break
      case 'Abnormal':
        stateCode = 3
        break
      case 'Offline':
        stateCode = 4
        break
    }
    return stateCode
  }

  // 無人載具狀態顏色 & 文字
  const UVStatusColor = [
    { id: 1, statusType: 'StandBy', color: '#67C23A', label: 'vehicleStatus.standby', statusColor: 'success' }, // 待機
    { id: 2, statusType: 'Run', color: '#409EFF', label: 'vehicleStatus.run', statusColor: 'primary' }, // 任務中
    { id: 3, statusType: 'Abnormal', color: '#F56C6C', label: 'vehicleStatus.abnormal', statusColor: 'danger' }, // 異常
    { id: 4, statusType: 'Offline', color: '#999999', label: 'vehicleStatus.offline', statusColor: 'info' }, // 離線
  ]

  // 巡檢任務 申請狀態
  const applicationStatus = () => {
    return [
      { id: 'W', bgColor: '#FCF6EC', label: t('caseStatus.paending'), textColor: 'warning' },
      { id: 'A', bgColor: '#F0F9EB', label: t('caseStatus.approve'), textColor: 'success' },
      { id: 'D', bgColor: '#FEF0F0', label: t('caseStatus.reject'), textColor: 'danger' },
      { id: 'C', bgColor: '#E4E7ED', label: t('caseStatus.cancel'), textColor: 'info' },
    ]
  }
  // 影像任務 數據任務 執行狀態
  const implementStatus = () => {
    return [
      { id: 'WAITING', label: t('taskStatus.waiting'), color: '#A8ABB200', icon: 'icon-play-circle' }, // 未執行
      { id: 'RUNNING', label: t('taskStatus.running'), color: '#FFFFFF00', icon: 'icon-progress-activity' }, // 執行中
      { id: 'FAILED', label: t('taskStatus.failed'), color: '#F56C6C', icon: '' }, //  執行失敗
      { id: 'COMPLETED', label: t('taskStatus.completed'), color: '#95D475', icon: '' }, // 已完成
      { id: 'CANCEL', label: t('taskStatus.cancel'), color: '#EEEEEE', icon: '' }, // 已取消
    ]
  }

  const sourceType = (type: string) => {
    let source = ''
    switch (type) {
      case 'Record':
        source = t('common.record') // 記錄
        break
      case 'Live':
        source = t('common.live') // 即時
        break
      case 'Media':
        source = t('common.media') // 檔案
        break
    }
    return source
  }
  // 衛星數量狀態顏色(SatelliteVolume) <=> GPS 狀態
  const GPSStateColor = (gpsStatus = 0) => {
    let stateColor = ''
    if (gpsStatus === 0 || gpsStatus === 1 || gpsStatus === 2) {
      stateColor = 'bg-danger'
    }
    if (gpsStatus === 3 || gpsStatus === 4) {
      stateColor = 'bg-success'
    }
    if (gpsStatus === 5 || gpsStatus === 6) {
      stateColor = 'bg-primary'
    }
    return stateColor
  }

  return {
    getCircleClass,
    getFillClass,
    getTypeClass,
    getTypeText,
    convertDroneState,
    GPSStateColor,
    UVStatusColor,
    applicationStatus,
    implementStatus,
    sourceType,
  }
}
