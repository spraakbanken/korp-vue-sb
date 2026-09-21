<script setup lang="ts">
/**
 * Widget to select an NPEGL e_cat match pattern.
 *
 * Each option is associated with a `match` and an `exact` regex pattern. Which one to use depends on the operator.
 */
import type { WidgetProps } from "@/search/extended/widgets/widget"
import optionsRaw from "./npegl_ecat_options.yaml"
import { ref, watchEffect } from "vue"

/** Format of the options YAML */
type EcatOptions = Record<string, { exact: string; match: string }>

const options = optionsRaw as EcatOptions

const model = defineModel<string>({ required: true })

const props = defineProps<WidgetProps>()

/** Current selection. */
const selected = ref<string>()

const isRegex = () => props.operator.includes("*")

// Translate model value to selection
watchEffect(() => {
  const pair = Object.entries(options).find(
    ([, values]) => model.value == (isRegex() ? values.match : values.exact),
  )
  if (pair) selected.value = pair[0]
})

// Translate selection to model value
watchEffect(() => {
  if (!selected.value) return
  const item = options[selected.value]
  model.value = isRegex() ? item.match : item.exact
})
</script>

<template>
  <select class="form-select" v-model="selected">
    <option v-for="label in Object.keys(options)" :key="label">
      {{ label }}
    </option>
  </select>
</template>
