import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Armada Photos",
  description: "Share and view photos from Armada events.",
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
        lang="en"
        className="min-h-screen bg-[#f7f5f2] text-[#172b35]">
        {children}
      </div>
    </>
  )
}
