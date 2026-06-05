import { Lemgram } from "@/core/lemgram"

export function getStringifiers(t: (key: string) => string) {
  /** Format compound lemgrams separated by "+" */
  const complemgram = (item: string) =>
    item.replace(/:.*$/, "")
      .split("+")
      .map((part) => Lemgram.parse(part)?.toHtml(t) || "(?)")
      .join(" + ")

  const compwf = (item: string) => item.split("+").join(" + ")

  return { complemgram, compwf }
}
