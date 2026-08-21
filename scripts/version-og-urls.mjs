import fs from "node:fs/promises"
import path from "node:path"

const outputDir = path.resolve(process.argv[2] ?? "public")
const version = process.env.OG_IMAGE_VERSION ?? "20260804-1"
const metaPattern =
  /(<meta\s+(?:property|name)="(?:og:image|og:image:url|twitter:image)"\s+content=")([^"]+)("\s*\/?>)/g

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(target)))
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(target)
  }
  return files
}

let updatedFiles = 0
let updatedTags = 0

for (const file of await walk(outputDir)) {
  const source = await fs.readFile(file, "utf8")
  const updated = source.replace(metaPattern, (match, before, url, after) => {
    const cleanUrl = url.replace(/(?:\?|&amp;)v=[^&"]+/, "")
    const separator = cleanUrl.includes("?") ? "&amp;" : "?"
    updatedTags += 1
    return `${before}${cleanUrl}${separator}v=${version}${after}`
  })

  if (updated !== source) {
    await fs.writeFile(file, updated)
    updatedFiles += 1
  }
}

console.log(`Versioned ${updatedTags} Open Graph image tags across ${updatedFiles} HTML files.`)
