import { NavigationMenu } from "@/components/shared/NavigationMenu"

export default function BlogLayout({
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
