import { InstagramIcon, LinkedinIcon, Music2Icon } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full bg-black text-white py-8 flex flex-col items-center">
      {/* Divider */}
      <hr className="w-2/3 h-[1px] bg-slate-600 opacity-40 mb-6" />

      {/* Content wrapper */}
      <div className="flex flex-col items-center text-center gap-6 md:flex-row md:items-start md:justify-between md:text-left md:gap-12 md:px-24 w-full max-w-6xl">
        {/* Follow us */}
        <div className="space-y-1">
          <p className="font-semibold">Follow us on:</p>
          <div className="flex flex-col items-center gap-1 md:items-start">
            <a href="https://linkedin.com/company/armada" className="flex items-center gap-2 hover:text-melon-700">
              <LinkedinIcon size={18} />
              <span>LinkedIn</span>
            </a>
            <a href="https://instagram.com/thsarmada" className="flex items-center gap-2 hover:text-melon-700">
              <InstagramIcon size={18} />
              <span>Instagram</span>
            </a>
            <a href="https://tiktok.com/@ths.armada" className="flex items-center gap-2 hover:text-melon-700">
              <Music2Icon size={18} />
              <span>TikTok</span>
            </a>
          </div>
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
        </div>

        {/* Partner */}
        <div className="flex flex-col items-center gap-2">
          <p className="font-semibold">In Partnership With:</p>
          <Image
            src="/sture-logo-up.png"
            alt="Sture Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>
      </div>
    </footer>

  );
}
