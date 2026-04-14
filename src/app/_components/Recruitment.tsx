import { RecruitmentRollingBanner } from "@/app/_components/RecruitmentRollingBanner"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { DateTime } from "luxon"

export async function RecruitmentBanner() {
  const recruitment = await fetchRecruitment({
    next: {
      revalidate: 3600 * 3 // 3 hours
    }
  })

  const now = DateTime.now()
  const recruitmentNotStarted =
    recruitment != null && DateTime.fromISO(recruitment.start_date) > now

  const recruitmentClosed =
    recruitment == null ||
    recruitmentNotStarted ||
    DateTime.fromISO(recruitment.end_date) < now

  return (
    <RecruitmentRollingBanner
      endDate={recruitment?.end_date ?? ""}
      defaultVisible={!recruitmentClosed}
    />
  )
}
