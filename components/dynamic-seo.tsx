"use client"

import { useEffect, useState } from "react"

interface SeoSettings {
  siteTitle: string
  siteDescription: string
  keywords: string
  googleAnalyticsId: string
  customHeadCode: string
}

const defaultSeoSettings: SeoSettings = {
  siteTitle: "Gerüstbauer24",
  siteDescription: "Das führende Verzeichnis für Gerüstbaufirmen in Deutschland. Finden Sie zuverlässige Gerüstbauer in Ihrer Nähe.",
  keywords: "Gerüstbau, Gerüstbauer, Gerüstbaufirma, Deutschland",
  googleAnalyticsId: "",
  customHeadCode: ""
}

export default function DynamicSeo() {
  const [mounted, setMounted] = useState(false)
  const [settings, setSettings] = useState<SeoSettings>(defaultSeoSettings)

  useEffect(() => {
    setMounted(true)
    const savedSeo = localStorage.getItem("seoSettings")
    if (savedSeo) {
      try {
        const parsed = JSON.parse(savedSeo)
        setSettings({ ...defaultSeoSettings, ...parsed })
      } catch (e) {
        console.error("Error parsing SEO settings:", e)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    if (settings.siteTitle) {
      document.title = settings.siteTitle
    }

    let metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute("content", settings.siteDescription)
    } else {
      metaDescription = document.createElement("meta")
      metaDescription.setAttribute("name", "description")
      metaDescription.setAttribute("content", settings.siteDescription)
      document.head.appendChild(metaDescription)
    }

    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute("content", settings.keywords)
    } else {
      metaKeywords = document.createElement("meta")
      metaKeywords.setAttribute("name", "keywords")
      metaKeywords.setAttribute("content", settings.keywords)
      document.head.appendChild(metaKeywords)
    }

    const existingCustomCode = document.getElementById("dynamic-custom-head-code")
    if (existingCustomCode) {
      existingCustomCode.remove()
    }

    if (settings.customHeadCode && settings.customHeadCode.trim()) {
      const container = document.createElement("div")
      container.id = "dynamic-custom-head-code"
      container.innerHTML = settings.customHeadCode
      
      const scripts = container.querySelectorAll("script")
      scripts.forEach((script) => {
        const newScript = document.createElement("script")
        if (script.src) {
          newScript.src = script.src
        } else {
          newScript.textContent = script.textContent
        }
        Array.from(script.attributes).forEach((attr) => {
          if (attr.name !== "src") {
            newScript.setAttribute(attr.name, attr.value)
          }
        })
        document.head.appendChild(newScript)
      })

      const nonScripts = container.querySelectorAll("meta, link, style")
      nonScripts.forEach((element) => {
        const clone = element.cloneNode(true) as HTMLElement
        document.head.appendChild(clone)
      })
    }

    if (settings.googleAnalyticsId && settings.googleAnalyticsId.trim() && settings.googleAnalyticsId !== "G-XXXXXXXXXX") {
      const existingGtag = document.getElementById("gtag-script")
      if (!existingGtag) {
        const gtagScript = document.createElement("script")
        gtagScript.id = "gtag-script"
        gtagScript.async = true
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`
        document.head.appendChild(gtagScript)

        const gtagInline = document.createElement("script")
        gtagInline.id = "gtag-inline"
        gtagInline.textContent = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings.googleAnalyticsId}');
        `
        document.head.appendChild(gtagInline)
      }
    }
  }, [mounted, settings])

  return null
}
