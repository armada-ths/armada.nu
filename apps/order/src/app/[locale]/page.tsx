import { cookies } from "next/headers"
import { sendOrder, refreshOrderData } from "../actions"
import { OrderForm } from "@order/components/order/OrderForm"
import { OrderUnavailable } from "@order/components/order/OrderUnavailable"
import { env } from "@order/env"
import { fetchDates, fetchOrderData } from "@order/lib/cms"
import { hasOrderAccess, isOrderOpen } from "@order/lib/orders"

export default async function OrderPage() {
  const access = hasOrderAccess(
    (await cookies()).get("_ea")?.value,
    env.EXPO_ACCESS_TOKEN
  )
  if (!access) return <OrderUnavailable code="access_required" />
  const dates = await fetchDates()
  if (!dates) return <OrderUnavailable code="availability_unavailable" />
  if (!isOrderOpen(dates)) return <OrderUnavailable code="orders_closed" />
  const data = await fetchOrderData()
  if (!data) return <OrderUnavailable code="availability_unavailable" />
  return (
    <main className="px-5 pb-16">
      <OrderForm
        data={data}
        refreshData={refreshOrderData}
        submitOrder={sendOrder}
      />
    </main>
  )
}
