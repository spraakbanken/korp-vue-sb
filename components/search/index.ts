import MsdWidget from "./MsdWidget.vue"
import ComplemgramWidget from "./ComplemgramWidget.vue"

export default {
  msd: { component: MsdWidget },
  complemgramExtended: {
    component: ComplemgramWidget,
    props: { variant: "affix" },
    noescape: true,
  },
}
