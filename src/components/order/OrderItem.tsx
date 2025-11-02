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
        <div className="text-sm font-medium leading-tight">{name}</div>
        {description && (
          <div className="text-xs text-stone-400">{description}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onDecrease}
          disabled={!canDecrease}
          aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          inputMode="numeric"
          pattern="[0-9]*"
          className="w-20 text-center"
          value={quantity}
          onChange={e => handleInput(e.target.value)}
          aria-label="Quantity"
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onIncrease}
          disabled={!canIncrease}
          aria-label="Increase">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
