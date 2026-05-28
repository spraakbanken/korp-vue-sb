<script setup lang="ts">
/** @file Formatter for showing a video clip in a dialog */
import ModalDialog, { type ConfirmDialog } from "@/components/ModalDialog.vue"
import { isKwicRowToken } from "@/core/kwic/kwic"
import { transformSeconds } from "@/core/util"
import { type FormatterProps } from "@/results/formatter"
import { whenever } from "@vueuse/core"
import { computed, ref, useTemplateRef, watch } from "vue"

export type IvipVideoFormatterOptions = {
  baseURL?: string
}

const props = defineProps<FormatterProps<IvipVideoFormatterOptions>>()

const isOpen = ref(false)
let dialog: ConfirmDialog | undefined
const video = useTemplateRef("video")
/** Whether playback is restricted to the given timespan. */
const playSentenceOnly = ref(true)
/** Whether playback has reached the end of the sentence. */
const atEndOfSentence = ref(false)

const structs = computed(() => {
  if (!isKwicRowToken(props.rowToken))
    throw new Error("IvipVideo formatter requires a KwicRowToken")
  return props.rowToken.row.structs
})

const start = computed(() => parseInt(props.rowToken.token.attrs.sentence_start || "0") / 1000)
const end = computed(() => parseInt(props.rowToken.token.attrs.sentence_end || "0") / 1000)

const filename = computed(
  () => `${structs.value.text_mediafile}.${structs.value.text_mediafileext}`,
)

const url = computed(() => {
  const base = props.options?.baseURL || ""
  return base + structs.value.text_mediafilepath + filename.value
})

// Open dialog when button is clicked
whenever(
  () => isOpen.value,
  () => dialog?.reveal(),
)

// Customize playback
watch(
  () => video.value,
  () => {
    if (!video.value) return
    // Play from sentence start
    video.value.currentTime = start.value
    // Pause at sentence end
    video.value.addEventListener("timeupdate", () => {
      if (!video.value) return
      if (video.value.currentTime > end.value && playSentenceOnly.value) {
        video.value.pause()
        atEndOfSentence.value = true
      }
    })
  },
)

function replay() {
  if (!video.value) return
  video.value.currentTime = start.value
  atEndOfSentence.value = false
  video.value.play()
}

function playAll() {
  playSentenceOnly.value = false
  atEndOfSentence.value = false
  video.value?.play()
}

function close() {
  isOpen.value = false
  playSentenceOnly.value = true
  atEndOfSentence.value = false
}
</script>

<template>
  <!-- Button to open video dialog -->
  <button type="button" class="btn btn-sm btn-secondary" @click="isOpen = true">
    <fa-icon icon="fa-solid fa-play" class="me-1" />
    {{ $t("video.show") }}
  </button>

  <ModalDialog
    :title="filename"
    :confirm-label="$t('close')"
    @setup="dialog = $event"
    @close="close()"
  >
    <div class="position-relative">
      <!-- Video element -->
      <video v-if="isOpen" ref="video" controls controlslist="nodownload" autoplay class="w-100">
        <source :src="url" type="video/mp4" />
        {{ $t("video.not_supported") }}
      </video>

      <!-- Overlay with replay controls -->
      <div
        v-if="atEndOfSentence"
        class="position-absolute top-0 bottom-0 h-100 w-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center gap-2"
      >
        <button type="button" class="btn btn-dark fw-bold fs-5" @click="replay()">
          <fa-icon icon="fa-solid fa-rotate-left" class="d-block mx-auto mt-2" size="xl" />
          {{ $t("video.replay") }}
        </button>
        <button type="button" class="btn btn-dark fw-bold fs-5" @click="playAll()">
          <fa-icon icon="fa-solid fa-play" class="d-block mx-auto mt-2" size="xl" />
          {{ $t("video.play_all") }}
        </button>
      </div>
    </div>

    <!-- Utterance info -->
    <table class="table mt-3">
      <tbody>
        <tr v-if="isKwicRowToken(rowToken)">
          <th>{{ $t("video.utterance") }}</th>
          <td>
            <span v-for="(token, i) in rowToken.row.tokens" :key="i">{{ token.word }} {{}}</span>
          </td>
        </tr>
        <tr>
          <th>{{ $t("video.span") }}</th>
          <td>{{ transformSeconds(start) }}–{{ transformSeconds(end) }}</td>
        </tr>
      </tbody>
    </table>
  </ModalDialog>
</template>
