import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent } from "storybook/test"

import { Button } from "./button"

const meta = {
    title: "UI/Button",
    component: Button,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "noShadow", "neutral", "reverse"]
        },
        size: {
            control: "select",
            options: ["default", "sm", "lg", "icon"]
        }
    },
    args: { onClick: fn() }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { children: "Register Company" },
    play: async ({ canvas, args }) => {
        const button = canvas.getByRole("button", { name: "Register Company" })
        await expect(button).toBeInTheDocument()
        await userEvent.click(button)
        await expect(args.onClick).toHaveBeenCalledOnce()
    }
}

export const NoShadow: Story = {
    args: { variant: "noShadow", children: "No Shadow" }
}

export const Neutral: Story = {
    args: { variant: "neutral", children: "Go Back" }
}

export const Reverse: Story = {
    args: { variant: "reverse", children: "Hover Me" }
}

export const Large: Story = {
    args: { size: "lg", children: "Apply Now" }
}

export const Small: Story = {
    args: { size: "sm", children: "Details" }
}

export const Disabled: Story = {
    args: { disabled: true, children: "Unavailable" },
    play: async ({ canvas }) => {
        const button = canvas.getByRole("button", { name: "Unavailable" })
        await expect(button).toBeDisabled()
    }
}
