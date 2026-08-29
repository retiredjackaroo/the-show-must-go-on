import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative } from "node:path"

const output = process.argv[2] ?? "public"
const root = join(process.cwd(), output)
const basePath = "/the-show-must-go-on/"
const failures = []

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

for (const file of walk(root).filter((entry) => entry.endsWith(".html"))) {
  const html = readFileSync(file, "utf8")
  const display = relative(root, file)
  if (/href=["'][^"']*Transcript[^"']*["']/i.test(html))
    failures.push(`${display}: transcript link`)
  if (
    /<(?:meta|link)\b(?=[^>]*(?:rel="canonical"|property="og:url"|property="twitter:url"))[^>]+(?:content|href)="[^"]*\/index(?:\.html)?"/i.test(
      html,
    )
  )
    failures.push(`${display}: /index metadata URL`)
  for (const href of html.matchAll(/<a\b[^>]*href="([^"#?]+)"/gi)) {
    const target = href[1]
    if (
      target.startsWith("http") ||
      target.startsWith("mailto:") ||
      target.startsWith("javascript:")
    )
      continue
    if (
      display !== "404.html" &&
      target.startsWith("/") &&
      !target.startsWith(basePath) &&
      !target.startsWith("/static/")
    )
      failures.push(`${display}: invalid base-path link ${target}`)
    if (!target.startsWith("/")) {
      const local = join(dirname(file), target)
      if (
        !existsSync(local) &&
        !existsSync(`${local}.html`) &&
        !existsSync(join(local, "index.html"))
      )
        failures.push(`${display}: missing target ${target}`)
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"))
  process.exit(1)
}
console.log("Public HTML links and metadata validated.")
