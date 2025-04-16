import type { App } from 'vue'
import settings from '@instance/settings'

export default async function install(app: App) {
  console.log(`Kubhist, Vue ${app.version}`)
  settings.korp_backend_url += '/kubhist'
}
