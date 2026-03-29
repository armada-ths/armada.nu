"use client"

import { track } from "@vercel/analytics"
import { SiInstagram, SiTiktok } from "react-icons/si"

import { LinkedInIcon } from "@/components/shared/icons/LinkedInIcon"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import Image from "next/image"

export function Footer({ signupUrl }: { signupUrl: string }) {
  return (
    <footer className="bg-licorice flex w-full flex-col items-center py-8 text-white">
      {/* Divider */}
      <hr className="mb-6 h-px w-2/3 bg-slate-600 opacity-40" />

      {/* Desktop footer */}
      <div className="hidden w-full max-w-6xl md:flex md:flex-row md:items-start md:justify-between md:gap-12 md:px-24 md:text-left">
        {/* Social media */}
        <div className="space-y-1">
          <p className="font-semibold">Follow us on:</p>
          <div className="flex flex-col items-center gap-1 md:items-start">
            <a
              href="https://linkedin.com/company/armada"
              className="hover:text-melon-700 flex items-center gap-2">
              <LinkedInIcon className="h-4.5 w-4.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://instagram.com/thsarmada"
              className="hover:text-melon-700 flex items-center gap-2">
              <SiInstagram size={18} />
              <span>Instagram</span>
            </a>
            <a
              href="https://tiktok.com/@ths.armada"
              className="hover:text-melon-700 flex items-center gap-2">
              <SiTiktok size={18} />
              <span>TikTok</span>
            </a>
          </div>
        </div>

        {/* Students */}
        <div className="space-y-1">
          <p className="font-semibold">STUDENTS</p>
          <div className="flex flex-col gap-1">
            <a
              href="/student/recruitment"
              className="hover:text-melon-700"
              onClick={() => track("student_signup_click", { location: "footer_student_recruitment_desktop" })}>
              Recruitment
            </a>
            <a href="/student/events" className="hover:text-melon-700">
              Events
            </a>
            <a href="/student/exhibitors" className="hover:text-melon-700">
              Exhibitors
            </a>
            <a href="/student/map" className="hover:text-melon-700">
              Map
            </a>
          </div>
        </div>

        {/* Exhibitors */}
        <div className="space-y-1">
          <p className="font-semibold">EXHIBITORS</p>
          <div className="flex flex-col gap-1">
            <a
              href={signupUrl}
              className="hover:text-melon-700"
              onClick={() => track("exhibitor_signup_click", { location: "footer_exhibitor_desktop" })}>
              Registration
            </a>
            <a href="/exhibitor/packages" className="hover:text-melon-700">
              Packages
            </a>
            <a href="/exhibitor" className="hover:text-melon-700">
              Why Armada
            </a>
            <a href="/exhibitor/timeline" className="hover:text-melon-700">
              Timeline
            </a>
            <a href="/exhibitor/events" className="hover:text-melon-700">
              Events
            </a>
          </div>
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
      {/* Mobile accordion footer */}
      <div className="w-full max-w-6xl px-6 md:hidden">
        {/* Social media */}
        <div className="mb-6 flex w-full flex-col gap-3 pl-4">
          <p className="font-semibold">Follow us on:</p>
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/company/armada"
              className="hover:text-melon-700 transition-colors">
              <LinkedInIcon className="h-6 w-6" />
            </a>
            <a
              href="https://instagram.com/thsarmada"
              className="hover:text-melon-700 transition-colors">
              <SiInstagram size={24} />
            </a>
            <a
              href="https://tiktok.com/@ths.armada"
              className="hover:text-melon-700 transition-colors">
              <SiTiktok size={24} />
            </a>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {/* Students */}
          <AccordionItem value="students">
            <AccordionTrigger className="text-snow bg-licorice">
              Students
            </AccordionTrigger>
            <AccordionContent className="bg-licorice">
              <div className="flex flex-col gap-2">
                <a href="/student/recruitment" onClick={() => track("student_signup_click", { location: "footer_student_recruitment_mobile" })}>
                  Recruitment
                </a>
                <a href="/student/events">Events</a>
                <a href="/student/exhibitors">Exhibitors</a>
                <a href="/student/map">Map</a>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Exhibitors */}
          <AccordionItem value="exhibitors">
            <AccordionTrigger className="text-snow bg-licorice">
              Exhibitors
            </AccordionTrigger>
            <AccordionContent className="bg-licorice">
              <div className="flex flex-col gap-2">
                <a href={signupUrl} onClick={() => track("exhibitor_signup_click", { location: "footer_exhibitor_mobile" })}>
                  Registration
                </a>
                <a href="/exhibitor/packages">Packages</a>
                <a href="/exhibitor">Why Armada</a>
                <a href="/exhibitor/timeline">Timeline</a>
                <a href="/exhibitor/events">Events</a>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* Partner */}
        <div className="mt-6 flex w-full flex-col items-center gap-2">
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
  )
}
