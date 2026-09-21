"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CircleAlert, CircleCheck, Mail } from "lucide-react"
import { type SubmitEvent, useState } from "react"

export interface EmailListSignupFields {
  email: string
  firstName?: string
}

export interface EmailListSignupFormProps {
  onSubmit: (fields: EmailListSignupFields) => Promise<boolean>
  title?: string
  description?: string
}

const GENERIC_ERROR_MESSAGE =
  "We couldn't subscribe you right now. Please try again in a moment."

/**
 * Presentational signup form for the "notify me about future recruitments"
 * email list. The Eventro integration lives in the parent component; this
 * component only handles input state and submit feedback so it stays easy to
 * exercise in Storybook.
 */
export function EmailListSignupForm({
  onSubmit,
  title = "Get notified when applications open",
  description = "Enter your email to receive updates about upcoming Armada volunteer recruitment."
}: EmailListSignupFormProps) {
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "submitting") {
      return
    }

    setStatus("submitting")

    try {
      const trimmedFirstName = firstName.trim()
      const success = await onSubmit({
        email: email.trim(),
        ...(trimmedFirstName ? { firstName: trimmedFirstName } : {})
      })
      if (success) {
        setStatus("success")
        setFirstName("")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <Card
        className="bg-melon gap-0 p-5 text-sm sm:p-6"
        role="status"
        aria-live="polite">
        <div className="flex items-center gap-3">
          <div className="bg-grapefruit text-snow border-border rounded-base flex size-10 shrink-0 items-center justify-center border-2">
            <CircleCheck size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="font-heading">You&apos;re subscribed.</p>
            <p className="mt-1">We&apos;ll email you when applications open.</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-melon gap-0 p-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="bg-grapefruit text-snow border-border rounded-base flex size-10 shrink-0 items-center justify-center border-2">
            <Mail size={20} aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-heading text-base">{title}</h2>
            <p className="mt-1 text-sm">{description}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor="recruitment-signup-email">
              Email
            </label>
            <Input
              id="recruitment-signup-email"
              type="email"
              required
              maxLength={255}
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={event => setEmail(event.target.value.trim())}
              disabled={status === "submitting"}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm" htmlFor="recruitment-signup-first-name">
              First name (optional)
            </label>
            <Input
              id="recruitment-signup-first-name"
              type="text"
              maxLength={255}
              autoComplete="given-name"
              placeholder="Your first name"
              value={firstName}
              onChange={event => setFirstName(event.target.value)}
              disabled={status === "submitting"}
            />
          </div>
          <Button
            type="submit"
            className="bg-grapefruit text-snow"
            disabled={status === "submitting" || email === ""}>
            {status === "submitting" ? "Subscribing..." : "Notify me"}
          </Button>
        </div>
        {status === "error" ? (
          <div
            className="bg-licorice text-snow border-border rounded-base flex items-start gap-2 border-2 px-3 py-2 text-sm"
            role="alert">
            <CircleAlert
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <p>{GENERIC_ERROR_MESSAGE}</p>
          </div>
        ) : null}
      </form>
    </Card>
  )
}
