import { useEffect, useRef, useState } from "react"

export function useDebounce<T>(
  value: T,
  callback: (value: T) => void,
  options?: {
    timeout?: number
  }
) {
  const initialized = useRef(false)
  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }

    if (timeout.current !== null) {
      clearTimeout(timeout.current as NodeJS.Timeout)
    }
    timeout.current = setTimeout(() => callback(value), options?.timeout ?? 150)
    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current)
      }
    }
  }, [value, options?.timeout])
}

export function useDebounceValue<T>(
  value: T,
  options?: {
    timeout?: number
  }
) {
  const initialized = useRef(false)
  const timeout = useRef<NodeJS.Timeout | null>(null)
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      return
    }

    if (timeout.current !== null) {
      clearTimeout(timeout.current)
    }

    timeout.current = setTimeout(
      () => setDebouncedValue(value),
      options?.timeout ?? 100
    )

    return () => {
      if (timeout.current !== null) {
        clearTimeout(timeout.current)
      }
    }
  }, [value, options?.timeout])

  return debouncedValue
}
