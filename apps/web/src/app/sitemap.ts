import { getDefaultFeatureFlags, type FeatureFlagKey } from "@/feature_flags"
import { MetadataRoute } from "next"

type SitemapEntry = {
  url: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
  flag?: FeatureFlagKey
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const flags = await getDefaultFeatureFlags()
  const lastModified = new Date()

  const entries: SitemapEntry[] = [
    {
      url: "https://armada.nu",
      changeFrequency: "monthly",
      priority: 1
    },
    {
      url: "https://armada.nu/about",
      changeFrequency: "monthly",
      priority: 0.6,
      flag: "ABOUT_PAGE"
    },
    {
      url: "https://armada.nu/about/team",
      changeFrequency: "monthly",
      priority: 0.45,
      flag: "ABOUT_TEAM_PAGE"
    },
    {
      url: "https://armada.nu/student/recruitment",
      changeFrequency: "weekly",
      priority: 0.75,
      flag: "STUDENT_RECRUITMENT_PAGE"
    },
    {
      url: "https://armada.nu/student/exhibitors",
      changeFrequency: "weekly",
      priority: 0.8,
      flag: "EXHIBITOR_PAGE"
    },
    {
      url: "https://armada.nu/student/events",
      changeFrequency: "weekly",
      priority: 0.7,
      flag: "EVENT_PAGE"
    },
    {
      url: "https://armada.nu/student/map",
      changeFrequency: "monthly",
      priority: 0.4,
      flag: "MAP_PAGE"
    },
    {
      url: "https://armada.nu/student/at-the-fair",
      changeFrequency: "monthly",
      priority: 0.45,
      flag: "AT_FAIR_PAGE"
    },
    {
      url: "https://armada.nu/exhibitor",
      changeFrequency: "weekly",
      priority: 0.9,
      flag: "EXHIBITOR_MAIN_PAGE"
    },
    {
      url: "https://armada.nu/exhibitor/signup",
      changeFrequency: "weekly",
      priority: 0.8,
      flag: "EXHIBITOR_SIGNUP_PAGE"
    },
    {
      url: "https://armada.nu/exhibitor/packages",
      changeFrequency: "monthly",
      priority: 0.65,
      flag: "EXHIBITOR_PACKAGES"
    },
    {
      url: "https://armada.nu/exhibitor/timeline",
      changeFrequency: "monthly",
      priority: 0.45,
      flag: "EXHIBITOR_TIMELINE_PAGE"
    },
    {
      url: "https://armada.nu/exhibitor/events",
      changeFrequency: "weekly",
      priority: 0.6,
      flag: "EXHIBITOR_EVENTS"
    },
    {
      url: "https://armada.nu/blog",
      changeFrequency: "weekly",
      priority: 0.4,
      flag: "ARMADA_BLOG_PAGE"
    }
  ]

  return entries
    .filter(entry => (entry.flag ? flags[entry.flag] : true))
    .map(({ url, changeFrequency, priority }) => ({
      url,
      lastModified,
      changeFrequency,
      priority
    }))
}
