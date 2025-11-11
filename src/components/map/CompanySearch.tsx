"use client";

import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRef, useState } from "react";

interface CompanySearchProps {
  exhibitors: Exhibitor[];
  onSelect: (exhibitor: Exhibitor) => void;
}

export default function CompanySearch({ exhibitors, onSelect }: CompanySearchProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="absolute top-40 left-6 z-50 w-80">
      <Command className="bg-stone-900 border border-stone-800 rounded-xl shadow-lg">
        <CommandInput
          ref={inputRef}
          placeholder="Search companies..."
          className="text-white placeholder:text-stone-500"
          onFocus={() => setOpen(true)}
          onValueChange={() => setOpen(true)} // typing should reopen if closed
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {open && (
          <CommandList className="max-h-64 overflow-y-auto">
            <CommandEmpty>No companies found.</CommandEmpty>
            <CommandGroup heading="Exhibitors">
              {exhibitors.map(ex => (
                <CommandItem
                  key={ex.id}
                  className="cursor-pointer text-stone-200 hover:bg-emerald-700"
                  onSelect={() => {
                    onSelect(ex);
                    inputRef.current?.blur();
                    inputRef.current!.value = "";
                    setOpen(false);
                  }}
                >
                  {ex.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}
