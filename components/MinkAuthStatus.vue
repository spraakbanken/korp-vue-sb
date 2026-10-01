<script lang="ts" setup>
/** @file Enhances the fed-auth component with a modal with info about the Mink mode */
import AuthFedStatus from "@/auth/federated/AuthFedStatus.vue"
import { useAuth } from "@/auth/useAuth"
import ModalDialog, { type ConfirmDialog } from "@/components/ModalDialog.vue"
import { corpusListing } from "@/core/corpora/corpusListing"

const auth = useAuth()

/** Controls the login dialog */
let loginDialog: ConfirmDialog | undefined
/** Controls the dialog to show when there are no corpora */
let emptyDialog: ConfirmDialog | undefined

function onLoginDialogReady(dialog: ConfirmDialog) {
  loginDialog = dialog
  if (!auth.isLoggedIn()) loginDialog.reveal()
  // Go to login if user confirms
  loginDialog?.onConfirm(() => auth.login())
}

function onEmptyDialogReady(dialog: ConfirmDialog) {
  emptyDialog = dialog
  if (auth.isLoggedIn() && !corpusListing.corpora.length) emptyDialog.reveal()
}
</script>

<template>
  <AuthFedStatus />

  <ModalDialog
    @setup="onLoginDialogReady"
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

  <ModalDialog @setup="onEmptyDialogReady" :title="$t('mink.empty')" size="md" disable-cancel>
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
