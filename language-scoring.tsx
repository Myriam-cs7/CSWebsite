"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { setCookie, getCookie } from "cookies-next"

// Define language score interface
interface LanguageScore {
  code: string
  score: number
}

// Available languages
const AVAILABLE_LANGUAGES = ["en", "fr"]
const DEFAULT_LANGUAGE = "en"

export function useLanguageScoring() {
  const router = useRouter()
  const [languageScores, setLanguageScores] = useState<LanguageScore[]>([
    { code: "en", score: 0 },
    { code: "fr", score: 0 },
  ])
  const [currentLanguage, setCurrentLanguage] = useState<string>(DEFAULT_LANGUAGE)

  // Initialize language scores on component mount
  useEffect(() => {
    initializeLanguageScores()
  }, [])

  // Initialize language scores based on various factors
  const initializeLanguageScores = () => {
    const scores: LanguageScore[] = AVAILABLE_LANGUAGES.map((lang) => ({
      code: lang,
      score: calculateInitialScore(lang),
    }))

    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score)

    // Get the highest scoring language
    const preferredLanguage = scores[0].code

    // Set the current language
    const savedLanguage = getCookie("language") as string
    const languageToUse = savedLanguage || preferredLanguage

    setCurrentLanguage(languageToUse)
    setLanguageScores(scores)

    // Save to cookie if not already set
    if (!savedLanguage) {
      setCookie("language", languageToUse, { maxAge: 30 * 24 * 60 * 60 }) // 30 days
    }
  }

  // Calculate initial score for each language based on various factors
  const calculateInitialScore = (languageCode: string): number => {
    let score = 0

    // Factor 1: Browser language preferences
    const browserLanguages = navigator.languages || [navigator.language]
    browserLanguages.forEach((lang, index) => {
      const langCode = lang.split("-")[0].toLowerCase()
      if (langCode === languageCode) {
        // Give higher score to languages that appear earlier in the preferences list
        score += 50 - index * 10
      }
    })

    // Factor 2: Previously selected language (from cookie)
    const savedLanguage = getCookie("language") as string
    if (savedLanguage === languageCode) {
      score += 100 // Heavily favor previously selected language
    }

    // Factor 3: Geolocation-based scoring (simplified example)
    // In a real implementation, you might use a geolocation API
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (languageCode === "fr" && (userTimeZone.includes("Paris") || userTimeZone.includes("Europe"))) {
      score += 30
    }
    if (languageCode === "en" && (userTimeZone.includes("America") || userTimeZone.includes("London"))) {
      score += 30
    }

    return score
  }

  // Update scores when user selects a language
  const selectLanguage = (languageCode: string) => {
    // Update scores
    const updatedScores = languageScores.map((lang) => {
      if (lang.code === languageCode) {
        return { ...lang, score: lang.score + 50 } // Increase score for selected language
      }
      return lang
    })

    setLanguageScores(updatedScores)
    setCurrentLanguage(languageCode)

    // Save selection to cookie
    setCookie("language", languageCode, { maxAge: 30 * 24 * 60 * 60 }) // 30 days
  }

  return {
    currentLanguage,
    languageScores,
    selectLanguage,
  }
}

