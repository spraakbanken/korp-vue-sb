import type { MaybeConfigurable } from "@/core/config/config.types"
import IvipVideoFormatter from "./IvipVideoFormatter.vue"
import type { Formatter } from "@/results/formatter"
import LsiImageFormatter from "./LsiImageFormatter.vue"
import CopyRowButtonFormatter from "./CopyRowButtonFormatter.vue"
import ComplemgramFormatterItem from "./ComplemgramFormatterItem.vue"
import DefaultFormatter from "@/results/sidebar/DefaultFormatter.vue"

const formatters: Record<string, MaybeConfigurable<Formatter>> = {
  complemgram: {
    component: DefaultFormatter,
    options: { itemComponent: ComplemgramFormatterItem },
  },
  copyRowButton: (options) => ({ component: CopyRowButtonFormatter, options }),
  ivipVideo: (options) => ({ component: IvipVideoFormatter, options }),
  lsiImage: { component: LsiImageFormatter },
}

export default formatters
