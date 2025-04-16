import type { App } from 'vue'
import type { InstancePluginOptions } from '@/types/app.types'
import kubhist from '@instance/modes/kubhist'
import searchComponents from '@instance/components/search'
import settings from './settings'

// This is a standard Vue 3 plugin: https://vuejs.org/guide/reusability/plugins
export default function install(app: App, options: InstancePluginOptions): void {
  // We can do different things depending on the mode
  if (options.mode == 'kubhist') {
    // We may put mode-specific code in a separate module
    // It can take the shape of a plugin on its own
    app.use(kubhist)
  }

  if (options.mode == 'mink') {
    // Change backend URL
    settings.korp_backend_url += '/mink'
    // Set auth module to Federatedauth
    // Implement initialization_checks
    // etc.
  }

  // This is how we will provide named components and functions that can be referenced from config.
  app.provide('korp.components.search', searchComponents) // attribute extended_component
  // app.provide('korp.components.stringify', ...)

  // TODO Can we add locales here?
}
