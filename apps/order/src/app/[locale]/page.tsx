import { sendOrder, refreshOrderData } from "../actions"
import { OrderForm } from "@order/components/order/OrderForm"
import { OrderUnavailable } from "@order/components/order/OrderUnavailable"

export default async function OrderPage() {
  const result = await refreshOrderData()
  if (!result.success && result.errorCode === "access_required")
    return <OrderUnavailable code="access_required" />
  return (
    <main className="px-5 pb-16">
      <OrderForm
        data={result.success ? result.data : undefined}
        initialError={result.success ? undefined : result.errorCode}
        refreshData={refreshOrderData}
        submitOrder={sendOrder}
      />
    </main>
  )
}
