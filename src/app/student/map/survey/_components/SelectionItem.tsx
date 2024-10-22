export function SelectionItem({
  name,
  isSelected,
  onClick
}: {
  name: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <div
      className={`inline-block w-auto cursor-pointer text-ellipsis whitespace-nowrap rounded-3xl border px-3 py-1 text-center xs:px-4 xs:py-2  ${
        isSelected
          ? "border-2 border-melon-700 text-melon-700 shadow-lg shadow-melon-700/30"
          : "border-emerald-600 text-emerald-600"
      }`}
      onClick={onClick}>
      <span className="text-xs xs:text-base">{name}</span>
    </div>
  )
}
