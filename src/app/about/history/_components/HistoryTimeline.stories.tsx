import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { HistoryTimeline } from "./HistoryTimeline"
import type { TimelineEntry } from "@/components/shared/hooks/api/useTimelineEntries"

const era1Entries: TimelineEntry[] = [
  {
    id: 1,
    title: "The First Fair",
    body: "Armada was founded in 1979 by a small group of KTH students who wanted to bridge the gap between academia and industry. The first fair attracted 12 companies and hundreds of curious students.",
    era: "founding",
    eraTitle: "The Founding Years (1979–1989)",
    sortOrder: 1
  },
  {
    id: 2,
    title: "Growing Pains",
    body: "By the mid-1980s Armada had outgrown its original venue. The organizing committee doubled in size and the fair moved to larger facilities on the KTH main campus.",
    era: "founding",
    eraTitle: "The Founding Years (1979–1989)",
    sortOrder: 2
  },
  {
    id: 3,
    title: "100 Companies",
    body: "A milestone: over 100 companies participated for the first time, cementing Armada's reputation as Scandinavia's premier student-run recruitment fair.",
    era: "founding",
    eraTitle: "The Founding Years (1979–1989)",
    sortOrder: 3
  }
]

const era2Entries: TimelineEntry[] = [
  {
    id: 4,
    title: "Digital Dawn",
    body: "The internet era arrived at Armada. The first online registration system was launched, replacing paper forms and dramatically reducing administrative overhead.",
    era: "digital",
    eraTitle: "The Digital Era (1990–2005)",
    sortOrder: 4
  },
  {
    id: 5,
    title: "International Reach",
    body: "Armada began attracting international companies for the first time. Multinational corporations from across Europe recognised KTH's talent pipeline and joined the fair.",
    era: "digital",
    eraTitle: "The Digital Era (1990–2005)",
    sortOrder: 5
  }
]

const allEras = [
  { eraTitle: "The Founding Years (1979–1989)", entries: era1Entries },
  { eraTitle: "The Digital Era (1990–2005)", entries: era2Entries }
]

const meta = {
  title: "Timeline/HistoryTimeline",
  component: HistoryTimeline,
  parameters: {
    layout: "fullscreen"
  },
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <div className="min-h-screen bg-white px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <Story />
        </div>
      </div>
    )
  ]
} satisfies Meta<typeof HistoryTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { eras: allEras }
}

export const SingleEra: Story = {
  args: {
    eras: [{ eraTitle: "The Founding Years (1979–1989)", entries: era1Entries }]
  }
}
