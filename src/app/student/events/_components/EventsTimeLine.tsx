import { EventItem } from "@/app/student/events/_components/EventItem"
import { Event } from "@/components/shared/hooks/api/useEvents"
import { Suspense } from "react"

import { formatTimestampAsDate } from "@/lib/utils"
import Timeline from "@mui/lab/Timeline"
import TimelineConnector from "@mui/lab/TimelineConnector"
import TimelineContent from "@mui/lab/TimelineContent"
import TimelineDot from "@mui/lab/TimelineDot"
import TimelineItem from "@mui/lab/TimelineItem"
import TimelineOppositeContent, {
  timelineOppositeContentClasses
} from "@mui/lab/TimelineOppositeContent"
import TimelineSeparator from "@mui/lab/TimelineSeparator"

export function EventsTimeline({ events }: { events: Event[] }) {
  return (
    <Timeline
      position="right"
      className="mt-10 w-full px-2 sm:px-0"
      sx={{
        [`& .${timelineOppositeContentClasses.root}`]: {
          flex: { xs: 0, sm: 0.2 }
        },
        "& .MuiTimelineItem-root:before": {
          padding: 0,
          flex: { xs: 0, sm: "auto" }
        }
      }}>
      {events.map((event, idx) => (
        <TimelineItem key={event.id}>
          <TimelineOppositeContent
            className="hidden text-stone-300 sm:block"
            sx={{
              display: { xs: "none", sm: "block" }
            }}>
            {formatTimestampAsDate(event.eventStart)}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot sx={{ bgcolor: "#00d790" }} />
            {idx < events.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            {/* EventItem uses useSearchParams, so needs to have a Suspense boundary */}
            <Suspense>
              <EventItem event={event} />
            </Suspense>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
