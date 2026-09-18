"use client"

import { Check, ChevronDown } from "lucide-react"
import { useId, useRef, useState, type KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import { EXHIBITOR_SORT_OPTIONS, type ExhibitorSort } from "./exhibitorSort"

interface Props {
  value: ExhibitorSort
  onValueChange?: (value: ExhibitorSort) => void
  triggerClassName?: string
}

export default function ExhibitorSortMenu({
  value,
  onValueChange,
  triggerClassName
}: Props) {
  const [open, setOpen] = useState(false)
  const listboxId = useId()
  const selectedOptionRef = useRef<HTMLButtonElement>(null)
  const selectedOption = EXHIBITOR_SORT_OPTIONS.find(
    option => option.value === value
  )

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      return
    }

    event.preventDefault()
    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='option']")
    )
    if (options.length === 0) return

    const currentIndex = options.indexOf(
      document.activeElement as HTMLButtonElement
    )
    let nextIndex = currentIndex

    if (event.key === "Home") nextIndex = 0
    if (event.key === "End") nextIndex = options.length - 1
    if (event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % options.length
    }
    if (event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + options.length) % options.length
    }

    options[nextIndex]?.focus()
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          role="combobox"
          aria-label="Sort exhibitors by"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          className={cn("justify-between", triggerClassName)}
          onKeyDown={event => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              setOpen(true)
            }
          }}>
          <span className="truncate">{selectedOption?.label}</span>
          <ChevronDown aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        id={listboxId}
        role="listbox"
        aria-label="Sort exhibitors by"
        align="start"
        className="bg-snow text-licorice w-(--radix-popover-trigger-width) p-1"
        onOpenAutoFocus={event => {
          event.preventDefault()
          selectedOptionRef.current?.focus()
        }}
        onKeyDown={handleListKeyDown}>
        {EXHIBITOR_SORT_OPTIONS.map(option => {
          const selected = option.value === value

          return (
            <button
              key={option.value}
              ref={selected ? selectedOptionRef : undefined}
              type="button"
              role="option"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              className="outline-border rounded-base relative flex w-full cursor-pointer items-center border-2 border-transparent py-1.5 pr-8 pl-2 text-left text-sm outline-0 select-none hover:border-stone-800 focus-visible:border-stone-800"
              onClick={() => {
                onValueChange?.(option.value)
                setOpen(false)
              }}>
              {option.label}
              <Check
                aria-hidden="true"
                className={cn(
                  "absolute right-2 size-4",
                  !selected && "invisible"
                )}
              />
            </button>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
