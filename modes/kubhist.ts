import type { App } from 'vue'
import type { ModePluginOptions } from '@/types/app.types'
import settings from '@instance/settings'

export async function install(app: App, options: ModePluginOptions) {
  console.log(`Kubhist, Vue ${app.version}`, Object.fromEntries(options.params.entries()))
  settings.korp_backend_url += '/kubhist'
}
