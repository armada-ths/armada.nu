export function PageHeader(
  props: {
    title: string
    subtitle: string
  } & React.HTMLAttributes<HTMLDivElement>
) {
  const { title, subtitle } = props
  return (
    <div {...props}>
      <h1 className="font-lato text-melon-700 mt-20 text-center text-3xl font-bold">
        {title}
      </h1>
      <p className="text-center">{subtitle}</p>
    </div>
  )
}
