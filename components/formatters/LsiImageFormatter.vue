<script lang="ts" setup>
import type { FormatterProps } from "@/results/formatter"
import type { KwicRow } from "@/core/kwic/kwic"
import { computed } from "vue"

const REGEX = new RegExp("volume=(.*-.*)&pages=.*#page/(.*)/mode")

const props = defineProps<FormatterProps>()

const href = computed(() => (props.rowToken.row as KwicRow).structs.page_page_url)

const src = computed(() => {
  const matches = href.value?.match(REGEX)
  if (!matches) return null
  const volume = matches[1]
  const page = ("00" + matches[2]).slice(-3)
  return `https://spraakbanken.gu.se/korp/data/lsi/faksimil_thumb/thumb.lsi-v${volume}-${page}.jpg`
})
</script>

<template>
  <div>
    <a v-if="href && src" :href target="_blank">
      <img :src />
    </a>
  </div>
</template>
