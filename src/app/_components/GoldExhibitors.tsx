"use client";

import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GoldExhibitorsProps {
  exhibitors: Exhibitor[];
}

export default function GoldExhibitors({ exhibitors }: GoldExhibitorsProps) {
  exhibitors = exhibitors.slice(0, 4);

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen py-20 bg-gradient-to-b from-black via-[#00210e] to-black overflow-hidden">
      {/* Gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.2)_0%,transparent_70%)]" />

      <h2 className="relative text-center text-3xl font-semibold text-amber-400 mb-16 tracking-wide">
        Gold Exhibitors
      </h2>

      <div className="relative z-10 mx-auto flex flex-col gap-16 px-6 md:px-20 max-w-6xl">
        {exhibitors.map((ex, index) => (
          <ExhibitorCard key={index} exhibitor={ex} />
        ))}
      </div>
    </section>
  );
}

function ExhibitorCard({ exhibitor }: { exhibitor: Exhibitor }) {
  const [expanded, setExpanded] = useState(false);
  const [maxLength, setMaxLength] = useState(600); // default fallback

  useEffect(() => {
    const updateLength = () => {
      if (window.innerWidth < 640) setMaxLength(300); // mobile (sm)
      else if (window.innerWidth < 1024) setMaxLength(600); // tablet (md)
      else setMaxLength(900); // desktop (lg+)
    };

    updateLength();
    window.addEventListener("resize", updateLength);
    return () => window.removeEventListener("resize", updateLength);
  }, []);

  const isLong = exhibitor.about && exhibitor.about.length > maxLength;
  const displayedText = expanded
    ? exhibitor.about
    : exhibitor.about?.slice(0, maxLength) + (isLong ? "..." : "");

  return (
    <div
      className="
        flex flex-col items-center md:flex-row md:items-center md:gap-12
        bg-amber-400 rounded-xl
        px-4 py-6 sm:px-6 sm:py-8 md:px-8
        mx-auto w-[90%] sm:w-[80%] md:w-full
        shadow-[0_0_25px_rgba(255,215,0,0.2)]
        hover:shadow-[0_0_35px_rgba(255,215,0,0.3)]
        transition
      "
    >
      {/* Logo */}
      <div className="flex justify-center flex-shrink-0 mb-6 md:mb-0">
        <Image
          src={exhibitor.logoFreesize ?? ""}
          alt={`${exhibitor.name} logo`}
          width={180}
          height={80}
          className="h-full w-full object-contain drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]"
        />
      </div>

      {/* Text */}
      <div className="text-center md:text-left">
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

        <p className="text-black max-w-prose leading-relaxed mb-3">
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
      </div>
    </div>
  );
}
