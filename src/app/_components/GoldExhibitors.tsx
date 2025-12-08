"use client";

import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors";
import { Page } from "@/components/shared/Page";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface GoldExhibitorsProps {
  exhibitors: Exhibitor[];
}

export default function GoldExhibitors({ exhibitors }: GoldExhibitorsProps) {
  const plugin = useRef(
    Autoplay({
      delay: 6000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => setSelectedIndex(api.selectedScrollSnap());

    setScrollSnaps(api.scrollSnapList());
    api.on("select", handleSelect);

    // ✅ Return void-cleanup function
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);


  const visibleExhibitors = exhibitors.slice(0, 8);

  return (
    <section className="py-16 w-full">
      {/* gold glow */}
      <Page.Header className="relative text-center text-3xl text-pineapple mb-16 tracking-wide">
        Gold Exhibitors
      </Page.Header>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full select-none"
      >
        <CarouselContent>
          {visibleExhibitors.map((ex, index) => (
            <CarouselItem key={index} className="mb-1">
              <ExhibitorCard exhibitor={ex} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious size="icon" className="bg-snow hidden sm:flex" />
        <CarouselNext size="icon" className="bg-snow hidden sm:flex" />
      </Carousel>

      {/* dot navigation */}
      <div className="flex justify-center mt-8 gap-2">
        {scrollSnaps.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to slide ${idx + 1}`}
            aria-current={idx === selectedIndex}
            onClick={() => api?.scrollTo(idx)}
            className={`h-3 w-3 rounded-full transition ${idx === selectedIndex
              ? "bg-pineapple scale-110"
              : "bg-pineapple/30 hover:bg-pineapple/60"
              }`}
          />
        ))}
      </div>
    </section>
  );
}

function ExhibitorCard({ exhibitor }: { exhibitor: Exhibitor }) {
  const [expanded, setExpanded] = useState(false);
  const [maxLength, setMaxLength] = useState(600);

  useEffect(() => {
    const updateLength = () => {
      if (window.innerWidth < 640) setMaxLength(300);
      else if (window.innerWidth < 1024) setMaxLength(600);
      else setMaxLength(800);
    };
    updateLength();
    window.addEventListener("resize", updateLength);
    return () => window.removeEventListener("resize", updateLength);
  }, []);

  const about = exhibitor.about ?? "";
  const isLong = about.length > maxLength;
  const displayedText = expanded
    ? about
    : about.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <Card
      className="
        flex flex-col items-center text-center
        bg-pineapple rounded p-8 sm:p-10
        transition
        h-full mr-1
      "
    >
      {exhibitor.logoFreesize && (
        <div className="flex justify-center mb-6">
          <Image
            src={exhibitor.logoFreesize}
            alt={`${exhibitor.name} logo`}
            width={200}
            height={90}
            className="h-20 object-contain"
          />
        </div>
      )}

      <h3 className="text-2xl font-semibold text-black mb-3">
        {exhibitor.companyWebsite ? (
          <a
            href={exhibitor.companyWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline-offset-4 hover:underline transition"
          >
            {exhibitor.name}
          </a>
        ) : (
          exhibitor.name
        )}
      </h3>

      <p className="text-black leading-relaxed mb-3 text-sm sm:text-base max-w-prose">
        {displayedText}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-sm font-medium text-black hover:text-white underline underline-offset-2 transition"
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </Card>
  );
}
