import { z } from "zod"

const optionalText = z.string().nullable().optional()
export const loungeCategorySchema = z.object({
  id: z.number().int().positive().safe(),
  name: z.string().trim().min(1),
  nameSv: optionalText,
  sortOrder: z.number().int().nonnegative().safe()
})
export const loungeItemSchema = z.object({
  id: z.number().int().positive().safe(),
  categoryId: z.number().int().positive().safe(),
  name: z.string().trim().min(1),
  nameSv: optionalText,
  description: optionalText,
  descriptionSv: optionalText,
  sortOrder: z.number().int().nonnegative().safe(),
  maxPerOrder: z.number().int().positive().safe().nullable().optional(),
  soldOut: z.boolean()
})
export const exhibitorSchema = z.object({
  id: z.number().int().positive().safe(),
  name: z.string().trim().min(1),
  tier: z.literal("Gold")
})
export type LoungeItem = z.infer<typeof loungeItemSchema>
export type LoungeCategory = z.infer<typeof loungeCategorySchema>
export type GoldExhibitor = z.infer<typeof exhibitorSchema>
export type OrderData = {
  categories: LoungeCategory[]
  items: LoungeItem[]
  exhibitors: GoldExhibitor[]
}
