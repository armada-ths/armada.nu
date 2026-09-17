"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { FormEvent, useState } from "react"

export type EmailListSignupResult =
  { success: true } | { success: false; error: string }

export interface EmailListSignupFormProps {
  onSubmit: (email: string) => Promise<EmailListSignupResult>
}

const GENERIC_ERROR_MESSAGE =
  "Something went wrong. Please try again in a moment."

/**
 * Presentational signup form for the "notify me about future recruitments"
 * email list. All Eventro/reCAPTCHA integration lives in the parent
 * component; this component only handles input state and submit feedback so
 * it stays easy to exercise in Storybook.
 */
export function EmailListSignupForm({ onSubmit }: EmailListSignupFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "submitting") {
      return
    }

    setStatus("submitting")
    setErrorMessage(null)

    try {
      const result = await onSubmit(email)
      if (result.success) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
        setErrorMessage(result.error || GENERIC_ERROR_MESSAGE)
      }
    } catch {
      setStatus("error")
      setErrorMessage(GENERIC_ERROR_MESSAGE)
    }
  }

  if (status === "success") {
    return (
      <div className="bg-coconut rounded-md p-4 text-sm">
        <p className="font-semibold">You&apos;re on the list! 🎉</p>
        <p className="text-licorice/70 mt-1">
          We&apos;ll email you as soon as our next recruitment opens.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-coconut flex flex-col gap-3 rounded-md p-4 sm:flex-row sm:items-start">
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Mail size={18} />
          <p className="text-sm font-semibold">
            Get notified about future recruitments
          </p>
        </div>
        <p className="text-licorice/70 text-xs">
          Leave your email and we&apos;ll let you know as soon as our next Host,
          OT or PG recruitment opens. No spam, unsubscribe anytime.
        </p>
        <Input
          type="email"
          required
          placeholder="you@example.com"
          aria-label="Email address"
          value={email}
          onChange={event => setEmail(event.target.value)}
          disabled={status === "submitting"}
        />
        {status === "error" ? (
          <p className="text-sm text-red-600">
            {errorMessage || GENERIC_ERROR_MESSAGE}
          </p>
        ) : null}
      </div>
      <Button
        type="submit"
        className="bg-grapefruit text-snow sm:mt-6"
        disabled={status === "submitting" || email === ""}>
        {status === "submitting" ? "Signing up..." : "Notify me"}
      </Button>
    </form>
  )
}
