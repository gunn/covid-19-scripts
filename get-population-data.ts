import fetch from "node-fetch"
import * as csvtojson from "csvtojson"


async function getPopulationData() {
  const url = `https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/counties/totals/co-est2019-alldata.csv`

  const resp = await fetch(url)
  const data = await resp.text()

  return csvtojson().fromString(data)
}

export default getPopulationData
