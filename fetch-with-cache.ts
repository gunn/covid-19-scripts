import * as fs from "fs"
import * as path from "path"
import fetch from "node-fetch"

const { readFile, writeFile, stat } = fs.promises


const CACHE_DIR = "./external-data"
const fileExists = async path => !!(await stat(path).catch(e => false))


async function fetchWithCache(url, cacheFile) {
  const filePath = path.join(CACHE_DIR, cacheFile)
  const exists = await fileExists(filePath)

  if (!exists) {
    const resp = await fetch(url)
    const data = await resp.text()
    await writeFile(filePath, data)
  }

  const buffer = await readFile(filePath)

  return buffer.toString()
}


export default fetchWithCache
