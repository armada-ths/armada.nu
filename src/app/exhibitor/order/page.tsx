import { OrderForm } from "@/components/order/OrderForm"
import { Page } from "@/components/shared/Page"
import { fetchExhibitors } from "@/components/shared/hooks/api/useExhibitors"

export default async function OrderPage() {
  const data = await fetchExhibitors()
  const exhibitors = data
    ? data.map(e => e.name).sort((a, b) => a.localeCompare(b))
    : []

  return (
    <Page.Background withIndents>
      <OrderForm exhibitors={exhibitors} />
    </Page.Background>
  )
}
