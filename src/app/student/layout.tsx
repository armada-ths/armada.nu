import { NavigationMenu } from "@/components/shared/NavigationMenu"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { DateTime } from "luxon"

export default async function ExhibitorLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const data = await fetchRecruitment({
    next: {
      revalidate: 10800 // 3 hours
    }
  })

  const isPastDate = (data?.end_date &&
    DateTime.fromISO(data.end_date, { zone: "Europe/Stockholm" }).plus({ days: 1 }) < DateTime.now()) ||
    (data?.start_date && DateTime.fromISO(data.start_date, { zone: "Europe/Stockholm" }) > DateTime.now())

  return isPastDate ? (
    <>
      <NavigationMenu />
      {children}
    </>
  ) : (
    <>
      <NavigationMenu />
      {children}
    </>
  )
}
