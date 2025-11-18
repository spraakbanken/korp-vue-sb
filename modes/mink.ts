import type { App } from 'vue'
import settings from '@instance/settings'
import authFederated from '@/auth/federated'

export default async function install(app: App) {
  settings.korp_backend_url = 'https://spraakbanken3.it.gu.se/korp'

  settings['auth_module'] = {
    module: 'federated_auth', // TODO Remove
    options: {
      jwt_url: 'https://sp.spraakbanken.gu.se/auth/jwt',
      login_service: 'https://sp.spraakbanken.gu.se/auth/login',
      logout_service: 'https://sp.spraakbanken.gu.se/Shibboleth.sso/Logout',
    },
  }
  app.provide('korp.auth', authFederated)
}
