import fetch from "node-fetch"
import fetchWithCache from "./fetch-with-cache"
import { JSDOM } from "jsdom"


const CURRENT_CASES_URL = "https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases/covid-19-current-cases-details"


async function getNzData() {
  // const resp = await fetch(CURRENT_CASES_URL)
  // const html = await resp.text()
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

  return casesByDhb
}


export default getNzData
