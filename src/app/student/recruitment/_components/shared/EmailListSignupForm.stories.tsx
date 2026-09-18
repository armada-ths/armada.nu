import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, waitFor } from "storybook/test"

import {
  EmailListSignupForm,
  EmailListSignupResult
} from "./EmailListSignupForm"

const meta = {
  title: "Recruitment/EmailListSignupForm",
  component: EmailListSignupForm,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: {
    onSubmit: fn()
  }
} satisfies Meta<typeof EmailListSignupForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: args => (
    <div className="w-[min(34rem,90vw)]">
      <EmailListSignupForm {...args} />
    </div>
  )
}

export const SuccessfulSignup: Story = {
  args: {
    onSubmit: fn(async (): Promise<EmailListSignupResult> => ({
      success: true
    }))
  },
  render: args => (
    <div className="w-[min(34rem,90vw)]">
      <EmailListSignupForm {...args} />
    </div>
  ),
  play: async ({ canvas, args }) => {
    await userEvent.type(
      canvas.getByLabelText(/name \(optional\)/i),
      "Ada Lovelace"
    )
    await userEvent.type(
      canvas.getByLabelText(/email address/i),
      "ada@example.com"
    )
    await userEvent.click(canvas.getByRole("button", { name: /notify me/i }))

    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith(
        "Ada Lovelace",
        "ada@example.com"
      )
    )
    await expect(
      await canvas.findByText(/you're on the list/i)
    ).toBeInTheDocument()
  }
}

export const SuccessfulSignupWithoutName: Story = {
  args: {
    onSubmit: fn(async (): Promise<EmailListSignupResult> => ({
      success: true
    }))
  },
  render: args => (
    <div className="w-[min(34rem,90vw)]">
      <EmailListSignupForm {...args} />
    </div>
  ),
  play: async ({ canvas, args }) => {
    await userEvent.type(
      canvas.getByLabelText(/email address/i),
      "ada@example.com"
    )
    await userEvent.click(canvas.getByRole("button", { name: /notify me/i }))

    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith("", "ada@example.com")
    )
    await expect(
      await canvas.findByText(/you're on the list/i)
    ).toBeInTheDocument()
  }
}

export const FailedSignup: Story = {
  args: {
    onSubmit: fn(async (): Promise<EmailListSignupResult> => ({
      success: false,
      error: "Signup failed. Please try again."
    }))
  },
  render: args => (
    <div className="w-[min(34rem,90vw)]">
      <EmailListSignupForm {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await userEvent.type(
      canvas.getByLabelText(/name \(optional\)/i),
      "Ada Lovelace"
    )
    await userEvent.type(
      canvas.getByLabelText(/email address/i),
      "ada@example.com"
    )
    await userEvent.click(canvas.getByRole("button", { name: /notify me/i }))

    await expect(
      await canvas.findByText(/signup failed\. please try again\./i)
    ).toBeInTheDocument()
  }
}

export const DisabledUntilEmailEntered: Story = {
  render: args => (
    <div className="w-[min(34rem,90vw)]">
      <EmailListSignupForm {...args} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: /notify me/i })
    ).toBeDisabled()
  }
}
