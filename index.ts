import * as fs from "fs"

import getPopulationData from "./get-population-data"
import getDataForDay     from "./get-data-for-day"


async function combineDataSets () {
  const populationData = await getPopulationData()
  const populationByFips = populationData.reduce((obj, entry)=> {
    const fips = entry.STATE + entry.COUNTY
    obj[fips] = +entry.POPESTIMATE2019
    return obj
  }, {})

  const day = await getDataForDay("03-31-2020")

  const countyData = day.map(entry=> {
    const population = +populationByFips[entry.FIPS]

    return (
      {
        country:   entry.Country_Region,
        state:     entry.Province_State,
        subregion: entry.Admin2,
        lat:       +entry.Lat,
        long:      +entry.Long_,

        fips:      entry.FIPS,
        population,

        confirmed: +entry.Confirmed,
        deaths:    +entry.Deaths,
        recovered: +entry.Recovered,

        confirmedPer100K: +(((1e5 * +entry.Confirmed) / population) || 0).toFixed(2),
        deathsPer100K:    +(((1e5 * +entry.Deaths   ) / population) || 0).toFixed(2),
        recoveredPer100K: +(((1e5 * +entry.Recovered) / population) || 0).toFixed(2),
        label: "",
        isLabel: false
      }
    )
  }).filter(d=> d.country=="US")

  fs.promises.writeFile("./output.json", JSON.stringify(countyData))
  console.log("Wrote data for", countyData.length, "US counties.")
}

combineDataSets()
