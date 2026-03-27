import type { MaybeConfigurable } from "@/core/config/config.types"
import IvipVideo from "./IvipVideo.vue"
import type { Formatter } from "@/results/formatter"

const formatters: Record<string, MaybeConfigurable<Formatter>> = {
  ivipVideo: { component: IvipVideo },
}

export default formatters
