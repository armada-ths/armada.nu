import ExhibitorDetails from "@/app/student/exhibitors/_components/ExhibitorDetails"
import { Page } from "@/components/shared/Page"
import {
	fetchAllYearExhibitors,
	fetchExhibitors
} from "@/components/shared/hooks/api/useExhibitors"
import { Badge } from "@/components/ui/badge"
import { DateTime } from "luxon"
import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"

interface RouteProps {
	params: { exhibitor: string }
	searchParams: unknown
}

// This tells Next about all the companies that it should
// prerender, these will be compiled at build time
export async function generateStaticParams() {
	const years = await fetchAllYearExhibitors({
		cache: "force-cache"
	})
	const exhibitors = years.flatMap(x => x.exhibitors)

	return exhibitors.map(exhibitor => ({
		exhibitor: exhibitor.id
	}))
}

function getYearOrDefault(searchParams: unknown) {
	return searchParams != null &&
		typeof searchParams == "object" &&
		"year" in searchParams &&
		typeof searchParams.year == "string" &&
		!isNaN(searchParams.year as unknown as number)
		? parseInt(searchParams.year)
		: DateTime.now().minus({ months: 6 }).year // Always default to current year, but 6 months back
}

export async function generateMetadata({
	params,
	searchParams
}: RouteProps): Promise<Metadata> {
	const year = getYearOrDefault(searchParams)
	const exhibitors = await fetchExhibitors({ year, cache: "force-cache" })
	const exhibitor = exhibitors.find(x => x.id.toString() === params.exhibitor)

	if (exhibitor == null) return notFound()

	return {
		title: `${exhibitor?.name} at Armada`,
		abstract: exhibitor?.about,
		openGraph: {
			images: [exhibitor.logo_squared ?? exhibitor.logo_freesize ?? ""]
		}
	}
}

export default async function ExhibitorPage({
	params,
	searchParams
}: RouteProps) {
	// Type narrow the searchParams to a number
	const year = getYearOrDefault(searchParams)

	const exhibitors = await fetchExhibitors({
		year,
		next: { revalidate: 3600 * 24 * 6 /* 6 days */ }
	})
	const exhibitor = exhibitors.find(x => x.id.toString() === params.exhibitor)

	if (exhibitor == null) {
		return notFound()
	}

	return (
		<Page.Background withIndents>
			<Page.Boundary>
				<ExhibitorDetails exhibitor={exhibitor} />
			</Page.Boundary>
		</Page.Background>
	)
}
