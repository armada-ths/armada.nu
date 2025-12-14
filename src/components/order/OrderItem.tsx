import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus } from "lucide-react"

export interface OrderItemProps {
  name: string
  description?: string
  max?: number
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  onChange: (qty: number) => void
}

export default function OrderItem({
  name,
  description,
  max,
  quantity,
  onIncrease,
  onDecrease,
  onChange
}: OrderItemProps) {
  const canIncrease = !max || quantity < max
  const canDecrease = quantity > 0

  function handleInput(value: string) {
    let n = Math.floor(Number(value)) || 0
    if (max) n = Math.min(n, max)
    onChange(Math.max(0, n))
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div>
        <div className="text-sm leading-tight font-medium">{name}</div>
        {description && (
          <div className="text-xs text-stone-400">{description}</div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="noShadow"
          onClick={onDecrease}
          disabled={!canDecrease}
          className="w-16"
          aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-full text-center"
          value={quantity}
          onChange={e => handleInput(e.target.value)}
          aria-label="Quantity"
        />
        <Button
          type="button"
          size="icon"
          variant="noShadow"
          className="w-16"
          onClick={onIncrease}
          disabled={!canIncrease}
          aria-label="Increase">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
