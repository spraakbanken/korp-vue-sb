import type { FrequencyCounts } from "@/core/backend/korp-api"
import {
  type PhraseLevelDisjunctionRow,
  type StandardSingleRow,
  type StatisticsResult,
} from "@/core/statistics/statistics.types"
import { injectionKeys } from "@/injection"
import { groupBy, mapValues } from "lodash-es"
import type { App } from "vue"

export default async function install(app: App) {
  app.provide(injectionKeys.hook.statisticsPostprocess, npeglStatisticsPostprocess)
  app.provide(injectionKeys.attribute.listStringifiers, {
    npeglStringify: catToString,
  })
}

/** ABBA => ABA */
const filterDuplicates = (array: (string | null)[]) =>
  array.reduce(
    (agg, val) => (agg[agg.length - 1] == val ? agg : [...agg, val]),
    [] as (string | null)[],
  )

/** [a:1 a:1 b a:1 a:2] => "a b a a" */
export const catToString = (array: (string | null)[]) =>
  filterDuplicates(array)
    .map((item) => item?.split(":")[0])
    .join(" ")

function npeglStatisticsPostprocess(result: StatisticsResult) {
  // Group rows that have the same representation of the e_cat attribute (e.g. [a:1 a:1] == [a:1])
  // Skip the totals row
  const singleRows = result.rows.slice(1) as StandardSingleRow[]
  const groups = groupBy(singleRows, (row) => {
    // Group values first by attribute, then token
    const values = row.value
    const repr = (attr: string) =>
      attr == "e_cat" ? catToString(values[attr].flat()) : values[attr].flat().join(" ")
    return result.reduceVals.map(repr).join("/")
  })

  // Merge the rows in each group
  const output = Object.values(groups).map((group) => {
    // Convert to phrase-level disjunction rows
    const rowsNew: PhraseLevelDisjunctionRow[] = group.map((row) => ({
      ...row,
      isPhraseLevelDisjunction: true,
      values: [row.value],
    }))
    // Sum up frequencies
    return rowsNew.reduce((agg, row) => {
      agg.combined = add(agg.combined, row.combined)
      agg.corpora = mapValues(row.corpora, (val, corpusId) => add(agg.corpora[corpusId], val))
      agg.values.push(row.value)
      return agg
    })
  })

  // Re-sort after merging
  output.sort((a, b) => b.combined.absolute - a.combined.absolute)
  // Add total row on top
  result.rows = [result.rows[0], ...output]
}

/** Sum the abs/rel frequencies of two cells */
const add = (a: FrequencyCounts, b: FrequencyCounts): FrequencyCounts => ({
  absolute: a.absolute + b.absolute,
  relative: a.relative + b.relative,
})
