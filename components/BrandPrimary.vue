<script setup lang="ts">
import { useI18n } from "vue-i18n"
import { vPopover } from "@/bootstrap"
import ColorSchemeImg from "@/components/ColorSchemeImg.vue"
import korpSloganSwe from "@instance/assets/korp_slogan.svg"
import korpSloganSweLight from "@instance/assets/korp_slogan_light.svg"
import korpSloganEng from "@instance/assets/korp_slogan_en.svg"
import korpSloganEngLight from "@instance/assets/korp_slogan_en_light.svg"
import { computed } from "vue"

const { locale, t } = useI18n()

/** Link to homepage, i.e. without any hash params */
const selfUrl = window.location.href.replace(/#.*/, "")
const isLab = import.meta.env.VITE_LAB

// TODO Improve keyboard navigation; this link appears last in tab order
const labTooltip = computed(
  () =>
    `<div><strong>${t("lab.heading")}</strong> ${t("lab.help")}</div>
    <div><a href="/korp#${window.location.hash}">${t("lab.link")}</a></div>`,
)
</script>

<template>
  <div>
    <div class="d-inline-block position-relative">
      <a :href="selfUrl">
        <ColorSchemeImg
          :dark-src="locale == 'swe' ? korpSloganSweLight : korpSloganEngLight"
          :light-src="locale == 'swe' ? korpSloganSwe : korpSloganEng"
          alt="Korp"
          class="align-self-end"
        />
      </a>

      <!-- Lab mode indicator -->
      <button
        v-if="isLab"
        type="button"
        v-popover
        data-bs-toggle="popover"
        data-bs-html="true"
        :data-bs-content="labTooltip"
        :key="locale"
        style="cursor: help"
        class="position-absolute top-0 end-0 border-0 badge rounded-pill bg-warning fs-6"
      >
        <fa-icon icon="flask" />
        {{ $t("lab") }}
      </button>
    </div>
  </div>
</template>
