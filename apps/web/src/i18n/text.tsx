"use client"
import { useTranslations } from "next-intl"
import en from "./messages/en.json"
export type StaticTextKey = keyof typeof en.Static
export function LocalizedText({ id }: { id: StaticTextKey }) {
  const t = useTranslations("Static")
  return t(id)
}
