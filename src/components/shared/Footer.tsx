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

function FooterAffiliations() {
  return (
    <div className="flex items-start justify-center gap-6">
      <div className="flex w-28 flex-col items-center gap-2 text-center">
        <p className="font-semibold">In partnership with:</p>
        <a href="https://sture.se/">
          <Image
            src="/sture-logo-up.png"
            alt="Sture Logo"
            width={70}
            height={70}
            className="object-contain"
            style={{ height: "auto" }}
          />
        </a>
      </div>
      <div className="flex w-40 flex-col items-center gap-2 text-center">
        <p className="font-semibold">Member of:</p>
        <a href="https://diversitycharter.se/">
          <Image
            src="/LogoDCS-300dpi.png"
            alt="Diversity Charter Sweden logo"
            width={150}
            height={103}
            className="object-contain"
            style={{ height: "auto" }}
          />
        </a>
      </div>
    </div>
  )
}

export function Footer({ signupUrl }: { signupUrl: string }) {
  return (
    <footer className="bg-licorice text-snow flex w-full flex-col items-center py-8">
      {/* Divider */}
      <hr className="mb-6 h-px w-2/3 bg-slate-600 opacity-40" />

      {/* Desktop footer */}
      <div className="hidden w-full max-w-6xl lg:flex lg:flex-row lg:items-start lg:justify-center lg:gap-[clamp(1.5rem,3vw,3rem)] lg:px-[clamp(2rem,6vw,6rem)] lg:text-left">
        {/* Social media */}
        <div className="space-y-1">
          <p className="font-semibold">Follow us on:</p>
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <a
              href="https://linkedin.com/company/armada"
              className="hover:text-melon flex items-center gap-2">
              <LinkedInIcon
                className="h-4.5 w-4.5"
                aria-hidden="true"
                focusable="false"
              />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://instagram.com/thsarmada"
              className="hover:text-melon flex items-center gap-2">
              <SiInstagram size={18} aria-hidden="true" focusable="false" />
              <span>Instagram</span>
            </a>
            <a
              href="https://tiktok.com/@ths.armada"
              className="hover:text-melon flex items-center gap-2">
              <SiTiktok size={18} aria-hidden="true" focusable="false" />
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
              className="hover:text-melon"
              onClick={() =>
                track("student_signup_click", {
                  location: "footer_student_recruitment_desktop"
                })
              }>
              Recruitment
            </a>
            <a href="/student/events" className="hover:text-melon">
              Events
            </a>
            <a href="/student/exhibitors" className="hover:text-melon">
              Exhibitors
            </a>
            <a href="/student/map" className="hover:text-melon">
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
              className="hover:text-melon"
              onClick={() =>
                track("exhibitor_signup_click", {
                  location: "footer_exhibitor_desktop"
                })
              }>
              Registration
            </a>
            <a href="/exhibitor/packages" className="hover:text-melon">
              Kits
            </a>
            <a href="/exhibitor" className="hover:text-melon">
              Why Armada
            </a>
            <a href="/exhibitor/timeline" className="hover:text-melon">
              Timeline
            </a>
            <a href="/exhibitor/events" className="hover:text-melon">
              Events
            </a>
          </div>
        </div>

        {/* About */}
        <div className="space-y-1">
          <p className="font-semibold">ABOUT</p>
          <div className="flex flex-col gap-1">
            <a href="/about" className="hover:text-melon">
              About Armada
            </a>
            <a href="/about/team" className="hover:text-melon">
              Team
            </a>
            <a
              href="/blog"
              className="hover:text-melon"
              onClick={() =>
                track("blog_click", {
                  location: "footer_blog_desktop"
                })
              }>
              Blog
            </a>
          </div>
        </div>

        {/* Partnerships and affiliations */}
        <FooterAffiliations />
      </div>
      {/* Mobile accordion footer */}
      <div className="w-full max-w-6xl px-6 lg:hidden">
        {/* Social media */}
        <div className="mb-6 flex w-full flex-col gap-3 pl-4">
          <p className="font-semibold">Follow us on:</p>
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/company/armada"
              aria-label="LinkedIn"
              className="hover:text-melon transition-colors">
              <LinkedInIcon
                className="h-6 w-6"
                aria-hidden="true"
                focusable="false"
              />
            </a>
            <a
              href="https://instagram.com/thsarmada"
              aria-label="Instagram"
              className="hover:text-melon transition-colors">
              <SiInstagram size={24} aria-hidden="true" focusable="false" />
            </a>
            <a
              href="https://tiktok.com/@ths.armada"
              aria-label="TikTok"
              className="hover:text-melon transition-colors">
              <SiTiktok size={24} aria-hidden="true" focusable="false" />
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
                <a
                  href="/student/recruitment"
                  onClick={() =>
                    track("student_signup_click", {
                      location: "footer_student_recruitment_mobile"
                    })
                  }>
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
                <a
                  href={signupUrl}
                  onClick={() =>
                    track("exhibitor_signup_click", {
                      location: "footer_exhibitor_mobile"
                    })
                  }>
                  Registration
                </a>
                <a href="/exhibitor/packages">Kits</a>
                <a href="/exhibitor">Why Armada</a>
                <a href="/exhibitor/timeline">Timeline</a>
                <a href="/exhibitor/events">Events</a>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* About */}
          <AccordionItem value="about">
            <AccordionTrigger className="text-snow bg-licorice">
              About
            </AccordionTrigger>
            <AccordionContent className="bg-licorice">
              <div className="flex flex-col gap-2">
                <a href="/about">About Armada</a>
                <a href="/about/team">Team</a>
                <a
                  href="/blog"
                  onClick={() =>
                    track("blog_click", {
                      location: "footer_blog_mobile"
                    })
                  }>
                  Blog
                </a>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* Partnerships and affiliations */}
        <div className="mt-6 w-full">
          <FooterAffiliations />
        </div>
      </div>
    </footer>
  )
}
