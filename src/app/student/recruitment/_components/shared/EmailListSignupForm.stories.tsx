import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, waitFor } from "storybook/test"

import { EmailListSignupForm } from "./EmailListSignupForm"

const meta = {
  title: "Recruitment/EmailListSignupForm",
  component: EmailListSignupForm,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="w-[min(34rem,90vw)]">
        <Story />
      </div>
    )
  ],
  args: {
    onSubmit: fn(async () => false)
  }
} satisfies Meta<typeof EmailListSignupForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SuccessfulSignup: Story = {
  args: {
    onSubmit: fn(async () => true)
  },
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText(/^name/i), " Ada Lovelace ")
    await userEvent.type(canvas.getByLabelText(/^email$/i), "ada@example.com")
    await userEvent.click(canvas.getByRole("button", { name: /notify me/i }))

    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({
        name: "Ada Lovelace",
        email: "ada@example.com"
      })
    )
    await expect(
      await canvas.findByText(/you're subscribed/i)
    ).toBeInTheDocument()
  }
}

export const SuccessfulSignupWithoutName: Story = {
  args: {
    onSubmit: fn(async () => true)
  },
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText(/^email$/i), "ada@example.com")
    await userEvent.click(canvas.getByRole("button", { name: /notify me/i }))

    await waitFor(() =>
      expect(args.onSubmit).toHaveBeenCalledWith({
        email: "ada@example.com"
      })
    )
    await expect(
      await canvas.findByText(/you're subscribed/i)
    ).toBeInTheDocument()
  }
}

export const FailedSignup: Story = {
  args: {
    onSubmit: fn(async () => false)
  },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText(/^name/i), "Ada Lovelace")
    await userEvent.type(canvas.getByLabelText(/^email$/i), "ada@example.com")
    await userEvent.click(canvas.getByRole("button", { name: /notify me/i }))

    await expect(await canvas.findByRole("alert")).toHaveTextContent(
      /couldn't subscribe you right now/i
    )
  }
}

export const DisabledUntilEmailEntered: Story = {
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: /notify me/i })
    ).toBeDisabled()
  }
}
