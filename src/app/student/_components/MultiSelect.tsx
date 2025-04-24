import BadgeCollection from "@/app/student/exhibitors/_components/BadgeCollection"
import { Filter, FilterItem } from "@/app/student/lib/filters"
import { useScreenSize } from "@/components/shared/hooks/useScreenSize"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

import { ChevronDown, X } from "lucide-react"
import { useRef, useState } from "react"

// TODO:
// - keyboard navigation?

export default function MultiSelect({
  filter,
  onChange
}: {
  filter: Filter
  onChange: (items: FilterItem[]) => void
}) {
  const { selected, items, label } = filter

  const [searchText, setSearchText] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)

  const searchedItems = items.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  )

  function isSelected(item: FilterItem) {
    return selected.some(s => s.id === item.id)
  }

  function onSelectionChange(item: FilterItem) {
    if (isSelected(item)) {
      onChange(selected.filter(s => s.id !== item.id)) // remove item
    } else {
      onChange([...selected, item]) // add item
    }
  }

  // we have more space for the badges on mobile layout since trigger button expands to full width
  // might be better to calculate based on the actual width of the trigger button
  const { width } = useScreenSize()
  const maxDisplayed = width && width < 470 ? 2 : 1

  return (
    <Popover
      // want to clear the input field when popover closes, but if we do it right away it causes the popover to rerender and it looks bad
      // so add delay to allow the close transition to play, but probably there is a better way to do this
      onOpenChange={open => !open && setTimeout(() => setSearchText(""), 300)}>
      <PopoverTrigger asChild>
        <div className="flex h-10 w-full cursor-pointer items-center rounded-md bg-stone-950 p-2 text-sm text-stone-300 xs:w-auto">
          {selected.length === 0 ? (
            <>
              <span>{label}</span>
              <ChevronDown size={16} className="ml-auto opacity-50 xs:ml-3" />
            </>
          ) : (
            <>
              <BadgeCollection
                items={selected}
                maxDisplayed={maxDisplayed}
                className="flex-nowrap overflow-auto"
              />
              <Button
                title="Clear"
                className="ml-auto aspect-square h-fit border-none p-1 xs:ml-3"
                variant="outline"
                onClick={e => {
                  e.stopPropagation()
                  onChange([])
                }}>
                <X size={16} className="opacity-50"></X>
              </Button>
            </>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="z-10 w-full border-none p-0"
        align="start"
        sideOffset={5}
        collisionPadding={10}
        onOpenAutoFocus={e => {
          e.preventDefault()
        }}>
        <div className="w-[--radix-popover-trigger-width] rounded-md border border-emerald-800 bg-stone-950 p-0 text-sm text-stone-300 shadow-lg xs:w-max">
          <Input
            searchIcon={true}
            ref={inputRef}
            placeholder={label}
            className="mb-1 rounded-none rounded-t-md border-0 border-b dark:border-emerald-800"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}></Input>
          <ScrollArea>
            <div className="flex max-h-[33vh] flex-col" role="listbox">
              {searchedItems.length === 0 ? (
                <span className="p-1 text-stone-400">No results</span>
              ) : (
                searchedItems.map(item => (
                  <button
                    role="option"
                    aria-selected={isSelected(item)}
                    key={item.id}
                    className="flex min-w-32 cursor-default items-center gap-2 p-2 pl-3 text-left hover:bg-emerald-950 hover:text-melon-700"
                    onClick={() => onSelectionChange(item)}>
                    <Checkbox checked={isSelected(item)} tabIndex={-1} />
                    <span>{item.name}</span>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
