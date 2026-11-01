export function OrganisationMembersInfo({
  children,
  title
}: {
  children?: React.ReactNode
  title: string
}) {
  return (
    <div className="relative mt-5 flex min-w-48 flex-1 flex-col rounded-lg bg-green-950 p-5">
      <h3 className="font-lato text-snow text-2xl">{title}</h3>
      <div className="text-gray-200 italic">{children}</div>
    </div>
  )
}
