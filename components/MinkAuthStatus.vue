<script lang="ts" setup>
/** @file Enhances the fed-auth component with a modal with info about the Mink mode */
import AuthFedStatus from "@/auth/federated/AuthFedStatus.vue"
import { useAuth } from "@/auth/useAuth"
import ModalDialog, { type ConfirmDialog } from "@/components/ModalDialog.vue"
import { corpusListing } from "@/core/corpora/corpusListing"
import { onMounted } from "vue"

const auth = useAuth()

/** Controls the login dialog */
let loginDialog: ConfirmDialog | undefined
/** Controls the dialog to show when there are no corpora */
let emptyDialog: ConfirmDialog | undefined

onMounted(() => {
  // Show modal if not logged in
  if (!auth.isLoggedIn()) {
    loginDialog?.reveal()
  } else if (!corpusListing.corpora.length) {
    emptyDialog?.reveal()
  }

  // Go to login if user confirms
  loginDialog?.onConfirm(() => auth.login())
})
</script>

<template>
  <AuthFedStatus />

  <ModalDialog
    @setup="loginDialog = $event"
    :title="$t('auth.login')"
    size="md"
    :confirm-label="$t('auth.login')"
    disable-cancel
  >
    <img src="@instance/assets/mink.svg" alt="Mink" class="d-block mx-auto mb-3" />
    <p>{{ $t("mink.login.help") }}</p>
    <p class="mb-0">
      <a :href="$t('mink.link.url')" target="_blank">{{ $t("mink.link.label") }}</a>
    </p>
  </ModalDialog>

  <ModalDialog @setup="emptyDialog = $event" :title="$t('mink.empty')" size="md" disable-cancel>
    <img src="@instance/assets/mink.svg" alt="Mink" class="d-block mx-auto mb-3" />
    <p>{{ $t("mink.empty.text") }}</p>
    <p class="mb-0">
      <i18n-t keypath="mink.empty.create" scope="global">
        <template #mink>
          <a :href="$t('mink.link.url')" target="_blank">Mink</a>
        </template>
      </i18n-t>
    </p>
    <!-- Hide OK button -->
    <template #footer><div></div></template>
  </ModalDialog>
</template>
