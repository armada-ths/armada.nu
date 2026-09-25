import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bilder från Armada",
  description: "Dela och se bilder från Armadas event.",
  robots: { index: false, follow: false }
}

export default function PhotosLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`body:has([data-photo-app]) footer { display: none }`}</style>
      <div
        data-photo-app
        lang="sv"
        className="min-h-screen bg-[#f7f5f2] text-[#172b35]">
        {children}
      </div>
    </>
  )
}
