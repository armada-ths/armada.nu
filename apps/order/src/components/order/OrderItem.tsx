import { Button } from "@armada/shared/ui/button"
import { Input } from "@armada/shared/ui/input"
import { Minus, Plus } from "lucide-react"
import Image from "next/image"

export interface OrderItemProps {
  name: string
  description?: string
  max?: number
  imageUrl?: string
  unavailable?: boolean
  soldOutLabel?: string
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  onChange: (qty: number) => void
  labels?: {
    decrease: string
    quantity: string
    increase: string
  }
}

export default function OrderItem({
  name,
  description,
  max,
  imageUrl,
  unavailable,
  soldOutLabel,
  quantity,
  onIncrease,
  onDecrease,
  onChange,
  labels = {
    decrease: "Decrease",
    quantity: "Quantity",
    increase: "Increase"
  }
}: OrderItemProps) {
  const canIncrease = !unavailable && (!max || quantity < max)
  const canDecrease = !unavailable && quantity > 0

  function handleInput(value: string) {
    let n = Math.floor(Number(value)) || 0
    if (max) n = Math.min(n, max)
    onChange(Math.max(0, n))
  }

  return (
    <div className="flex h-full flex-col gap-3">
      {imageUrl && (
        <div className="relative aspect-square w-full">
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(max-width: 639px) 90vw, (max-width: 767px) 45vw, 220px"
            className="rounded-md object-cover"
          />
        </div>
      )}
      <div>
        <div className="text-sm leading-tight font-medium">{name}</div>
        {description && (
          <div className="text-licorice text-xs">{description}</div>
        )}
      </div>
      {soldOutLabel && <p className="text-sm font-semibold">{soldOutLabel}</p>}

      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="noShadow"
          onClick={onDecrease}
          disabled={!canDecrease}
          className="h-9 w-9 shrink-0"
          aria-label={labels.decrease}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          inputMode="numeric"
          pattern="[0-9]*"
          className="min-w-0 flex-1 text-center"
          value={quantity}
          disabled={unavailable}
          onChange={e => handleInput(e.target.value)}
          aria-label={labels.quantity}
        />
        <Button
          type="button"
          size="icon"
          variant="noShadow"
          className="h-9 w-9 shrink-0"
          onClick={onIncrease}
          disabled={!canIncrease}
          aria-label={labels.increase}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
