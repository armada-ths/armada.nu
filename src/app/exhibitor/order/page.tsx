import { OrderForm } from "@/components/order/OrderForm"
import { Page } from "@/components/shared/Page"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
import { DateTime } from "luxon"
import { cookies } from "next/headers"

export default async function OrderPage() {
  const cookieStore = await cookies()
  const accessCookie = cookieStore.get("_ea")?.value
  const secret = process.env.EXPO_ACCESS_TOKEN
  const hasAccess = accessCookie === secret

  const data = await fetchExhibitors()
  const exhibitors = data
    ? data.map(e => e.name).sort((a, b) => a.localeCompare(b))
    : []

  const dates = await fetchDates()
  const now = DateTime.now().setZone("Europe/Stockholm")

  const START_TIME = { hour: 10, minute: 0 }
  const END_TIME_DAY_1 = { hour: 15, minute: 30 }
  const END_TIME_DAY_2 = { hour: 14, minute: 30 }

  const startDate = DateTime.fromISO(dates.fair.days[0], { zone: "Europe/Stockholm" })
  const endDate = DateTime.fromISO(dates.fair.days[1], { zone: "Europe/Stockholm" })

  const isOpen = !!dates && (() => {

    // Before day 1 → OPEN
    if (now < startDate.startOf("day")) {
      return true
    }

    // Day 1
    if (now.hasSame(startDate, "day")) {
      const close = startDate.set(END_TIME_DAY_1)
      return now <= close
    }

    // Day 2
    if (now.hasSame(endDate, "day")) {
      const open = endDate.set(START_TIME)
      const close = endDate.set(END_TIME_DAY_2)
      return now >= open && now <= close
    }

    // After day 2 → closed
    return false
  })()


  return (
    <Page.Background withIndents>
      {hasAccess && isOpen ? (
        <OrderForm exhibitors={exhibitors} />
      ) : !hasAccess ? (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-2xl font-semibold mb-4">Order Form (Exhibitors)</h1>
          <p>
            This form is intended for exhibitors at the fair.
            Please scan the QR code provided at our booth to access it.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-2xl font-semibold mb-4">Order Form (Exhibitors)</h1>
          <p>
            The order form is currently closed. You can place orders during
            the fair opening hours, but no later than 30 minutes before the end of each day.
          </p>
        </div>
      )}
    </Page.Background>
  )
}
