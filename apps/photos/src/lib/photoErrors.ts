import type en from "../i18n/messages/en.json"
export const photoErrorCodes = [
  "invalid_event_link",
  "event_is_unavailable",
  "invalid_guest_id",
  "uploads_are_closed",
  "upload_too_large",
  "privacy_confirmation_required",
  "photo_limit_reached",
  "verification_failed",
  "a_photo_is_required",
  "unsupported_photo_format",
  "invalid_photo",
  "storage_unavailable",
  "could_not_register_photo",
  "gallery_is_closed",
  "invalid_limit",
  "invalid_cursor",
  "gallery_unavailable",
  "invalid_photo_ids",
  "unknown_error",
  "network_error",
  "upload_failed",
  "verification_unavailable",
  "camera_photo_invalid",
  "event_not_found"
] as const
export type PhotoErrorCode = keyof typeof en.PhotoErrors
export function isPhotoErrorCode(value: unknown): value is PhotoErrorCode {
  return (
    typeof value === "string" &&
    (photoErrorCodes as readonly string[]).includes(value)
  )
}
export class PhotoError extends Error {
  constructor(readonly code: PhotoErrorCode) {
    super(code)
    this.name = "PhotoError"
  }
}
export function photoErrorCode(
  cause: unknown,
  fallback: PhotoErrorCode = "unknown_error"
): PhotoErrorCode {
  return cause instanceof PhotoError ? cause.code : fallback
}
export function photoAPIError(
  response:
    | { headers: Headers }
    | { getResponseHeader: (name: string) => string | null }
) {
  const code =
    "headers" in response
      ? response.headers.get("X-Armada-Error-Code")
      : response.getResponseHeader("X-Armada-Error-Code")
  return new PhotoError(isPhotoErrorCode(code) ? code : "unknown_error")
}
