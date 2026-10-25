import Image from "next/image"

import { Page } from "@/components/shared/Page"

const sponsors = [
  {
    name: "Barilla",
    href: "https://www.barilla.com/sv-se",
    logo: "/sponsors/barilla.png",
    width: 3840,
    height: 2160,
    imageClassName: "h-auto w-64 max-w-full object-contain",
    sizes: "256px"
  },
  {
    name: "HYD Re:hydrate",
    href: "https://hyddrinks.se/",
    logo: "/sponsors/hyd-rehydrate.png",
    width: 536,
    height: 429,
    imageClassName: "h-auto w-40 max-w-full object-contain",
    sizes: "160px"
  },
  {
    name: "Estrella",
    href: "https://www.estrella.se/",
    logo: "/sponsors/estrella.png",
    width: 2954,
    height: 1445,
    imageClassName: "h-auto w-56 max-w-full object-contain",
    sizes: "224px"
  }
]

export default function Sponsors() {
  return (
    <section
      aria-labelledby="sponsors-heading"
      className="bg-snow text-licorice mt-8">
      <Page.Boundary className="mt-0 px-6 py-14 sm:py-16">
        <h2
          id="sponsors-heading"
          className="font-bebas-neue text-center text-4xl">
          Our sponsors
        </h2>
        <ul className="mt-8 grid grid-cols-1 items-center gap-6 sm:grid-cols-3 sm:gap-8">
          {sponsors.map(sponsor => (
            <li key={sponsor.name} className="flex justify-center">
              <a
                href={sponsor.href}
                className="focus-visible:outline-licorice flex h-40 w-full max-w-72 items-center justify-center rounded-md px-4 transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={sponsor.width}
                  height={sponsor.height}
                  sizes={sponsor.sizes}
                  className={sponsor.imageClassName}
                />
              </a>
            </li>
          ))}
        </ul>
      </Page.Boundary>
    </section>
  )
}
