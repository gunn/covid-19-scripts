import { fetchWithCache } from "./utils"
import * as csvtojson from "csvtojson"


async function getPopulationData() {
  const url = `https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/counties/totals/co-est2019-alldata.csv`

  const data = await fetchWithCache(url, "pop.csv")

  return csvtojson({
    includeColumns: /(STATE|COUNTY|STNAME|CTYNAME|POPESTIMATE2019)/
  }).fromString(data)
}


export default getPopulationData
