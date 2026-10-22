import { z } from "zod"

// Reject failed or malformed responses so ISR can retain the last good page.
// Validate without transforming the payload or dropping additional CMS fields.
export async function readCmsResponse<T>(
  response: Response,
  resource: string,
  schema: z.ZodType
): Promise<T> {
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${resource}: ${response.status} ${response.statusText}`
    )
  }
  const data: unknown = await response.json()
  if (!schema.safeParse(data).success) {
    throw new Error(`Invalid CMS response for ${resource}`)
  }
  return data as T
}

export const blogPostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  text: z.string(),
  author: z.string(),
  createdAt: z.string(),
  imageUrl: z.string().optional(),
  imageUrls: z.array(z.string()).optional(),
  showCoverInPost: z.boolean().optional()
})

export const fairDateSchema = z.object({
  fair: z.object({ description: z.string(), days: z.array(z.string()) }),
  ir: z.object({ start: z.string(), end: z.string(), acceptance: z.string() }),
  fr: z.object({ start: z.string(), end: z.string() }),
  events: z.object({ start: z.string() })
})

// Eventro/CMS may omit optional event details. Validate the stable core.
export const eventSchema = z.object({
  id: z.number(),
  name: z.string(),
  location: z.string().nullish(),
  food: z.string().nullish(),
  openTo: z.string().nullish(),
  mapUrl: z.string().nullish(),
  eventStart: z.union([z.string(), z.number()]),
  eventEnd: z.union([z.string(), z.number()]),
  registrationRequired: z.boolean()
})

export const highlightCardSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  brand: z.string().nullish(),
  linkText: z.string().nullish(),
  linkUrl: z.string().nullish(),
  ctaEventName: z.string().nullish()
})

export const organizationSchema = z.object({
  name: z.string(),
  people: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      email: z.string().nullable(),
      picture: z.string().nullable(),
      linkedin_url: z.string().nullable(),
      role: z.string(),
      rank: z.string().nullish()
    })
  )
})
