import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const assets = path.join(root, "content/Campaigns/Moonsea/Assets")

const cards = [
  {
    source: "Pugs side quest team.png",
    output: "social-pugs-side-quest.png",
    eyebrow: "TYRANNY ON THE MOONSEA · SIDE QUEST",
    title: "Pug’s Side Quest",
    subtitle: "Enter as guests. Leave as guardians.",
  },
  {
    source: "The Moon Arch Test.png",
    output: "social-session-3-narrative.png",
    eyebrow: "CHAPTER 11 · SIDE QUEST · SESSION 3",
    title: "Enter as Guests,\nLeave as Guardians",
    subtitle: "The road finally reaches Myth Drannor.",
    portrait: true,
  },
  {
    source: "Session 3 - End of Ankheg Battle.png",
    output: "social-session-3-notes.png",
    eyebrow: "SESSION 3 · TABLE NOTES",
    title: "The Fight Below\nMyth Drannor",
    subtitle: "One ankheg dead. Two guardians grappled.",
  },
  {
    source: "Bullshit.png",
    output: "social-bullshit.png",
    eyebrow: "MORWYN’S FIELD SKETCHES",
    title: "Bullshit",
    subtitle: "Kjeorn’s celestial steed makes an introduction.",
  },
]

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

function textLines(text, x, y, size, gap) {
  return text
    .split("\n")
    .map((line, index) => `<tspan x="${x}" y="${y + index * gap}">${escapeXml(line)}</tspan>`)
    .join("")
}

for (const card of cards) {
  const source = path.join(assets, card.source)
  const output = path.join(assets, card.output)
  const titleLines = card.title.split("\n").length

  const background = await sharp(source)
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .modulate({ brightness: 0.72, saturation: 0.86 })
    .blur(card.portrait ? 8 : 1.2)
    .png()
    .toBuffer()

  const composites = [{ input: background }]

  if (card.portrait) {
    const portrait = await sharp(source)
      .resize(510, 590, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer()
    composites.push({ input: portrait, left: 664, top: 20 })
  }

  const overlay = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#07131b" stop-opacity="0.96"/>
          <stop offset="0.53" stop-color="#0a1821" stop-opacity="0.76"/>
          <stop offset="1" stop-color="#07131b" stop-opacity="0.16"/>
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.48" stop-color="#07131b" stop-opacity="0"/>
          <stop offset="1" stop-color="#07131b" stop-opacity="0.72"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <rect width="1200" height="630" fill="url(#floor)"/>
      <rect x="35" y="35" width="1130" height="560" rx="10" fill="none" stroke="#d7c27a" stroke-opacity="0.62" stroke-width="2"/>
      <circle cx="84" cy="86" r="22" fill="none" stroke="#d7c27a" stroke-width="3"/>
      <path d="M84 68 A18 18 0 1 0 84 104 A14 14 0 1 1 84 68" fill="#d7c27a"/>
      <text x="125" y="96" fill="#e8d999" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="3">${escapeXml(card.eyebrow)}</text>
      <text fill="#fffdf2" font-family="Georgia, serif" font-size="${titleLines > 1 ? 62 : 72}" font-weight="700">${textLines(card.title, 74, titleLines > 1 ? 270 : 320, titleLines > 1 ? 62 : 72, 76)}</text>
      <rect x="75" y="${titleLines > 1 ? 430 : 395}" width="105" height="5" rx="2.5" fill="#d7c27a"/>
      <text x="75" y="${titleLines > 1 ? 489 : 456}" fill="#f3eee0" font-family="Arial, sans-serif" font-size="27" font-weight="500">${escapeXml(card.subtitle)}</text>
      <text x="75" y="560" fill="#d7c27a" font-family="Arial, sans-serif" font-size="18" letter-spacing="2">THE TEAM YOU’VE DEFINITELY HEARD OF</text>
    </svg>`

  composites.push({ input: Buffer.from(overlay) })
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: "#07131b" } })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(output)
  console.log(path.relative(root, output))
}
