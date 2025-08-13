import type { ApiModule } from './model/_types'

const files = import.meta.glob<{ default: ApiModule }>(
  './model/*.{ts,js}',
  { eager: true }
)

const api: Record<string, ApiModule> = {}

for (const [path, mod] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.(ts|js)$/, '')
  api[name] = mod.default
}

export default api
