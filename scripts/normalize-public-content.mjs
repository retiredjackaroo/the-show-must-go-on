import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"

const siteRoot = join(process.cwd(), "content")
const vaultRoot =
  "/Users/jamesrichardson/Documents/Obsidian Notes/Campaigns/Private Campaigns/The Show Must Go On"
const alt = {
  "Lucian Vale.png": "Lucian Vale, the party's human bard.",
  "Ordrin Emberkeg.png": "Ordrin Emberkeg, the party's dwarf war cleric.",
  "Thud Firebelly Portrait.png": "Thud Firebelly, the party's human barbarian.",
  "Arlen Marr.png": "Lieutenant Arlen Marr in military dress.",
  "Old Standard Inn.jpg": "The Old Standard Inn in Greyfen.",
  "Greyfen.jpg": "Greyfen, the marsh settlement and former fort.",
  "North Marsh Hunting Blind.jpg": "The hunting blind in the North Marsh.",
  "Greyfen Clinic.jpg": "The crowded Greyfen Clinic.",
  "Greyfen Shrine.jpg": "Greyfen Shrine, Brother Sen's sanctuary.",
  "Greyfen Wharf.jpg": "The wharf at Greyfen.",
  "North Marsh.jpg": "The North Marsh around Greyfen.",
  "Fen Mother Waters.jpg": "The Fen Mother in the marsh waters.",
  "Session 1 - Fen Mother Combat.png": "The party fighting the Fen Mother during Session 1.",
  "Greyfen Causeway.jpg": "The causeway leading toward Greyfen.",
  "Greyfen Return.jpg": "The party's return to Greyfen.",
  "Session 2 - Public Hearing.jpg": "The public hearing in Greyfen during Session 2.",
  "Greyfen Ferry Departure.jpg": "The ferry departing Greyfen with the party aboard.",
  "Session 2 - Fen Mother Prize.png":
    "The Fen Mother's body hauled aboard the ferry after the final fight.",
  "Session 2 - Mystery Interlude.jpg":
    "A polished talk-show studio with circular lights, chairs and a host's desk.",
}

function files(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const path = join(root, entry.name)
    return entry.isDirectory() ? files(path) : path.endsWith(".md") ? [path] : []
  })
}

function normalize(path) {
  const source = readFileSync(path, "utf8")
  const title = source.match(/^---\n[\s\S]*?^title:\s*["']?(.+?)["']?\s*$[\s\S]*?^---\n/m)?.[1]
  let output = source
  if (title) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    output = output.replace(new RegExp(`^# ${escaped}\\n\\n`, "m"), "")
  }
  output = output.replace(/!\[\[Assets\/([^\]|]+)\]\]/g, (match, asset) =>
    alt[asset] ? `![[Assets/${asset}|${alt[asset]}]]` : match,
  )
  if (output !== source) writeFileSync(path, output)
}

for (const siteFile of files(siteRoot)) {
  normalize(siteFile)
  const vaultFile = join(vaultRoot, relative(siteRoot, siteFile))
  try {
    if (statSync(vaultFile).isFile()) normalize(vaultFile)
  } catch {}
}
