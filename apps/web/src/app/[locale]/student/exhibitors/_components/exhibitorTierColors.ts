export function exhibitorTierColors(tier?: string) {
  switch (tier) {
    case "Gold":
      return { background: "bg-pineapple", fill: "fill-pineapple" }
    case "Silver":
      return { background: "bg-silver", fill: "fill-silver" }
    case "Bronze":
      return { background: "bg-bronze", fill: "fill-bronze" }
    default:
      return { background: undefined, fill: "fill-snow" }
  }
}
