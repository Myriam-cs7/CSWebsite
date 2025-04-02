"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Paintbrush } from "lucide-react"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const presetColors = [
    "#000000",
    "#ffffff",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b",
    "#cfaa5c",
    "#b89548",
    "#e9c989",
  ]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Paintbrush size={16} />
          <span className="sr-only">Choisir une couleur</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              className="w-8 h-8 rounded-md border border-gray-200 cursor-pointer"
              style={{ backgroundColor: presetColor }}
              onClick={() => {
                onChange(presetColor)
                setIsOpen(false)
              }}
              aria-label={`Couleur ${presetColor}`}
            />
          ))}
        </div>
        <div className="mt-4">
          <input type="color" value={color} onChange={(e) => onChange(e.target.value)} className="w-full h-8" />
        </div>
      </PopoverContent>
    </Popover>
  )
}

