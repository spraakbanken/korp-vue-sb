<script lang="ts" setup>
import type { LangString } from "@/core/model/locale"
import { useLocale } from "@/i18n/useLocale"
import type { WidgetProps } from "@/search/extended/widgets/widget"
import msdDataRaw from "@instance/assets/msd.yaml"
import { useId } from "vue"

const msdData = msdDataRaw as {
  label: LangString
  options: { msd: string; label: LangString }[]
}[]

const model = defineModel<string>({ required: true })
defineProps<WidgetProps>()

const { locObj } = useLocale()

const id = useId()
</script>

<template>
  <div class="hstack gap-1">
    <input class="form-control" v-model="model" size="10" />

    <!-- Help dropdown -->
    <div class="dropdown">
      <button
        :id="`${id}-help`"
        type="button"
        :title="$t('msd.menu')"
        class="btn btn-link btn-sm dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        :aria-label="$t('msd.menu')"
      ></button>

      <ul class="dropdown-menu" :aria-labelledby="`${id}-help`">
        <template v-for="({ label, options }, i) in msdData" :key="i">
          <li>
            <h6 class="dropdown-header">
              {{ locObj(label) }}
            </h6>
          </li>
          <li v-for="{ msd, label } in options" :key="msd">
            <a href="#" class="dropdown-item" @click.prevent="model = msd">
              <strong>{{ msd }}</strong
              >: {{ locObj(label) }}
            </a>
          </li>
          <div v-if="i < msdData.length - 1" class="dropdown-divider"></div>
        </template>
      </ul>
    </div>
  </div>
</template>
