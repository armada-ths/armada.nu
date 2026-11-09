"use client"

import { getTierRank } from "@/app/[locale]/student/exhibitors/_components/exhibitorSort"
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
import { useMemo, useState } from "react"
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
  const orderedExhibitors = useMemo(
    () =>
      exhibitors.toSorted(
        (a, b) =>
          getTierRank(a.exhibitor?.tier) - getTierRank(b.exhibitor?.tier)
      ),
    [exhibitors]
  )

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
        className="w-88 max-w-[calc(100vw-1.5rem)] bg-white p-0">
        <Command label={t("search")} className="bg-white">
          <CommandInput
            placeholder={t("search")}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            <CommandEmpty>{t("noResults")}</CommandEmpty>
            {/* cmdk sorts matching DOM nodes in place. Remount the group when
                clearing the query to restore the default tier order. */}
            <CommandGroup key={query.trim() ? "matches" : "all"}>
              {(query.trim() ? exhibitors : orderedExhibitors).map(
                exhibitor => (
                  <CommandItem
                    key={exhibitor.id}
                    value={exhibitor.id}
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
                )
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
