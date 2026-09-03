"use client"

import { track } from "@vercel/analytics"
import { usePathname } from "next/navigation"
import { SiInstagram, SiTiktok } from "react-icons/si"

import { LinkedInIcon } from "@/components/shared/icons/LinkedInIcon"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import Image from "next/image"

import {
  createLocalePath,
  getLocaleFromPathname,
  translations
} from "@/lib/i18n"

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
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname)
  const dict = translations[locale]
  const nextLocale = locale === "en" ? "sv" : "en"
  const withLocale = (path: string) => createLocalePath(path, locale)

  return (
    <footer className="bg-licorice text-snow flex w-full flex-col items-center py-8">
      <div className="mb-6 flex items-center gap-3">
        <a
          href={createLocalePath(pathname, nextLocale)}
          className="text-snow border-snow hover:bg-snow hover:text-licorice rounded-full border px-3 py-1 text-sm font-semibold transition-colors"
          aria-label={`Switch language to ${nextLocale === "en" ? "English" : "Swedish"}`}>
          {dict.switchLanguage}
        </a>
      </div>

      {/* Divider */}
      <hr className="mb-6 h-px w-2/3 bg-slate-600 opacity-40" />

      {/* Desktop footer */}
      <div className="hidden w-full max-w-7xl lg:flex lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:px-12 lg:text-left">
        {/* Social media */}
        <div className="space-y-1">
          <p className="font-semibold">{dict.followUs}</p>
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
          <p className="font-semibold">{dict.students}</p>
          <div className="flex flex-col gap-1">
            <a
              href={withLocale("/student/recruitment")}
              className="hover:text-melon"
              onClick={() =>
                track("student_signup_click", {
                  location: "footer_student_recruitment_desktop"
                })
              }>
              {dict.recruitment}
            </a>
            <a
              href={withLocale("/student/events")}
              className="hover:text-melon">
              {dict.events}
            </a>
            <a
              href={withLocale("/student/exhibitors")}
              className="hover:text-melon">
              {dict.exhibitorsList}
            </a>
            <a href={withLocale("/student/map")} className="hover:text-melon">
              {dict.map}
            </a>
          </div>
        </div>

        {/* Exhibitors */}
        <div className="space-y-1">
          <p className="font-semibold">{dict.exhibitors}</p>
          <div className="flex flex-col gap-1">
            <a
              href={signupUrl}
              className="hover:text-melon"
              onClick={() =>
                track("exhibitor_signup_click", {
                  location: "footer_exhibitor_desktop"
                })
              }>
              {dict.registration}
            </a>
            <a
              href={withLocale("/exhibitor/packages")}
              className="hover:text-melon">
              {dict.kits}
            </a>
            <a href={withLocale("/exhibitor")} className="hover:text-melon">
              {dict.whyArmada}
            </a>
            <a
              href={withLocale("/exhibitor/timeline")}
              className="hover:text-melon">
              {dict.timeline}
            </a>
            <a
              href={withLocale("/exhibitor/events")}
              className="hover:text-melon">
              {dict.events}
            </a>
          </div>
        </div>

        {/* About */}
        <div className="space-y-1">
          <p className="font-semibold">{dict.about}</p>
          <div className="flex flex-col gap-1">
            <a href={withLocale("/about")} className="hover:text-melon">
              {dict.aboutArmada}
            </a>
            <a href={withLocale("/about/team")} className="hover:text-melon">
              {dict.team}
            </a>
            <a
              href={withLocale("/blog")}
              className="hover:text-melon"
              onClick={() =>
                track("blog_click", {
                  location: "footer_blog_desktop"
                })
              }>
              {dict.blog}
            </a>
          </div>
        </div>

        {/* Partnerships and affiliations */}
        <FooterAffiliations />
      </div>
      {/* Mobile accordion footer */}
      <div className="w-full max-w-7xl px-6 lg:hidden">
        {/* Social media */}
        <div className="mb-6 flex w-full flex-col gap-3 pl-4">
          <p className="font-semibold">{dict.followUs}</p>
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
              {dict.students}
            </AccordionTrigger>
            <AccordionContent className="bg-licorice">
              <div className="flex flex-col gap-2">
                <a
                  href={withLocale("/student/recruitment")}
                  onClick={() =>
                    track("student_signup_click", {
                      location: "footer_student_recruitment_mobile"
                    })
                  }>
                  {dict.recruitment}
                </a>
                <a href={withLocale("/student/events")}>{dict.events}</a>
                <a href={withLocale("/student/exhibitors")}>
                  {dict.exhibitorsList}
                </a>
                <a href={withLocale("/student/map")}>{dict.map}</a>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Exhibitors */}
          <AccordionItem value="exhibitors">
            <AccordionTrigger className="text-snow bg-licorice">
              {dict.exhibitors}
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
                  {dict.registration}
                </a>
                <a href={withLocale("/exhibitor/packages")}>{dict.kits}</a>
                <a href={withLocale("/exhibitor")}>{dict.whyArmada}</a>
                <a href={withLocale("/exhibitor/timeline")}>{dict.timeline}</a>
                <a href={withLocale("/exhibitor/events")}>{dict.events}</a>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* About */}
          <AccordionItem value="about">
            <AccordionTrigger className="text-snow bg-licorice">
              {dict.about}
            </AccordionTrigger>
            <AccordionContent className="bg-licorice">
              <div className="flex flex-col gap-2">
                <a href={withLocale("/about")}>{dict.aboutArmada}</a>
                <a href={withLocale("/about/team")}>{dict.team}</a>
                <a
                  href={withLocale("/blog")}
                  onClick={() =>
                    track("blog_click", {
                      location: "footer_blog_mobile"
                    })
                  }>
                  {dict.blog}
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
