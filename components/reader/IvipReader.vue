<script lang="ts" setup>
import { type KwicRow, type KwicRowToken } from "@/core/kwic/kwic"
import { injectionKeys } from "@/injection"
import KwicToken from "@/results/kwic/KwicToken.vue"
import type { ReaderProps } from "@/results/text/text"
import { groupBy, pickBy, uniq } from "lodash-es"
import { computed, inject, ref, useTemplateRef, watch, type Ref } from "vue"

const COLORS = ["#888", "#1565c0", "#388e3c", "#00838f", "#ff3333", "#ff7700"]

const props = defineProps<ReaderProps>()

const selectedToken = inject(injectionKeys.selectedToken) as Ref<KwicRowToken | undefined>
const video = useTemplateRef("video")
/** Current video playback position in seconds */
const playpos = ref<number>()

const filename = computed(
  () => `${props.document.structs.text_mediafile}.${props.document.structs.text_mediafileext}`,
)

const url = computed(() => {
  const base = `https://spraakbanken.gu.se/korp/data/${props.corpus.id}/`
  return base + props.document.structs.text_mediafilepath + filename.value
})

const sentences = computed<KwicRow[]>(() => {
  // Split tokens into sentences
  const groups = groupBy(props.document.tokens, (token) => token.attrs.sentence_id)
  // Create rows for each sentence
  return Object.values(groups).map((tokens) => {
    const row = { ...props.document }
    row.id = props.document.id + tokens[0].id
    row.tokens = tokens
    const sentenceAttrs = pickBy(tokens[0].attrs, (_, key) => key.startsWith("sentence_"))
    row.structs = { ...row.structs, ...sentenceAttrs }
    return row
  })
})

const speakers = computed(() =>
  uniq(["paus", ...props.document.tokens.map((t) => t.attrs.sentence_speaker_id).filter(Boolean)]),
)

// Sync video playtime to ref
watch(video, () => {
  if (!video.value) return
  video.value.addEventListener("timeupdate", () => (playpos.value = video.value?.currentTime))
})

watch(selectedToken, () => {
  if (!selectedToken.value) return
  const start = parseInt(selectedToken.value.token.attrs.sentence_start || "0") / 1000
  if (video.value) video.value.currentTime = start
})

function isSentencePlaying(row: KwicRow) {
  if (!playpos.value) return false
  const start = parseInt(row.structs.sentence_start || "0") / 1000
  const end = parseInt(row.structs.sentence_end || "0") / 1000
  return playpos.value >= start && playpos.value < end
}
</script>

<template>
  <!-- Video element -->
  <video ref="video" controls controlslist="nodownload" autoplay class="w-100" style="height: 40vh">
    <source :src="url" type="video/mp4" />
    {{ $t("video.not_supported") }}
  </video>

  <!-- Utterances -->
  <article class="overflow-auto" style="height: 50vh">
    <div
      v-for="row in sentences"
      :key="row.structs.sentence_id!"
      class="hstack align-items-baseline gap-3"
      :class="{ 'bg-success-subtle': isSentencePlaying(row) }"
      :style="{ color: COLORS[speakers.indexOf(row.structs.sentence_speaker_id!) % COLORS.length] }"
    >
      <strong style="width: 3em">{{ row.structs.sentence_speaker_id }}</strong>
      <div class="font-monospace small" style="white-space: pre">
        <KwicToken v-for="(token, i) in row.tokens" :key="i" :rowToken="{ row, token }" />
      </div>
    </div>
  </article>
</template>
