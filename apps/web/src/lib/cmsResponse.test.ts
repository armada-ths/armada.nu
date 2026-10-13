import { afterEach, describe, expect, it, vi } from "vitest"
import {
  fetchBlogPosts,
  fetchBlogPostById
} from "@/components/shared/hooks/api/useBlogPosts"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { fetchEvents } from "@/components/shared/hooks/api/useEvents"
import { fetchHighlightCards } from "@/components/shared/hooks/api/useHighlightCards"
import { fetchOrganization } from "@/components/shared/hooks/api/useOrganization"

vi.mock("@/env", () => ({
  env: { NEXT_PUBLIC_API_URL: "https://cms.example.test" }
}))

const post = {
  id: 1,
  userId: 2,
  title: "Cached post",
  text: "Content",
  author: "Armada",
  createdAt: "2026-10-13"
}
const dates = {
  fair: { description: "Fair", days: ["2026-11-17"] },
  ir: { start: "2026-01-01", end: "2026-02-01", acceptance: "2026-03-01" },
  fr: { start: "2026-04-01", end: "2026-05-01" },
  events: { start: "2026-09-01" }
}
const resources = [
  {
    name: "blog posts",
    fetch: fetchBlogPosts,
    data: [post],
    path: "/blogposts",
    tag: "blog-posts",
    list: true
  },
  {
    name: "blog post",
    fetch: () => fetchBlogPostById(1),
    data: post,
    path: "/blogposts/1",
    tag: "blog-posts",
    list: false
  },
  {
    name: "dates",
    fetch: fetchDates,
    data: dates,
    path: "/dates",
    tag: "dates",
    list: false
  },
  {
    name: "events",
    fetch: fetchEvents,
    data: [
      {
        id: 1,
        name: "Event",
        location: "KTH",
        eventStart: "2026-11-17",
        eventEnd: "2026-11-18",
        registrationRequired: false
      }
    ],
    path: "/events?public=true",
    tag: "events",
    list: true
  },
  {
    name: "highlight cards",
    fetch: fetchHighlightCards,
    data: [
      {
        id: 1,
        title: "Fair",
        subtitle: "Welcome",
        description: "Join us",
        brand: null,
        linkText: null,
        linkUrl: null,
        ctaEventName: null
      }
    ],
    path: "/highlightcards",
    tag: "highlight-cards",
    list: true
  },
  {
    name: "organization",
    fetch: fetchOrganization,
    data: [
      {
        name: "Team",
        people: [
          {
            id: 1,
            name: "Member",
            rank: null,
            email: null,
            picture: null,
            linkedin_url: null,
            role: "Developer"
          }
        ]
      }
    ],
    path: "/organization",
    tag: "organization",
    list: true
  }
]

afterEach(() => vi.unstubAllGlobals())

describe.each(resources)("CMS $name", resource => {
  it("returns valid content and preserves cache settings", async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json(resource.data))
    vi.stubGlobal("fetch", fetch)
    expect(await resource.fetch()).toEqual(resource.data)
    expect(fetch).toHaveBeenCalledWith(
      `https://cms.example.test/api/v1${resource.path}`,
      {
        next: { revalidate: 86400, tags: [resource.tag] }
      }
    )
  })

  it.each([404, 429, 500, 503])(
    "rejects HTTP %s even with valid JSON",
    async status => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(Response.json(resource.data, { status }))
      )
      await expect(resource.fetch()).rejects.toThrow(
        `Failed to fetch ${resource.name}: ${status}`
      )
    }
  )

  it("propagates network errors", async () => {
    const error = new TypeError("CMS offline")
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error))
    await expect(resource.fetch()).rejects.toBe(error)
  })

  it("rejects invalid JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not JSON")))
    await expect(resource.fetch()).rejects.toThrow()
  })

  it.each([null, {}, { error: "offline" }, "invalid", [null], [{}]])(
    "rejects invalid response data %j",
    async data => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(data)))
      await expect(resource.fetch()).rejects.toThrow("Invalid CMS response")
    }
  )

  if (resource.list) {
    it("accepts a legitimately empty collection", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json([])))
      expect(await resource.fetch()).toEqual([])
    })
  }
})

it("preserves explicit event request options", async () => {
  const fetch = vi.fn().mockResolvedValue(Response.json([]))
  vi.stubGlobal("fetch", fetch)
  const signal = new AbortController().signal
  await fetchEvents({
    signal,
    cache: "no-store",
    next: { revalidate: 0, tags: ["custom"] }
  })
  expect(fetch).toHaveBeenCalledWith(expect.any(String), {
    signal,
    cache: "no-store",
    next: { revalidate: 0, tags: ["custom"] }
  })
})

it("rejects malformed nested date data", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValue(
        Response.json({ ...dates, fair: { description: "Fair", days: null } })
      )
  )
  await expect(fetchDates()).rejects.toThrow("Invalid CMS response")
})

it("preserves additional CMS fields", async () => {
  const data = [{ ...post, published: true }]
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(data)))
  expect(await fetchBlogPosts()).toEqual(data)
})
