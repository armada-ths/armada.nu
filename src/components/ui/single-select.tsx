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

    React.useEffect(() => {
      if (!isPopoverOpen) {
        setSearchValue("")
      }
    }, [isPopoverOpen])

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
            <div className="mx-auto flex w-full items-center justify-between">
              <span className="mx-3 flex items-center gap-2 truncate text-sm">
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
          onEscapeKeyDown={() => setIsPopoverOpen(false)}>
          <Command className="bg-snow">
            {searchable && (
              <CommandInput
                placeholder="Search options..."
                value={searchValue}
                onValueChange={setSearchValue}
              />
            )}
            <CommandList className="max-h-[40vh] overflow-y-auto">
              <CommandEmpty>
                {emptyIndicator || "No results found."}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map(option => {
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
                        option.disabled && "cursor-not-allowed opacity-50"
                      )}
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
                      <span>{option.label}</span>
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
