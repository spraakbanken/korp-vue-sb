import MsdWidget from "./MsdWidget.vue"
import ComplemgramWidget from "./ComplemgramWidget.vue"
import CompwfWidget from "./CompwfWidget.vue"
import type { Widget } from "@/search/extended/widgets/widget"
import type { MaybeConfigurable } from "@/core/config/config.types"

const widgets: Record<string, MaybeConfigurable<Widget>> = {
  msd: { component: MsdWidget },
  complemgramExtended: {
    component: ComplemgramWidget,
    noescape: true,
    options: { variant: "affix" },
  },
  // TODO Add `case_sensitive: true` to config
  compwf: { component: CompwfWidget, noescape: true, options: { case_sensitive: true } },
}

export default widgets
