import type { App } from "vue"
import settings from "@/core/config"
import { injectionKeys } from "@/injection"
import createAuthFederated from "@/auth/federated"
import MinkAuthStatus from "@instance/components/MinkAuthStatus.vue"
import minkLogo from "@instance/assets/mink.svg"
import { html } from "@/core/util"

export default async function install(app: App) {
  // Use SB-Auth
  const auth = createAuthFederated({
    jwtUrl: "https://sp.spraakbanken.gu.se/auth/jwt",
    loginUrl: "https://sp.spraakbanken.gu.se/auth/login",
    logoutUrl: "https://sp.spraakbanken.gu.se/Shibboleth.sso/Logout",
  })
  // Override default auth status component to force login
  auth.statusComponent = MinkAuthStatus
  app.provide(injectionKeys.auth, auth)

  // Use custom Korp backend instance
  settings.korp_backend_url = "https://spraakbanken3.it.gu.se/korp"

  settings.map_enabled = true

  settings.corpus_info_link = {
    url_template: "https://spraakbanken.gu.se/mink/library/corpus/%s",
    label: { swe: "Öppna i Mink", eng: "Open in Mink" },
  }

  // Get user's corpus ids from Mink backend
  settings.get_corpus_ids = async () => {
    if (!auth.isLoggedIn()) return undefined
    // Fetch user's corpus ids from Mink
    const minkUrl = "https://spraakbanken2.it.gu.se/ws/mink/v2"
    const conf = { headers: auth.getAuthorizationHeader() }
    const response = await fetch(`${minkUrl}/list-korp-corpora`, conf)
    const data = await response.json()
    return data.resources
  }

  settings.description = {
    swe: html`
      <img src="${minkLogo}" alt="Mink" class="d-block mb-3" style="height: 5rem;" />
      <div class="text-lg">
        <p>Det här är Mink-läget i Korp.</p>
        <p>
          Här kan du söka i de korpusar som du har laddat upp och installerat via Mink. Alla
          korpusar i läget är privata och kan endast ses av dig.
        </p>
        <p>Klicka i korpusväljaren ovanför för att göra ditt materialurval.</p>
        <p><a href="https://spraakbanken.gu.se/mink/">Läs mer om Mink</a></p>
      </div>
    `,
    eng: html`
      <img src="${minkLogo}" alt="Mink" class="d-block mb-3" style="height: 5rem;" />
      <div class="text-lg">
        <p>This is the Mink mode of Korp.</p>
        <p>
          Here you can search in the corpora that you have uploaded and installed via Mink. All
          corpora in this mode are private and can only be seen by you.
        </p>
        <p>Click the corpus selector above to choose material.</p>
        <p><a href="https://spraakbanken.gu.se/mink/">Read more about Mink</a></p>
      </div>
    `,
  }

  settings.frontpage = {
    corpus_updates: false,
    examples: [
      {
        label: { swe: "Alla adjektiv", eng: "All adjectives" },
        params: { search: "cqp", cqp: '[pos = "JJ"]', search_tab: 1 },
      },
      {
        label: { swe: "Fördelning av verb", eng: "Distribution of verbs" },
        params: {
          search: "cqp",
          cqp: '[pos = "VB"]',
          search_tab: 1,
          stats_reduce: "lemma",
          result_tab: 2,
        },
      },
      {
        label: { swe: 'Verb följt av "inte"', eng: 'Verbs followed by "inte" ("not")' },
        params: { search: "cqp", cqp: '[pos = "VB"] [word = "inte" %c]', search_tab: 1 },
      },
      {
        label: { swe: 'Ordbild för "jobb"', eng: 'Word picture for "jobb" ("work")' },
        params: { search: "lemgram|jobb..nn.1", result_tab: 3 },
      },
    ],
  }
}
