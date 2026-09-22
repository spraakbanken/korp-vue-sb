import {
  type AbsRelSeq,
  type PhraseLevelDisjunctionRow,
  type SingleRow,
  type StatisticsProcessed,
} from "@/core/statistics/statistics.types"
import { injectionKeys } from "@/injection"
import { groupBy, mapValues } from "lodash-es"
import type { App } from "vue"

export default async function install(app: App) {
  app.provide(injectionKeys.statisticsPostprocess, npeglStatisticsPostprocess)
  app.provide(injectionKeys.attribute.listStringifiers, {
    npeglStringify: catToString,
  })
  app.provide(injectionKeys.attribute.cqpStringifiers, {
    npeglCQP: (tokens) =>
      "(" + tokens.map((item) => (item ? `_.e_cat="${item}"` : "!_.e_cat")).join(" | ") + ")",
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
  const singleRows = rows.slice(1) as SingleRow[]
  const groups = groupBy(singleRows, (row) => {
    // Group values first by attribute, then token
    const values = swapLevels(row.statsValues)
    const repr = (attr: string) =>
      attr == "e_cat" ? catToString(values[attr].flat()) : values[attr].flat().join(" ")
    return params.reduceVals.map(repr).join("/")
  })

  // Merge the rows in each group
  const output = Object.values(groups).map((group) => {
    // Convert to phrase-level disjunction rows
    const rowsNew: PhraseLevelDisjunctionRow[] = group.map((row) => ({
      ...row,
      isPhraseLevelDisjunction: true,
      statsValues: [row.statsValues],
    }))
    // Sum up frequencies
    return rowsNew.reduce((agg, row) => {
      agg.total = add(agg.total, row.total)
      agg.count = mapValues(row.count, (val, corpusId) => add(agg.count[corpusId], val))
      agg.statsValues.push(...row.statsValues)
      return agg
    })
  })

  // Re-sort after merging
  output.sort((a, b) => b.total[0] - a.total[0])
  // Add total row on top
  const rowsNew = [rows[0], ...output]

  return { rows: rowsNew, params }
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
