"use client";

import Image from "next/image";

interface RollingBannerProps {
  logos: string[];
}

function RollingRow({
  logos,
  duration = 30,
  reverse = false,
}: {
  logos: string[];
  duration?: number;
  reverse?: boolean;
}) {
  const duplicated = [...logos, ...logos]; // or triple if short
  const animationClass = reverse ? "animate-scroll-reverse" : "animate-scroll";

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        className={`flex min-w-max ${animationClass} will-change-transform`}
        style={{
          animationDuration: `${duration}s`,
          transform: "translateZ(0)",
        }}
      >
        {duplicated.map((logo, index) => (
          <div key={index} className="mx-12 shrink-0">
            <Image
              src={logo}
              alt={`Logo ${index + 1}`}
              width={0}
              height={0}
              sizes="100vw"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RollingBanner({ logos }: RollingBannerProps) {
  const perRow = Math.ceil(logos.length / 3);
  const row1 = logos.slice(0, perRow);
  const row2 = logos.slice(perRow, perRow * 2);
  const row3 = logos.slice(perRow * 2);

  return (
    <section
      className="
        relative left-1/2 right-1/2 -mx-[50vw]
        w-screen max-w-none
        overflow-y-visible py-12
      "
    >
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-8">
        Silver Exhibitors
      </h2>

      <div className="space-y-10">
        <RollingRow logos={row1} duration={25} />
        <RollingRow logos={row2} duration={35} reverse />
        <RollingRow logos={row3} duration={28} />
      </div>
    </section>
  );
}
