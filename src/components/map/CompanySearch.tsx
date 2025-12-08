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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search } from "lucide-react";
import { useState } from "react";

interface CompanySearchProps {
  exhibitors: Exhibitor[];
  onSelect: (exhibitor: Exhibitor) => void;
}

export default function CompanySearch({ exhibitors, onSelect }: CompanySearchProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (exhibitor: Exhibitor) => {
    onSelect(exhibitor);
    setOpen(false);
  };

  return (
    <div className="absolute top-44 left-6 z-50 w-80">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center justify-center p-2 rounded-lg bg-white border border-stone-800 hover:bg-stone-300">
            <Search className="h-4 w-4 text-stone-800" />
          </button>
        </PopoverTrigger>

        <PopoverContent side="right" align="start" className=" rounded-md p-0 w-[320px] border shadow-xl">
          <Command className="bg-white rounded-md">
            <CommandInput
              placeholder="Search exhibitors..."
              className="text-white"
            />
            <CommandList className="max-h-64 overflow-y-auto">
              <CommandEmpty>No companies found.</CommandEmpty>
              <CommandGroup heading="Exhibitors">
                {exhibitors.map(ex => (
                  <CommandItem key={ex.id} onSelect={() => handleSelect(ex)}>
                    {ex.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
