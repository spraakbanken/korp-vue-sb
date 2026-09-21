import {
  isTotalRow,
  type AbsRelSeq,
  type StatisticsProcessed,
} from "@/core/statistics/statistics.types"
import { injectionKeys } from "@/injection"
import { groupBy } from "lodash-es"
import type { App } from "vue"

export default async function install(app: App) {
  app.provide(injectionKeys.statisticsPostprocess, npeglStatisticsPostprocess)
  app.provide(injectionKeys.attribute.listStringifiers, {
    npeglStringify: catToString,
  })
}

/** ABBA => ABA */
const filterDuplicates = (array: string[]) =>
  array.reduce((agg, val) => (agg[agg.length - 1] == val ? agg : [...agg, val]), [] as string[])

/** [a:1 a:1 b a:1 a:2] => "a b a a" */
export const catToString = (array: string[]) =>
  filterDuplicates(array)
    .map((item) => item.split(":")[0])
    .join(" ")

function npeglStatisticsPostprocess(result: StatisticsProcessed): StatisticsProcessed {
  const { rows, params } = result

  // Group rows that have the same representation of the e_cat attribute (e.g. [a:1 a:1] == [a:1])
  // Skip the totals row
  const groups = groupBy(rows.slice(1), (row) => {
    if (isTotalRow(row)) return Symbol()
    const values = swapLevels(row.statsValues)
    const repr = (attr: string) =>
      attr == "e_cat" ? catToString(values[attr].flat()) : values[attr].flat().join(" ")
    return params.reduceVals.map(repr).join("/")
  })

  // Merge the rows in each group
  const output = Object.values(groups).map((group) =>
    group.reduce((agg, row) => {
      // Sum up frequencies
      agg.total = add(agg.total, row.total)
      for (const corpusId in row.count) {
        agg.count[corpusId] = add(agg.count[corpusId] || [0, 0], row.count[corpusId])
      }

      // @ts-expect-error we have to let Korp know that the cqp expression we need to create
      // is like [] | [] | [], which Korp doesn't have a natural way to handle.
      agg.isPhraseLevelDisjunction = true
      // @ts-expect-error Usually a Record[], but for NPEGL a Record[][] to enable phrase-level disjunction.
      agg.statsValues.push(row.statsValues)

      // Include other things from row that are not yet in agg (rowId, formattedValue?)
      return { ...row, ...agg }
    }),
  )

  // Add total row on top.
  output.unshift(rows[0])

  return { rows: output, params }
}

/** Sum the abs/rel frequencies of two cells */
const add = (arr1: AbsRelSeq, arr2: AbsRelSeq): AbsRelSeq => [arr1[0] + arr2[0], arr1[1] + arr2[1]]

/** Convert a list of records to a record of lists (r[a][b] is now in r[b][a]). */
function swapLevels<T>(obj: Record<string, T>[]): Record<string, T[]> {
  const newObj: Record<string, T[]> = {}
  for (const key1 in obj) {
    for (const key2 in obj[key1]) {
      newObj[key2] ??= []
      newObj[key2][key1] = obj[key1][key2]
    }
  }
  return newObj
}
