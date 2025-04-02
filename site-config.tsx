"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Interface pour les sections du site
export interface SiteSection {
  id: string
  title: string
  description?: string
  visible: boolean
  order: number
  content: any
}

// Interface pour la configuration du site
export interface SiteConfig {
  sections: SiteSection[]
  logo: string
  primaryColor: string
  secondaryColor: string
}

// Configuration par défaut
const defaultConfig: SiteConfig = {
  sections: [
    {
      id: "hero",
      title: "Section Héro",
      visible: true,
      order: 1,
      content: {
        title: "Transform customer experience and build loyal relationships",
        description:
          "AI-powered skincare consultations that combine French luxury expertise with cutting-edge technology",
        showChatbot: true,
      },
    },
    {
      id: "about",
      title: "À Propos",
      visible: true,
      order: 2,
      content: {
        title: "Combining French Skincare Expertise with AI Innovation",
        paragraphs: [
          "Founded in Paris in 2021, cAIre Solutions was born from a vision to transform how luxury skincare brands connect with their customers in the digital age.",
          "Our team combines decades of experience in the French luxury beauty industry with cutting-edge AI expertise to create solutions that maintain the personalized, high-touch experience of in-store consultations in the digital realm.",
        ],
        stats: [
          { label: "Luxury Brands", value: "25+" },
          { label: "Customer Interactions", value: "15M+" },
          { label: "Customer Satisfaction", value: "98%" },
          { label: "Sales Increase", value: "35%" },
        ],
      },
    },
    {
      id: "features",
      title: "Fonctionnalités",
      visible: true,
      order: 3,
      content: {
        title: "Features Designed for Luxury Brands",
        description: "Our AI solutions are tailored specifically for premium skincare and beauty brands.",
        items: [
          {
            title: "Personalized Recommendations",
            description: "AI-powered product suggestions based on individual skin concerns and goals.",
            icon: "Star",
          },
          {
            title: "Brand Protection",
            description: "Ensure your AI assistant maintains your brand voice and luxury positioning.",
            icon: "Shield",
          },
          {
            title: "Loyalty Integration",
            description: "Seamlessly connect with your existing loyalty and CRM systems.",
            icon: "Heart",
          },
          {
            title: "Easy Integration",
            description: "Simple implementation with your existing e-commerce platform.",
            icon: "Code",
          },
        ],
      },
    },
    {
      id: "benefits",
      title: "Avantages",
      visible: true,
      order: 4,
      content: {
        title: "Transform Your Customer Experience",
        description: "Discover how our AI solutions can elevate your brand's digital presence.",
        items: [
          {
            title: "Increase Conversion Rates",
            description:
              "Guide customers to the perfect products for their needs, increasing purchase likelihood by an average of 35%.",
          },
          {
            title: "Enhance Customer Satisfaction",
            description: "Provide instant, accurate skincare advice that builds trust and confidence in your brand.",
          },
          {
            title: "Gain Valuable Customer Insights",
            description: "Learn from every interaction to better understand your customers' needs and preferences.",
          },
          {
            title: "Reduce Support Costs",
            description: "Automate routine inquiries while maintaining the luxury experience your customers expect.",
          },
        ],
        results: [
          { label: "Conversion Rate", value: "+35%" },
          { label: "Customer Satisfaction", value: "+42%" },
          { label: "Average Order Value", value: "+28%" },
          { label: "Customer Retention", value: "+45%" },
        ],
      },
    },
    {
      id: "pricing",
      title: "Tarifs",
      visible: true,
      order: 5,
      content: {
        title: "Simple, Transparent Pricing",
        description:
          "Choose the plan that's right for your brand. All plans include access to our core AI assistant technology.",
        plans: [
          {
            name: "Starter",
            price: "€499",
            period: "/month",
            description: "Perfect for small brands looking to enhance their online presence",
            features: [
              "AI Assistant Integration",
              "Basic Skincare Knowledge Base",
              "Up to 1,000 conversations/month",
              "Standard Analytics Dashboard",
              "Email Support",
            ],
            buttonText: "Get Started",
            highlighted: false,
          },
          {
            name: "Professional",
            price: "€999",
            period: "/month",
            description: "Ideal for growing brands seeking advanced personalization",
            features: [
              "Everything in Starter",
              "Advanced Skincare Knowledge Base",
              "Up to 5,000 conversations/month",
              "Advanced Analytics & Insights",
              "Product Recommendation Engine",
              "Priority Support",
              "Custom Branding",
            ],
            buttonText: "Start Free Trial",
            highlighted: true,
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "Tailored solutions for luxury brands with complex needs",
            features: [
              "Everything in Professional",
              "Unlimited conversations",
              "Dedicated Knowledge Base",
              "Multi-language Support",
              "Custom AI Training",
              "Dedicated Account Manager",
              "API Access",
              "24/7 Premium Support",
            ],
            buttonText: "Contact Sales",
            highlighted: false,
          },
        ],
      },
    },
    {
      id: "cta",
      title: "Appel à l'Action",
      visible: true,
      order: 6,
      content: {
        title: "Ready to Transform Your Customer Experience?",
        description:
          "Join leading luxury skincare brands already using cAIre Solutions to enhance their digital presence.",
        primaryButton: "Request a Demo",
        secondaryButton: "Contact Sales",
      },
    },
    {
      id: "footer",
      title: "Pied de Page",
      visible: true,
      order: 7,
      content: {
        description:
          "AI-powered skincare consultations combining French luxury expertise with cutting-edge technology.",
        copyright: "© 2023 cAIre Solutions. All rights reserved.",
        links: {
          company: ["About", "Careers", "Blog", "Press"],
          resources: ["Documentation", "Case Studies", "Webinars", "Help Center"],
          legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
        },
        contact: {
          location: "Paris, France",
          email: "contact@caire-solutions.com",
          phone: "+33 1 23 45 67 89",
        },
      },
    },
  ],
  logo: "/images/logo.png",
  primaryColor: "#cfaa5c",
  secondaryColor: "#000000",
}

// Créer le contexte
type SiteConfigContextType = {
  config: SiteConfig
  updateConfig: (newConfig: SiteConfig) => void
  updateSection: (sectionId: string, newContent: any) => void
  reorderSections: (sectionId: string, newOrder: number) => void
  toggleSectionVisibility: (sectionId: string) => void
}

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: defaultConfig,
  updateConfig: () => {},
  updateSection: () => {},
  reorderSections: () => {},
  toggleSectionVisibility: () => {},
})

// Créer le provider
export function SiteConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig)

  // Charger la configuration depuis le stockage local au démarrage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("siteConfig")
      if (savedConfig) {
        try {
          setConfig(JSON.parse(savedConfig))
        } catch (e) {
          console.error("Erreur lors du chargement de la configuration:", e)
        }
      }
    }
  }, [])

  // Mettre à jour la configuration complète
  const updateConfig = (newConfig: SiteConfig) => {
    setConfig(newConfig)
    if (typeof window !== "undefined") {
      localStorage.setItem("siteConfig", JSON.stringify(newConfig))
    }
  }

  // Mettre à jour une section spécifique
  const updateSection = (sectionId: string, newContent: any) => {
    const newConfig = { ...config }
    const sectionIndex = newConfig.sections.findIndex((s) => s.id === sectionId)

    if (sectionIndex !== -1) {
      newConfig.sections[sectionIndex].content = {
        ...newConfig.sections[sectionIndex].content,
        ...newContent,
      }
      updateConfig(newConfig)
    }
  }

  // Réorganiser les sections
  const reorderSections = (sectionId: string, newOrder: number) => {
    const newConfig = { ...config }
    const sectionIndex = newConfig.sections.findIndex((s) => s.id === sectionId)

    if (sectionIndex !== -1) {
      const section = newConfig.sections[sectionIndex]
      const oldOrder = section.order

      // Mettre à jour l'ordre de toutes les sections affectées
      newConfig.sections.forEach((s) => {
        if (oldOrder < newOrder && s.order > oldOrder && s.order <= newOrder) {
          s.order--
        } else if (oldOrder > newOrder && s.order < oldOrder && s.order >= newOrder) {
          s.order++
        }
      })

      section.order = newOrder
      updateConfig(newConfig)
    }
  }

  // Activer/désactiver la visibilité d'une section
  const toggleSectionVisibility = (sectionId: string) => {
    const newConfig = { ...config }
    const sectionIndex = newConfig.sections.findIndex((s) => s.id === sectionId)

    if (sectionIndex !== -1) {
      newConfig.sections[sectionIndex].visible = !newConfig.sections[sectionIndex].visible
      updateConfig(newConfig)
    }
  }

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        updateConfig,
        updateSection,
        reorderSections,
        toggleSectionVisibility,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  )
}

// Créer le hook
export function useSiteConfig() {
  const context = useContext(SiteConfigContext)
  if (context === undefined) {
    throw new Error("useSiteConfig doit être utilisé à l'intérieur d'un SiteConfigProvider")
  }
  return context
}

