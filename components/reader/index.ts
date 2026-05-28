import type { MaybeConfigurable } from "@/core/config/config.types"
import type { Reader } from "@/results/text/text"
import IvipReader from "./IvipReader.vue"

export const readers: Record<string, MaybeConfigurable<Reader>> = {
  ivipReadingMode: { component: IvipReader },
}
