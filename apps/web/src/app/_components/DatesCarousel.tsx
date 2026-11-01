"use client"
import { LocalizedText } from "@/i18n/text"

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"

export default function DateCarousel() {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))

  return (
    <Carousel
      plugins={[autoplay.current]}
      className="w-full max-w-xs mask-[linear-gradient(to_right,transparent,black_1%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_1%,black_90%,transparent)]"
      opts={{
        loop: true,
        align: "start",
        duration: 50
      }}>
      <CarouselContent>
        <CarouselItem>
          <p className="text-melon mt-16 text-2xl mix-blend-normal">
            <LocalizedText id="november1810001600" />
          </p>
        </CarouselItem>
        <CarouselItem>
          <p className="text-melon mt-16 text-2xl mix-blend-normal">
            <LocalizedText id="november1910001500" />
          </p>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  )
}
