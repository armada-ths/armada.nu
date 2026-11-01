"use client"
import { Link } from "@armada/shared/i18n/navigation"
import { useTranslations, useFormatter } from "next-intl"
import { X } from "lucide-react"
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
    removeStagedPhoto,
    uploadStagedPhotos,
    retryUpload
  } = upload
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
        disabled={
          !confirmed ||
          !info.uploads_open ||
          stagedPhotos.length >= info.remaining
        }
        onClick={() => cameraInputRef.current?.click()}>
        {stagedPhotos.length > 0 ? t("takeAnother") : t("openCamera")}
      </button>
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
