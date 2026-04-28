declare module "react-google-recaptcha"
declare module "sonner"

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

declare module "*.svg" {
  import type { FC, SVGProps } from "react"

  const content: FC<SVGProps<SVGSVGElement>>
  export default content
}

declare module "*.svg?url" {
  const content: string
  export default content
}
