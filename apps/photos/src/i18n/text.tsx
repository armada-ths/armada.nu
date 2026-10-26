"use client"
import { useTranslations } from "next-intl"
import type en from "./messages/en.json"
export function PhotoText({ id }: { id: keyof typeof en.PhotosStatic }) {
  const t = useTranslations("PhotosStatic")
  return <>{t(id)}</>
}
