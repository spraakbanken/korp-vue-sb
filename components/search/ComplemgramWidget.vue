<script lang="ts" setup>
/**
 * Extended search widget for compound lemgram attribute.
 *
 * Compound lemgrams are separated by `+`: `<lemgram>[+<lemgram>...]:<score>`.
 * This widget wraps the standard lemgram widget and modifies the regex to account for the compound format.
 */
import LemgramAutocompleteWidget, {
  type LemgramAutocompleteOptions,
} from "@/search/extended/widgets/LemgramAutocompleteWidget.vue"
import type { WidgetProps } from "@/search/extended/widgets/widget"

const model = defineModel<string>({
  required: true,

  // Emit selected lemgram with added `+` (or `:score`) to target a given part of the compound
  set: (value) => {
    if (["starts_with_contains", "not_starts_with_contains"].includes(props.operator))
      return value + "\\+"
    else if (["ends_with_contains", "not_ends_with_contains"].includes(props.operator))
      return "\\+" + value + ":.*"
    else if (["incontains_contains", "not_incontains_contains"].includes(props.operator))
      return "\\+" + value + "\\+"

    return value
  },

  // Remove the `+` and `:score` parts that we added when emitting
  get: (value) => value.replace(/[\\+\.\*:]*$/, "").replace(/^\\\+/, ""),
})

const props = defineProps<WidgetProps<LemgramAutocompleteOptions>>()
</script>

<template>
  <LemgramAutocompleteWidget v-model="model" :attribute :operator :options />
</template>
