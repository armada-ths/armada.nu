import { InstagramIcon, LinkedinIcon, Music2Icon } from "lucide-react"

export function Footer() {
  return (
    <div className="flex w-full justify-center">
      <div className="absolute mt-2 h-1 w-2/3 rounded bg-slate-500 bg-opacity-20">
        {" "}
      </div>
      <div className="m-5 mb-3 mt-7 w-1/4">
        <p>Follow us on:</p>
        <a
          href="https://www.linkedin.com/company/armada"
          className="flex items-end space-x-1">
          <LinkedinIcon size="20" />
          <p className="mb-0">LinkedIn</p>
        </a>
        <a
          href="https://www.instagram.com/thsarmada/"
          className="flex items-end space-x-1">
          <InstagramIcon size="20" />
          <p>Instagram</p>
        </a>
        <a
          href="https://www.tiktok.com/@ths.armada"
          className="flex items-end space-x-1">
          <Music2Icon size="20" />
          <p>TikTok</p>
        </a>
      </div>

      <div className="m-5 mb-3 mt-7 w-1/2 text-center">
        {/*
        <p>Follow us on:</p>
        <a className="flex justify-center space-x-1">
          <LinkedinIcon size="20" />
          <p className="mb-0">LinkedIn</p>
        </a>
        <a className="flex justify-center space-x-1">
          <InstagramIcon size="20" />
          <p>Instagram</p>
        </a>
        <a className="flex justify-center space-x-1">
          <Music2Icon size="20" />
          <p>TikTok</p>
        </a>*/}
      </div>
      <div className="m-5 mb-3 mt-7 w-1/4 text-end">
        <p>ARMADA</p>
        <p>Drottning Kristinas väg 15</p>
        <p>114 28, Stockholm</p>
      </div>
    </div>
  )
}
