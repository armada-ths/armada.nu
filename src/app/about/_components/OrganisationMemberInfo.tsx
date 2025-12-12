export function OrganisationMembersInfo({
  children,
  title
}: {
  children?: React.ReactNode
  title: string
}) {
  return (
    <div className="mt=5 relative flex min-w-48 flex-1 flex-col rounded-lg bg-green-950 p-5">
      <h3 className="font-lato text-snow text-2xl">{title}</h3>
      <p className="text-gray-200 italic">{children}</p>
    </div>
  )
}
