"use client"
import { sendToSlack } from "@/app/exhibitor/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { getLocaleFromPathname, type Locale } from "@/lib/i18n"
import { Headset, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

function isRecaptchaAllowedHostname(hostname: string) {
  return hostname === "armada.nu" || hostname === "staging.armada.nu"
}

const contactSalesText: Record<
  Locale,
  {
    trigger: string
    title: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    company: string
    companyPlaceholder: string
    message: string
    messagePlaceholder: string
    send: string
    sending: string
    missingRecaptcha: string
    invalidDomain: string
    recaptchaNotReady: string
    submitted: string
    submitFailed: string
  }
> = {
  en: {
    trigger: "Contact Sales",
    title: "Contact",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "Your email",
    phone: "Phone",
    company: "Company",
    companyPlaceholder: "Your company",
    message: "Message",
    messagePlaceholder: "Enter your message",
    send: "Send",
    sending: "Sending...",
    missingRecaptcha: "reCAPTCHA site key is missing.",
    invalidDomain: "reCAPTCHA is not configured for this domain.",
    recaptchaNotReady: "reCAPTCHA is not ready yet. Please try again.",
    submitted: "Submitted! Our sales person will get in touch with you soon!",
    submitFailed: "Submit failed. Please try again."
  },
  sv: {
    trigger: "Kontakta sales",
    title: "Kontakt",
    name: "Namn",
    namePlaceholder: "Ditt namn",
    email: "E-post",
    emailPlaceholder: "Din e-post",
    phone: "Telefon",
    company: "Företag",
    companyPlaceholder: "Ditt företag",
    message: "Meddelande",
    messagePlaceholder: "Skriv ditt meddelande",
    send: "Skicka",
    sending: "Skickar...",
    missingRecaptcha: "reCAPTCHA site key saknas.",
    invalidDomain: "reCAPTCHA är inte konfigurerat för den här domänen.",
    recaptchaNotReady: "reCAPTCHA är inte redo ännu. Försök igen.",
    submitted: "Skickat! Vår salesansvariga kontaktar er snart.",
    submitFailed: "Det gick inte att skicka. Försök igen."
  }
}

export function CompanySubmissionPopover() {
  const pathname = usePathname()
  const dict = contactSalesText[getLocaleFromPathname(pathname)]

  // Don't show on the order page
  if (pathname === "/exhibitor/order") {
    return null
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isAllowedHost, setIsAllowedHost] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    setIsAllowedHost(isRecaptchaAllowedHostname(window.location.hostname))
  }, [])

  const shouldLoadRecaptcha = Boolean(siteKey) && isAllowedHost && isOpen

  const formFilled = useMemo(
    () =>
      formData.name !== "" &&
      formData.email !== "" &&
      formData.phone !== "" &&
      formData.company !== "" &&
      formData.message !== "",
    [formData]
  )

  function handleFieldChange(event: {
    target: { name: string; value: string }
  }) {
    const key = event.target.name
    const updatedFormValue = event.target.value
    const newFormData = { ...formData, [key]: updatedFormValue }
    setFormData(newFormData)
  }

  async function sendMessage() {
    if (!siteKey) {
      toast.error(dict.missingRecaptcha)
      return
    }

    if (!isAllowedHost) {
      toast.error(dict.invalidDomain)
      return
    }

    const grecaptchaEnterprise = window.grecaptcha?.enterprise
    if (!grecaptchaEnterprise) {
      toast.error(dict.recaptchaNotReady)
      return
    }

    try {
      setIsSubmitting(true)

      await new Promise<void>(resolve => {
        grecaptchaEnterprise.ready(() => resolve())
      })

      const recaptchaToken = await grecaptchaEnterprise.execute(siteKey, {
        action: "contact_sales"
      })

      const result = await sendToSlack({
        ...formData,
        recaptchaToken
      })

      if (result.success) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: ""
        })
        toast.success(dict.submitted)
        setIsOpen(false)
      } else {
        toast.error(dict.submitFailed)
      }
    } catch {
      toast.error(dict.submitFailed)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed bottom-0 z-10 mb-4 scale-75 transform md:mb-8 md:ml-8 md:scale-90">
      {shouldLoadRecaptcha ? (
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${siteKey}`}
          strategy="afterInteractive"
        />
      ) : null}
      <Popover open={isOpen}>
        <PopoverTrigger>
          <div
            className="bg-snow text-licorice flex flex-row rounded-md p-2"
            onClick={() => setIsOpen(!isOpen)}>
            <Headset className="mr-1" />
            {dict.trigger}
          </div>
        </PopoverTrigger>
        <PopoverContent side="top" className="bg-licorice z-10 ml-4 w-auto">
          <div className="bg-licorice p-4 shadow-md filter">
            <div className="flex flex-col gap-2">
              <p className="text-l font-semibold">{dict.title}</p>
              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="name">
                  {dict.name}
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFieldChange}
                  placeholder={dict.namePlaceholder}
                />
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="email">
                  {dict.email}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  placeholder={dict.emailPlaceholder}
                />
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="phone">
                  {dict.phone}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  placeholder="+46"
                />
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="company">
                  {dict.company}
                </label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleFieldChange}
                  placeholder={dict.companyPlaceholder}
                />
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="message">
                  {dict.message}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleFieldChange}
                  className="bg-snow text-licorice placeholder:text-licorice/50"
                  placeholder={dict.messagePlaceholder}
                />
              </fieldset>

              <div className="flex justify-end">
                <Button
                  className="bg-grapefruit text-snow mt-2"
                  onClick={sendMessage}
                  disabled={!formFilled || isSubmitting}>
                  {isSubmitting ? dict.sending : dict.send}
                </Button>
              </div>

              <X
                className="absolute top-1.25 right-1.25 cursor-default hover:cursor-pointer"
                onClick={() => setIsOpen(false)}></X>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
