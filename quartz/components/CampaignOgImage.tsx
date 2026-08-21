import type { SocialImageOptions } from "../../.quartz/plugins/og-image/dist/index.js"

const fontName = (font: string | { name: string }) => (typeof font === "string" ? font : font.name)

export const campaignOgImage: SocialImageOptions["imageStructure"] = ({
  cfg,
  title,
  description,
  fileData,
}) => {
  const typography = (
    cfg.theme as {
      typography: {
        header: string | { name: string }
        body: string | { name: string }
      }
    }
  ).typography
  const slug = String(fileData.slug ?? "")
  const isDarkSun = slug.includes("dark-sun")
  const isMoonsea = slug.includes("moonsea")
  const accent = isDarkSun ? "#e79545" : isMoonsea ? "#dfcb78" : "#83b7c7"
  const accentSoft = isDarkSun ? "#7b3426" : isMoonsea ? "#244b62" : "#31596a"
  const campaign = isDarkSun
    ? "BORN UNDER A DARK SUN"
    : isMoonsea
      ? "TYRANNY ON THE MOONSEA"
      : "CAMPAIGN CODEX"
  const section = slug.includes("/characters/")
    ? "CHARACTER"
    : slug.includes("/npcs/")
      ? "PERSON OF INTEREST"
      : slug.includes("/locations/")
        ? "LOCATION"
        : slug.includes("/sessions/")
          ? "SESSION RECORD"
          : slug.includes("/items/")
            ? "ITEM"
            : slug.includes("/factions/")
              ? "FACTION"
              : "CAMPAIGN ARCHIVE"
  const tags = (fileData.frontmatter?.tags ?? []).slice(0, 3)
  const headerFont = fontName(typography.header)
  const bodyFont = fontName(typography.body)
  const titleSize = title.length > 54 ? 60 : title.length > 34 ? 68 : 78

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: isDarkSun
          ? "linear-gradient(135deg, #1a0d0a 0%, #35160f 54%, #0b1116 100%)"
          : "linear-gradient(135deg, #06121a 0%, #102a39 56%, #071119 100%)",
        color: "#fffaf0",
        fontFamily: bodyFont,
      }}
    >
      <div
        style={{
          display: "flex",
          position: "absolute",
          width: "540px",
          height: "540px",
          right: "-125px",
          top: "-175px",
          border: `3px solid ${accent}`,
          borderRadius: "50%",
          opacity: 0.18,
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          width: "390px",
          height: "390px",
          right: "-50px",
          top: "-100px",
          border: `24px solid ${accentSoft}`,
          borderRadius: "50%",
          opacity: 0.34,
        }}
      />
      <div
        style={{
          display: "flex",
          position: "absolute",
          left: "34px",
          top: "34px",
          width: "1132px",
          height: "562px",
          border: `2px solid ${accent}`,
          borderRadius: "10px",
          opacity: 0.58,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          padding: "64px 76px 56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: accent }}>
          <div
            style={{
              display: "flex",
              width: "36px",
              height: "36px",
              border: `3px solid ${accent}`,
              borderRadius: "50%",
              marginRight: "18px",
            }}
          />
          <div style={{ display: "flex", fontSize: "22px", fontWeight: 700, letterSpacing: "3px" }}>
            {campaign} · {section}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "62px",
            maxWidth: "970px",
            fontFamily: headerFont,
            fontSize: `${titleSize}px`,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-1px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            width: "104px",
            height: "5px",
            marginTop: "28px",
            borderRadius: "3px",
            backgroundColor: accent,
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: "25px",
            maxWidth: "960px",
            color: "#e9e4d8",
            fontSize: "27px",
            lineHeight: 1.3,
            overflow: "hidden",
          }}
        >
          {description || "A record from the adventures of the team you've definitely heard of."}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            color: accent,
            fontSize: "17px",
            letterSpacing: "2px",
          }}
        >
          <div style={{ display: "flex" }}>THE TEAM YOU’VE DEFINITELY HEARD OF</div>
          <div style={{ display: "flex", gap: "10px" }}>
            {tags.map((tag) => (
              <div
                style={{
                  display: "flex",
                  padding: "7px 12px",
                  border: `1px solid ${accent}`,
                  borderRadius: "16px",
                  letterSpacing: "0",
                  fontSize: "15px",
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
