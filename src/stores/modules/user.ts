import { storageSession, storageLocal } from '@/utils/storage'
import { useKeepAliveStore } from './keep-alive'
import router from '@/router'
import systemRouter from '@/router/system-router'
import { usePermissionStore } from './permission'
import cookies from '@/utils/cookie'
import sysConfig from '@/config'
import api from '@/api'
import { ElMessage } from 'element-plus'

import { t } from '@locales'
const routes = systemRouter

const USER_INFO_KEY = 'USER_INFO'
const TOKEN_KEY = 'TOKEN'
const GOOGLE_INFO_KEY = 'GUSER_INFO' // Google 來的使用者資訊
const DEVICE_TYPE = 'DEVICE_TYPE' // 裝置型態
const USAGE_NOTIFY_KEY = 'USAGE_NOTIFY' // 資源使用量告警
const LANG_KEY = 'APP_LANG' // 語系

export interface GoogleUserInfo {
  userName: string
  avaterImg: string
}
export interface UsageNotification {
  isNotify: boolean
  isCompanyExpireAlarm: boolean
  isGPUOverAlarm: boolean
  isStorageOverAlarm: boolean
}
export interface StoredUserInfo {
  email: string
  roleCompany: string
  roleGroup: string
  companyName: string
  companyList: any[]
  isSystem: number
}
export interface UserState {
  token: string
  userInfo: StoredUserInfo | null
  googleUserInfo: GoogleUserInfo | null
  deviceType: string | null
  usageNotify: UsageNotification | null
}

type ResetType = 'init' | 'reset' | undefined

export const useUserStore = defineStore('user', {
  state: () => ({
    token: cookies.get(TOKEN_KEY) ?? '',
    userInfo: (storageSession.getItem<StoredUserInfo>(USER_INFO_KEY) || null) as StoredUserInfo | null,
    googleUserInfo: (storageSession.getItem<GoogleUserInfo>(GOOGLE_INFO_KEY) || null) as GoogleUserInfo | null,
    deviceType: (storageLocal.getItem<string>(DEVICE_TYPE) || null) as string | null,
    usageNotify: (storageSession.getItem<UsageNotification>(USAGE_NOTIFY_KEY) || null) as UsageNotification | null,
  }),
  actions: {
    SET_TOKEN(token?: string) {
      this.token = token ?? ''
      cookies.set(TOKEN_KEY, this.token, { secure: true })
    },
    SET_USERINFO(info: { userData: any; companyList: any[] }) {
      const userInfo = {
        email: info.userData.userEmail || '',
        roleCompany: info.userData.companyID || '',
        roleGroup: info.userData.groupID || '',
        companyName: info.userData.companyName || '',
        companyList: info.companyList || [],
        isSystem: info.userData.isSystem || 0,
      }
      storageSession.setItem(USER_INFO_KEY, userInfo)
      this.userInfo = userInfo
    },
    SET_GUSERINFO(gInfo: GoogleUserInfo | null) {
      storageSession.setItem(GOOGLE_INFO_KEY, gInfo)
      this.googleUserInfo = gInfo
    },
    SET_DEVICETYPE(type: string | null) {
      storageLocal.setItem(DEVICE_TYPE, type)
      this.deviceType = type
    },
    SET_USAGE_NOTIFY(info: { isCompanyExpireAlarm: boolean; isGPUOverAlarm: boolean; isStorageOverAlarm: boolean }) {
      const usageNotification: UsageNotification = {
        isNotify: true,
        isCompanyExpireAlarm: !!info.isCompanyExpireAlarm,
        isGPUOverAlarm: !!info.isGPUOverAlarm,
        isStorageOverAlarm: !!info.isStorageOverAlarm,
      }
      storageSession.setItem(USAGE_NOTIFY_KEY, usageNotification)
      // this.usageNotify = usageNotification
    },
    // 登入
    async login(credential: string): Promise<any> {
      try {
        const payload = {
          language: storageLocal.getItem(LANG_KEY) || sysConfig.LANG,
          credential: credential,
          isMobile: this.deviceType === 'mobile',
        }
        console.log('user.js 裝置', this.deviceType)
        const loginRes: any = await api.auth.login.post(payload)
        if (loginRes.status === 'success') {
          console.log('success')
          const token = loginRes.responseData.jwt
          const userInfo = {
            userData: loginRes.responseData.userInfo,
            companyList: loginRes.responseData.companyGroupList,
          }
          const googleInfo = {
            userName: loginRes.responseData.userInfo.userName,
            avaterImg: loginRes.responseData.userInfo.picture,
          }

          const dynmicMenu = [...loginRes.responseData.methodMenu, ...loginRes.responseData.settingMenu]
          const settingMenu = loginRes.responseData.settingMenu
          this.SET_TOKEN(token)
          this.SET_USERINFO(userInfo)
          this.SET_GUSERINFO(googleInfo)
          this.SET_USAGE_NOTIFY(loginRes.responseData)
          usePermissionStore().SET_DYNMIC_MENUS(dynmicMenu)
          usePermissionStore().SET_SETTING_MENU(settingMenu)
          usePermissionStore().initAuthRoute()
        }
        return loginRes
      } catch (err) {
        console.log('登入發生問題：', err)
        ElMessage.error(t('systemNotification.loginFailed'))
      }
    },

    // 切換公司群組
    async changeCompanyGroup(data: any): Promise<any> {
      try {
        const res: any = await api.auth.changeRole.post(data)
        if (res.status === 'success') {
          // 先清空原本的資訊
          this.resetUserLogin('reset')
          const token = res.responseData.jwt
          const userInfo = {
            userData: res.responseData.userInfo,
            companyList: res.responseData.companyGroupList,
          }
          const menu = [...res.responseData.methodMenu, ...res.responseData.settingMenu]
          const settingMenu = res.responseData.settingMenu

          // 刪除舊路由(替換成systemRouter)
          router.addRoute(routes[0])
          this.SET_TOKEN(token)
          this.SET_USERINFO(userInfo)
          this.SET_USAGE_NOTIFY(res.responseData)
          usePermissionStore().SET_DYNMIC_MENUS(menu)
          usePermissionStore().SET_SETTING_MENU(settingMenu)
          usePermissionStore().initAuthRoute()
        }
        return res
      } catch (err) {
        console.log('切換公司群組時發生問題：', err)
        ElMessage.error(t('systemNotification.changeCompanyError'))
      }
    },
    // 刷新公司群組選單
    async refreshGroupInfo(info: any): Promise<any> {
      try {
        const res: any = await api.auth.changeRole.post(info)
        if (res.status === 'success') {
          const token = res.responseData.jwt
          const userInfo = {
            userData: res.responseData.userInfo,
            companyList: res.responseData.companyGroupList,
          }
          this.SET_TOKEN(token)
          this.SET_USERINFO(userInfo)
        }
        return res.status
      } catch (err) {
        // console.log('刷新公司群組選單資訊時發生問題：', err)
        console.log(t('systemNotification.resetCompanyError'), err)
      }
    },
    resetUserLogin(type?: ResetType) {
      this.token = ''
      this.userInfo = null
      // 如果是登出或是回到登入畫面時要將google info 清掉
      if (type === 'init') {
        this.googleUserInfo = null
      }
      this.usageNotify = null
      this.clearStorage(type)
      useKeepAliveStore().resetKeepAliveStore()
      usePermissionStore().resetPermissionStore()
    },

    clearStorage(type?: ResetType) {
      cookies.remove(TOKEN_KEY)
      storageSession.clear()

      // 如果是切換Company的話需要重新把google inf○存進session
      if (type === 'reset') {
        this.SET_GUSERINFO(this.googleUserInfo)
      }
    },
    clearCache(): Promise<void> {
      return new Promise<void>((resolve) => {
        storageLocal.clear()
        this.resetUserLogin()
        resolve() // ok
      })
    },

  },
})
