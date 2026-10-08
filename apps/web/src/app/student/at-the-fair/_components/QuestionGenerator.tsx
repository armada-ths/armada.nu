"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export function QuestionGenerator({
  eyebrow,
  emptyText,
  buttonText,
  questions
}: {
  eyebrow: string
  emptyText: string
  buttonText: string
  questions: string[]
}) {
  const [randomNumber, setRandomNumber] = useState(-1)

  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * questions.length)
    setRandomNumber(number)
  }

  return (
    <Card className="border-licorice bg-melon mt-2 min-h-48 min-w-48 place-items-center rounded-2xl border-2 p-5 text-center">
      <p className="absolute opacity-80">
        <i>{eyebrow}</i>
      </p>
      <div className="flex">
        <div className="grow place-content-center justify-center">
          <p className="text-snow pt-7 text-center text-3xl opacity-90">
            <i>{randomNumber >= 0 ? questions[randomNumber] : emptyText}</i>
          </p>
        </div>
      </div>
      <Button
        variant={"noShadow"}
        onClick={() => generateRandomNumber()}
        className="text-snow bg-grapefruit spinning-border hover:bg-grapefruit/70 rounded-lg p-3 hover:scale-105 active:scale-95">
        {buttonText}
      </Button>
    </Card>
  )
}
