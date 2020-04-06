import * as fs from "fs"
import * as path from "path"
import fetch from "node-fetch"


const { readFile, writeFile, stat } = fs.promises


const CACHE_DIR = "./external-data"
const fileExists = async path => !!(await stat(path).catch(e => false))


async function generateDataWithCache(dir, fileName, generateFunction) {
  const filePath = path.join(dir, fileName)
  const exists = await fileExists(filePath)

  if (!exists) {
    const data = await generateFunction()
    await writeFile(filePath, data)
  }

  const buffer = await readFile(filePath)
  return buffer.toString()
}


async function fetchWithCache(url, cacheFile) {
  return await generateDataWithCache(CACHE_DIR, cacheFile, async ()=> {
    const resp = await fetch(url)
    return await resp.text()
  })
}


export {
  fetchWithCache,
  generateDataWithCache
}
