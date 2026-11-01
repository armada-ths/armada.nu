"use client"
import { useParams } from "next/navigation"
import { PhotoExperience } from "@photos/app/[locale]/e/[token]/photo-experience"
// Keep the event controller outside the locale segment so files, XHRs and the viewer survive locale navigation.
export function PhotosWorkspace({ children }: { children: React.ReactNode }) {
  const params = useParams<{ token?: string }>()
  return typeof params.token === "string" ? (
    <PhotoExperience key={params.token} token={params.token} />
  ) : (
    children
  )
}
