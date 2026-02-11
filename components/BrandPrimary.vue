<script setup lang="ts">
import { useI18n } from "vue-i18n"
import ColorSchemeImg from "@/components/ColorSchemeImg.vue"
import korpSloganSwe from "@instance/assets/korp_slogan.svg"
import korpSloganSweLight from "@instance/assets/korp_slogan_light.svg"
import korpSloganEng from "@instance/assets/korp_slogan_en.svg"
import korpSloganEngLight from "@instance/assets/korp_slogan_en_light.svg"

const { locale } = useI18n()
</script>

<template>
  <ColorSchemeImg
    :dark-src="locale == 'swe' ? korpSloganSweLight : korpSloganEngLight"
    :light-src="locale == 'swe' ? korpSloganSwe : korpSloganEng"
    alt="Korp slogan"
    class="align-self-end"
  />
</template>
