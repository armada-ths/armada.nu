import { useState, useSyncExternalStore, type ComponentProps } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useSearchParams } from "@storybook/nextjs-vite/navigation.mock"
import { expect, userEvent, waitFor, within } from "storybook/test"

import type {
  Employment,
  Exhibitor,
  Industry,
  Program
} from "@/components/shared/hooks/api/useExhibitors"

import ExhibitorSearch from "./ExhibitorSearch"

let navigationUrl = new URL("https://example.test/student/exhibitors")

const subscribeToHistory = (callback: () => void) => {
  window.addEventListener("exhibitor-history-change", callback)
  return () => window.removeEventListener("exhibitor-history-change", callback)
}

function useHistorySearchParams() {
  const query = useSyncExternalStore(
    subscribeToHistory,
    () => navigationUrl.search,
    () => ""
  )
  return new URLSearchParams(query) as ReturnType<typeof useSearchParams>
}

// Model Next's History API integration without navigating the Storybook preview itself.
function mockNativeNavigation(query: string) {
  const originalSearchParams = useSearchParams.getMockImplementation()
  const methods = {
    pushState: window.history.pushState,
    replaceState: window.history.replaceState,
    back: window.history.back,
    forward: window.history.forward
  }
  navigationUrl = new URL(`/student/exhibitors${query}`, window.location.origin)
  const entries = [navigationUrl]
  let position = 0
  const notify = () =>
    window.dispatchEvent(new Event("exhibitor-history-change"))
  window.history.pushState = (_data, _unused, url) => {
    navigationUrl = new URL(String(url), navigationUrl)
    entries.splice(position + 1, entries.length, navigationUrl)
    position++
    notify()
  }
  window.history.replaceState = (_data, _unused, url) => {
    navigationUrl = new URL(String(url), navigationUrl)
    entries[position] = navigationUrl
    notify()
  }
  window.history.back = () => {
    if (position > 0) {
      navigationUrl = entries[--position]
      notify()
    }
  }
  window.history.forward = () => {
    if (position < entries.length - 1) {
      navigationUrl = entries[++position]
      notify()
    }
  }
  useSearchParams.mockImplementation(useHistorySearchParams)
  return () => {
    if (originalSearchParams)
      useSearchParams.mockImplementation(originalSearchParams)
    Object.assign(window.history, methods)
  }
}

function RefreshableExhibitorSearch(
  props: ComponentProps<typeof ExhibitorSearch>
) {
  const [data, setData] = useState(props.exhibitors)
  return (
    <>
      <button
        onClick={() =>
          setData(previous => previous.map(exhibitor => ({ ...exhibitor })))
        }>
        Refresh server data
      </button>
      <ExhibitorSearch {...props} exhibitors={data} />
    </>
  )
}

const internship: Employment = { id: 1, name: "Internship" }
const software: Industry = {
  id: 1,
  name: "Technology & Software Development"
}
const engineering: Program = { id: 1, name: "Engineering Physics" }

const exhibitors: Exhibitor[] = [
  {
    id: 1,
    name: "Beta Industries",
    type: "Company",
    tier: "Gold",
    fairLocation: "Nymble",
    climateCompensation: false,
    employments: [internship],
    industries: [software],
    programs: [engineering]
  },
  {
    id: 2,
    name: "Alpha Systems",
    type: "Company",
    tier: "Bronze",
    fairLocation: "Nymble",
    climateCompensation: false,
    employments: [],
    industries: [],
    programs: []
  },
  {
    id: 3,
    name: "Gamma Group",
    type: "Company",
    tier: "Silver",
    fairLocation: "Nymble",
    climateCompensation: false,
    employments: [],
    industries: [],
    programs: []
  }
]

const meta = {
  title: "Student/ExhibitorSearch",
  component: ExhibitorSearch,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true }
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <div className="bg-coconut min-h-screen px-5">
        <Story />
      </div>
    )
  ],
  args: {
    exhibitors,
    employments: [internship],
    industries: [software],
    programs: [engineering]
  }
} satisfies Meta<typeof ExhibitorSearch>

export default meta
type Story = StoryObj<typeof meta>

export const FilteringAndSorting: Story = {
  play: async ({ canvas }) => {
    const searchInput = canvas.getByPlaceholderText("Search by company name")
    const companyHeadings = canvas.getAllByRole("heading", { level: 3 })
    await expect(companyHeadings[0]).toHaveTextContent("Beta Industries")

    const sortTrigger = canvas.getByRole("combobox", {
      name: "Sort exhibitors by"
    })
    await userEvent.click(sortTrigger)

    await userEvent.click(searchInput)
    await expect(searchInput).toHaveFocus()
    await expect(sortTrigger).toHaveAttribute("aria-expanded", "false")

    await userEvent.click(sortTrigger)
    await userEvent.click(
      await within(document.body).findByRole("option", { name: "Name: A-Z" })
    )

    await waitFor(() => {
      expect(canvas.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent(
        "Alpha Systems"
      )
    })

    const industryTrigger = canvas.getByRole("combobox", {
      name: /Filter by Industry/
    })
    await userEvent.click(industryTrigger)
    const industryListbox = await within(document.body).findByRole("listbox", {
      name: "Available options"
    })
    await userEvent.click(
      within(industryListbox).getByRole("option", {
        name: /Technology & Software Development, not selected/
      })
    )
    await userEvent.click(
      within(document.body).getByRole("button", { name: "Close" })
    )

    const removeIndustry = canvas.getByRole("button", {
      name: /Remove Technology & Software Development/
    })
    const industryBadge = removeIndustry.closest<HTMLElement>(
      "[data-slot='badge']"
    )
    await expect(industryBadge).not.toBeNull()
    if (!industryBadge) return

    const badgeBeforeHover = industryBadge.getBoundingClientRect()
    await userEvent.hover(removeIndustry)
    await new Promise(resolve => setTimeout(resolve, 350))
    const badgeAfterHover = industryBadge.getBoundingClientRect()

    await expect(badgeAfterHover.width).toBe(badgeBeforeHover.width)
    await expect(badgeAfterHover.height).toBe(badgeBeforeHover.height)
    await expect(industryTrigger.className).toContain(
      "hover:translate-x-boxShadowX"
    )
    await expect(industryTrigger.className).toContain(
      "hover:translate-y-boxShadowY"
    )
    await expect(industryTrigger.className).toContain("hover:shadow-none")

    await userEvent.click(removeIndustry)

    await userEvent.type(searchInput, "Gamma")
    await expect(canvas.getByText("Gamma Group")).toBeInTheDocument()
    await expect(canvas.queryByText("Alpha Systems")).not.toBeInTheDocument()
  }
}

export const ClosingCompanyModal: Story = {
  beforeEach: () => mockNativeNavigation("?id=1&source=kept"),
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/student/exhibitors",
        query: { id: "1" }
      }
    }
  },
  play: async () => {
    const body = within(document.body)
    const dialog = await body.findByRole("dialog")

    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }))

    await waitFor(() => {
      expect(body.queryByRole("dialog")).not.toBeInTheDocument()
    })
    await expect(navigationUrl.searchParams.has("id")).toBe(false)
    await expect(navigationUrl.searchParams.get("source")).toBe("kept")

    await new Promise(resolve => setTimeout(resolve, 300))
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument()
  }
}

export const RandomizedWithinTiers: Story = {
  render: args => <RefreshableExhibitorSearch {...args} />,
  args: {
    exhibitors: ["Gold", "Silver", "Bronze"].flatMap((tier, tierIndex) =>
      ["Zulu", "Alpha"].map((name, index) => ({
        ...exhibitors[0],
        id: 100 + tierIndex * 2 + index,
        tier,
        name: `${tier} ${name}`
      }))
    )
  },
  beforeEach: () => {
    const original = Math.random
    Math.random = () => 0
    return () => {
      Math.random = original
    }
  },
  play: async ({ canvas }) => {
    const goldFirst = [
      "Gold Alpha",
      "Gold Zulu",
      "Silver Zulu",
      "Silver Alpha",
      "Bronze Zulu",
      "Bronze Alpha"
    ]
    const names = () =>
      canvas
        .getAllByRole("heading", { level: 3 })
        .map(heading => heading.textContent)
    const chooseSort = async (name: string) => {
      await userEvent.click(
        canvas.getByRole("combobox", { name: "Sort exhibitors by" })
      )
      await userEvent.click(
        await within(document.body).findByRole("option", { name })
      )
    }
    await waitFor(() => expect(names()).toEqual(goldFirst))
    await chooseSort("Name: A-Z")
    await waitFor(() =>
      expect(names()).toEqual([...goldFirst].sort((a, b) => a.localeCompare(b)))
    )
    await chooseSort("Name: Z-A")
    await waitFor(() =>
      expect(names()).toEqual([...goldFirst].sort((a, b) => b.localeCompare(a)))
    )
    await chooseSort("Tier: Bronze to Gold")
    await waitFor(() =>
      expect(names()).toEqual([
        "Bronze Zulu",
        "Bronze Alpha",
        "Silver Zulu",
        "Silver Alpha",
        "Gold Alpha",
        "Gold Zulu"
      ])
    )
    await chooseSort("Tier: Gold to Bronze")
    await waitFor(() => expect(names()).toEqual(goldFirst))
    const search = canvas.getByPlaceholderText("Search by company name")
    await userEvent.type(search, "Gold")
    await waitFor(() => expect(names()).toEqual(["Gold Alpha", "Gold Zulu"]))
    await userEvent.clear(search)
    await waitFor(() => expect(names()).toEqual(goldFirst))
    Math.random = () => 0.999
    await userEvent.click(
      canvas.getByRole("button", { name: "Refresh server data" })
    )
    await waitFor(() => expect(names()).toEqual(goldFirst))
    await userEvent.click(
      canvas.getByRole("button", { name: "Refresh server data" })
    )
    await waitFor(() => expect(names()).toEqual(goldFirst))
  }
}

export const ModalNavigationStaysStable: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/student/exhibitors" }
    }
  },
  beforeEach: () => mockNativeNavigation("?source=kept"),
  play: async ({ canvas, canvasElement }) => {
    await canvas.findByRole("link", { name: /Alpha Systems/ })
    const names = () =>
      Array.from(
        canvasElement.querySelectorAll("[data-exhibitor-list] h3"),
        heading => heading.textContent
      )
    const order = names()
    const body = within(canvasElement.ownerDocument.body)
    const findModal = (stage: string) =>
      body.findByRole(
        "dialog",
        {},
        {
          onTimeout: () =>
            new Error(`Missing modal at ${stage}; URL: ${navigationUrl.href}`)
        }
      )
    await userEvent.click(canvas.getByRole("link", { name: /Alpha Systems/ }))
    await findModal("first open")
    await expect(navigationUrl.searchParams.get("id")).toBe("2")
    await expect(names()).toEqual(order)
    await userEvent.click(body.getByRole("button", { name: "Close" }))
    await waitFor(() =>
      expect(body.queryByRole("dialog")).not.toBeInTheDocument()
    )
    let reopened = false
    const observer = new MutationObserver(() => {
      if (document.querySelector('[role="dialog"]')) reopened = true
    })
    observer.observe(document.body, { childList: true, subtree: true })
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await expect(reopened).toBe(false)
      await expect(names()).toEqual(order)
    } finally {
      observer.disconnect()
    }
    await userEvent.click(canvas.getByRole("link", { name: /Alpha Systems/ }))
    await findModal("reopen")
    window.history.back()
    await waitFor(() =>
      expect(body.queryByRole("dialog")).not.toBeInTheDocument()
    )
    window.history.forward()
    await findModal("forward")
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(body.queryByRole("dialog")).not.toBeInTheDocument()
    )
    await expect(names()).toEqual(order)
    await expect(navigationUrl.searchParams.get("source")).toBe("kept")
  }
}

export const MobileModalClosesOnce: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/student/exhibitors" }
    }
  },
  beforeEach: () => mockNativeNavigation("?id=1&source=kept"),
  play: async () => {
    const body = within(document.body)
    await body.findByRole("dialog")
    await userEvent.keyboard("{Escape}")
    await waitFor(() =>
      expect(body.queryByRole("dialog")).not.toBeInTheDocument()
    )
    await new Promise(resolve => setTimeout(resolve, 1000))
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument()
    await expect(navigationUrl.searchParams.has("id")).toBe(false)
    await expect(navigationUrl.searchParams.get("source")).toBe("kept")
  }
}
