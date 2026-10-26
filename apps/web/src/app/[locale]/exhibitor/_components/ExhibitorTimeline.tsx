import { P } from "@/app/_components/Paragraph"
import {
  TimelineItem,
  TimelineList
} from "@/app/[locale]/exhibitor/_components/TimelineItem"
import { getSignupUrl } from "@/components/shared/feature"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { TrackedLink } from "@/components/shared/TrackedLink"
import { Button } from "@/components/ui/button"
import { type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"
import { DateTime } from "luxon"
import { Link } from "@armada/shared/i18n/navigation"

import { timelineText } from "@/i18n/dictionaries"

function formatTimelineDate(isoString: string, locale: Locale) {
  const date = DateTime.fromISO(isoString).setLocale(locale)
  if (locale === "sv") {
    return date.toFormat(
      date.year !== DateTime.now().year ? "d LLLL yyyy" : "d LLLL"
    )
  }

  return date.toFormat(
    date.year !== DateTime.now().year ? "d LLLL yyyy" : "d LLLL"
  )
}

export async function ExhibitorTimeline() {
  const locale = await getRequestLocale()
  const dict = timelineText[locale]
  const dates = await fetchDates()
  if (!dates) return null
  const signupUrl = await getSignupUrl()
  const packagesUrl = "/exhibitor/packages"

  return (
    <TimelineList>
      <TimelineItem
        dateStringISO={dates.ir.start}
        dateStringHuman={dict.before(
          DateTime.fromISO(dates.ir.start).setLocale(locale).toFormat("LLLL")
        )}
        title={dict.setupTitle}>
        {dict.setupBody.map(body => (
          <P className="mt-3" key={body}>
            {body}
          </P>
        ))}
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.ir.start}
        dateStringHuman={formatTimelineDate(dates.ir.start, locale)}
        title={dict.priorityStartTitle}>
        <P className="mt-3">
          {dict.priorityBody[0]}{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>
          .
        </P>
        <P className="mt-3">{dict.priorityBody[1]}</P>
        <P className="mt-3">
          {dict.priorityBody[2]}{" "}
          <Link className="underline hover:no-underline" href={packagesUrl}>
            {dict.linkHere}
          </Link>
          .
        </P>
        <div className="my-4">
          <TrackedLink
            href={signupUrl}
            tracking={{
              eventName: "exhibitor_signup_click",
              eventData: {
                location: "exhibitor_timeline_priority_registration"
              }
            }}>
            <Button className="bg-grapefruit text-snow cursor-pointer">
              {dict.signupButton}
            </Button>
          </TrackedLink>
        </div>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.ir.end}
        dateStringHuman={formatTimelineDate(dates.ir.end, locale)}
        title={dict.priorityEndTitle}
      />

      <TimelineItem
        dateStringISO={dates.ir.acceptance}
        dateStringHuman={formatTimelineDate(dates.ir.acceptance, locale)}
        title={dict.acceptanceTitle}>
        <P>
          {dict.acceptanceBody[0]} {formatTimelineDate(dates.ir.end, locale)}.
        </P>
        <P>
          {dict.acceptanceBody[1]}{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>
          .
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fr.start}
        dateStringHuman={formatTimelineDate(dates.fr.start, locale)}
        title={dict.standardStartTitle}>
        <P className="mt-3">{dict.standardBody[0]}</P>
        <div className="my-4">
          <TrackedLink
            href={signupUrl}
            tracking={{
              eventName: "exhibitor_signup_click",
              eventData: {
                location: "exhibitor_timeline_standard_registration"
              }
            }}>
            <Button className="bg-grapefruit text-snow cursor-pointer">
              {dict.signupButton}
            </Button>
          </TrackedLink>
        </div>
        <P className="mt-3">
          {dict.standardBody[1]}{" "}
          <Link
            className="underline hover:no-underline"
            href="mailto:sales@armada.nu">
            sales@armada.nu
          </Link>
          .
        </P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fr.end}
        dateStringHuman={formatTimelineDate(dates.fr.end, locale)}
        title={dict.standardEndTitle}
      />

      <TimelineItem
        dateStringISO={dates.fr.end}
        dateStringHuman={formatTimelineDate(dates.fr.end, locale)}
        title={dict.preparationsTitle}>
        <P className="mt-3">{dict.preparationsIntro}</P>
        <ul className="mx-4 list-disc">
          {dict.preparationsItems.map(item => (
            <li className="mt-3" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <P className="mt-3">{dict.preparationsBody}</P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.events.start}
        dateStringHuman={formatTimelineDate(dates.events.start, locale)}
        title={dict.eventsTitle}>
        <P className="mt-3">{dict.eventsBody[0]}</P>
        <P>{dict.eventsBody[1]}</P>
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[0]}
        dateStringHuman={formatTimelineDate(dates.fair.days[0], locale)}
        title={dict.fairStartTitle}>
        {dict.fairStartBody.map(body => (
          <P className="mt-3" key={body}>
            {body}
          </P>
        ))}
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[0]}
        dateStringHuman={formatTimelineDate(dates.fair.days[0], locale)}
        title={dict.banquetTitle}>
        {dict.banquetBody.map(body => (
          <P className="mt-3" key={body}>
            {body}
          </P>
        ))}
      </TimelineItem>

      <TimelineItem
        dateStringISO={dates.fair.days[1]}
        dateStringHuman={formatTimelineDate(dates.fair.days[1], locale)}
        title={dict.fairEndTitle}
      />
    </TimelineList>
  )
}
