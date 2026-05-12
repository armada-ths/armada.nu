import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, userEvent } from "storybook/test"

import { Input } from "./input"

const meta = {
    title: "UI/Input",
    component: Input,
    parameters: {
        layout: "centered"
    },
    tags: ["autodocs"],
    decorators: [
        Story => (
            <div className="w-80">
                <Story />
            </div>
        )
    ]
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithPlaceholder: Story = {
    args: { placeholder: "Your email address" },
    play: async ({ canvas }) => {
        const input = canvas.getByPlaceholderText("Your email address")
        await expect(input).toBeInTheDocument()
        await userEvent.type(input, "student@kth.se")
        await expect(input).toHaveValue("student@kth.se")
    }
}

export const Disabled: Story = {
    args: { disabled: true, placeholder: "Applications closed" },
    play: async ({ canvas }) => {
        const input = canvas.getByPlaceholderText("Applications closed")
        await expect(input).toBeDisabled()
    }
}

export const Password: Story = {
    args: { type: "password", placeholder: "Enter your password" }
}
