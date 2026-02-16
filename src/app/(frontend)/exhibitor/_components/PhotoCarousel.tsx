import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import Image from "next/image"

export function PhotoCarousel() {
  const promotionalPhotos = [
    {
      src: "/fair_pictures/49121473038_5876d71e29_b.jpg",
      alt: "Student talking to company representative"
    },
    {
      src: "/fair_pictures/49121988801_f0b111943f_k.jpg",
      alt: "Crowded room of students attending the fair"
    },
    {
      src: "/fair_pictures/49122130686_297ea7d00a_o.jpg",
      alt: "Student interacting with robot"
    }
  ]

  return (
    <Carousel className="w-4/5">
      <CarouselContent>
        {promotionalPhotos.map(({ src, alt }, index) => (
          <CarouselItem key={index}>
            <div className="w-full">
              <Card className="w-full">
                <CardContent className="flex w-full items-center justify-center overflow-hidden p-6">
                  <Image
                    src={src}
                    width={430}
                    height={280}
                    alt={alt}
                    className="h-[280px] w-[430px] object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
