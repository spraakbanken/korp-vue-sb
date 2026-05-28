<script lang="ts" setup>
/** @file Formatter with button that configured attribute values to clipboard */
import type { FormatterProps } from "@/results/formatter"
import type { KwicRowToken } from "@/core/kwic/kwic"

export type CopyRowButtonFormatterOptions = {
  /** What attributes to add to copied string; default is `["word"]` */
  attributes?: string[]
}

const props = defineProps<FormatterProps<CopyRowButtonFormatterOptions>>()

function copy() {
  const { row } = props.rowToken as KwicRowToken
  const lines: string[] = []
  for (const attr of props.options?.attributes || ["word"]) {
    // For struct attrs, add it once
    if (attr in row.structs) lines.push(row.structs[attr] || "")
    // For token attrs, add one for each token, tab-separated
    else lines.push(row.tokens.map((token) => token.attrs[attr] || "").join("\t"))
  }
  navigator.clipboard.writeText(lines.join("\n"))
}
</script>

<template>
  <button type="button" class="btn btn-secondary btn-sm" @click="copy()">
    <fa-icon icon="fa-solid fa-copy" class="me-1" /> {{ $t("result.formatter.copy_row") }}
  </button>
</template>
