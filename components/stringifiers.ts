import { Lemgram } from "@/core/lemgram"
import { Saldo } from "@/core/saldo"
import { splitSuffix } from "@/core/util"
import { escape } from "lodash-es"

/** Split by "+", transform and join back with " + " */
const decompound = (item: string, parse?: (item: string) => string) =>
  item
    .split("+")
    .map((part) => (parse ? parse(part) : part))
    .join(" + ")

export function getStringifiers(t: (key: string) => string) {
  /** Format compound lemgrams separated by "+" */
  const complemgram = (item: string) => decompound(splitSuffix(item)[0], lemgram)

  /** Format compound word forms separated by "+" */
  const compwf = decompound

  /** Format a lemgram */
  const lemgram = (item: string) => Lemgram.parse(item)?.toHtml(t) || item

  /** Format a word baseform */
  const lemma = (item: string) => splitSuffix(escape(item))[0].replace(/_/g, " ")

  /** Format a ranked SALDO sense */
  const sense = (item: string) => Saldo.parse(splitSuffix(item)[0])?.toHtml() || item

  return { complemgram, compwf, lemgram, lemma, sense }
}
