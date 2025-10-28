import { InstagramIcon, LinkedinIcon, Music2Icon } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    /* IF WIDTH < 768, SET TO VERTICAL, OTHERWISE KEEP HORIZONTAL */
    <div className="w-100 flex flex-col items-center justify-center md:flex-row md:items-start md:px-36">
      <hr className="static mt-2 h-1 w-2/3 rounded border-0 bg-slate-500 bg-opacity-30 md:absolute" />
      <div className="m-5 mb-3 mt-7 w-1/4 place-items-center text-center md:place-items-start md:text-start">
        <p>
          <b>Follow us on:</b>
        </p>
        <a
          href="https://www.linkedin.com/company/armada"
          className="flex space-x-1">
          <LinkedinIcon size="20" />
          <p className="mb-0">LinkedIn</p>
        </a>
        <a
          href="https://www.instagram.com/thsarmada/"
          className="flex space-x-1">
          <InstagramIcon size="20" />
          <p>Instagram</p>
        </a>
        <a href="https://www.tiktok.com/@ths.armada" className="flex space-x-1">
          <Music2Icon size="20" />
          <p>TikTok</p>
        </a>
      </div>

      <div className="m-5 mb-3 mt-7 w-1/4 place-items-center text-center md:place-items-start md:text-left">
        <p>
          <b>STUDENTS</b>
        </p>
        <a href="/student/recruitment">Recruitment</a>
      </div>
      <div className="m-5 mb-3 mt-7 w-1/4 place-items-center text-center md:place-items-start md:text-left">
        <p>
          <b>EXHIBITORS</b>
        </p>
        <a href="https://app.eventro.se/register/armada">Registration</a>
        <br />
        <a href="/exhibitor/packages">Packages</a>
        <br />
        <a href="/exhibitor">Why Armada</a>
        <br />
        <a href="/exhibitor/timeline">Timeline</a>
        <br />
        <a href="/exhibitor/events">Events</a>
        <br />
        <a href="/exhibitor/order">Order form</a>
      </div>

      <div className="m-5 mb-3 mt-7 w-1/4 place-items-center text-center md:place-items-start md:text-left">
        <p className="pb-4">
          <b>In Partnership With:</b>
        </p>
        <Image
          src={"/sture-logo-up.png"}
          alt={"Sture Logo"}
          width={60}
          height={120}
        />
      </div>
    </div>
  )
}
