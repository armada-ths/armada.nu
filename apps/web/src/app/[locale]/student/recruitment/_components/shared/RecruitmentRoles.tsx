"use client"
import { useDraftState } from "@armada/shared/i18n/client"
import { Accordion } from "@/components/ui/accordion"
export function RecruitmentRoles({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDraftState<string[]>("recruitmentRoles", [])
  return (
    <Accordion type="multiple" value={open} onValueChange={setOpen}>
      {children}
    </Accordion>
  )
}
