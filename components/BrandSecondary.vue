<script setup lang="ts">
import { useI18n } from "vue-i18n"

const { locale } = useI18n()
</script>

<template>
  <div>
    <div class="alert alert-warning d-inline-block m-0 p-1 px-2 text-start">
      <h6 class="m-0">{{ $t("banner_v10.heading") }}</h6>
      <div>{{ $t("banner_v10.help") }}</div>
      <div>
        <a :href="`https://spraakbanken.gu.se/korp9/#?lang=${locale}`">{{
          $t("banner_v10.link_v9")
        }}</a>
      </div>
    </div>
  </div>
</template>
