import type { Plugin } from "vue"
import searchComponents from "@instance/components/search"
import authBasic from "@/auth/basic"

// An async function returning a Vue 3 plugin: https://vuejs.org/guide/reusability/plugins
// It is wrapped in an async function so that we can await dynamically imported code if needed.
export default async function createPlugin(options: { mode: string }): Promise<Plugin> {
  // Default installer
  const install: Plugin = (app) => {
    // This is how we will provide named components and functions that can be referenced from config
    app.provide("korp.components.search", searchComponents) // attribute extended_component
    app.provide("korp.components.stringify", "...")
    app.provide("korp.auth", authBasic)
  }

  if (options.mode == "kubhist") {
    const { default: kubhist } = await import("@instance/modes/kubhist")
    // Override installer to do additional stuff
    return (app) => {
      install(app, options)
      app.use(kubhist)
    }
  }

  if (options.mode == "mink") {
    // Load separate mode plugin
    return (await import("@instance/modes/mink")).default
  }

  // Use default installer unless overridden
  return install
}
