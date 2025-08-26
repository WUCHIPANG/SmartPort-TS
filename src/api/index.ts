import type { ApiModule } from './model/_types'
import dashboard, { type DashboardModule } from './model/dashboard'
import weather,   { type WeatherModule }   from './model/weather'
import auth,   { type AuthModule }   from './model/auth'
import imt,   { type ImtModule }   from './model/imt'
import feature,   { type FeatureModule }   from './model/feature'
export type ApiRoot = {
  dashboard: DashboardModule
  weather: WeatherModule
  auth: AuthModule
  imt: ImtModule
  feature: FeatureModule
}

const typedApi: ApiRoot = {
  dashboard,
  weather,
  auth,
  imt,
  feature
}

export default typedApi

export const rawApi = (() => {
  const files = import.meta.glob<{ default: ApiModule }>(
    './model/*.{ts,js}',
    { eager: true }
  )
  const api: Record<string, ApiModule> = {}
  for (const [path, mod] of Object.entries(files)) {
    const name = path.split('/').pop()!.replace(/\.(ts|js)$/, '')
    api[name] = mod.default
  }
  return api
})()
