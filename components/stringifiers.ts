import { Lemgram } from "@/core/lemgram"
import { Saldo } from "@/core/saldo"
import { escape } from "lodash-es"

/** Split by "+", transform and join back with " + " */
const decompound = (item: string, parse?: (item: string) => string) =>
  item
    .split("+")
    .map((part) => (parse ? parse(part) : part))
    .join(" + ")

const stripRank = (item: string) => item.replace(/:.*/, "")

export function getStringifiers(t: (key: string) => string) {
  /** Format compound lemgrams separated by "+" */
  const complemgram = (item: string) => decompound(stripRank(item), lemgram)

  /** Format compound word forms separated by "+" */
  // TODO Add `stringify: compwf` to compwf attribute config
  const compwf = decompound

  /** Format a lemgram */
  const lemgram = (item: string) => Lemgram.parse(item)?.toHtml(t) || item

  /** Format a word baseform */
  const lemma = (item: string) => escape(item).replace(/_/g, " ")

  /** Format a ranked SALDO sense */
  const sense = (item: string) => Saldo.parse(stripRank(item))?.toHtml() || item

  return { complemgram, compwf, lemgram, lemma, sense }
}
