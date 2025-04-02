"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// English translations
const en = {
  nav: {
    about: "About",
    features: "Features",
    benefits: "Benefits",
    pricing: "Pricing",
    blog: "Blog",
  },
  hero: {
    title: "Transform customer experience and build loyal relationships",
    description: "AI-powered skincare consultations that combine French luxury expertise with cutting-edge technology",
  },
  buttons: {
    tryFree: "Try for Free",
    watchDemo: "Watch Demo",
    requestDemo: "Request a Demo",
    contactSales: "Contact Sales",
  },
  chatbot: {
    online: "Online",
    placeholder: "Ask about skincare...",
    restart: "Restart conversation",
    product: {
      title: "Luxury Renewal Serum",
      description: "With hyaluronic acid & niacinamide",
    },
  },
  about: {
    badge: "Our Story",
    title: "Combining French Skincare Expertise with AI Innovation",
    paragraph1:
      "Founded in Paris in 2021, cAIre Solutions was born from a vision to transform how luxury skincare brands connect with their customers in the digital age.",
    paragraph2:
      "Our team combines decades of experience in the French luxury beauty industry with cutting-edge AI expertise to create solutions that maintain the personalized, high-touch experience of in-store consultations in the digital realm.",
    stats: {
      brands: "Luxury Brands",
      interactions: "Customer Interactions",
      satisfaction: "Customer Satisfaction",
      sales: "Sales Increase",
    },
  },
  features: {
    title: "Features Designed for Luxury Brands",
    description: "Our AI solutions are tailored specifically for premium skincare and beauty brands.",
    items: {
      recommendations: {
        title: "Personalized Recommendations",
        description: "AI-powered product suggestions based on individual skin concerns and goals.",
      },
      protection: {
        title: "Brand Protection",
        description: "Ensure your AI assistant maintains your brand voice and luxury positioning.",
      },
      loyalty: {
        title: "Loyalty Integration",
        description: "Seamlessly connect with your existing loyalty and CRM systems.",
      },
      integration: {
        title: "Easy Integration",
        description: "Simple implementation with your existing e-commerce platform.",
      },
    },
  },
  benefits: {
    title: "Transform Your Customer Experience",
    description: "Discover how our AI solutions can elevate your brand's digital presence.",
    videoText: "See cAIre in action",
    button: "Learn more about our benefits",
    results: {
      conversion: "Conversion Rate",
      satisfaction: "Customer Satisfaction",
      orderValue: "Average Order Value",
      retention: "Customer Retention",
    },
    items: {
      conversion: {
        title: "Increase Conversion Rates",
        description:
          "Guide customers to the perfect products for their needs, increasing purchase likelihood by an average of 35%.",
      },
      satisfaction: {
        title: "Enhance Customer Satisfaction",
        description: "Provide instant, accurate skincare advice that builds trust and confidence in your brand.",
      },
      insights: {
        title: "Gain Valuable Customer Insights",
        description: "Learn from every interaction to better understand your customers' needs and preferences.",
      },
      costs: {
        title: "Reduce Support Costs",
        description: "Automate routine inquiries while maintaining the luxury experience your customers expect.",
      },
    },
  },
  cta: {
    title: "Ready to Transform Your Customer Experience?",
    description: "Join leading luxury skincare brands already using cAIre Solutions to enhance their digital presence.",
  },
  footer: {
    description: "AI-powered skincare consultations combining French luxury expertise with cutting-edge technology.",
    company: "Company",
    resources: "Resources",
    contact: "Contact",
    copyright: "© 2023 cAIre Solutions. All rights reserved.",
    links: {
      documentation: "Documentation",
      caseStudies: "Case Studies",
      webinars: "Webinars",
      helpCenter: "Help Center",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      cookies: "Cookie Policy",
    },
  },
  contact: {
    location: "Paris, France",
    email: "contact@caire-solutions.com",
    phone: "+33 1 23 45 67 89",
  },
}

// French translations
const fr = {
  nav: {
    about: "À propos",
    features: "Fonctionnalités",
    benefits: "Avantages",
    pricing: "Tarifs",
    blog: "Blog",
  },
  hero: {
    title: "Transformez l'expérience client et créez des relations fidèles",
    description:
      "Consultations de soins de la peau alimentées par l'IA qui combinent l'expertise du luxe français et la technologie de pointe",
  },
  buttons: {
    tryFree: "Essai Gratuit",
    watchDemo: "Voir la Démo",
    requestDemo: "Demander une Démo",
    contactSales: "Contacter les Ventes",
  },
  chatbot: {
    online: "En ligne",
    placeholder: "Posez une question...",
    restart: "Redémarrer la conversation",
    product: {
      title: "Sérum Renouvellement Luxe",
      description: "Avec acide hyaluronique & niacinamide",
    },
  },
  about: {
    badge: "Notre Histoire",
    title: "Allier l'Expertise Française en Soins et l'Innovation IA",
    paragraph1:
      "Fondée à Paris en 2021, cAIre Solutions est née d'une vision visant à transformer la façon dont les marques de soins de luxe se connectent avec leurs clients à l'ère numérique.",
    paragraph2:
      "Notre équipe combine des décennies d'expérience dans l'industrie française de la beauté de luxe avec une expertise de pointe en IA pour créer des solutions qui maintiennent l'expérience personnalisée des consultations en magasin dans le domaine numérique.",
    stats: {
      brands: "Marques de Luxe",
      interactions: "Interactions Clients",
      satisfaction: "Satisfaction Client",
      sales: "Augmentation des Ventes",
    },
  },
  features: {
    title: "Fonctionnalités Conçues pour les Marques de Luxe",
    description: "Nos solutions IA sont spécialement adaptées aux marques de soins et de beauté haut de gamme.",
    items: {
      recommendations: {
        title: "Recommandations Personnalisées",
        description:
          "Suggestions de produits alimentées par l'IA basées sur les préoccupations et objectifs individuels.",
      },
      protection: {
        title: "Protection de la Marque",
        description:
          "Assurez-vous que votre assistant IA maintient la voix de votre marque et son positionnement luxe.",
      },
      loyalty: {
        title: "Intégration de Fidélité",
        description: "Connectez-vous facilement avec vos systèmes de fidélité et CRM existants.",
      },
      integration: {
        title: "Intégration Facile",
        description: "Mise en œuvre simple avec votre plateforme e-commerce existante.",
      },
    },
  },
  benefits: {
    title: "Transformez Votre Expérience Client",
    description: "Découvrez comment nos solutions IA peuvent élever la présence numérique de votre marque.",
    videoText: "Voir cAIre en action",
    button: "En savoir plus sur nos avantages",
    results: {
      conversion: "Taux de Conversion",
      satisfaction: "Satisfaction Client",
      orderValue: "Valeur Moyenne des Commandes",
      retention: "Fidélisation Client",
    },
    items: {
      conversion: {
        title: "Augmentez les Taux de Conversion",
        description:
          "Guidez les clients vers les produits parfaits pour leurs besoins, augmentant la probabilité d'achat de 35% en moyenne.",
      },
      satisfaction: {
        title: "Améliorez la Satisfaction Client",
        description:
          "Fournissez des conseils instantanés et précis sur les soins de la peau qui renforcent la confiance en votre marque.",
      },
      insights: {
        title: "Obtenez des Insights Clients Précieux",
        description: "Apprenez de chaque interaction pour mieux comprendre les besoins et préférences de vos clients.",
      },
      costs: {
        title: "Réduisez les Coûts de Support",
        description:
          "Automatisez les demandes de routine tout en maintenant l'expérience de luxe que vos clients attendent.",
      },
    },
  },
  cta: {
    title: "Prêt à Transformer Votre Expérience Client ?",
    description:
      "Rejoignez les grandes marques de soins de luxe qui utilisent déjà cAIre Solutions pour améliorer leur présence numérique.",
  },
  footer: {
    description:
      "Consultations de soins de la peau alimentées par l'IA combinant l'expertise du luxe français et la technologie de pointe.",
    company: "Entreprise",
    resources: "Ressources",
    contact: "Contact",
    copyright: "© 2023 cAIre Solutions. Tous droits réservés.",
    links: {
      documentation: "Documentation",
      caseStudies: "Études de Cas",
      webinars: "Webinaires",
      helpCenter: "Centre d'Aide",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      cookies: "Politique de Cookies",
    },
  },
  contact: {
    location: "Paris, France",
    email: "contact@caire-solutions.com",
    phone: "+33 1 23 45 67 89",
  },
}

// Create the translations object with all languages
const translations = { en, fr }

// Create the context
type TranslationType = typeof en
type LanguageContextType = {
  t: TranslationType
  language: string
  setLanguage: (lang: string) => void
}

const LanguageContext = createContext<LanguageContextType>({
  t: en,
  language: "en",
  setLanguage: () => {},
})

// Create the provider component
export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en")
  const [t, setT] = useState<TranslationType>(en)

  useEffect(() => {
    // Get language from cookie or localStorage if available
    const savedLanguage = typeof window !== "undefined" ? localStorage.getItem("language") || "en" : "en"

    setLanguage(savedLanguage)
    setT(translations[savedLanguage as keyof typeof translations] || en)
  }, [])

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang)
    setT(translations[lang as keyof typeof translations] || en)

    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Create the hook
export function useTranslation() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

