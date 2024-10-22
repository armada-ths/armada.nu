import { QuestionnaireForm } from "@/app/student/map/_components/QuestionnaireForm"
import { Page } from "@/components/shared/Page"

export default async function SurveyPage() {
  return (
    <Page.Background withIndents>
      <QuestionnaireForm />
    </Page.Background>
  )
}
