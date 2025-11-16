"use client"
import { P } from "@/app/_components/Paragraph"
import { Page } from "@/components/shared/Page"
import { useState } from "react"

export default function AtFairPage() {
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
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>At the Fair</Page.Header>
        <div>
          <P>
            Walking up to a representative of a company you really want to work
            for can be intimidating! But don't fret, below we’ve collected some
            tips on how to get the most out of your conversation.
          </P>

          <ul className="mt-2 text-stone-400">
            <li>
              <i>· Formulate your sentences and speak clearly.</i>
            </li>
            <li>
              <i>· Treat it like a friendly chat.</i>
            </li>
            <li>
              <i>· Show interest and ask questions.</i>
            </li>
          </ul>

          <P>
            Remember that you are not chatting with an AI who just knows facts
            about the company, but with another person. Think of it as a date
            with a company!
          </P>
        </div>
        <br />
        <Page.Header tier="secondary">Example questions</Page.Header>
        <P>
          Below are some examples of questions you can ask the companies during
          Armada to get the conversation started.
        </P>
        {/*INSERT QUESTION GENERATOR HERE*/}
        <div className="mt-2 min-h-48 min-w-48 place-items-center rounded-2xl bg-green-950 p-5">
          <p className="absolute text-green-300 opacity-80">
            <i>Question</i>
          </p>
          <div className="flex">
            <div className="grow place-content-center justify-center">
              <p className="py-7 text-center text-3xl text-green-50 opacity-90">
                <i>
                  {randomNumber >= 0
                    ? questions[randomNumber]
                    : "Press the button below to generate a question."}
                </i>
              </p>
            </div>
          </div>
          <button
            onClick={() => generateRandomNumber()}
            className="rounded-lg bg-green-700 p-3">
            Generate Question
          </button>
        </div>
        <br />
        <div className="self-center"></div>
      </Page.Boundary>
    </Page.Background>
  )
}
