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
import { getStringifiers } from "./components/stringifiers"
import { readers } from "./components/reader"

// An async function returning a Vue 3 plugin: https://vuejs.org/guide/reusability/plugins
// It is wrapped in an async function so that we can await dynamically imported code if needed.
export default async function createPlugin(options: {
  mode: string
  t: (key: string) => string
}): Promise<Plugin> {
  // Destructure options
  const { mode, t } = options

  // Default installer
  const installCommon: Plugin = (app) => {
    // Provide components
    app.provide(componentInjectionKeys.BrandPrimary, BrandPrimary)
    app.provide(componentInjectionKeys.BrandSecondary, BrandSecondary)

    // Provide named components and functions that can be referenced from config
    app.provide(injectionKeys.hook.afterInit, async ({ settings }) => {
      // Modify corpus config with new changes
      Object.values(settings.corpora).forEach((corpus) => {
        if (corpus.attributes["lemma"]) corpus.attributes["lemma"].stringify = "lemma"
        if (corpus.attributes["compwf"]) corpus.attributes["compwf"].stringify = "compwf"
        if (corpus.attributes["e_cat"]) corpus.attributes["e_cat"].escape = false
      })
    })
    app.provide(injectionKeys.search.widgets, searchComponents) // attribute extended_component
    app.provide(injectionKeys.attribute.formatters, formatters) // attribute sidebar_component
    app.provide(injectionKeys.attribute.stringifiers, getStringifiers(t))
    app.provide(injectionKeys.readers, readers)

    app.provide(injectionKeys.largeNumberFormatter, (locale, n) => {
      // Utilize native formatting
      const original = new Intl.NumberFormat(locale, { notation: "compact" }).format(n)
      const singular = /^1\s/.test(original)

      // Replace magnitude abbreviations with full words
      if (locale == "swe")
        return original
          .replace("tn", "tusen")
          .replace("mn", singular ? "miljon" : "miljoner")
          .replace("md", singular ? "miljard" : "miljarder")
          .replace("bn", singular ? "biljon" : "biljoner")

      if (locale == "eng")
        return original
          .replace("K", "thousand")
          .replace("M", "million")
          .replace("B", "billion")
          .replace("T", "trillion")

      // Fall back to original formatting for other locales
      return original
    })

    // Add icons used in instance code
    import("./fontawesome")
  }

  // Lab mode
  // Pick help links for normal/lab mode
  if (settings.navigation?.help_links)
    settings.navigation.help_links = settings.navigation.help_links.filter(
      (link) => !("lab" in link) || !!link.lab == !!import.meta.env.VITE_LAB,
    )

  // Mode-specific configuration

  if (mode == "default") {
    settings.frontpage ??= {}
    settings.frontpage.examples = defaultExamples as SearchExample[]
  }

  if (mode == "mink") {
    // Load separate mode plugin
    const { default: installMink } = await import("@instance/modes/mink")
    return (app) => {
      installCommon(app)
      installMink(app)
    }
  }

  if (mode == "npegl") {
    const { default: installNpegl } = await import("@instance/modes/npegl")
    return (app) => {
      installCommon(app)
      installNpegl(app)
    }
  }

  // Default installer
  return (app) => {
    installCommon(app)
    // Use basic auth
    app.provide(injectionKeys.auth, authBasic({ defaultRemember: true }))
  }
}
