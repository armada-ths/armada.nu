export function FilterSelectionItem({
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
      className={`flex w-auto cursor-pointer text-ellipsis whitespace-nowrap rounded-3xl border px-3 py-2 text-center transition xs:px-4 xs:py-2 ${
        isSelected
          ? "border-1 border-melon-700 text-melon-700 shadow-md shadow-melon-700/30"
          : "border-emerald-700 text-emerald-700"
      }`}
      onClick={onClick}>
      <span className="text-xs xs:text-base">{name}</span>
    </div>
  )
}
