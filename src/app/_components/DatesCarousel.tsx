"use client"

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { useRef } from "react"

export default function DateCarousel() {
    const autoplay = useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    )

    return (
        <Carousel
            plugins={[autoplay.current]}
            className="w-full max-w-xs [mask-image:linear-gradient(to_right,transparent,black_1%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_1%,black_90%,transparent)]"
            opts={{
                loop: true,
                align: "start",
                duration: 50,
            }}
        >
            <CarouselContent>
                <CarouselItem>
                    <p className="mt-16 text-2xl text-melon-700 text-left mix-blend-normal">
                        November 18 10:00–16:00
                    </p>
                </CarouselItem>
                <CarouselItem>
                    <p className="mt-16 text-2xl text-melon-700 text-left mix-blend-normal">
                        November 19 10:00–15:00
                    </p>
                </CarouselItem>
            </CarouselContent>
        </Carousel>
    )
}