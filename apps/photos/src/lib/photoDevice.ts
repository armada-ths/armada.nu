type PhotoDevice = {
  userAgent: string
  maxTouchPoints: number
  userAgentData?: { mobile: boolean }
}

// Device hints gate the camera UI, not API access. They can be spoofed.
export function isMobilePhotoDevice(device: PhotoDevice): boolean {
  if (device.userAgentData?.mobile) return true
  if (/Android|iPhone|iPad|iPod/i.test(device.userAgent)) return true

  // iPadOS can identify itself as a Mac when requesting desktop websites.
  return /Macintosh/i.test(device.userAgent) && device.maxTouchPoints > 1
}
