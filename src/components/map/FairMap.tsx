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

export default function FairMap({ exhibitors, MapComponent }: FairMapProps) {
  const [selectedBoothId, setSelectedBoothId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Clean up old logos
    svg.querySelectorAll("image[data-logo]").forEach(img => img.remove());

    const booths = svg.querySelectorAll("[id*='__booth']");
    booths.forEach(el => {
      el.setAttribute("fill", "#ffffff");
      el.setAttribute("stroke", "#cccccc");
      el.setAttribute("stroke-width", "1");
      el.classList.add("cursor-pointer", "transition-all", "duration-200");
    });

    // Add logos dynamically
    exhibitors.forEach(ex => {
      if (!ex.fairLocation || !ex.logoSquared) return;
      const booth = svg.querySelector(`[id$="__${ex.fairLocation}"]`);
      if (!booth) return;

      const bbox = (booth as SVGGraphicsElement).getBBox();
      const logo = document.createElementNS("http://www.w3.org/2000/svg", "image");

      const logoPath = ex.logoSquared.startsWith("/public")
        ? ex.logoSquared.replace("/public", "")
        : ex.logoSquared;

      const sizeFactor = 0.8; // bigger logos
      const width = bbox.width * sizeFactor;
      const height = bbox.height * sizeFactor;

      logo.setAttributeNS(null, "href", logoPath);
      logo.setAttribute("data-logo", "true");
      logo.setAttribute("width", String(width));
      logo.setAttribute("height", String(height));
      logo.setAttribute("x", String(bbox.x + bbox.width / 2 - width / 2));
      logo.setAttribute("y", String(bbox.y + bbox.height / 2 - height / 2));
      logo.setAttribute("preserveAspectRatio", "xMidYMid meet");
      logo.style.pointerEvents = "none"; // logo shouldn't block booth clicks

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
  }, [selectedBoothId, exhibitors]);

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
      <TransformWrapper initialScale={isMobile ? 1.8 : 1} centerOnInit minScale={1} maxScale={3} limitToBounds smooth>
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
