import * as fs from "fs"

import { generateDataWithCache } from "./utils"

import getNytCountyData  from "./get-nyt-county-data"
import getUsCounties     from "./get-us-counties"


async function outputUsCountyData() {
  const json = await generateDataWithCache("./outputs", "nyt.json", async ()=> {
    const usCountyJson = await getUsCounties()
    const usCounties = JSON.parse(usCountyJson)
    const usCountiesByFips = usCounties.reduce((obj, entry)=> {
      obj[entry.fips] = entry
      return obj
    }, {})
  
    // const day = await getDataForDay("04-06-2020")
    const nytCountyData = (await getNytCountyData()).map(entry=> {
      const county = usCountiesByFips[entry.fips]
      if (!county) return null
      const population = county.population
      return (
        {
          ...county,
          date: new Date(entry.date).toISOString(),
          cases:  +entry.cases,
          deaths: +entry.deaths,
          casesPer100K:  +(((1e5 * +entry.cases ) / population) || 0).toFixed(2),
          deathsPer100K: +(((1e5 * +entry.deaths) / population) || 0).toFixed(2)
        }
      )
    }).filter(d=> d)
      .filter(d=> d.subregion != "unassigned")

    return JSON.stringify(nytCountyData)
  })

  const data = JSON.parse(json)

  ;["cases", "deaths", "casesPer100K", "deathsPer100K"].map(field=> {
    // console.log(field, Math.max(...data.map(d=> d[field])))
    let maxField = {[field]: 0} as any
    data.forEach(f=> {
      if (f[field] > maxField[field]) maxField = f
    })

    console.log(field, maxField)
  })

  // console.log(JSON.parse(data).slice(0, 40))
}


outputUsCountyData()
