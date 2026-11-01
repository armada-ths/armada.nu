import {
  PhotoError,
  photoAPIError,
  photoErrorCode,
  type PhotoErrorCode
} from "@photos/lib/photoErrors"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent
} from "react"
import { createPhotoID } from "@photos/lib/photoClient"
import { guestID } from "./photo-client"
import type { EventInfo, Upload, StagedPhoto } from "./photo-types"

export function usePhotoUploads({
  base,
  info,
  mobileDevice,
  getVerificationToken,
  refreshInfo
}: {
  base: string
  info: EventInfo | null
  mobileDevice: boolean
  getVerificationToken: () => Promise<string>
  refreshInfo: () => Promise<void>
}) {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [confirmed, setConfirmed] = useState(false)
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([])
  const [cameraError, setCameraError] = useState<PhotoErrorCode | null>(null)
  const active = useRef(0)
  const uploadsRef = useRef<Upload[]>([])
  const stagedPhotosRef = useRef<StagedPhoto[]>([])
  const cameraInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(
    () => () => {
      uploadsRef.current.forEach(item => URL.revokeObjectURL(item.preview))
      stagedPhotosRef.current.forEach(photo =>
        URL.revokeObjectURL(photo.preview)
      )
    },
    []
  )

  const updateUploads = useCallback((fn: (items: Upload[]) => Upload[]) => {
    const next = fn(uploadsRef.current)
    uploadsRef.current = next
    setUploads(next)
  }, [])

  const uploadOne = useCallback(
    async (item: Upload) => {
      try {
        const captcha = await getVerificationToken()
        const form = new FormData()
        form.append("photo", item.file)
        form.append("guest_id", guestID())
        form.append("privacy_confirmed", "true")
        form.append("recaptcha_token", captcha)
        const approval = await new Promise<"approved" | "pending">(
          (resolve, reject) => {
            const request = new XMLHttpRequest()
            request.open("POST", `${base}/photos`)
            request.upload.onprogress = event => {
              if (event.lengthComputable)
                updateUploads(items =>
                  items.map(candidate =>
                    candidate.id === item.id
                      ? {
                          ...candidate,
                          progress: Math.round(
                            (100 * event.loaded) / event.total
                          )
                        }
                      : candidate
                  )
                )
            }
            request.onload = () => {
              if (request.status !== 201) {
                reject(photoAPIError(request))
                return
              }
              try {
                const result = JSON.parse(request.responseText) as {
                  status?: string
                }
                resolve(result.status === "approved" ? "approved" : "pending")
              } catch {
                resolve("pending")
              }
            }
            request.onerror = () => reject(new PhotoError("network_error"))
            request.send(form)
          }
        )
        updateUploads(items =>
          items.map(candidate =>
            candidate.id === item.id
              ? { ...candidate, state: "done", approval, progress: 100 }
              : candidate
          )
        )
        void refreshInfo().catch(cause =>
          setCameraError(photoErrorCode(cause, "network_error"))
        )
      } catch (cause) {
        updateUploads(items =>
          items.map(candidate =>
            candidate.id === item.id
              ? {
                  ...candidate,
                  state: "error",
                  error: photoErrorCode(cause, "upload_failed")
                }
              : candidate
          )
        )
      } finally {
        active.current--
        window.setTimeout(drain, 0)
      }
    },
    [base, getVerificationToken, refreshInfo, updateUploads]
  )

  const drain = useCallback(() => {
    if (!mobileDevice) return
    while (active.current < 2) {
      const item = uploadsRef.current.find(
        candidate => candidate.state === "queued"
      )
      if (!item) break
      active.current++
      updateUploads(items =>
        items.map(candidate =>
          candidate.id === item.id
            ? { ...candidate, state: "uploading" }
            : candidate
        )
      )
      void uploadOne(item)
    }
  }, [mobileDevice, updateUploads, uploadOne])

  const onCameraPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""
    if (!file || !mobileDevice) return
    if (
      (file.type && !file.type.startsWith("image/")) ||
      file.size > 25 * 1024 * 1024
    ) {
      setCameraError("camera_photo_invalid")
      return
    }
    if (stagedPhotosRef.current.length >= (info?.remaining ?? 0)) {
      setCameraError("photo_limit_reached")
      return
    }
    const next = {
      id: createPhotoID(),
      file,
      preview: URL.createObjectURL(file)
    }
    stagedPhotosRef.current = [...stagedPhotosRef.current, next]
    setStagedPhotos(stagedPhotosRef.current)
    setCameraError(null)
  }

  const removeStagedPhoto = (id: string) => {
    const photo = stagedPhotosRef.current.find(candidate => candidate.id === id)
    if (!photo) return
    URL.revokeObjectURL(photo.preview)
    stagedPhotosRef.current = stagedPhotosRef.current.filter(
      candidate => candidate.id !== id
    )
    setStagedPhotos(stagedPhotosRef.current)
    setCameraError(null)
  }

  const uploadStagedPhotos = () => {
    const staged = stagedPhotosRef.current
    if (
      staged.length === 0 ||
      !mobileDevice ||
      !confirmed ||
      !info?.uploads_open ||
      staged.length > info.remaining
    )
      return
    stagedPhotosRef.current = []
    setStagedPhotos([])
    updateUploads(items => [
      ...items,
      ...staged.map(photo => ({
        id: photo.id,
        file: photo.file,
        preview: photo.preview,
        progress: 0,
        state: "queued" as const
      }))
    ])
    window.setTimeout(drain, 0)
  }

  const retryUpload = (id: string) => {
    updateUploads(items =>
      items.map(item =>
        item.id === id
          ? { ...item, state: "queued", error: undefined, progress: 0 }
          : item
      )
    )
    window.setTimeout(drain, 0)
  }
  return {
    uploads,
    confirmed,
    setConfirmed,
    stagedPhotos,
    cameraError,
    cameraInputRef,
    onCameraPhoto,
    removeStagedPhoto,
    uploadStagedPhotos,
    retryUpload
  }
}
