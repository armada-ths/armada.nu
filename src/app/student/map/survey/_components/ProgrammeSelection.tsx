"use client"

import { programmeList } from "@/app/student/map/lib/survey"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown } from "lucide-react"
import { useRef, useState } from "react"

export default function ProgrammeSelection({
  programme,
  onProgrammeSelectChange
}: {
  programme: string
  onProgrammeSelectChange: (programme: string) => void
}) {
  return (
    <div className="flex w-auto flex-col justify-between">
      <div>
        <p className="m-4 text-left text-xl text-stone-200">
          Pick the programme that you are studying:
        </p>
        <div className="flex w-full justify-center">
          <ProgrammeSelector
            programme={programme || "programme"}
            onProgrammeSelectChange={onProgrammeSelectChange}
          />
        </div>
      </div>
    </div>
  )
}

function ProgrammeSelector({
  programme,
  onProgrammeSelectChange
}: {
  programme: string
  onProgrammeSelectChange: (programme: string) => void
}) {
  const [searchText, setSearchText] = useState("")
  const [open, setOpen] = useState(false)
  const [programmes, setProgrammes] = useState(programmeList)

  const inputRef = useRef<HTMLInputElement>(null)
  function filterBySearch(text: string) {
    setSearchText(text)
    setProgrammes(
      programmeList.filter(programme =>
        programme.toLowerCase().includes(text.toLowerCase())
      )
    )
  }

  return (
    <Popover
      open={open}
      onOpenChange={open =>
        !open && setTimeout(() => filterBySearch(""), 300) && setOpen(false)
      }>
      <PopoverTrigger asChild className="mb-2" onClick={() => setOpen(!open)}>
        <div className="mx-4 flex h-10 w-full cursor-pointer justify-between rounded-md border border-stone-600 bg-stone-950 p-2 text-sm text-stone-300 xs:w-96">
          <span>{programme}</span>
          <ChevronDown size={16} className="ml-auto opacity-50 xs:ml-3" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="z-50 w-full border-none p-0"
        align="start"
        side="bottom"
        sideOffset={5}
        collisionPadding={10}
        onOpenAutoFocus={e => {
          e.preventDefault()
        }}>
        <div className="w-[--radix-popover-trigger-width] rounded-md border border-stone-600 bg-stone-950 p-0 text-sm text-stone-300 shadow-lg xs:w-96">
          <Input
            searchIcon={true}
            ref={inputRef}
            placeholder={"Programme"}
            className="mb-1 rounded-none rounded-t-md border-0 border-b dark:border-stone-600"
            value={searchText}
            onChange={e => filterBySearch(e.target.value)}></Input>
          <ScrollArea>
            <div
              className="flex max-h-[172px] flex-col xs:max-h-[208px]"
              role="listbox">
              {programmes.map(programme => (
                <button
                  role="option"
                  key={programme}
                  className="flex min-w-32 cursor-default items-center gap-2 p-2 pl-3 hover:bg-emerald-950 hover:text-melon-700"
                  onClick={() => {
                    setOpen(!open)
                    onProgrammeSelectChange(programme)
                  }}
                  value={programme.toString()}>
                  <span className="flex text-left">{programme}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
