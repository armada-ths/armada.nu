"use client"
import { Link } from "@armada/shared/i18n/navigation"
import { useLocale } from "@armada/shared/i18n/client"
import { normalizeLocale } from "@armada/shared/i18n/routing"

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

import { translations } from "@/lib/i18n"

function FooterAffiliations({
  inPartnershipWith,
  memberOf
}: {
  inPartnershipWith: string
  memberOf: string
}) {
  return (
    <div className="flex items-start justify-center gap-6">
      <div className="flex w-28 flex-col items-center gap-2 text-center">
        <p className="font-semibold">{inPartnershipWith}</p>
        <Link href="https://sture.se/">
          <Image
            src="/sture-logo-up.png"
            alt="Sture"
            width={70}
            height={70}
            className="object-contain"
            style={{ height: "auto" }}
          />
        </Link>
      </div>
      <div className="flex w-40 flex-col items-center gap-2 text-center">
        <p className="font-semibold">{memberOf}</p>
        <Link href="https://diversitycharter.se/">
          <Image
            src="/LogoDCS-300dpi.png"
            alt="Diversity Charter Sweden"
            width={150}
            height={103}
            className="object-contain"
            style={{ height: "auto" }}
          />
        </Link>
      </div>
    </div>
  )
}

export function Footer({ signupUrl }: { signupUrl: string }) {
  const locale = normalizeLocale(useLocale())
  const dict = translations[locale]

  return (
    <footer className="bg-licorice text-snow flex w-full flex-col items-center py-8">
      {/* Divider */}
      <hr className="mb-6 h-px w-2/3 bg-slate-600 opacity-40" />

      {/* Desktop footer */}
      <div className="hidden w-full max-w-7xl lg:flex lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:px-12 lg:text-left">
        {/* Social media */}
        <div className="space-y-1">
          <p className="font-semibold">{dict.followUs}</p>
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <Link
              href="https://linkedin.com/company/armada"
              className="hover:text-melon flex items-center gap-2">
              <LinkedInIcon
                className="h-4.5 w-4.5"
                aria-hidden="true"
                focusable="false"
              />
              <span>LinkedIn</span>
            </Link>
            <Link
              href="https://instagram.com/thsarmada"
              className="hover:text-melon flex items-center gap-2">
              <SiInstagram size={18} aria-hidden="true" focusable="false" />
              <span>Instagram</span>
            </Link>
            <Link
              href="https://tiktok.com/@ths.armada"
              className="hover:text-melon flex items-center gap-2">
              <SiTiktok size={18} aria-hidden="true" focusable="false" />
              <span>TikTok</span>
            </Link>
          </div>
        </div>

        {/* Students */}
        <div className="space-y-1">
          <p className="font-semibold">{dict.students}</p>
          <div className="flex flex-col gap-1">
            <Link
              href={"/student/recruitment"}
              className="hover:text-melon"
              onClick={() =>
                track("student_signup_click", {
                  location: "footer_student_recruitment_desktop"
                })
              }>
              {dict.recruitment}
            </Link>
            <Link href={"/student/events"} className="hover:text-melon">
              {dict.events}
            </Link>
            <Link href={"/student/exhibitors"} className="hover:text-melon">
              {dict.exhibitorsList}
            </Link>
            <Link href={"/student/map"} className="hover:text-melon">
              {dict.map}
            </Link>
          </div>
        </div>

        {/* Exhibitors */}
        <div className="space-y-1">
          <p className="font-semibold">{dict.exhibitors}</p>
          <div className="flex flex-col gap-1">
            <Link
              href={signupUrl}
              className="hover:text-melon"
              onClick={() =>
                track("exhibitor_signup_click", {
                  location: "footer_exhibitor_desktop"
                })
              }>
              {dict.registration}
            </Link>
            <Link href={"/exhibitor/packages"} className="hover:text-melon">
              {dict.kits}
            </Link>
            <Link href={"/exhibitor"} className="hover:text-melon">
              {dict.whyArmada}
            </Link>
            <Link href={"/exhibitor/timeline"} className="hover:text-melon">
              {dict.timeline}
            </Link>
            <Link href={"/exhibitor/events"} className="hover:text-melon">
              {dict.events}
            </Link>
          </div>
        </div>

        {/* About */}
        <div className="space-y-1">
          <p className="font-semibold">{dict.about}</p>
          <div className="flex flex-col gap-1">
            <Link href={"/about"} className="hover:text-melon">
              {dict.aboutArmada}
            </Link>
            <Link href={"/about/team"} className="hover:text-melon">
              {dict.team}
            </Link>
            <Link
              href={"/blog"}
              className="hover:text-melon"
              onClick={() =>
                track("blog_click", {
                  location: "footer_blog_desktop"
                })
              }>
              {dict.blog}
            </Link>
          </div>
        </div>

        {/* Partnerships and affiliations */}
        <FooterAffiliations
          inPartnershipWith={dict.inPartnershipWith}
          memberOf={dict.memberOf}
        />
      </div>
      {/* Mobile accordion footer */}
      <div className="w-full max-w-7xl px-6 lg:hidden">
        {/* Social media */}
        <div className="mb-6 flex w-full flex-col gap-3 pl-4">
          <p className="font-semibold">{dict.followUs}</p>
          <div className="flex items-center gap-6">
            <Link
              href="https://linkedin.com/company/armada"
              aria-label="LinkedIn"
              className="hover:text-melon transition-colors">
              <LinkedInIcon
                className="h-6 w-6"
                aria-hidden="true"
                focusable="false"
              />
            </Link>
            <Link
              href="https://instagram.com/thsarmada"
              aria-label="Instagram"
              className="hover:text-melon transition-colors">
              <SiInstagram size={24} aria-hidden="true" focusable="false" />
            </Link>
            <Link
              href="https://tiktok.com/@ths.armada"
              aria-label="TikTok"
              className="hover:text-melon transition-colors">
              <SiTiktok size={24} aria-hidden="true" focusable="false" />
            </Link>
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
                <Link
                  href={"/student/recruitment"}
                  onClick={() =>
                    track("student_signup_click", {
                      location: "footer_student_recruitment_mobile"
                    })
                  }>
                  {dict.recruitment}
                </Link>
                <Link href={"/student/events"}>{dict.events}</Link>
                <Link href={"/student/exhibitors"}>{dict.exhibitorsList}</Link>
                <Link href={"/student/map"}>{dict.map}</Link>
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
                <Link
                  href={signupUrl}
                  onClick={() =>
                    track("exhibitor_signup_click", {
                      location: "footer_exhibitor_mobile"
                    })
                  }>
                  {dict.registration}
                </Link>
                <Link href={"/exhibitor/packages"}>{dict.kits}</Link>
                <Link href={"/exhibitor"}>{dict.whyArmada}</Link>
                <Link href={"/exhibitor/timeline"}>{dict.timeline}</Link>
                <Link href={"/exhibitor/events"}>{dict.events}</Link>
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
                <Link href={"/about"}>{dict.aboutArmada}</Link>
                <Link href={"/about/team"}>{dict.team}</Link>
                <Link
                  href={"/blog"}
                  onClick={() =>
                    track("blog_click", {
                      location: "footer_blog_mobile"
                    })
                  }>
                  {dict.blog}
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* Partnerships and affiliations */}
        <div className="mt-6 w-full">
          <FooterAffiliations
            inPartnershipWith={dict.inPartnershipWith}
            memberOf={dict.memberOf}
          />
        </div>
      </div>
    </footer>
  )
}
