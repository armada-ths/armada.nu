"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"
import type { MappedExhibitor } from "./maps"

export default function CompanySearch({
  exhibitors,
  open,
  onOpenChange,
  onSelect
}: {
  exhibitors: MappedExhibitor[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (exhibitor: MappedExhibitor) => void
}) {
  const t = useTranslations("FairMap")
  const [query, setQuery] = useState("")

  return (
    <Popover
      open={open}
      onOpenChange={nextOpen => {
        setQuery("")
        onOpenChange(nextOpen)
      }}>
      <PopoverTrigger asChild>
        <Button
          variant="neutral"
          type="button"
          className={
            open
              ? "hover:shadow-shadow! transition-none hover:translate-none!"
              : undefined
          }>
          <Search aria-hidden="true" />
          {t("search")}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-88 max-w-[calc(100vw-1.5rem)] p-0">
        <Command label={t("search")}>
          <CommandInput
            placeholder={t("search")}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>{t("noResults")}</CommandEmpty>
            <CommandGroup heading={t("exhibitors")}>
              {exhibitors.map(exhibitor => (
                <CommandItem
                  key={exhibitor.exhibitorId}
                  value={String(exhibitor.exhibitorId)}
                  keywords={[
                    exhibitor.name,
                    exhibitor.room,
                    String(exhibitor.booth)
                  ]}
                  onSelect={() => {
                    onSelect(exhibitor)
                    setQuery("")
                    onOpenChange(false)
                  }}>
                  <span>{exhibitor.name}</span>
                  <span className="ml-auto shrink-0 text-xs">
                    {t("booth", { booth: exhibitor.booth })}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
