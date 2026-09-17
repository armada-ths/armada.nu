import { CheckIcon, ChevronDown } from "lucide-react"
import * as React from "react"

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
import { cn } from "@/lib/utils"

/**
 * Option interface for SingleSelect component
 */
interface SingleSelectOption {
  /** The text to display for the option. */
  label: string
  /** The unique value associated with the option. */
  value: string
  /** Optional icon component to display alongside the option. */
  icon?: React.ComponentType<{ className?: string }>
  /** Whether this option is disabled */
  disabled?: boolean
}

/**
 * Props for SingleSelect component
 */
interface SingleSelectProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  /** An array of option objects to be displayed in the single-select component. */
  options: SingleSelectOption[]

  /** The currently selected value. */
  value?: string

  /** Callback function triggered when the selected value changes. */
  onValueChange: (value: string) => void

  /** Placeholder text to be displayed when no value is selected. */
  placeholder?: string

  /** The modality of the popover. Optional, defaults to false. */
  modalPopover?: boolean

  /** Additional class names for the trigger button. */
  className?: string

  /** If true, shows search functionality in the popover. Optional, defaults to true. */
  searchable?: boolean

  /** Custom empty state message when no options match search. */
  emptyIndicator?: React.ReactNode

  /** Custom CSS class for the popover content. */
  popoverClassName?: string

  /** If true, disables the component completely. Optional, defaults to false. */
  disabled?: boolean

  /** If true, automatically closes the popover after selecting an option. Optional, defaults to true. */
  closeOnSelect?: boolean
}

export const SingleSelect = React.forwardRef<
  HTMLButtonElement,
  SingleSelectProps
>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select an option",
      modalPopover = false,
      className,
      searchable = true,
      emptyIndicator,
      popoverClassName,
      disabled = false,
      closeOnSelect = true,
      ...props
    },
    ref
  ) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [searchValue, setSearchValue] = React.useState("")
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)
    const navigationInputRef = React.useRef<HTMLInputElement>(null)

    const selectedOption = React.useMemo(
      () => options.find(option => option.value === value),
      [options, value]
    )

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchValue) return options
      return options.filter(option =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    }, [options, searchValue, searchable])

    const handleSelect = (optionValue: string) => {
      const option = options.find(option => option.value === optionValue)
      if (disabled || option?.disabled) return
      onValueChange(optionValue)
      if (closeOnSelect) {
        setIsPopoverOpen(false)
      }
    }

    const handleTogglePopover = () => {
      if (disabled) return
      setIsPopoverOpen(prev => !prev)
    }

    const handleNavigationKeyDown = (
      event: React.KeyboardEvent<HTMLElement>
    ) => {
      if (searchable || filteredOptions.length === 0) return

      const enabledIndexes = filteredOptions.reduce<number[]>(
        (indexes, option, index) => {
          if (!option.disabled) indexes.push(index)
          return indexes
        },
        []
      )
      if (enabledIndexes.length === 0) return

      const currentPosition = Math.max(
        enabledIndexes.indexOf(highlightedIndex),
        0
      )

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setHighlightedIndex(
            enabledIndexes[(currentPosition + 1) % enabledIndexes.length]
          )
          break
        case "ArrowUp":
          event.preventDefault()
          setHighlightedIndex(
            enabledIndexes[
              (currentPosition - 1 + enabledIndexes.length) %
                enabledIndexes.length
            ]
          )
          break
        case "Home":
          event.preventDefault()
          setHighlightedIndex(enabledIndexes[0])
          break
        case "End":
          event.preventDefault()
          setHighlightedIndex(enabledIndexes[enabledIndexes.length - 1])
          break
        case "Enter":
          event.preventDefault()
          handleSelect(filteredOptions[highlightedIndex].value)
          break
        default:
          break
      }
    }

    React.useEffect(() => {
      if (!isPopoverOpen) {
        setSearchValue("")
        return
      }
      const selectedIndex = filteredOptions.findIndex(
        option => option.value === value && !option.disabled
      )
      const firstEnabledIndex = filteredOptions.findIndex(
        option => !option.disabled
      )
      setHighlightedIndex(
        selectedIndex >= 0 ? selectedIndex : Math.max(firstEnabledIndex, 0)
      )
      if (!searchable) {
        requestAnimationFrame(() => navigationInputRef.current?.focus())
      }
    }, [filteredOptions, isPopoverOpen, value])

    const SelectedIcon = selectedOption?.icon

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            disabled={disabled}
            role="combobox"
            aria-expanded={isPopoverOpen}
            aria-haspopup="listbox"
            className={cn(
              "flex h-auto min-h-10 items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto",
              "w-full",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}>
            <div className="mx-auto flex w-full min-w-0 items-center justify-between">
              <span className="mx-3 flex min-w-0 flex-1 items-center gap-2 truncate text-sm">
                {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
                {selectedOption ? (
                  selectedOption.label
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </span>
              <ChevronDown className="text-muted-foreground mx-2 h-4 shrink-0 cursor-pointer" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-auto min-w-[--radix-popover-trigger-width] p-0",
            popoverClassName
          )}
          align="start"
          onOpenAutoFocus={event => {
            event.preventDefault()
          }}
          onKeyDown={handleNavigationKeyDown}
          onEscapeKeyDown={() => setIsPopoverOpen(false)}>
          <Command className="bg-snow">
            {searchable && (
              <CommandInput
                placeholder="Search options..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
            )}
            {!searchable && (
              <CommandInput
                ref={navigationInputRef}
                tabIndex={-1}
                aria-label="Navigate options"
                wrapperClassName="sr-only"
              />
            )}
            <CommandList className="max-h-[40vh] overflow-y-auto">
              <CommandEmpty>
                {emptyIndicator || "No results found."}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option, index) => {
                  const isSelected = option.value === value
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      className={cn(
                        "cursor-pointer",
                        highlightedIndex === index &&
                          "bg-accent text-accent-foreground",
                        option.disabled && "cursor-not-allowed opacity-50"
                      )}
                      onMouseMove={() => setHighlightedIndex(index)}
                      disabled={option.disabled}>
                      <div
                        className={cn(
                          "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-xs border",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}>
                        <CheckIcon className="h-4 w-4" />
                      </div>
                      {option.icon && (
                        <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                      )}
                      <span className="min-w-0 truncate">{option.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

SingleSelect.displayName = "SingleSelect"
export type { SingleSelectOption, SingleSelectProps }
