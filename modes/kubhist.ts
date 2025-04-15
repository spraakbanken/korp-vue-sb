import { App } from 'vue'
// @ts-expect-error Ignore problem-marking in VSCode, not sure what the problem is
import settings from '@instance/settings'

export async function setup(app: App) {
  console.log(`Kubhist, Vue ${app.version}`)
  settings.description.eng = 'Kubhist description'
}
