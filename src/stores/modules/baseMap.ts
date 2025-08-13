// 基本地圖功能使用

// Icon
import baseControl from '@/assets/svg/baseControl.svg'
import throwIcon from '@/assets/svg/throw.svg'
export const useBaseMapStore = defineStore('baseMap', {
  state: () => ({
    // 儲存 Map 需要顯示的高度
    mapHeight: 0,
    // 存放所有載具資訊
    UVsList: [],
    // 存放被選取的載具資訊
    selectedUV: {},
    // 巡檢任務進入地圖是編輯還是新增
    isNewCreate: true,
    // 新增巡檢任務：路線資訊
    missionInfo: {
      MissionRange: [],
      NoFlyZone: [],
      MissionPath: [],
      Screenshot: null,
      PayloadFOV: '',
      PathInfo: {
        PathType: '',
        PathName: '',
      },
      PathParams: {},
    },
    // 暫存用巡檢任務
    missionInfoTemp: {},
    // 載具監看：被選擇的巡檢任務 ID
    selectedMissionID: null,
    // 載具監看：任務中無人機操作按鈕狀態 (為了與 Video 上的連動，才寫在這)
    UVOrderBtn: {
      base: {
        title: {
          name: 'map.uvOrder.button.basicControls', // 基本控制
          imgUrl: baseControl,
          order: 'BASECONTROL',
          toggle: false,
        },
        funs: [
          {
            permission: true,
            name: 'map.uvOrder.button.rtl', // 返航
            icon: 'icon-helicopter-symbol',
            order: 'RTL',
            isStartUp: false,
          },
          {
            permission: true,
            name: 'map.uvOrder.button.land', // 降落
            icon: 'icon-landing',
            order: 'LAND',
            isStartUp: false,
          },
          {
            permission: true,
            name: 'map.uvOrder.button.rotate', // 旋轉
            icon: 'icon-drone-rotate',
            order: 'ROTATE',
            isStartUp: false,
          },
          {
            permission: true,
            name: 'map.uvOrder.button.loiter', // 暫停
            icon: 'icon-pause-circle',
            order: 'LOITER',
            isStartUp: false,
          },
        ],
        show: true,
      },
      advanced: {
        title: {
          name: 'map.uvOrder.button.advancedControls', // 進階控制
          icon: 'icon-advanced-control',
          order: 'ADVANCEDCONTROL',
          toggle: false,
        },
        funs: [
          {
            permission: true,
            name: 'map.uvOrder.button.throw', // 投擲
            imgUrl: throwIcon,
            order: 'THROW',
            isStartUp: false,
          },
          {
            permission: true,
            name: 'map.uvOrder.button.playsound', // 廣播
            icon: 'icon-amplifier',
            order: 'PLAYSOUND',
            isStartUp: false,
          },
        ],
        show: true,
      },
      stopMission: {
        title: {
          name: 'map.uvOrder.button.endTask', // 結束任務
          icon: 'icon-tab-close-right',
          order: 'ENDMISSION',
          toggle: false,
        },
        show: true,
      },
    },
    // ========== 新增巡檢任務：軌跡轉路徑 ==========
    // 巡檢任務紀錄進入地圖儲存有無路徑資料
    toMapHavePath: false,
    // 是否只要編輯某一步驟的資料
    onlyEditOneSetp: false,
    // 控制是否需要清除 DropZone UI 上的資料(按鈕進來/下一步時存 false 通知不需要清除)
    clearDropZonePathFile: false,
    // 存入被刪除的PathMediaID
    delPathTemp: [],
    // 存入被刪除的PhotoMediaID
    delPhotoTemp: [],
  }),
  actions: {
    resetMissionInfo() {
      this.missionInfo.MissionRange.length = 0
      this.missionInfo.NoFlyZone.length = 0
      this.missionInfo.MissionPath.length = 0
      this.missionInfo.Screenshot = null
      this.missionInfo.PayloadFOV = ''
      this.missionInfo.PathInfo.PathType = ''
      this.missionInfo.PathInfo.PathName = ''
      this.missionInfo.PathParams = {}
    },
    resetDroneActionBtn() {
      this.UVOrderBtn.base.show = false
      this.UVOrderBtn.advanced.show = false
      this.UVOrderBtn.stopMission.show = false
    },
    setTranslations(t) {
      this.UVOrderBtn.base.title.name = t('map.uvOrder.button.basicControls')
      this.UVOrderBtn.base.funs = [
        {
          name: t('map.uvOrder.button.rtl'),
          icon: 'icon-helicopter-symbol',
          order: 'RTL',
          isStartUp: false,
        },
        {
          name: t('map.uvOrder.button.land'),
          icon: 'icon-landing',
          order: 'LAND',
          isStartUp: false,
        },
        {
          name: t('map.uvOrder.button.rotate'),
          icon: 'icon-drone-rotate',
          order: 'ROTATE',
          isStartUp: false,
        },
        {
          name: t('map.uvOrder.button.loiter'),
          icon: 'icon-pause-circle',
          order: 'LOITER',
          isStartUp: false,
        },
      ]
      this.UVOrderBtn.advanced.title.name = t(
        'map.uvOrder.button.advancedControls'
      )
      this.UVOrderBtn.advanced.funs = [
        {
          name: t('map.uvOrder.button.throw'),
          imgUrl: throwIcon,
          order: 'THROW',
          isStartUp: false,
        },
        {
          name: t('map.uvOrder.button.playsound'),
          icon: 'icon-amplifier',
          order: 'PLAYSOUND',
          isStartUp: false,
        },
      ]
      this.UVOrderBtn.stopMission.title.name = t('map.uvOrder.button.endTask')
    },
  },
})
