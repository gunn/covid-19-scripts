import { fetchWithCache } from "./utils"
import { JSDOM } from "jsdom"


const CURRENT_CASES_URL = "https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases/covid-19-current-cases-details"


async function getNzData() {
  const html = await fetchWithCache(CURRENT_CASES_URL, "nz-current-cases.html")

  const doc = new JSDOM(html).window.document
  const rows = doc.querySelectorAll("table")[0].querySelectorAll("tr")

  const casesByDhb = {}

  rows.forEach(tr=> {
    const [
      date, sex, age, dhb,
      internationalTravel, lastCountry, flightNumber,
      departureDate, ArrivalDate
    ] = Array.from(tr.children).map((d: any)=> d.innerHTML)

    casesByDhb[dhb] ?? (casesByDhb[dhb]=0)
    casesByDhb[dhb]++
  })

  const dhbData = []

  Object.keys(DHBs).map(name=> {
    const { population, lat, long } = DHBs[name]
    const confirmed = casesByDhb[name]

    dhbData.push({
      country: "NZ",
      state: name,
      population,
      confirmed,
      confirmedPer100K: +(((1e5 * +confirmed) / population) || 0).toFixed(2),
      lat,
      long
    })
  })

  return dhbData
}


export default getNzData


// 2009 population figures from https://en.wikipedia.org/wiki/District_health_board
const DHBs = {
  Auckland             : {population: 441100, long: 174.763336,    lat: -36.848461},
  "Bay of Plenty"      : {population: 207700, long: 176.430446,    lat: -37.869893},
  Canterbury           : {population: 502000, long: 172.447311,    lat: -43.207942},
  "Counties Manukau"   : {population: 481700, long: 174.758782,    lat: -37.186531},
  "Hawkes Bay"         : {population: 153900, long: 176.864333186, lat: -39.6253576},
  "Hutt Valley"        : {population: 142700, long: 175.075922,    lat: -41.158816},
  Lakes                : {population: 101800, long: 176.217034,    lat: -38.481834},
  "Mid Central"        : {population: 166000, long: 175.939658,    lat: -40.482573},
  "Nelson Marlborough" : {population: 136800, long: 172.838,       lat: -41.521829},
  Northland            : {population: 155800, long: 173.821143,    lat: -35.482481},
  "South Canterbury"   : {population: 55600,  long: 170.94153,     lat: -44.237391},
  Southern             : {population: 300400, long: 170.000026,    lat: -45.846091},
  Tairawhiti           : {population: 46200,  long: 178.0233579,   lat: -38.6608879},
  Taranaki             : {population: 108300, long: 174.363663,    lat: -39.287899},
  Waikato              : {population: 365700, long: 175.490928,    lat: -37.963374},
  Wairarapa            : {population: 39900,  long: 175.417743332, lat: -41.2673998},
  Waitemata            : {population: 528500, long: 174.528991,    lat: -36.52623},
  "Capital and Coast"  : {population: 288100, long: 174.7772114,   lat: -41.2887953},
  "West Coast"         : {population: 32600,  long: 171.475371,    lat: -42.017893},
  Whanganui            : {population: 63200,  long: 175.0478901,   lat: -39.9300887}
}
