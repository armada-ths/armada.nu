import { P } from "@/app/_components/Paragraph"
import { QuestionGenerator } from "@/app/student/at-the-fair/_components/QuestionGenerator"
import { Page } from "@/components/shared/Page"


export default function AtFairPage() {

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
        <QuestionGenerator />
        <br />
        <div className="self-center"></div>
      </Page.Boundary>
    </Page.Background>
  )
}
