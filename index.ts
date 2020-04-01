import getPopulationData from "./get-population-data"
import getDataForDay     from "./get-data-for-day"


async function combineDataSets () {
  const populationData = await getPopulationData()

  console.log(populationData.length)
  
  // TODO: implement function:

  // while day < today, day++
  // dayData=getDataForDay(day)
  // merge(populationData, dayData)
}

combineDataSets()
