import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "Order Form - Exhibitor Lounge",
  description: "Order drinks and snacks from the lounge."
}
export default function OrderLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <NavigationMenu />
      <main>{children}</main>
      <Toaster expand={true} closeButton />
    </>
  )
}
