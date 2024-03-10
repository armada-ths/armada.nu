import Providers from "@/app/providers"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { DateTime } from "luxon"
import type { Metadata } from "next"
import { Bebas_Neue, Inter, Lato } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const bebasNeue = Bebas_Neue({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-bebas-neue"
})
const lato = Lato({
	subsets: ["latin"],
	weight: ["100", "300", "400", "700", "900"],
	variable: "--font-lato"
})

export const metadata: Metadata = {
	title: `THS Armada ${DateTime.now().year} Career Fair`,
	description: "Scandinavia's largest student career fair",
	openGraph: {
		title: `THS Armada ${DateTime.now().year} Career Fair`,
		description: "Scandinavia's largest student career fair",
		url: "https://armada.nu",
		type: "website",
		images: [
			{
				url: "/screenshots/homepage_screenshot.jpeg",
				width: 2531,
				height: 1395,
				alt: "Armada homepage"
			}
		]
	}
}

export const revalidate = 60 * 60 * 12 // 12 hours

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang="en"
			style={{
				colorScheme: "dark"
			}}>
			<head />
			<body
				className={`${inter.variable} ${bebasNeue.variable} ${lato.variable}`}>
				<Analytics />
				<SpeedInsights />
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
