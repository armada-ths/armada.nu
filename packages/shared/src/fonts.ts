import { Bebas_Neue, Inter, Lato } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
})
const bebas = Bebas_Neue({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  variable: "--font-bebas-neue"
})
const lato = Lato({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato"
})
export const fontVariables = `${inter.variable} ${bebas.variable} ${lato.variable}`
