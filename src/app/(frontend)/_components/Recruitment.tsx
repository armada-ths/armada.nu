import { Banner1 } from "@/components/banner1"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { DateTime } from "luxon"

export async function RecruitmentBanner() {
  const recruitment = await fetchRecruitment({
    next: {
      revalidate: 3600 * 3 // 3 hours
    }
  })

  const recruitmentClosed =
    recruitment == null ||
    DateTime.fromISO(recruitment.end_date) < DateTime.now()

  return (
    <Banner1
      title={"Student Recruitment is open! "}
      description={"Join Armada "}
      linkText={"here"}
      linkUrl={"/student/recruitment"}
      defaultVisible={!recruitmentClosed}
    />
  )
}
