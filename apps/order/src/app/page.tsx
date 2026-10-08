import { cookies } from "next/headers"
import { sendOrder } from "./actions"
import { OrderForm } from "@order/components/order/OrderForm"
import { env } from "@order/env"
import { fetchDates, fetchExhibitors } from "@order/lib/cms"
import { hasOrderAccess, isOrderOpen } from "@order/lib/orders"

export default async function OrderPage() {
  const access = hasOrderAccess(
    (await cookies()).get("_ea")?.value,
    env.EXPO_ACCESS_TOKEN
  )
  if (!access)
    return (
      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-2xl font-semibold">Order Form (Exhibitors)</h1>
        <p className="mt-4">
          Please open the access link provided to your company to place an
          order.
        </p>
      </main>
    )
  if (!isOrderOpen(await fetchDates()))
    return (
      <main className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-2xl font-semibold">Order Form (Exhibitors)</h1>
        <p className="mt-4">
          The order form is currently closed. You can place orders during the
          fair opening hours, but no later than 30 minutes before the end of
          each day.
        </p>
      </main>
    )
  return (
    <main className="px-5 pb-16">
      <OrderForm exhibitors={await fetchExhibitors()} submitOrder={sendOrder} />
    </main>
  )
}
