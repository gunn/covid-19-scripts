import getPopulationData from "./get-population-data"
import getDataForDay     from "./get-data-for-day"
import { generateDataWithCache } from "./utils"


async function getUsCounties() {
  return await generateDataWithCache("./outputs", "us-counties.json", async ()=> {
    const populationData = await getPopulationData()
    const populationByFips = populationData.reduce((obj, entry)=> {
      const fips = entry.STATE + entry.COUNTY
      obj[fips] = +entry.POPESTIMATE2019
      return obj
    }, {})
  
    const day = await getDataForDay("04-05-2020")
  
    const countyData = day
      .filter(d=> d.Country_Region=="US")
      .map(entry=> {
        const population = +populationByFips[entry.FIPS]
  
        return (
          {
            state:     entry.Province_State,
            subregion: entry.Admin2,
            lat:       +entry.Lat,
            long:      +entry.Long_,
  
            fips:      entry.FIPS,
            population
          }
        )
      })
    
    return JSON.stringify(countyData, null, 2)
  })
}

export default getUsCounties
