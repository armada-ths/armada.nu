"use client"

import { Page } from "@/components/shared/Page";
import Image from "next/image";
import { useState } from "react";
import afryImage from "./img/afry.png";
import fraImage from "./img/fra.png";

// ✅ Step 1: Define your data
const companies = [
  {
    name: "Afry",
    image: afryImage,
    description: "Afry is an international engineering, design and advisory company.",
    locationImg: afryImage
  },
  {
    name: "FRA",
    image: fraImage,
    description: "FRA does top secret stuff",
    locationImg: fraImage
  },
];

export default function AtFairPage() {
  const [selected, setSelected] = useState<null | typeof companies[0]>(null);

  // Function to handle the "lean" effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to card center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max tilt value
    const maxTilt = 15;

    // Calculate rotation:
    // rotateX is based on Y-movement. (y - centerY) is negative at the top.
    // rotateY is based on X-movement. (x - centerX) is negative on the left.
    const rotateX = ((y - centerY) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    // Calculate shadow offset for 3D depth
    const shadowX = -rotateY * 0.8; // Opposite of rotateY for parallax effect
    const shadowY = rotateX * 0.8;  // Matches rotateX (to look like it's lifting)

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.boxShadow = `${shadowX}px ${shadowY}px 25px rgba(0, 255, 0, 0.4)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const card = e.currentTarget;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    // Reset to a subtle default shadow
    card.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.4)";
  };

  return (
    <Page.Background withIndents>
      <Page.Boundary>
        <Page.Header>Companies at the Fair</Page.Header>

        {/* ✅ Step 2: Render list of companies */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {companies.map((company) => (
            <div
              key={company.name}
              className="cursor-pointer rounded-xl bg-black p-2 shadow-md transition-all duration-300 ease-out inline-block"
              onClick={() => setSelected(company)}
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div className="w-[240px] h-[180px] overflow-hidden rounded-lg bg-zinc-800 flex items-center justify-center">
                <Image
                  src={company.image}
                  alt={company.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-center text-green-100">{company.name}</p>
            </div>
          ))}
        </div>

        {/* ✅ Step 3: Popup (modal) */}
        {selected && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-black/90 p-6 rounded-2xl shadow-lg max-w-md w-full text-center border-2"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">{selected.name}</h2>
              <p className="mb-4 text-white-700">{selected.description}</p>
              <Image src={selected.locationImg} alt="Failed to load image" className="mb-2 mx-auto rounded-lg pointer-events-none"/>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Page.Boundary>
    </Page.Background>
  );
}