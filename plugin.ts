import type { Plugin } from 'vue'
import type { InstancePluginOptions } from '@/types/app.types'
import searchComponents from '@instance/components/search'
import settings from './settings'

// An async function returning a Vue 3 plugin: https://vuejs.org/guide/reusability/plugins
// It is wrapped in an async function so that we can await dynamically imported code if needed.
export default async function createPlugin(options: InstancePluginOptions): Promise<Plugin> {
  // Default installer
  const install: Plugin = (app) => {
    // This is how we will provide named components and functions that can be referenced from config
    app.provide('korp.components.search', searchComponents) // attribute extended_component
    app.provide('korp.components.stringify', '...')
  }

  // We can override the installer depending on the mode
  if (options.mode == 'kubhist') {
    // We may put mode-specific code in a separate module
    // It can take the shape of a plugin on its own
    const { default: kubhist } = await import('@instance/modes/kubhist')
    // Override installer to do additional stuff
    return (app) => {
      install(app, options)
      app.use(kubhist)
    }
  }

  // Do simple mode-specific things without loading additional code
  if (options.mode == 'mink') {
    settings.korp_backend_url += '/mink'
  }

  // Use default installer unless overridden
  return install
}
