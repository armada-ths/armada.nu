import { NavigationMenu } from "@/components/shared/NavigationMenu"

export default function ExhibitorLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavigationMenu />
      {children}
    </>
  )
}
