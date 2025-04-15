import { App } from 'vue'
// TODO Squiggly red in vscode, but works fine
import settings from '@instance/settings'

export async function setup(app: App) {
  console.log(`Kubhist, Vue ${app.version}`)
  settings.description.eng = 'Kubhist description'
}
