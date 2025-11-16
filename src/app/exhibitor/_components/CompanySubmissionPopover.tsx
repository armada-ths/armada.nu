"use client"
import { sendToSlack } from "@/app/exhibitor/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import * as Popover from "@radix-ui/react-popover"
import { Headset, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMemo, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "sonner"

export function CompanySubmissionPopover() {
  const pathname = usePathname()

  // Don't show on the order page
  if (pathname === "/exhibitor/order") {
    return null
  }
  const recaptcha = useRef<{ getValue: () => string } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })
  const [isVerified, setIsVerified] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const formFilled = useMemo(
    () =>
      formData.name !== "" &&
      formData.email !== "" &&
      formData.phone !== "" &&
      formData.company !== "" &&
      formData.message !== "" &&
      isVerified,
    [formData, isVerified]
  )

  function handleFieldChange(event: {
    target: { name: string; value: string }
  }) {
    const key = event.target.name
    const updatedFormValue = event.target.value
    const newFormData = { ...formData, [key]: updatedFormValue }
    setFormData(newFormData)
  }

  function handleVerify(response: string | null) {
    if (response) {
      setIsVerified(true)
    } else {
      setIsVerified(false)
    }
  }

  async function sendMessage() {
    const captchaValue = recaptcha.current?.getValue()
    if (!captchaValue) {
      toast.warning("Please verify the reCAPTCHA!")
      return
    }
    const result = await sendToSlack(formData)

    if (result.success) {
      // Reset form fields
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      })
      toast.success(
        "Submitted! Our sale person will get in touch with you soon!"
      )
      setIsOpen(false)
    } else {
      toast.error("Submit failed! Please check your email format.")
    }
  }

  return (
    <div className="fixed bottom-0 z-50 mb-4 scale-75 transform md:mb-8 md:ml-8 md:scale-90">
      <Popover.Root open={isOpen}>
        <Popover.Trigger>
          <div
            className="mt-4 flex flex-row rounded-md bg-white p-2 text-black"
            onClick={() => setIsOpen(!isOpen)}>
            <Headset className="mr-1" />
            Contact Sales
          </div>
        </Popover.Trigger>
        <Popover.Content
          side="top"
          className="z-0 ml-4 max-h-[80vh] w-auto md:h-fit">
          <div className="rounded-lg bg-zinc-800 p-4 shadow-md filter">
            <div className="flex flex-col gap-2 p-2">
              <p className="text-l font-semibold">Contact</p>
              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="name">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFieldChange}
                  placeholder="Your name"
                />
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFieldChange}
                  placeholder="Your email"
                />
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="phone">
                  Phone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="phone"
                  value={formData.phone}
                  onChange={handleFieldChange}
                  placeholder="+46"
                />
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="company">
                  Company
                </label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleFieldChange}
                  placeholder="Your company"
                />
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1 text-sm" htmlFor="message">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleFieldChange}
                  placeholder="Enter your message"
                />
              </fieldset>

              <ReCAPTCHA
                ref={recaptcha}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                onChange={handleVerify}
                theme="dark"
              />

              <div className="flex justify-end">
                <Button
                  className="mt-2"
                  onClick={sendMessage}
                  disabled={!formFilled}>
                  Send
                </Button>
              </div>

              <X
                className="absolute right-[5px] top-[5px] cursor-default hover:cursor-pointer"
                onClick={() => setIsOpen(false)}></X>
            </div>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  )
}
