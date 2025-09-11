"use client"
import { sendOrderToSlack } from "@/app/exhibitor/actions"
import { Page } from "@/components/shared/Page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { toast } from "sonner"

export default function OrderPage() {
  const recaptcha = useRef<InstanceType<typeof ReCAPTCHA> | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    message: ""
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Support both variable names; prefer SITE_KEY
  const siteKey =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
    process.env.NEXT_PUBLIC_RECAPTCHA_KEY ??
    ""

  useEffect(() => {
    if (!siteKey) {
      // Avoid crashing reCAPTCHA; keep submit disabled
      console.warn(
        "Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY (or NEXT_PUBLIC_RECAPTCHA_KEY). reCAPTCHA disabled."
      )
    }
  }, [siteKey])

  function handleFieldChange(event: {
    target: { name: string; value: string }
  }) {
    const key = event.target.name
    const updatedFormValue = event.target.value
    const newFormData = { ...formData, [key]: updatedFormValue }
    setFormData(newFormData)
  }

  async function sendMessage() {
    if (isSubmitting) return

    // Simple client-side validation
    const missingName = formData.name.trim() === ""
    const missingCompany = formData.company.trim() === ""
    const missingMessage = formData.message.trim() === ""
    if (missingName || missingCompany || missingMessage) {
      toast.warning("Please fill in all fields before sending.")
      // Focus first missing field to guide the user
      requestAnimationFrame(() => {
        if (missingName) document.getElementById("name")?.focus()
        else if (missingCompany) document.getElementById("company")?.focus()
        else document.getElementById("message")?.focus()
      })
      return
    }

    setIsSubmitting(true)
    let token: string | null | undefined
    if (siteKey) {
      try {
        token = await recaptcha.current?.executeAsync?.()
        if (!token) {
          toast.warning("Please verify the reCAPTCHA!")
          setIsSubmitting(false)
          return
        }
      } catch {
        setIsSubmitting(false)
        toast.error("Failed to run reCAPTCHA. Please try again.")
        return
      } finally {
        // Reset the invisible widget so it can be executed again later
        recaptcha.current?.reset?.()
      }
    }

    const result = await sendOrderToSlack(formData)

    if (result.success) {
      setFormData({
        name: "",
        company: "",
        message: ""
      })
      toast.success("Submitted!")
      setSubmitted(true)
    } else {
      toast.error(result.error ?? "Submit failed!")
    }
    setIsSubmitting(false)
  }

  function sendAnother() {
    // Reset local state and show the form again
    setSubmitted(false)
    recaptcha.current?.reset?.()
  }

  if (submitted) {
    return (
      <Page.Background withIndents>
        <Page.Boundary maxWidth={750}>
          <Page.Header>Order</Page.Header>
          <div className="mt-3" role="status" aria-live="polite">
            <h2 className="mb-2 text-lg font-semibold">
              Thank you for your request!
            </h2>
            <p>
              We’ve received your order request and will get back to you as soon
              as possible.
            </p>
            <div className="mt-8">
              <Button size="sm" className="px-2" onClick={sendAnother}>
                Send another request
              </Button>
            </div>
          </div>
        </Page.Boundary>
      </Page.Background>
    )
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={750}>
        <Page.Header>Order</Page.Header>
        <div className="mt-2 flex flex-col gap-2">
          <fieldset className="flex flex-col">
            <label className="mb-1 text-sm" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              searchIcon={false}
              onChange={handleFieldChange}
              placeholder="Your name"
              autoFocus
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
              searchIcon={false}
              onChange={handleFieldChange}
              placeholder="Your company"
            />
          </fieldset>

          <fieldset className="flex flex-col">
            <label className="mb-1 text-sm" htmlFor="message">
              Request
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleFieldChange}
              placeholder="Your request"
            />
          </fieldset>

          <div className="mt-4 flex items-end gap-4">
            {siteKey ? (
              <ReCAPTCHA
                ref={recaptcha}
                sitekey={siteKey}
                theme="dark"
                size="invisible"
              />
            ) : (
              <div className="text-sm text-red-600">
                reCAPTCHA unavailable: missing site key
              </div>
            )}
            <div className="ml-auto">
              <Button
                className="mt-0"
                onClick={sendMessage}
                disabled={isSubmitting}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
