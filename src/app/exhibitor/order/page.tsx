import { OrderForm } from "@/components/order/OrderForm"
import { Page } from "@/components/shared/Page"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"
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

  return (
    <Page.Background withIndents>
      {hasAccess ? (
        <OrderForm exhibitors={exhibitors} />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-2xl font-semibold mb-4">Order Form (Exhibitors)</h1>
          <p>
            This form is intended for exhibitors at the fair.
            Please scan the QR code provided at our booth to access it.
          </p>
        </div>
      )}
    </Page.Background>
  )
}
