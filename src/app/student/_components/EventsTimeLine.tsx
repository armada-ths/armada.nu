import { P } from "@/app/_components/Paragraph"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import { EventItem } from "@/app/student/_components/EventItem"
import { DateTime } from "luxon"
import Link from "next/link"

function formatDate(date: string) {
	return DateTime.fromISO(date).toFormat(
		`d MMMM ${DateTime.fromISO(date).year !== DateTime.now().year ? " YYYY" : ""}`
	)
}

export async function EventsTimeline() {
	const dates = await fetchDates()

	//ASSUMPTION: the start date will be first for fair dates
	return (
		<Accordion
			type="single"
			collapsible={true}
			className="relative mt-10 border-s border-melon-700">
			<EventItem
				dateString={`Before ${formatDate(dates.ir.start)}`}
				title="Armada is setting up">
				<P className="mt-3 text-stone-400">
					Before the Initial Registration can open, we need to make
					preparations. We are right now choosing a new project group - 20
					something students who will work hard all year to make Armada happen.
				</P>
				<P className="mt-3 text-stone-400">
					We will open Initial Registration where you apply to be an exhibitor
					soon. You can express your interest here, and we will contact you as
					soon as registration opens!
				</P>
			</EventItem>

			<EventItem
				dateString={formatDate(dates.ir.start)}
				title="Initial Registration starts">
				<P className="mt-3 text-stone-400">
					Initial Registration is where you apply to be an exhibitor. When you
					register you commit to be a part of Armada and if given a spot you are
					expected to exhibit, so wait with registration until you are sure. If
					you have any questions, do not hesitate to contact{" "}
					<Link
						className="text-white underline hover:no-underline"
						href="mailto:sales@armada.nu">
						sales@armada.nu
					</Link>
					.
				</P>
				<P className="mt-3 text-stone-400">
					Sadly, we can&apos;t guarantee a spot for everyone that applies. We
					are right now investigating how many exhibitors we can fit and how big
					the interest is. We try our best to get a good mix of great exhibitors
					that make Armada the best place for students to find their dream
					employer!
				</P>
				<P className="mt-3 text-stone-400">
					During the Initial Registration you don&apos;t need to choose a
					package, and the packages are outlined{" "}
					<Link
						className="text-white underline hover:no-underline"
						href="/exhibitor/packages">
						here
					</Link>{" "}
					to give you an overview. Prices are set, and small changes can occur
					in the larger packages.
				</P>
				<div className="my-4">
					<Link href="https://register.armada.nu/register">
						<Button>Signup to Armada</Button>
					</Link>
				</div>
			</EventItem>
		</Accordion>
	)
}
