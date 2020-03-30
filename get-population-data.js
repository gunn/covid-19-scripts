const fetch = require("node-fetch")
const csvtojson = require("csvtojson")


async function getPopulationData(dateString) {
  const url = `https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/counties/totals/co-est2019-alldata.csv`

  const resp = await fetch(url)
  const data = await resp.text()

  return csvtojson().fromString(data)
}

module.exports = getPopulationData
