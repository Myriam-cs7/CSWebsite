"use client"

import { Button } from "@/components/ui/button"
import { Star, Play, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "../components/translations"
import LanguageSwitcher from "../components/language-switcher"
import { useSiteConfig } from "../components/site-config"
import AdminPanel from "../components/admin/admin-panel"

export default function Home() {
  const { t } = useTranslation()
  const { config } = useSiteConfig()

  // Animation states for chat
  const [messageIndex, setMessageIndex] = useState(0)
  const [showTyping, setShowTyping] = useState(false)
  const [currentText, setCurrentText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [showProductCard, setShowProductCard] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Trier les sections par ordre
  const sortedSections = [...config.sections].filter((section) => section.visible).sort((a, b) => a.order - b.order)

  // Messages pour le chatbot
  const messages = [
    {
      type: "assistant",
      content: "Hi there, I'm cAIre! Your personal luxury skincare assistant. How can I help you today?",
      typingSpeed: 30,
      delay: 500,
    },
    {
      type: "user",
      content: "I'm looking for a serum that helps with fine lines and hydration.",
      typingSpeed: 0, // User messages appear instantly
      delay: 1000,
    },
    {
      type: "assistant",
      content: "Based on your needs, I recommend our Luxury Renewal Serum with hyaluronic acid and niacinamide.",
      typingSpeed: 30,
      delay: 1200,
    },
    {
      type: "assistant",
      content: "Would you like to see our top recommendations?",
      typingSpeed: 30,
      delay: 800,
      withProduct: true,
    },
  ]

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messageIndex, currentText, showProductCard])

  // Start the conversation automatically
  useEffect(() => {
    startConversation()
  }, [])

  const startConversation = () => {
    setMessageIndex(0)
    setCurrentText("")
    setIsComplete(false)
    setShowProductCard(false)
    processNextMessage(0)
  }

  const processNextMessage = (index: number) => {
    if (index >= messages.length) {
      setIsComplete(true)
      return
    }

    const message = messages[index]

    if (message.type === "assistant") {
      setShowTyping(true)
      setCurrentText("")

      // Wait before starting to type
      setTimeout(() => {
        let charIndex = 0
        const text = message.content

        const typingInterval = setInterval(() => {
          if (charIndex < text.length) {
            setCurrentText((prev) => prev + text.charAt(charIndex))
            charIndex++
          } else {
            clearInterval(typingInterval)
            setShowTyping(false)

            // Show product card if this message has one
            if (message.withProduct) {
              setTimeout(() => {
                setShowProductCard(true)

                // Move to next message after showing product
                setTimeout(() => {
                  setMessageIndex(index + 1)
                  processNextMessage(index + 1)
                }, 1000)
              }, 500)
            } else {
              // Move to next message
              setTimeout(() => {
                setMessageIndex(index + 1)
                processNextMessage(index + 1)
              }, message.delay)
            }
          }
        }, message.typingSpeed)

        return () => clearInterval(typingInterval)
      }, message.delay)
    } else {
      // User messages appear immediately after a delay
      setTimeout(() => {
        setMessageIndex(index + 1)
        processNextMessage(index + 1)
      }, message.delay)
    }
  }

  // Function to reset and restart the conversation
  const restartConversation = () => {
    startConversation()
  }

  // Fonction pour rendre dynamiquement les sections
  const renderSection = (section) => {
    switch (section.id) {
      case "hero":
        return renderHeroSection(section)
      case "about":
        return renderAboutSection(section)
      case "features":
        return renderFeaturesSection(section)
      case "benefits":
        return renderBenefitsSection(section)
      case "pricing":
        return renderPricingSection(section)
      case "cta":
        return renderCtaSection(section)
      default:
        return null
    }
  }

  // Rendu de la section Hero
  const renderHeroSection = (section) => {
    const content = section.content

    return (
      <section className="relative bg-white text-black py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/5 z-0"></div>
        <div className="absolute inset-0 z-[-1] opacity-10">
          <div className="w-full h-full bg-gradient-to-r from-[#cfaa5c]/30 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 mb-10 md:mb-0 pr-0 md:pr-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {content.title.split("loyal").map((part, i) =>
                i === 0 ? (
                  <span key={i}>
                    {part}
                    <span className="text-[#cfaa5c]">loyal</span>
                  </span>
                ) : (
                  part
                ),
              )}
            </h1>

            <p className="text-xl text-gray-700 mb-8">{content.description}</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start">
              <Button className="bg-[#cfaa5c] hover:bg-[#b89548] transition-colors text-black text-lg py-6 px-8">
                {t.buttons.tryFree}
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 text-lg py-6 px-8 flex items-center gap-2"
                onClick={() => setShowVideo(!showVideo)}
              >
                <Play className="h-5 w-5" /> {t.buttons.watchDemo}
              </Button>
            </div>
          </div>

          {content.showChatbot && (
            <div className="md:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full overflow-hidden w-16 h-16 flex items-center justify-center bg-black">
                      <Image
                        src={config.logo || "/placeholder.svg"}
                        alt="cAIre Solutions Logo"
                        width={72}
                        height={72}
                        className="object-contain"
                      />
                    </div>
                    <span className="font-medium text-black text-lg">Glowbot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-500">{t.chatbot.online}</span>
                  </div>
                </div>

                <div ref={chatContainerRef} className="space-y-4 mb-6 h-[320px] overflow-y-auto px-1 py-2">
                  {/* Rendu des messages */}
                  {messages.slice(0, messageIndex).map((message, index) => (
                    <div
                      key={index}
                      className={`${
                        message.type === "assistant"
                          ? "bg-gray-100 rounded-lg p-3 max-w-[80%]"
                          : "bg-[#cfaa5c] text-white rounded-lg p-3 max-w-[80%] ml-auto"
                      } animate-fadeIn`}
                    >
                      <p className={message.type === "assistant" ? "text-gray-800" : "text-white"}>{message.content}</p>

                      {/* Product recommendation card */}
                      {message.withProduct && showProductCard && index === messageIndex - 1 && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mt-2 animate-fadeIn">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                              <Image
                                src="/images/serum.webp"
                                alt={t.chatbot.product.title}
                                width={64}
                                height={64}
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-black">{t.chatbot.product.title}</h4>
                              <p className="text-sm text-gray-600">{t.chatbot.product.description}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 fill-[#FFD700] text-[#FFD700]" />
                                <Star className="h-3 w-3 fill-[#FFD700] text-[#FFD700]" />
                                <Star className="h-3 w-3 fill-[#FFD700] text-[#FFD700]" />
                                <Star className="h-3 w-3 fill-[#FFD700] text-[#FFD700]" />
                                <Star className="h-3 w-3 fill-[#FFD700] text-[#FFD700]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Message en cours de saisie */}
                  {showTyping && (
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] animate-fadeIn">
                      <p className="text-gray-800">
                        {currentText}
                        <span className="inline-block w-1 h-4 ml-0.5 bg-gray-500 animate-blink"></span>
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={restartConversation}
                  className="bg-black text-white rounded-lg py-3 px-4 text-center hover:bg-gray-900 transition-colors cursor-pointer w-full"
                >
                  {isComplete ? t.chatbot.restart : t.chatbot.placeholder}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  // Rendu des autres sections (à implémenter selon vos besoins)
  const renderAboutSection = (section) => {
    const content = section.content

    return (
      <section id="about" className="bg-white text-black py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-12">
            <div className="md:w-1/3 mb-8 md:mb-0 md:sticky md:top-24">
              <div className="rounded-xl overflow-hidden relative aspect-[2/3] w-full max-w-[350px] mx-auto shadow-lg border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-b from-[#cfaa5c]/10 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-gray-500 font-medium">Portrait Photo</p>
                    <p className="text-sm text-gray-400 mt-2">Founder & CEO</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="inline-block bg-[#cfaa5c]/10 px-4 py-2 rounded-full text-[#cfaa5c] font-medium mb-4">
                {t.about.badge}
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.title}</h2>

              <div className="prose prose-lg max-w-none text-gray-700 mb-8">
                {content.paragraphs.map((paragraph, index) => (
                  <p key={index} className={index < content.paragraphs.length - 1 ? "mb-4" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
                {content.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-white rounded-lg shadow-sm transform transition-transform hover:scale-105 duration-300"
                  >
                    <div className="text-3xl font-bold text-[#cfaa5c] mb-1">{stat.value}</div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Implémentez les autres fonctions de rendu de section selon vos besoins

  const renderFeaturesSection = (section) => {
    // Implémentation du rendu de la section Features
    return <section id="features">...</section>
  }

  const renderBenefitsSection = (section) => {
    // Implémentation du rendu de la section Benefits
    return <section id="benefits">...</section>
  }

  const renderPricingSection = (section) => {
    // Implémentation du rendu de la section Pricing
    return <section id="pricing">...</section>
  }

  const renderCtaSection = (section) => {
    // Implémentation du rendu de la section CTA
    return <section>...</section>
  }

  return (
    <div className="min-h-screen">
      {/* Header - Black */}
      <header className="bg-black text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src={config.logo || "/placeholder.svg"}
                alt="cAIre Solutions Logo"
                width={180}
                height={180}
                className="object-contain"
              />
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              {t.nav.about}
            </a>
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              {t.nav.features}
            </a>
            <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">
              {t.nav.benefits}
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              {t.nav.pricing || "Pricing"}
            </a>
            <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
              {t.nav.blog}
            </Link>
          </nav>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                {t.nav.about}
              </a>
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                {t.nav.features}
              </a>
              <a
                href="#benefits"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                {t.nav.benefits}
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                {t.nav.pricing || "Pricing"}
              </a>
              <Link
                href="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
              >
                {t.nav.blog}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Rendu dynamique des sections */}
      {sortedSections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}

      {/* Footer - Black */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={config.logo || "/placeholder.svg"}
                  alt="cAIre Solutions Logo"
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <span className="text-xl font-light">
                  c<span className="text-[#cfaa5c]">AI</span>re Solutions
                </span>
              </div>
              <p className="text-gray-400">{t.footer.description}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.company}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                    {t.nav.about}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                    {t.nav.blog}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.resources}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t.footer.links.documentation}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t.footer.links.caseStudies}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">{t.footer.contact}</h4>
              <ul className="space-y-2">
                <li className="text-gray-400">{t.contact?.location || "Paris, France"}</li>
                <li>
                  <a
                    href="mailto:contact@caire-solutions.com"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {t.contact?.email || "contact@caire-solutions.com"}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">{t.footer.copyright}</p>
          </div>
        </div>
      </footer>

      {/* Panneau d'administration */}
      <AdminPanel />
    </div>
  )
}

