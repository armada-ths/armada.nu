"use client";

import ExhibitorDetails from "@/app/student/exhibitors/_components/ExhibitorDetails";
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";

const fadeOutDelay = 500;

interface FairMapProps {
  exhibitors: Exhibitor[];
  MapComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  currentFloorIndex: number;
  selectedExhibitor?: Exhibitor | null;
  onRequestFloorChange?: (floorIndex: number) => void;
}

const tierColors: Record<string, { fill: string; stroke: string }> = {
  gold: { fill: "#facc15", stroke: "#eab308" },
  silver: { fill: "#a8a29e", stroke: "#a8a29e" },
  bronze: { fill: "#00d790", stroke: "#00d790" },
  default: { fill: "#f5f5f5", stroke: "#737373" },
};

function parseRotation(transform?: string | null) {
  if (!transform?.startsWith("rotate(")) return null;
  const match = transform.match(/rotate\(([-0-9.]+)[ ,]([-0-9.]+)?[ ,]([-0-9.]+)?\)/);
  if (!match) return null;
  return {
    angle: parseFloat(match[1]),
    cx: match[2] ? parseFloat(match[2]) : undefined,
    cy: match[3] ? parseFloat(match[3]) : undefined,
  };
}

export default function FairMap({
  exhibitors,
  MapComponent,
  selectedExhibitor = null,
}: FairMapProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeExhibitor, setActiveExhibitor] = useState<Exhibitor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!selectedExhibitor?.fairLocation) return;
    const svg = svgRef.current;
    const api = transformRef.current;
    if (!svg || !api) return;

    const timeout = setTimeout(() => {
      const booth = svg.querySelector<SVGGraphicsElement>(
        `[id$="__${selectedExhibitor.fairLocation}"]`
      );
      if (!booth) return;

      api.zoomToElement(booth as unknown as HTMLElement, isMobile ? 5 : 3, 300);

      // Highlight glow
      const tier = (selectedExhibitor.tier || "").toLowerCase();
      const colors = tierColors[tier] || tierColors.default;
      const highlightColor = colors.stroke;

      const glow = booth.cloneNode(true) as SVGGraphicsElement;
      glow.setAttribute("stroke", highlightColor);
      glow.setAttribute("opacity", "1");
      glow.style.pointerEvents = "none";
      glow.style.filter = `drop-shadow(0 0 4px ${highlightColor}) drop-shadow(0 0 8px ${highlightColor})`;
      glow.classList.add("animate-pulse");
      glow.style.animationDuration = "1.5s";

      booth.parentNode?.appendChild(glow);
      setTimeout(() => glow.remove(), 3000);
    }, 350);

    return () => clearTimeout(timeout);
  }, [selectedExhibitor]);


  // Draw map + exhibitors
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    setIsLoading(true);
    requestAnimationFrame(() => {
      svg.querySelectorAll("image[data-logo], text[data-initial]").forEach(el => el.remove());

      const booths = svg.querySelectorAll<SVGElement>("[id*='__booth']");
      booths.forEach(el => {
        el.setAttribute("fill", "#ffffff");
        el.setAttribute("stroke", "#cccccc");
        el.setAttribute("stroke-width", "1");
        el.classList.add("cursor-pointer", "transition-all", "duration-200");
      });

      exhibitors.forEach(ex => {
        if (!ex.fairLocation) return;
        const booth = svg.querySelector<SVGGraphicsElement>(`[id$="__${ex.fairLocation}"]`);
        if (!booth) return;

        const tier = (ex.tier || "").toLowerCase();
        const colors = tierColors[tier] || tierColors.default;
        booth.setAttribute("fill", colors.fill);
        booth.setAttribute("stroke", colors.stroke);
        booth.setAttribute("stroke-width", "1.2");

        const bbox = booth.getBBox();
        const boothTransform = booth.getAttribute("transform");
        const rotation = parseRotation(boothTransform);
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        if (ex.logoFreesize) {
          const logo = document.createElementNS("http://www.w3.org/2000/svg", "image");
          const sizeFactor = 0.9;
          const width = bbox.width * sizeFactor;
          const height = bbox.height * sizeFactor;
          logo.setAttributeNS("http://www.w3.org/1999/xlink", "href", ex.logoFreesize);
          logo.setAttribute("data-logo", "true");
          logo.setAttribute("width", String(width));
          logo.setAttribute("height", String(height));
          logo.setAttribute("x", String(cx - width / 2));
          logo.setAttribute("y", String(cy - height / 2));
          logo.setAttribute("preserveAspectRatio", "xMidYMid meet");
          logo.style.pointerEvents = "none";

          logo.setAttribute("transform", boothTransform || "");

          svg.appendChild(logo);
        } else {
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          const firstLetter = (ex.name || "?").charAt(0).toUpperCase();
          const sizeFactor = 0.5;
          const fontSize = Math.min(bbox.width, bbox.height) * sizeFactor;
          text.textContent = firstLetter;
          text.setAttribute("x", String(cx));
          text.setAttribute("y", String(cy));
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("dominant-baseline", "central");
          text.setAttribute("font-size", String(fontSize));
          text.setAttribute("fill", "#444");
          text.setAttribute("data-initial", "true");
          text.style.pointerEvents = "none";

          text.setAttribute("transform", boothTransform || "");

          svg.appendChild(text);
        }
      });

      // delay a bit for smooth fade-out
      setTimeout(() => setIsLoading(false), fadeOutDelay);
    });
  }, [exhibitors]);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const target = event.target as SVGElement;
    const rawId = target.id;
    if (!rawId) return;
    const boothId = rawId.replace(/^.*__/, "");
    if (!boothId.startsWith("booth")) return;
    const exhibitor = exhibitors.find(e => e.fairLocation === boothId);
    if (!exhibitor) return;

    setActiveExhibitor(exhibitor);
    setModalOpen(true);
    const api = transformRef.current;
    if (api) {
      setTimeout(() => {
        api.zoomToElement(target as unknown as HTMLElement, isMobile ? 5 : 3, 200);
      }, 100); // small delay for mobile gesture processing
    }
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      <TransformWrapper
        ref={transformRef}
        initialScale={isMobile ? 1.8 : 1}
        centerOnInit
        minScale={1}
        maxScale={5}
        limitToBounds
        smooth
      >
        <TransformComponent>
          <MapComponent ref={svgRef} className="w-screen h-screen" onClick={handleClick} />
        </TransformComponent>
      </TransformWrapper>

      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-xs text-white transition-opacity duration-500">
          <div className="flex flex-col items-center space-y-6">
            {/* Spinner with logo inside */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Logo */}
              <Image
                src="/armada_white.svg"
                alt="Fair logo"
                width={50}
                height={50}
                priority
                className="select-none opacity-95 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]"
              />

              {/* Rotating ring */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g className="animate-[spin_1.5s_linear_infinite] origin-center">
                  <path
                    d="M50 5 a45 45 0 0 1 0 90 a45 45 0 0 1 0 -90"
                    fill="none"
                    stroke="#00d790"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="70 270"
                  />
                </g>
              </svg>
            </div>

            {/* Loading text */}
            <p className="text-lg font-medium mt-4">Loading the map...</p>
          </div>
        </div>
      )}


      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        onClose={() => {
          setModalOpen(false);
          setActiveExhibitor(null);
        }}
        className="max-w-[1000px] bg-linear-to-br from-emerald-950 via-stone-900 to-stone-900 p-0"
      >
        {activeExhibitor && (
          <div className="p-4 sm:p-10">
            <ExhibitorDetails exhibitor={activeExhibitor} />
          </div>
        )}
      </Modal>
    </div>
  );
}
