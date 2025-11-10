
import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { basename } from "path";
import prettier from "prettier";

interface Booth {
    id: string;
    number: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

const inputFile = process.argv[2];
if (!inputFile) {
    console.error("❌ Usage: npx tsx cleanMap.ts <input.svg>");
    process.exit(1);
}

const raw = readFileSync(inputFile, "utf8");
const dom = new JSDOM(raw);
const doc = dom.window.document;

const rects = [...doc.querySelectorAll("rect")];
const booths: Booth[] = [];

const TARGET_WIDTH = 50;
const TARGET_HEIGHT = 50;

for (const rect of rects) {
    const parentGroup = rect.closest("g");
    const textSibling = parentGroup?.querySelector("text");
    const boothNumber = textSibling?.textContent?.trim();

    if (!boothNumber || isNaN(Number(boothNumber))) continue;

    const x = parseFloat(rect.getAttribute("x") || "0");
    const y = parseFloat(rect.getAttribute("y") || "0");
    const width = parseFloat(rect.getAttribute("width") || "0");
    const height = parseFloat(rect.getAttribute("height") || "0");

    rect.removeAttribute("style");
    rect.removeAttribute("class");

    const cx = x + width / 2;
    const cy = y + height / 2;
    const newX = cx - TARGET_WIDTH / 2;
    const newY = cy - TARGET_HEIGHT / 2;

    rect.setAttribute("x", String(newX));
    rect.setAttribute("y", String(newY));
    rect.setAttribute("width", String(TARGET_WIDTH));
    rect.setAttribute("height", String(TARGET_HEIGHT));

    rect.setAttribute("id", `booth${boothNumber}`);
    rect.setAttribute("data-booth", boothNumber);
    rect.setAttribute("fill", "#ffffff");
    rect.setAttribute("stroke", "#000000");
    rect.setAttribute("stroke-width", "0.5");
    rect.setAttribute("cursor", "pointer");

    booths.push({
        id: `booth${boothNumber}`,
        number: boothNumber,
        x: newX,
        y: newY,
        width: TARGET_WIDTH,
        height: TARGET_HEIGHT,
    });

    // 🧽 Remove number text
    textSibling?.remove();
}

const svgEl = doc.querySelector("svg");
if (!svgEl) {
    process.exit(1);
}

svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
svgEl.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

const name = basename(inputFile).replace(/\.svg$/i, "");
const outSvg = `clean-${name}.svg`;
const outJson = `booths-${name}.json`;

(async () => {
    const prettySvg = await prettier.format(svgEl.outerHTML, { parser: "html" });
    writeFileSync(outSvg, prettySvg);
    writeFileSync(outJson, JSON.stringify(booths, null, 2));

    console.log(`Clean SVG saved: ${outSvg}`);
    console.log(`Booth metadata saved: ${outJson}`);
    console.log(`Labeled ${booths.length} booths.`);
    console.log(`All booths normalized to ${TARGET_WIDTH}×${TARGET_HEIGHT}px`);
})();
