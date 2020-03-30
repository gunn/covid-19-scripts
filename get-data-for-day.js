const fetch = require("node-fetch")
const csvtojson = require("csvtojson")


async function csvDataForDay(dateString) {
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${dateString}.csv`
  const resp = await fetch(url)
  const data = await resp.text()

  return data
}

async function dataForDay(dateString) {
  const csvData  = csvDataForDay(dateString)
  const jsonData = await csvtojson().fromString(csvData)

  return csvData
}

module.exports = dataForDay
