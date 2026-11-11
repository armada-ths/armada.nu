"use client"

import { Button } from "@armada/shared/ui/button"
import { Input } from "@armada/shared/ui/input"
import { ChevronRight, Minus, Plus } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

export interface OrderItemProps {
  name: string
  description?: string
  max?: number
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
    readMore?: string
    close?: string
  }
}

export default function OrderItem({
  name,
  description,
  max,
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
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const descriptionRow = useRef<HTMLDivElement>(null)
  const descriptionText = useRef<HTMLSpanElement>(null)
  const [descriptionClipped, setDescriptionClipped] = useState(false)

  useEffect(() => {
    const row = descriptionRow.current
    const text = descriptionText.current
    if (!row || !text) return
    const measure = () => {
      const range = document.createRange()
      range.selectNodeContents(text)
      setDescriptionClipped(
        range.getBoundingClientRect().width > row.clientWidth
      )
    }
    const observer = new ResizeObserver(measure)
    observer.observe(row)
    observer.observe(text)
    document.fonts.addEventListener("loadingdone", measure)
    return () => {
      observer.disconnect()
      document.fonts.removeEventListener("loadingdone", measure)
    }
  }, [description])

  function handleInput(value: string) {
    let n = Math.floor(Number(value)) || 0
    if (max) n = Math.min(n, max)
    onChange(Math.max(0, n))
  }

  return (
    <div className="flex h-25 min-w-0 shrink-0 flex-col gap-1" data-order-item>
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex items-start gap-1">
          <div className="line-clamp-2 min-w-0 flex-1 text-base leading-4 font-bold">
            {name}
          </div>
          {soldOutLabel && (
            <span className="shrink-0 text-xs font-semibold">
              {soldOutLabel}
            </span>
          )}
        </div>
        <div
          ref={descriptionRow}
          className="text-licorice flex min-w-0 items-center gap-1 text-xs leading-5">
          {description?.trim() && (
            <>
              <span ref={descriptionText} className="min-w-0 flex-1 truncate">
                {description}
              </span>
              {descriptionClipped && (
                <button
                  type="button"
                  aria-label={labels.readMore ?? "Read more"}
                  aria-haspopup="dialog"
                  className="shrink-0 rounded-sm p-0.5 opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                  onClick={() => {
                    setDetailsOpen(true)
                    dialog.current?.showModal()
                  }}>
                  <ChevronRight className="size-3" aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      <dialog
        ref={dialog}
        aria-labelledby={titleId}
        onClose={() => setDetailsOpen(false)}
        onKeyDown={event => {
          if (event.key === "Escape") {
            event.preventDefault()
            dialog.current?.close()
          }
        }}
        className="bg-snow text-licorice fixed inset-0 m-auto max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-md border p-6 backdrop:bg-black/50">
        {detailsOpen && (
          <>
            <h3 id={titleId} className="text-lg font-semibold">
              {name}
            </h3>
            {description && (
              <p className="mt-3 whitespace-pre-wrap">{description}</p>
            )}
            <Button
              type="button"
              autoFocus
              className="mt-5"
              onClick={() => dialog.current?.close()}>
              {labels.close ?? "Close"}
            </Button>
          </>
        )}
      </dialog>

      <div className="mt-auto flex items-center justify-center gap-2">
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
