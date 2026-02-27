import MsdWidget from "./MsdWidget.vue"
import ComplemgramWidget from "./ComplemgramWidget.vue"
import CompwfWidget from "./CompwfWidget.vue"

export default {
  msd: { component: MsdWidget },
  complemgramExtended: {
    component: ComplemgramWidget,
    noescape: true,
    options: { variant: "affix" },
  },
  // TODO Add `case_sensitive: true` to config
  compwf: { component: CompwfWidget, noescape: true, options: { case_sensitive: true } },
}
