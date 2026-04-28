declare module "react-google-recaptcha"
declare module "sonner"

declare module "*.svg" {
  import type { FC, SVGProps } from "react"

  const content: FC<SVGProps<SVGSVGElement>>
  export default content
}

declare module "*.svg?url" {
  const content: string
  export default content
}
