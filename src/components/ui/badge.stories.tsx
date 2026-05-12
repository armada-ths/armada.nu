import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect } from "storybook/test"

import { Badge } from "./badge"

const meta = {
    title: "UI/Badge",
    component: Badge,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "neutral"]
        }
    }
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { children: "Technology" },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("Technology")).toBeInTheDocument()
    }
}

export const Neutral: Story = {
    args: { variant: "neutral", children: "Consulting" }
}

export const MultipleVariants: Story = {
    args: {},
    render: () => (
        <div className="flex gap-2">
            <Badge>Sustainability</Badge>
            <Badge>Finance</Badge>
            <Badge variant="neutral">Engineering</Badge>
            <Badge variant="neutral">IT</Badge>
        </div>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByText("Sustainability")).toBeInTheDocument()
        await expect(canvas.getByText("Engineering")).toBeInTheDocument()
    }
}
