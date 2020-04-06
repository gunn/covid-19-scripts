import { fetchWithCache } from "./utils"
import * as csvtojson from "csvtojson"


async function csvDataForDay(dateString) {
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${dateString}.csv`
  const data = await fetchWithCache(url, `csse-${dateString}.csv`)

  return data
}

async function dataForDay(dateString) {
  const csvData  = await csvDataForDay(dateString)
  const jsonData = await csvtojson().fromString(csvData)

  return jsonData
}


export default dataForDay
