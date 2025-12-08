import { cn } from "@/lib/utils"

type Props = {
  imageUrl: string
  caption: string
  className?: string
}

export default function ImageCard({ imageUrl, caption, className }: Props) {
  return (
    <figure
      className={cn(
        "w-[250px] overflow-hidden rounded-base border-2 border-stone-200 bg-main font-base shadow-shadow dark:border-stone-800",
        className,
      )}
    >
      <img className="w-full aspect-4/3" src={imageUrl} alt="image" />
      <figcaption className="border-t-2 text-main-foreground border-stone-200 p-4 dark:border-stone-800">
        {caption}
      </figcaption>
    </figure>
  )
}
