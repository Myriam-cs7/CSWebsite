"use client"

import { useState, useEffect } from "react"
import { useLanguageScoring } from "./language-scoring"
import { useTranslation } from "./translations"
import { FlagIcon } from "./flag-icons"

export default function LanguageSwitcher() {
  const { currentLanguage, selectLanguage } = useLanguageScoring()
  const { setLanguage } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  // Update the translation context when language changes
  useEffect(() => {
    setLanguage(currentLanguage)
  }, [currentLanguage, setLanguage])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLanguageSelect = (lang: string) => {
    selectLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <FlagIcon code={currentLanguage} className="w-5 h-5" />
        <span className="sr-only">Select language</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => handleLanguageSelect("en")}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${
                currentLanguage === "en" ? "bg-gray-100" : ""
              } hover:bg-gray-100`}
              role="menuitem"
            >
              <FlagIcon code="en" className="w-5 h-5" />
              <span>English</span>
              {currentLanguage === "en" && (
                <svg
                  className="ml-auto h-4 w-4 text-[#cfaa5c]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <button
              onClick={() => handleLanguageSelect("fr")}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 text-sm ${
                currentLanguage === "fr" ? "bg-gray-100" : ""
              } hover:bg-gray-100`}
              role="menuitem"
            >
              <FlagIcon code="fr" className="w-5 h-5" />
              <span>Français</span>
              {currentLanguage === "fr" && (
                <svg
                  className="ml-auto h-4 w-4 text-[#cfaa5c]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

