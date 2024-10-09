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
      className={`inline-block w-auto cursor-pointer text-ellipsis whitespace-nowrap rounded-3xl border  px-4 py-2 text-center  ${
        isSelected
          ? "border-2  border-melon-700 text-melon-700 shadow-lg shadow-melon-700/30"
          : "border-green-700 text-green-800"
      }`}
      onClick={onClick}>
      <span className="">{name}</span>
    </div>
  )
}
