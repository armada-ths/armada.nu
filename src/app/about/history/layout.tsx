import { NavigationMenu } from "@/components/shared/NavigationMenu"

export default function TimelineLayout({
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
