import { CompanySubmissionPopover } from "@/app/exhibitor/_components/CompanySubmissionPopover"
import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { Toaster } from "@/components/ui/sonner"

export default async function ExhibitorLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavigationMenu />
      {children}
      <CompanySubmissionPopover />
      <Toaster expand={true} richColors closeButton />
    </>
  )
}
