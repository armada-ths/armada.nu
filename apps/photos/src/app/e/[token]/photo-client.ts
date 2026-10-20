import { useSyncExternalStore } from "react"
import { usesLocalPhotoApi } from "@photos/lib/photoRecaptcha"
import { isMobilePhotoDevice } from "@photos/lib/photoDevice"
import { createPhotoID } from "@photos/lib/photoClient"
import { env } from "@photos/env"

declare global {
  interface Window {
    grecaptcha?: {
      enterprise: {
        ready: (callback: () => void) => void
        execute: (
          siteKey: string,
          options: { action: string }
        ) => Promise<string>
      }
    }
  }
}

const configuredApi = env.NEXT_PUBLIC_API_URL
export const localApi = usesLocalPhotoApi(configuredApi, process.env.NODE_ENV)
export const siteKey = localApi
  ? env.NEXT_PUBLIC_LOCAL_RECAPTCHA_SITE_KEY
  : env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
export const api = localApi ? "" : configuredApi

// Device information is constant for this page; SSR must not access navigator.
const subscribeToDevice = () => () => {}
const getMobileDeviceSnapshot = () => isMobilePhotoDevice(navigator)
const getServerDeviceSnapshot = () => false

export function guestID() {
  const key = "armada-photo-guest"
  let value = localStorage.getItem(key)
  if (!value) {
    value = createPhotoID()
    localStorage.setItem(key, value)
  }
  return value
}

export function recaptchaToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const enterprise = window.grecaptcha?.enterprise
    if (!enterprise || !siteKey) {
      reject(new Error("Verification could not be loaded."))
      return
    }
    enterprise.ready(() =>
      enterprise
        .execute(siteKey, { action: "photo_upload" })
        .then(resolve, reject)
    )
  })
}

export function useMobilePhotoDevice() {
  return useSyncExternalStore(
    subscribeToDevice,
    getMobileDeviceSnapshot,
    getServerDeviceSnapshot
  )
}
