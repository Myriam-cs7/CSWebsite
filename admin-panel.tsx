"use client"

import { useState } from "react"
import { useSiteConfig, type SiteSection } from "../site-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, X, Plus, Trash2 } from "lucide-react"
import { ColorPicker } from "./color-picker"

export default function AdminPanel() {
  const { config, updateConfig, updateSection, reorderSections, toggleSectionVisibility } = useSiteConfig()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [editingSection, setEditingSection] = useState<SiteSection | null>(null)

  // Fonction pour mettre à jour les couleurs du site
  const updateColors = (type: "primary" | "secondary", color: string) => {
    const newConfig = { ...config }
    if (type === "primary") {
      newConfig.primaryColor = color
    } else {
      newConfig.secondaryColor = color
    }
    updateConfig(newConfig)
  }

  // Fonction pour mettre à jour le logo
  const updateLogo = (logoUrl: string) => {
    const newConfig = { ...config }
    newConfig.logo = logoUrl
    updateConfig(newConfig)
  }

  // Fonction pour sauvegarder les modifications d'une section
  const saveSection = () => {
    if (editingSection) {
      const newConfig = { ...config }
      const index = newConfig.sections.findIndex((s) => s.id === editingSection.id)
      if (index !== -1) {
        newConfig.sections[index] = editingSection
        updateConfig(newConfig)
      }
      setEditingSection(null)
    }
  }

  // Fonction pour annuler l'édition d'une section
  const cancelEditing = () => {
    setEditingSection(null)
  }

  // Fonction pour déplacer une section vers le haut
  const moveSectionUp = (section: SiteSection) => {
    if (section.order > 1) {
      reorderSections(section.id, section.order - 1)
    }
  }

  // Fonction pour déplacer une section vers le bas
  const moveSectionDown = (section: SiteSection) => {
    const maxOrder = Math.max(...config.sections.map((s) => s.order))
    if (section.order < maxOrder) {
      reorderSections(section.id, section.order + 1)
    }
  }

  // Fonction pour éditer le contenu d'une section
  const editSectionContent = (section: SiteSection) => {
    setEditingSection({ ...section })
    setActiveTab("sections")
  }

  // Fonction pour mettre à jour un champ de texte dans la section en cours d'édition
  const updateEditingField = (field: string, value: any) => {
    if (editingSection) {
      setEditingSection({
        ...editingSection,
        content: {
          ...editingSection.content,
          [field]: value,
        },
      })
    }
  }

  // Trier les sections par ordre
  const sortedSections = [...config.sections].sort((a, b) => a.order - b.order)

  return (
    <>
      {/* Bouton flottant pour ouvrir le panneau d'administration */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-[#cfaa5c] text-white p-4 rounded-full shadow-lg hover:bg-[#b89548] transition-all"
        aria-label="Ouvrir le panneau d'administration"
      >
        {isOpen ? <X size={24} /> : <span className="font-bold">Éditer</span>}
      </button>

      {/* Panneau d'administration */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Panneau d'Administration</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
              <div className="border-b px-4">
                <TabsList className="h-12">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="sections">Sections</TabsTrigger>
                  <TabsTrigger value="colors">Couleurs</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <TabsContent value="general" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres Généraux</CardTitle>
                      <CardDescription>Configurez les paramètres généraux de votre site web</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="logo">Logo URL</Label>
                        <div className="flex gap-4 items-center">
                          <Input
                            id="logo"
                            value={config.logo}
                            onChange={(e) => updateLogo(e.target.value)}
                            placeholder="/images/logo.png"
                          />
                          {config.logo && (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                              <img
                                src={config.logo || "/placeholder.svg"}
                                alt="Logo"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sections" className="mt-0">
                  {editingSection ? (
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Éditer {editingSection.title}</CardTitle>
                          <CardDescription>Modifiez le contenu de cette section</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={cancelEditing}>
                            Annuler
                          </Button>
                          <Button size="sm" onClick={saveSection}>
                            <Save size={16} className="mr-2" /> Enregistrer
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Champs d'édition dynamiques basés sur la section */}
                        {editingSection.id === "hero" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="hero-title">Titre</Label>
                              <Input
                                id="hero-title"
                                value={editingSection.content.title}
                                onChange={(e) => updateEditingField("title", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="hero-description">Description</Label>
                              <Textarea
                                id="hero-description"
                                value={editingSection.content.description}
                                onChange={(e) => updateEditingField("description", e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="show-chatbot"
                                checked={editingSection.content.showChatbot}
                                onCheckedChange={(checked) => updateEditingField("showChatbot", checked)}
                              />
                              <Label htmlFor="show-chatbot">Afficher le chatbot</Label>
                            </div>
                          </>
                        )}

                        {editingSection.id === "about" && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="about-title">Titre</Label>
                              <Input
                                id="about-title"
                                value={editingSection.content.title}
                                onChange={(e) => updateEditingField("title", e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Paragraphes</Label>
                              {editingSection.content.paragraphs.map((paragraph: string, index: number) => (
                                <div key={index} className="flex gap-2">
                                  <Textarea
                                    value={paragraph}
                                    onChange={(e) => {
                                      const newParagraphs = [...editingSection.content.paragraphs]
                                      newParagraphs[index] = e.target.value
                                      updateEditingField("paragraphs", newParagraphs)
                                    }}
                                    rows={3}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      const newParagraphs = [...editingSection.content.paragraphs]
                                      newParagraphs.splice(index, 1)
                                      updateEditingField("paragraphs", newParagraphs)
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newParagraphs = [...editingSection.content.paragraphs, "Nouveau paragraphe"]
                                  updateEditingField("paragraphs", newParagraphs)
                                }}
                              >
                                <Plus size={16} className="mr-2" /> Ajouter un paragraphe
                              </Button>
                            </div>
                          </>
                        )}

                        {/* Ajoutez des champs similaires pour les autres types de sections */}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Gestion des Sections</CardTitle>
                        <CardDescription>Réorganisez, activez ou désactivez les sections de votre site</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {sortedSections.map((section) => (
                            <div
                              key={section.id}
                              className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveSectionUp(section)}
                                    disabled={section.order === 1}
                                  >
                                    <ArrowUp size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => moveSectionDown(section)}
                                    disabled={section.order === sortedSections.length}
                                  >
                                    <ArrowDown size={16} />
                                  </Button>
                                </div>
                                <span className={section.visible ? "font-medium" : "font-medium text-gray-400"}>
                                  {section.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleSectionVisibility(section.id)}
                                  title={section.visible ? "Masquer" : "Afficher"}
                                >
                                  {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => editSectionContent(section)}>
                                  Éditer
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="colors" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Couleurs du Site</CardTitle>
                      <CardDescription>Personnalisez les couleurs principales de votre site</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Couleur Principale</Label>
                        <div className="flex items-center gap-4">
                          <ColorPicker
                            color={config.primaryColor}
                            onChange={(color) => updateColors("primary", color)}
                          />
                          <div className="flex-1">
                            <Input
                              value={config.primaryColor}
                              onChange={(e) => updateColors("primary", e.target.value)}
                            />
                          </div>
                          <div
                            className="w-10 h-10 rounded-md border"
                            style={{ backgroundColor: config.primaryColor }}
                          ></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Couleur Secondaire</Label>
                        <div className="flex items-center gap-4">
                          <ColorPicker
                            color={config.secondaryColor}
                            onChange={(color) => updateColors("secondary", color)}
                          />
                          <div className="flex-1">
                            <Input
                              value={config.secondaryColor}
                              onChange={(e) => updateColors("secondary", e.target.value)}
                            />
                          </div>
                          <div
                            className="w-10 h-10 rounded-md border"
                            style={{ backgroundColor: config.secondaryColor }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      )}
    </>
  )
}

