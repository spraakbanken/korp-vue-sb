import { Lemgram } from "@/core/lemgram"

export function getStringifiers(t: (key: string) => string) {
  /** Format compound lemgrams separated by "+" */
  const complemgram = (item: string) =>
    item
      .split("+")
      .map((part) => Lemgram.parse(part.replace(/:.*$/, ""))?.toHtml(t) || part)
      .join(" + ")

  const compwf = (item: string) => item.split("+").join(" + ")

  return { complemgram, compwf }
}
