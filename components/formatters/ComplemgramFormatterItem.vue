<script lang="ts" setup>
/** @file Formats compound lemgrams by replacing internal search */
import { stringify } from "@/core/cqp/cqp"
import { type Condition } from "@/core/cqp/cqp.types"
import { Lemgram } from "@/core/lemgram"
import { regescape, splitFirst } from "@/core/util"
import DefaultFormatterItem, {
  type DefaultFormatterItemProps,
} from "@/results/sidebar/DefaultFormatterItem.vue"
import { useAppStore } from "@/store/useAppStore"
import { computed } from "vue"
import { useMatomo } from "vue3-matomo"

const props = defineProps<DefaultFormatterItemProps>()

const store = useAppStore()
const matomo = useMatomo()

/** Compound item split and parsed into lemgrams */
const lemgrams = computed(() => {
  const ids = splitFirst(":", props.item)[0].split("+")
  return ids.map(Lemgram.parse)
})

function search(lemgram: Lemgram) {
  const val = regescape(lemgram.id)
  const conditions: Condition[] = [
    { type: "complemgram", op: "starts_with_contains", val },
    { type: "complemgram", op: "incontains_contains", val },
    { type: "complemgram", op: "ends_with_contains", val },
  ]
  const query = [{ and_block: [conditions] }]

  // Show extended search and fill with generated query
  store.search_tab = 1
  store.search = "cqp"
  store.cqp = stringify(query)
  matomo.value?.trackEvent("Sidebar", "Search")
}
</script>

<template>
  <DefaultFormatterItem :attribute :item :rowToken>
    <template #internalSearch>
      <tr>
        <th>{{ $t("result.sidebar.search.complemgram") }}</th>
        <td>
          <ul class="list-unstyled">
            <li v-for="(lemgram, key) in lemgrams" :key>
              <a
                v-if="lemgram"
                href="#"
                v-html="lemgram?.toHtml($t)"
                @click.prevent="search(lemgram)"
              />
              <!-- Fallback for invalid lemgrams -->
              <span v-else>(?)</span>
            </li>
          </ul>
        </td>
      </tr>
    </template>
  </DefaultFormatterItem>
</template>
