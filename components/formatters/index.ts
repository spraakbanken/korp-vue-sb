import type { MaybeConfigurable } from "@/core/config/config.types"
import IvipVideoFormatter from "./IvipVideoFormatter.vue"
import type { Formatter } from "@/results/formatter"

const formatters: Record<string, MaybeConfigurable<Formatter>> = {
  ivipVideo: (options) => ({ component: IvipVideoFormatter, options }),
}

export default formatters
