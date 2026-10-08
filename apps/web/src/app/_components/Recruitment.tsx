import { RecruitmentRollingBanner } from "@/app/_components/RecruitmentRollingBanner"
import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { DateTime } from "luxon"

const RECRUITMENT_BANNER_VISIBILITY_WINDOW_DAYS = 7

export async function RecruitmentBanner() {
  const recruitment = await fetchRecruitment({
    next: {
      revalidate: 86400
    }
  })

  const now = DateTime.now()
  const recruitmentStart =
    recruitment != null ? DateTime.fromISO(recruitment.start_date) : null
  const recruitmentEnd =
    recruitment != null ? DateTime.fromISO(recruitment.end_date) : null
  const recruitmentNotStarted =
    recruitmentStart != null && recruitmentStart > now

  const recruitmentClosed =
    recruitment == null ||
    recruitmentNotStarted ||
    (recruitmentEnd != null && recruitmentEnd < now)
  const recruitmentClosingSoon =
    recruitmentEnd != null &&
    recruitmentEnd > now &&
    recruitmentEnd.diff(now).as("days") <
      RECRUITMENT_BANNER_VISIBILITY_WINDOW_DAYS

  return (
    <RecruitmentRollingBanner
      endDate={recruitment?.end_date ?? ""}
      defaultVisible={!recruitmentClosed && recruitmentClosingSoon}
    />
  )
}
