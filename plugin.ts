import type { Plugin } from "vue"
import { componentInjectionKeys, injectionKeys } from "@/injection"
import authBasic from "@/auth/basic"
import BrandPrimary from "@instance/components/BrandPrimary.vue"
import BrandSecondary from "@instance/components/BrandSecondary.vue"
import searchComponents from "@instance/components/search"
import formatters from "@instance/components/formatters"
import settings from "./settings"
import defaultExamples from "./modes/default-examples.yml"
import type { SearchExample } from "@/core/config/instanceConfig.types"
import "./fontawesome"
import { getStringifiers } from "./components/stringifiers"
import { readers } from "./components/reader"

// An async function returning a Vue 3 plugin: https://vuejs.org/guide/reusability/plugins
// It is wrapped in an async function so that we can await dynamically imported code if needed.
export default async function createPlugin(options: {
  mode: string
  t: (key: string) => string
}): Promise<Plugin> {
  // Default installer
  const install: Plugin = (app) => {
    // Provide services
    // TODO Re-providing auth in Mink mode gives a warning. Make basic auth the fallback instead?
    app.provide(injectionKeys.auth, authBasic)

    // Provide components
    app.provide(componentInjectionKeys.BrandPrimary, BrandPrimary)
    app.provide(componentInjectionKeys.BrandSecondary, BrandSecondary)

    // Provide named components and functions that can be referenced from config
    app.provide(injectionKeys.search.widgets, searchComponents) // attribute extended_component
    app.provide(injectionKeys.attribute.formatters, formatters) // attribute sidebar_component
    app.provide(injectionKeys.readers, readers)

    app.provide(injectionKeys.attribute.stringifiers, getStringifiers(options.t))
  }

  if (options.mode == "default") {
    settings.frontpage ??= {}
    settings.frontpage.examples = defaultExamples as SearchExample[]
  }

  if (options.mode == "kubhist") {
    const { default: kubhist } = await import("@instance/modes/kubhist")
    // Override installer to do additional stuff
    return (app) => {
      install(app)
      kubhist(app)
    }
  }

  if (options.mode == "mink") {
    // Load separate mode plugin
    const { default: mink } = await import("@instance/modes/mink")
    return (app) => {
      install(app)
      mink(app)
    }
  }

  // Use default installer unless overridden
  return install
}
