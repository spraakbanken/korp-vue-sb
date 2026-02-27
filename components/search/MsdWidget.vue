<script lang="ts" setup>
import type { LangString } from "@/core/model/locale"
import { useLocale } from "@/i18n/useLocale"
import type { WidgetProps } from "@/search/extended/widgets/widget"
import msdDataRaw from "@instance/assets/msd.yaml"

const msdData = msdDataRaw as {
  label: LangString
  options: { msd: string; label: LangString }[]
}[]

const model = defineModel<string>({ required: true })
defineProps<WidgetProps>()

const { locObj } = useLocale()
</script>

<template>
  <select v-model="model" class="form-select" style="max-width: 20rem">
    <optgroup v-for="({ label, options }, i) in msdData" :key="i" :label="locObj(label)">
      <option v-for="{ msd, label } in options" :key="msd" :value="msd">
        {{ msd }}: {{ locObj(label) }}
      </option>
    </optgroup>
  </select>
</template>
