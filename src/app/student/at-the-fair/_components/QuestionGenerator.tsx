"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export function QuestionGenerator() {
  const [randomNumber, setRandomNumber] = useState(-1)
  const questions = [
    "How does your recruitment process look like?",
    "If you could give your younger self advice about working in your field, what would it be?",
    "What advice do you have to someone about to graduate?",
    "What is the best memory you have from work?",
    "What is the biggest professional mistake you have made?",
    "What was the biggest change between studying and working?",
    "What made you become your role?",
    "How does a typical day look for your role?",
    "What do you think are key character traits to have while working in your role?",
    "What tends to stand out in a cover letter?",
    "What’s the best way to prepare oneself for interviews?",
    "What’s your best memory from university?",
    "What do you wish someone told you when you were newly graduated?",
    "Why did you start working at your company?",
    "How do you handle work-life balance?",
    "What do you think about the work environment?",
    "How long have you worked there?",
    "What does your company do?",
    "What’s your role at your company?",
    "Why did you apply for the job in the first place?",
    "What are your suggestions for standing out during an interview?",
    "How does your company work with the sustainable development goals?"
  ]

  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * 22)
    setRandomNumber(number)
  }

  return (
    <Card className="border-licorice bg-melon-700 mt-2 min-h-48 min-w-48 place-items-center rounded-2xl border-2 p-5 text-center">
      <p className="absolute opacity-80">
        <i>Question for exhibitors:</i>
      </p>
      <div className="flex">
        <div className="grow place-content-center justify-center">
          <p className="text-snow pt-7 text-center text-3xl opacity-90">
            <i>
              {randomNumber >= 0
                ? questions[randomNumber]
                : "Press the button below to generate a question."}
            </i>
          </p>
        </div>
      </div>
      <Button
        variant={"noShadow"}
        onClick={() => generateRandomNumber()}
        className="text-snow bg-grapefruit spinning-border hover:bg-grapefruit/70 rounded-lg p-3 hover:scale-105 active:scale-95">
        Generate Question
      </Button>
    </Card>
  )
}
