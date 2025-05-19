import { fetchRecruitment } from "@/components/shared/hooks/api/useRecruitment"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UserRoundIcon } from "lucide-react"
import { DateTime } from "luxon"
import Link from "next/link"

export async function RecruitmentBanner() {
  const recruitment = await fetchRecruitment({
    next: {
      revalidate: 3600 * 3 // 3 hours
    }
  })

  //changed so recruitment is set to null if end date already has happened
  if (
    recruitment == null ||
    DateTime.fromISO(recruitment.end_date) < DateTime.now()
  )
    return null

  return (
    <Link href="/student/recruitment">
      <Alert className="mt-0 cursor-pointer dark:hover:border-melon-700 dark:hover:border-opacity-50">
        <UserRoundIcon className="h-4 w-4" />
        <AlertTitle>Recruitment open!</AlertTitle>
        <AlertDescription>
          Apply to become a part of Armada{" "}
          {/* 2 months since pg recruitment usually starts in nov/dec */}
          {DateTime.now().plus({ months: 2 }).year}{" "}
        </AlertDescription>
      </Alert>
    </Link>
  )
}
