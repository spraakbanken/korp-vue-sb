import { App } from 'vue'
// @ts-expect-error TODO Why is this module error-marked in VSCode?
import { ModePluginOptions } from '@/types/app.types.ts'
// @ts-expect-error TODO Why is this module error-marked in VSCode?
import settings from '@instance/settings'

export async function install(app: App, options: ModePluginOptions) {
  console.log(`Kubhist, Vue ${app.version}`, Object.fromEntries(options.params.entries()))
  settings.korp_backend_url += '/kubhist'
}
