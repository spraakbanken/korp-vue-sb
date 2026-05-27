<script lang="ts" setup>
/** @file Enhances the fed-auth component with a modal with info about the Mink mode */
import AuthFedStatus from "@/auth/federated/AuthFedStatus.vue"
import { useAuth } from "@/auth/useAuth"
import ModalDialog, { type ConfirmDialog } from "@/components/ModalDialog.vue"
import { onMounted } from "vue"

const auth = useAuth()

let dialog: ConfirmDialog | undefined

onMounted(() => {
  // Show modal if not logged in
  if (!auth.isLoggedIn()) {
    dialog?.reveal()
  }

  // Go to login if user confirms
  dialog?.onConfirm(() => auth.login())
})
</script>

<template>
  <AuthFedStatus />

  <!-- TODO Button label "Log in" -->
  <ModalDialog @setup="dialog = $event" :title="$t('auth.login')" size="md" disable-cancel>
    <img src="@instance/assets/mink.svg" alt="Mink" class="d-block mx-auto mb-3" />
    <p>{{ $t("mink.login.help") }}</p>
    <p>
      <a :href="$t('mink.link.url')" target="_blank">{{ $t("mink.link.label") }}</a>
    </p>
    <p class="mb-0">{{ $t("mink.login.ask") }}</p>
  </ModalDialog>
</template>
