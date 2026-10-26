"use client"

import { env } from "@/env"
import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { eventMapEmbedUrl, isShortMapLink } from "@/lib/eventMap"
import { normalizeExternalUrl } from "@/lib/externalUrl"

export function EventMap({
  mapUrl,
  name
}: {
  mapUrl?: string | null
  name: string
}) {
  const href = normalizeExternalUrl(mapUrl)
  const directEmbed = eventMapEmbedUrl(
    href,
    env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
  )
  const [resolved, setResolved] = useState<{
    href: string
    embedUrl: string
  } | null>(null)

  useEffect(() => {
    if (!href || !isShortMapLink(href)) return
    const controller = new AbortController()
    void fetch(`/api/event-map?${new URLSearchParams({ url: href })}`, {
      signal: controller.signal
    })
      .then(response => (response.ok ? response.json() : null))
      .then((data: { embedUrl?: unknown } | null) => {
        if (!controller.signal.aborted && typeof data?.embedUrl === "string") {
          // Validate even the resolver response before using it as an iframe source.
          const url = new URL(data.embedUrl)
          if (
            url.origin === "https://www.google.com" &&
            url.pathname === "/maps/embed/v1/place"
          ) {
            setResolved({ href, embedUrl: data.embedUrl })
          }
        }
      })
      .catch(() => {
        /* The original link remains available if resolution fails. */
      })
    return () => controller.abort()
  }, [href])

  if (!href) return null
  const embedUrl =
    directEmbed || (resolved?.href === href ? resolved.embedUrl : null)
  return (
    <div className="space-y-2">
      {embedUrl && (
        <iframe
          title={`Map for ${name}`}
          src={embedUrl}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          className="border-licorice/20 h-52 w-full rounded-lg border"
        />
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-licorice flex items-center gap-2 text-sm font-bold underline underline-offset-4">
        <MapPin size={16} aria-hidden="true" /> Open map
      </a>
    </div>
  )
}
