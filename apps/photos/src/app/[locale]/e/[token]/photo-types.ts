import type { PhotoErrorCode } from "@photos/lib/photoErrors"
export type EventInfo = {
  name: string
  nameSv?: string | null
  description: string
  descriptionSv?: string | null
  uploads_open: boolean
  gallery_open: boolean
  remaining: number
}
export type Photo = {
  id: number
  url: string
  thumbnail_url?: string
  urls_expires_at?: string
  width: number
  height: number
  approved_at: string
}
export type Gallery = { items: Photo[]; next_cursor: string }
export type Upload = {
  id: string
  file: File
  preview: string
  progress: number
  state: "queued" | "uploading" | "done" | "error"
  approval?: "approved" | "pending"
  error?: PhotoErrorCode
}
export type StagedPhoto = { id: string; file: File; preview: string }
