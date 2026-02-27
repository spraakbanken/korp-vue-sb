<script lang="ts" setup>
import DefaultWidget, {
  type DefaultWidgetOptions,
} from "@/search/extended/widgets/DefaultWidget.vue"
import type { WidgetProps } from "@/search/extended/widgets/widget"
import { watch } from "vue"

const model = defineModel<string>({
  required: true,

  // Remove the `+` parts added when emitting
  get: (value) => {
    value = value.replace(/[\\+\.\*]*$/, "").replace(/^\\\+/, "")
    return value == ".+?" ? "" : value
  },

  // Emit input string with added `+` to target a given part of the compound
  set: (value) => {
    // Let empty string match anything
    value = value || ".+?"
    if (["starts_with_contains", "not_starts_with_contains"].includes(props.operator))
      return value + "\\+"
    else if (["ends_with_contains", "not_ends_with_contains"].includes(props.operator))
      return "\\+" + value
    else if (["incontains_contains", "not_incontains_contains"].includes(props.operator))
      return "\\+" + value + "\\+"

    return value
  },
})

const props = defineProps<WidgetProps<DefaultWidgetOptions>>()

// The model setter depends on the operator, but does not automatically react to changes.
watch(
  () => props.operator,
  () => (model.value = model.value),
)
</script>

<template>
  <DefaultWidget v-model="model" :attribute :operator :options />
</template>
