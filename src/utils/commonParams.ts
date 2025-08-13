import { t } from '@locales'

// i18n
export const langList = [
  { name: '繁體中文', value: 'zh', abbreviation: '繁', langSetting: 'zh-TW' },
  { name: '简体中文', value: 'cn', abbreviation: '简', langSetting: 'zh-CN' },
  { name: 'English', value: 'en', abbreviation: 'En', langSetting: 'en' },
]

// 天氣icon
export const weatherIcon = [
  { id: 'w1', icon: 'icon-sunny' },
  { id: 'w2', icon: 'icon-partly-cloudy-day' },
  { id: 'w4', icon: 'icon-cloudy' },
  { id: 'w5', icon: 'icon-rainy' },
  { id: 'w6', icon: 'icon-thunderstorm' },
  { id: 'w7', icon: 'icon-mist' },
  { id: 'w8', icon: 'icon-foggy' },
  { id: 'w9', icon: 'icon-snow' },
]

// 載具型式
export const uvType = [
  { id: 'UAV' },
  { id: 'USV' },
  { id: 'UUV' },
  { id: 'AMR' },
  { id: 'OTHER' },
]

// 使用狀態
export function useStatus() {
  return [
    { id: 1, label: t('enableStatus.enabled') }, // 啟用
    { id: 0, label: t('enableStatus.disable') }, // 停用
  ]
}
// 載具操作
export function switchOperateModeList() {
  return [
    { label: t('inspectionTasks.vehicleOperaType.manual'), operateMode: 'Manual', value: true }, // 手動
    { label: t('inspectionTasks.vehicleOperaType.automatic'), operateMode: 'Auto', value: false }, // 自動
  ]
}
// 巡檢日期類型
export function scheduleType() {
  return [
    { value: 1, label: t('inspectionTasks.dateRange.scheduling') }, // 排程
    { value: 2, label: t('inspectionTasks.dateRange.recurring') }, // 周期
  ]
}
// 巡檢拍照模式
export function captureModeList() {
  return [
    { value: 'OFF', label: t('inspectionTasks.captureMode.off') }, // 關閉
    { value: 'WAYPOINTCAP', label: t('inspectionTasks.captureMode.waypointcap') }, // 定點
    { value: 'INTERVALCAP', label: t('inspectionTasks.captureMode.intervalcap') }, // 定時 (秒)
    { value: 'DISTANCECAP', label: t('inspectionTasks.captureMode.distancecap') }, // 定距 (公尺)
  ]
}
// 影像任務狀態
export function imageStatus() {
  return [
    { id: 'WAITING', label: t('taskStatus.waiting') }, // 未執行
    { id: 'RUNNING', label: t('taskStatus.running') }, // 執行中
    { id: 'FAILED', label: t('taskStatus.failed') }, // 執行失敗
    { id: 'COMPLETED', label: t('taskStatus.completed') }, // 已完成
    { id: 'CANCEL', label: t('taskStatus.cancel') }, // 已取消
  ]
}

// 影像來源
export function imageSource() {
  return [
    { id: 'Live', label: t('common.live') }, // 即時
    { id: 'Media', label: t('common.media') }, // 檔案
    { id: 'Record', label: t('common.record') }, // 記錄
  ]
}

// 星期列表
export function weekList() {
  return [
    { value: 'Mon', label: t('weekList.Mon') }, // 周一
    { value: 'Tue', label: t('weekList.Tue') }, // 周二
    { value: 'Wed', label: t('weekList.Wed') }, // 周三
    { value: 'Thu', label: t('weekList.Thu') }, // 周四
    { value: 'Fri', label: t('weekList.Fri') }, // 周五
    { value: 'Sat', label: t('weekList.Sat') }, // 周六
    { value: 'Sun', label: t('weekList.Sun') }, // 周日
  ]
}

// 巡檢任務申請狀態
export function applicationStatus() {
  return [
    { id: 'W', label: t('caseStatus.paending'), style: 'warning' }, // 待審核
    { id: 'A', label: t('caseStatus.approve'), style: 'success' }, // 核準
    { id: 'D', label: t('caseStatus.reject'), style: 'danger' }, // 退件
    { id: 'C', label: t('caseStatus.cancel'), style: 'info' }, // 取消
  ]
}

// 任務結束動作
export const endOfActionList = [
  { id: 1, label: 'RTL' },
  { id: 2, label: 'LAND' },
  { id: 3, label: 'STAY' },
]

// 巡檢任務-地圖資料設定
import scanRouteIcon from '../../src/assets/svg/route-scan.svg'
import circleRouteIcon from '../../src/assets/svg/route-circle.svg'
import timelineRouteIcon from '../../src/assets/svg/route-timeline.svg'

export function mapMissionInfo() {
  return [
    {
      pathType: 'Areascan', // 掃描路線
      pathName: t('map.missionPath.areascan'),
      icon: scanRouteIcon,
      PathParams: [
        { key: 'Points', label: t('inspectionTasks.mapSetting.coordinates'), suffix: '' }, // 座標
        { key: 'Height', label: t('inspectionTasks.mapSetting.height'), suffix: t('unit.distanceMeter') }, // 飛行高度 (m) / 公尺
        { key: 'SideOverlap', label: t('inspectionTasks.mapSetting.sideOverlap'), suffix: ' %' }, // 路線重疊率
        { key: 'FOV', label: t('inspectionTasks.mapSetting.fov'), suffix: t('unit.camAngle') }, // 鏡頭視角 / 度
        { key: 'Intersection', label: t('inspectionTasks.mapSetting.intersection'), suffix: '' }, // 路線交錯
        { key: 'Speed', label: t('inspectionTasks.mapSetting.speed'), suffix: ' m/s' }, // 無人機速度
        { key: 'DelayTime', label: t('inspectionTasks.mapSetting.delayTime'), suffix: t('unit.timeSec') }, // 點位停留時間 / 秒
        { key: 'CamAngle', label: t('inspectionTasks.mapSetting.camAngle'), suffix: t('unit.camAngle') }, // 鏡頭角度 / 度
      ],
    },
    {
      pathType: 'Expandingsquare', // 漸擴方形路線
      pathName: t('map.missionPath.expandingsquare'),
      icon: 'icon-route-square',
      PathParams: [
        { key: 'Point1', label: t('inspectionTasks.mapSetting.centerPoint'), suffix: '' }, // 中心點座標
        { key: 'Height', label: t('inspectionTasks.mapSetting.height'), suffix: t('unit.distanceMeter') }, // 飛行高度 (m) / 公尺
        { key: 'SideOverlap', label: t('inspectionTasks.mapSetting.sideOverlap'), suffix: ' %' }, // 路線重疊率
        { key: 'SearchRadius', label: t('inspectionTasks.mapSetting.searchRadius'), suffix: t('unit.distanceMeter') }, // 搜尋半徑(m) / 公尺
        { key: 'FOV', label: t('inspectionTasks.mapSetting.fov'), suffix: t('unit.camAngle') }, // 鏡頭視角 / 度
        { key: 'Speed', label: t('inspectionTasks.mapSetting.speed'), suffix: ' m/s' }, // 無人機速度
        { key: 'DelayTime', label: t('inspectionTasks.mapSetting.delayTime'), suffix: t('unit.timeSec') }, // 點位停留時間 / 秒
        { key: 'CamAngle', label: t('inspectionTasks.mapSetting.camAngle'), suffix: t('unit.camAngle') }, // 鏡頭角度 / 度
      ],
    },
    {
      pathType: 'Vertical', // 立面掃描路線
      pathName: t('map.missionPath.vertical'),
      icon: 'icon-arrow-up',
      PathParams: [
        { key: 'Point1', label: t('inspectionTasks.mapSetting.scanPointS'), suffix: '' }, // 掃描起始座標
        { key: 'Point2', label: t('inspectionTasks.mapSetting.scanPointE'), suffix: '' }, // 掃描結束座標
        { key: 'MaxHeight', label: t('inspectionTasks.mapSetting.maxHeight'), suffix: t('unit.distanceMeter') }, // 最大高度 (m) / 公尺
        { key: 'MinHeight', label: t('inspectionTasks.mapSetting.minHeight'), suffix: t('unit.distanceMeter') }, // 最小高度 (m) / 公尺
        { key: 'SideDistance', label: t('inspectionTasks.mapSetting.sideDistance'), suffix: t('unit.distanceMeter') }, // 掃描間隔距離 (m) / 公尺
        { key: 'Speed', label: t('inspectionTasks.mapSetting.speed'), suffix: ' m/s' }, // 無人機速度
        { key: 'DelayTime', label: t('inspectionTasks.mapSetting.delayTime'), suffix: t('unit.timeSec') }, // 點位停留時間 / 秒
        { key: 'CamAngle', label: t('inspectionTasks.mapSetting.camAngle'), suffix: t('unit.camAngle') }, // 鏡頭角度 / 度
      ],
    },
    {
      pathType: 'Circle', // 環繞路線
      pathName: t('map.missionPath.circle'),
      icon: circleRouteIcon,
      PathParams: [
        { key: 'Point1', label: t('inspectionTasks.mapSetting.circlePointS'), suffix: '' }, // 圓第一點座標
        { key: 'Point2', label: t('inspectionTasks.mapSetting.circlePointE'), suffix: '' }, // 圓第二點座標
        { key: 'Height', label: t('inspectionTasks.mapSetting.height'), suffix: t('unit.distanceMeter') }, // 飛行高度 (m) / 公尺
        { key: 'PointCount', label: t('inspectionTasks.mapSetting.pointCount'), suffix: '' }, // 生成點位數量
        { key: 'Speed', label: t('inspectionTasks.mapSetting.speed'), suffix: ' m/s' }, // 無人機速度
        { key: 'DelayTime', label: t('inspectionTasks.mapSetting.delayTime'), suffix: t('unit.timeSec') }, // 點位停留時間 / 秒
        { key: 'CamAngle', label: t('inspectionTasks.mapSetting.camAngle'), suffix: t('unit.camAngle') }, // 鏡頭角度 / 度
      ],
    },
    {
      pathType: 'Waypoints', // 任意路線
      pathName: t('map.missionPath.waypoints'),
      icon: 'icon-route-custom',
      PathParams: [
        { key: 'Points', label: t('inspectionTasks.mapSetting.coordinates'), suffix: '' }, // 座標
        { key: 'Height', label: t('inspectionTasks.mapSetting.height'), suffix: t('unit.distanceMeter') }, // 飛行高度 (m) / 公尺
        { key: 'Speed', label: t('inspectionTasks.mapSetting.speed'), suffix: ' m/s' }, // 無人機速度
        { key: 'DelayTime', label: t('inspectionTasks.mapSetting.delayTime'), suffix: t('unit.timeSec') }, // 點位停留時間 / 秒
        { key: 'CamAngle', label: t('inspectionTasks.mapSetting.camAngle'), suffix: t('unit.camAngle') }, // 鏡頭角度 / 度
      ],
    },
    {
      pathType: 'Circular3d', // 立體環繞路線
      pathName: t('map.missionPath.circular3d'),
      icon: 'icon-3d-swirl',
      PathParams: [
        { key: 'Point1', label: t('inspectionTasks.mapSetting.centerPoint'), suffix: '' }, // 中心點座標
        { key: 'SearchRadius', label: t('inspectionTasks.mapSetting.searchRadius'), suffix: t('unit.distanceMeter') }, // 搜尋半徑(m) / 公尺
        { key: 'ObjectHeight', label: t('inspectionTasks.mapSetting.objectHeight'), suffix: ' m/s' }, // 物件高度 (m)
        { key: 'MaxHeight', label: t('inspectionTasks.mapSetting.maxAltitude'), suffix: t('unit.distanceMeter') }, // 最高高度 / 公尺
        { key: 'MinHeight', label: t('inspectionTasks.mapSetting.minAltitude'), suffix: t('unit.distanceMeter') }, // 最低高度 / 公尺
        { key: 'FOV', label: t('inspectionTasks.mapSetting.fov'), suffix: t('unit.camAngle') }, // 鏡頭視角 / 度
        { key: 'PointCount', label: t('inspectionTasks.mapSetting.surroundingPoints'), suffix: '' }, // 環繞點位數量
        { key: 'Speed', label: t('inspectionTasks.mapSetting.speed'), suffix: ' m/s' }, // 無人機速度
        { key: 'DelayTime', label: t('inspectionTasks.mapSetting.delayTime'), suffix: t('unit.timeSec') }, // 點位停留時間 / 秒
        { key: 'CamAngle', label: t('inspectionTasks.mapSetting.camAngle'), suffix: t('unit.camAngle') }, // 鏡頭角度 / 度
      ],
    },
    {
      pathType: 'Timeline', // 復飛復拍
      pathName: t('map.missionPath.timeline'),
      icon: timelineRouteIcon,
      PathParams: [
        { key: 'TimelineType', label: t('inspectionTasks.mapSetting.timelineType'), suffix: '' }, // 復飛路線
        { key: 'Waypoints', label: t('inspectionTasks.mapSetting.waypoints'), suffix: '' }, // 點位數量
        { key: 'Checkpoints', label: t('inspectionTasks.mapSetting.checkpoints'), suffix: '' }, // 復拍數量
      ],
    },
  ]
}
