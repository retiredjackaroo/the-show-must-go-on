import { CustomOgImages } from "./.quartz/plugins/og-image/dist/index.js"
import { campaignOgImage } from "./quartz/components/CampaignOgImage"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

const config = await loadQuartzConfig()
const ogImageIndex = config.plugins.emitters.findIndex(
  (emitter) => emitter.name === "CustomOgImages",
)

if (ogImageIndex >= 0) {
  config.plugins.emitters[ogImageIndex] = CustomOgImages({
    colorScheme: "darkMode",
    width: 1200,
    height: 630,
    imageStructure: campaignOgImage,
  })
}

export default config
export const layout = await loadQuartzLayout()
