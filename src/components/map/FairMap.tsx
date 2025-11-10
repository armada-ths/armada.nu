"use client";

import ExhibitorDetails from "@/app/student/exhibitors/_components/ExhibitorDetails";
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors";
import Modal from "@/components/ui/Modal";
import { useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

interface FairMapProps {
  exhibitors: Exhibitor[];
  MapComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const tierColors: Record<string, { fill: string; stroke: string }> = {
  gold: { fill: "#facc15", stroke: "#eab308" },
  silver: { fill: "#a8a29e", stroke: "#a8a29e" },
  bronze: { fill: "#00d790", stroke: "#00d790" },
  default: { fill: "#f5f5f5", stroke: "#737373" },
};

export default function FairMap({ exhibitors, MapComponent }: FairMapProps) {
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.querySelectorAll("image[data-logo]").forEach(img => img.remove());

    const booths = svg.querySelectorAll("[id*='__booth']");
    booths.forEach(el => {
      el.setAttribute("fill", "#ffffff");
      el.setAttribute("stroke", "#cccccc");
      el.setAttribute("stroke-width", "1");
      el.classList.add("cursor-pointer", "transition-all", "duration-200");
    });

    exhibitors.forEach(ex => {
      if (!ex.fairLocation) return;

      const booth = svg.querySelector(`[id$="__${ex.fairLocation}"]`);
      if (!booth) return;

      const tier = (ex.tier || "").toLowerCase();
      const colors = tierColors[tier] || tierColors.default;

      booth.setAttribute("fill", colors.fill);
      booth.setAttribute("stroke", colors.stroke);
      booth.setAttribute("stroke-width", "1.2");

      if (!ex.logoFreesize) {
        const bbox = (booth as SVGGraphicsElement).getBBox();
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        const firstLetter = (ex.name || "?").charAt(0).toUpperCase();
        const sizeFactor = 0.5;
        const fontSize = Math.min(bbox.width, bbox.height) * sizeFactor;
        const cx = bbox.x + bbox.width / 2;
        const cy = bbox.y + bbox.height / 2;

        text.textContent = firstLetter;
        text.setAttribute("x", String(cx));
        text.setAttribute("y", String(cy));
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "central");
        text.setAttribute("font-size", String(fontSize));
        text.setAttribute("fill", "#444");
        text.style.pointerEvents = "none";

        const boothTransform = booth.getAttribute("transform");
        if (boothTransform?.startsWith("rotate(")) {
          const match = boothTransform.match(/rotate\(([-0-9.]+)[ ,]([-0-9.]+)?[ ,]([-0-9.]+)?\)/);
          if (match) {
            const boothRotation = parseFloat(match[1]);
            const cx = match[2] ? parseFloat(match[2]) : bbox.x + bbox.width / 2;
            const cy = match[3] ? parseFloat(match[3]) : bbox.y + bbox.height / 2;

            const absRotation = Math.abs(boothRotation % 360);

            if (absRotation < 20 || absRotation > 340) {
              // Slight tilt booths (like -11°, etc.) → follow booth directly
              text.setAttribute("transform", boothTransform);
            } else {
              // All others → apply your +90° logo correction
              const textRotation = boothRotation + 90;
              text.setAttribute("transform", `rotate(${textRotation} ${cx} ${cy})`);
            }
          }
        } else if (boothTransform) {
          text.setAttribute("transform", boothTransform);
        }

        svg.appendChild(text);
        return;
      }

      const bbox = (booth as SVGGraphicsElement).getBBox();
      const logo = document.createElementNS("http://www.w3.org/2000/svg", "image");

      const sizeFactor = 0.9;
      const width = bbox.width * sizeFactor;
      const height = bbox.height * sizeFactor;
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;

      logo.setAttributeNS("http://www.w3.org/1999/xlink", "href", ex.logoFreesize);
      logo.setAttribute("data-logo", "true");
      logo.setAttribute("width", String(width));
      logo.setAttribute("height", String(height));
      logo.setAttribute("x", String(cx - width / 2));
      logo.setAttribute("y", String(cy - height / 2));
      logo.setAttribute("preserveAspectRatio", "xMidYMid meet");
      logo.style.pointerEvents = "none";

      const boothTransform = booth.getAttribute("transform");

      if (boothTransform?.startsWith("rotate(")) {
        const match = boothTransform.match(/rotate\(([-0-9.]+)[ ,]([-0-9.]+)?[ ,]([-0-9.]+)?\)/);
        if (match) {
          const boothRotation = parseFloat(match[1]);
          const cx = match[2] ? parseFloat(match[2]) : bbox.x + bbox.width / 2;
          const cy = match[3] ? parseFloat(match[3]) : bbox.y + bbox.height / 2;

          const absRotation = Math.abs(boothRotation % 360);

          if (absRotation < 20 || absRotation > 340) {
            // Slight tilt booths (like -11°, etc.) → follow booth directly
            logo.setAttribute("transform", boothTransform);
          } else {
            // All others → apply your +90° logo correction
            const logoRotation = boothRotation + 90;
            logo.setAttribute("transform", `rotate(${logoRotation} ${cx} ${cy})`);
          }
        }
      } else if (boothTransform) {
        logo.setAttribute("transform", boothTransform);
      }

      svg.appendChild(logo);
    });


    // Highlight selected booth
    if (selectedBoothId) {
      const selected = svg.querySelector(`[id$="__${selectedBoothId}"]`);
      if (selected) {
        selected.setAttribute("fill", "#fde68a");
        selected.setAttribute("stroke", "#f59e0b");
      }
    }

  }, [selectedBoothId, exhibitors, svgRef.current]);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    const rawId = (event.target as SVGElement).id;
    if (!rawId) return;

    const boothId = rawId.replace(/^.*__/, "");
    if (!boothId.startsWith("booth")) return;

    const exhibitor = exhibitors.find(e => e.fairLocation === boothId);
    if (exhibitor) {
      setSelectedBoothId(boothId);
      setModalOpen(true);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const selectedExhibitor = exhibitors.find(e => e.fairLocation === selectedBoothId);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      <TransformWrapper initialScale={isMobile ? 1.8 : 1} centerOnInit minScale={1} maxScale={5} limitToBounds smooth>
        <TransformComponent>
          <MapComponent ref={svgRef} className="w-screen h-screen" onClick={handleClick} />
        </TransformComponent>
      </TransformWrapper>

      <Modal
        open={modalOpen}
        setOpen={setModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBoothId(null);
        }}
        className="max-w-[1000px] bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 p-0"
      >
        {selectedExhibitor && (
          <div className="p-4 sm:p-10">
            <ExhibitorDetails exhibitor={selectedExhibitor} />
          </div>
        )}
      </Modal>
    </div>
  );
}
