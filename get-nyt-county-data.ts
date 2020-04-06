import { fetchWithCache } from "./utils"
import * as csvtojson from "csvtojson"


async function getNytCountyData() {
  const url = `https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv`
  const data = await fetchWithCache(url, `nyt-county-data.csv`)

  const jsonData = await csvtojson().fromString(data)

  return jsonData
}


export default getNytCountyData
