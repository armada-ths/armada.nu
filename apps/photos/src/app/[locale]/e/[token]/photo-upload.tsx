"use client"
import { Link } from "@armada/shared/i18n/navigation"
import { useTranslations, useFormatter } from "next-intl"
import { useCallback, useEffect, useRef, useState } from "react"
import { SwitchCamera, X } from "lucide-react"
import type { EventInfo } from "./photo-types"
import type { usePhotoUploads } from "./use-photo-uploads"

export function PhotoUpload({
  info,
  mobileDevice,
  upload
}: {
  info: EventInfo
  mobileDevice: boolean
  upload: ReturnType<typeof usePhotoUploads>
}) {
  const t = useTranslations("Photos"),
    text = useTranslations("PhotosStatic"),
    errors = useTranslations("PhotoErrors"),
    format = useFormatter()
  const {
    uploads,
    confirmed,
    setConfirmed,
    stagedPhotos,
    cameraError,
    cameraInputRef,
    onCameraPhoto,
    stagePhoto,
    removeStagedPhoto,
    uploadStagedPhotos,
    retryUpload
  } = upload
  const [appCameraOpen, setAppCameraOpen] = useState(false)
  const closeAppCamera = useCallback(() => setAppCameraOpen(false), [])
  const canTakePhoto =
    confirmed && info.uploads_open && stagedPhotos.length < info.remaining
  return !mobileDevice ? (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">{text("uploadFromYourPhone")}</h2>
      <p className="mt-2">
        {text("photoUploadsAreOnlyAvailableOnMobileDevices")}
      </p>
      <p className="mt-2">{text("youCanStillViewTheGalleryOnThis")}</p>
    </section>
  ) : (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold">{text("shareYourPhotos")}</h2>
      <p className="mt-2">{t("remaining", { count: info.remaining })}</p>
      <p className="mt-2 text-sm">
        {text("takePhotosWithYourCameraReviewThemHere")}
      </p>
      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={event => {
            setConfirmed(event.target.checked)
            if (!event.target.checked) closeAppCamera()
          }}
          className="mt-1"
        />
        <span>
          {text("iHaveReadThe")}{" "}
          <Link
            className="underline"
            href="/privacy"
            target="_blank"
            rel="noreferrer">
            {text("privacyInformation")}
          </Link>{" "}
          {text("andHaveTheRightToShareThesePhotos")}
        </span>
      </label>
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        aria-label={text("takePhotoWithCamera")}
        className="sr-only"
        onChange={onCameraPhoto}
      />
      <button
        type="button"
        className="mt-6 block w-full rounded-xl bg-[#172b35] p-4 text-center font-semibold text-white disabled:opacity-60"
        disabled={!canTakePhoto}
        onClick={() => {
          closeAppCamera()
          cameraInputRef.current?.click()
        }}>
        {stagedPhotos.length > 0 ? t("takeAnother") : t("openCamera")}
      </button>
      {appCameraOpen && canTakePhoto ? (
        <AppCamera onClose={closeAppCamera} onCapture={stagePhoto} />
      ) : (
        <button
          type="button"
          className="mt-3 w-full rounded-xl border px-4 py-2 font-semibold disabled:opacity-60"
          disabled={!canTakePhoto}
          onClick={() => setAppCameraOpen(true)}>
          {t("appCameraOpen")}
        </button>
      )}
      {stagedPhotos.length > 0 && (
        <div className="mt-4">
          <p className="mb-3 font-semibold">
            {t("ready", { count: stagedPhotos.length })}
          </p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stagedPhotos.map((photo, index) => (
              <li key={photo.id} className="relative">
                <img
                  src={photo.preview}
                  alt={t("photoReady", { index: index + 1 })}
                  className="aspect-square w-full rounded-xl bg-black object-cover"
                />
                <button
                  type="button"
                  aria-label={t("removePhoto", { index: index + 1 })}
                  className="absolute top-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-white text-[#172b35] shadow-sm"
                  onClick={() => removeStagedPhoto(photo.id)}>
                  <X aria-hidden="true" size={18} />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 w-full rounded-xl bg-[#b74465] p-4 font-semibold text-white disabled:opacity-60"
            disabled={
              !confirmed ||
              !info.uploads_open ||
              stagedPhotos.length > info.remaining
            }
            onClick={uploadStagedPhotos}>
            {t("uploadCount", { count: stagedPhotos.length })}
          </button>
        </div>
      )}
      {cameraError && (
        <p role="alert" className="mt-3 text-red-700">
          {errors(cameraError)}
        </p>
      )}
      {!info.uploads_open && <p className="mt-4">{text("uploadsAreClosed")}</p>}
      <ul className="mt-6 space-y-3">
        {uploads.map(item => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-lg border p-2">
            <img
              src={item.preview}
              alt={text("photoPreview")}
              className="h-16 w-16 rounded object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{text("photoTakenWithCamera")}</p>
              <p className="text-xs">
                {item.state === "done"
                  ? item.approval === "approved"
                    ? t("added")
                    : t("awaiting")
                  : item.state === "error"
                    ? errors(item.error ?? "unknown_error")
                    : format.number(item.progress / 100, { style: "percent" })}
              </p>
              {item.state === "uploading" && (
                <progress className="w-full" value={item.progress} max="100" />
              )}
            </div>
            {item.state === "error" && (
              <button
                type="button"
                className="rounded bg-[#b74465] px-3 py-2 text-sm text-white"
                onClick={() => retryUpload(item.id)}>
                {text("tryAgain")}
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function AppCamera({
  onClose,
  onCapture
}: {
  onClose: () => void
  onCapture: (file: File) => void
}) {
  const t = useTranslations("Photos")
  const videoRef = useRef<HTMLVideoElement>(null)
  const session = useRef<AbortController | null>(null)
  const [facingMode, setFacingMode] = useState<"environment" | "user" | null>(
    null
  )
  const nextFacingMode = facingMode === "user" ? "environment" : "user"
  const [state, setState] = useState<
    "starting" | "ready" | "capturing" | "error"
  >("starting")

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    session.current = controller
    const video = videoRef.current
    if (!video) return
    let stream: MediaStream | undefined

    const stop = () => {
      controller.abort()
      stream?.getTracks().forEach(track => track.stop())
      video.srcObject = null
    }
    const fail = () => {
      if (signal.aborted) return
      stop()
      setState("error")
    }
    const closeWhenHidden = () => {
      if (document.visibilityState === "hidden") {
        stop()
        onClose()
      }
    }
    document.addEventListener("visibilitychange", closeWhenHidden, { signal })

    const start = async () => {
      try {
        const result = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: facingMode
              ? { exact: facingMode }
              : { ideal: "environment" },
            width: { ideal: 2560 },
            height: { ideal: 1440 }
          }
        })
        if (signal.aborted) {
          result.getTracks().forEach(track => track.stop())
          return
        }
        stream = result
        stream.getVideoTracks()[0]?.addEventListener("ended", fail, { signal })
        video.srcObject = stream
        await video.play()
        if (!signal.aborted) setState("ready")
      } catch {
        fail()
      }
    }

    void start()
    return stop
  }, [facingMode, onClose])

  const [captureFailed, setCaptureFailed] = useState(false)
  const capture = () => {
    setCaptureFailed(false)
    const video = videoRef.current
    if (!video?.videoWidth || !video.videoHeight || video.readyState < 2) {
      setCaptureFailed(true)
      return
    }
    const activeSession = session.current
    const canvas = document.createElement("canvas")
    const scale = Math.min(
      1,
      2560 / Math.max(video.videoWidth, video.videoHeight)
    )
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    const context = canvas.getContext("2d")
    if (!context) {
      setCaptureFailed(true)
      return
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    setState("capturing")
    canvas.toBlob(
      blob => {
        if (!activeSession || activeSession.signal.aborted) return
        if (blob?.type !== "image/jpeg") {
          setCaptureFailed(true)
          setState("ready")
          return
        }
        onCapture(new File([blob], "photo.jpg", { type: blob.type }))
        onClose()
      },
      "image/jpeg",
      0.9
    )
  }

  return (
    <div className="mt-3 space-y-3">
      <div className="relative min-h-16 rounded-xl bg-black">
        <video
          ref={videoRef}
          hidden={state === "error"}
          autoPlay
          playsInline
          muted
          aria-label={t("appCameraPreview")}
          className="max-h-96 w-full rounded-xl object-contain"
        />
        <button
          type="button"
          disabled={state === "starting" || state === "capturing"}
          onClick={() => {
            setCaptureFailed(false)
            setState("starting")
            setFacingMode(nextFacingMode)
          }}
          aria-label={t(
            nextFacingMode === "user"
              ? "appCameraSwitchFront"
              : "appCameraSwitchRear"
          )}
          className="absolute right-3 bottom-3 grid size-11 place-items-center rounded-xl border border-white/70 bg-black/75 text-white disabled:opacity-60">
          <SwitchCamera aria-hidden="true" size={22} />
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="text-red-700">
          {t("appCameraUnavailable")}
        </p>
      )}
      {captureFailed && state !== "error" && (
        <p role="alert" className="text-red-700">
          {t("appCameraCaptureFailed")}
        </p>
      )}
      {state === "starting" && <p role="status">{t("appCameraStarting")}</p>}
      <div className="flex flex-wrap gap-3">
        {state !== "error" && (
          <button
            type="button"
            disabled={state !== "ready"}
            onClick={capture}
            className="flex-1 rounded-xl bg-[#172b35] px-4 py-2 font-semibold text-white disabled:opacity-60">
            {t("appCameraCapture")}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border px-4 py-2 font-semibold">
          {t("appCameraClose")}
        </button>
      </div>
    </div>
  )
}
