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

interface CompanySearchProps {
  exhibitors: Exhibitor[];
  onSelect: (exhibitor: Exhibitor) => void;
}

export default function CompanySearch({ exhibitors, onSelect }: CompanySearchProps) {
  return (
    <div className="absolute top-40 left-6 z-50 w-80">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center justify-center p-2 rounded-lg bg-white border border-stone-800 hover:bg-stone-300">
            <Search className="h-4 w-4 text-stone-800" />
          </button>
        </PopoverTrigger>

        <PopoverContent side="right" align="start" className="p-0 w-[320px] bg-stone-900 border border-stone-800 shadow-xl">
          <Command>
            <CommandInput
              placeholder="Search exhibitors..."
              className="text-white placeholder:text-stone-500"
            />
            <CommandList className="max-h-64 overflow-y-auto">
              <CommandEmpty>No companies found.</CommandEmpty>
              <CommandGroup heading="Exhibitors">
                {exhibitors.map(ex => (
                  <CommandItem key={ex.id} onSelect={() => onSelect(ex)}>
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
