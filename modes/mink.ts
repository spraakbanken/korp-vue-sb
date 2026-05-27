import type { App } from "vue"
import settings from "@/core/config"
import { injectionKeys } from "@/injection"
import createAuthFederated from "@/auth/federated"
import MinkAuthStatus from "@instance/components/MinkAuthStatus.vue"

export default async function install(app: App) {
  settings.korp_backend_url = "https://spraakbanken3.it.gu.se/korp"

  const auth = createAuthFederated({
    jwtUrl: "https://sp.spraakbanken.gu.se/auth/jwt",
    loginUrl: "https://sp.spraakbanken.gu.se/auth/login",
    logoutUrl: "https://sp.spraakbanken.gu.se/Shibboleth.sso/Logout",
  })
  auth.statusComponent = MinkAuthStatus
  app.provide(injectionKeys.auth, auth)
}
