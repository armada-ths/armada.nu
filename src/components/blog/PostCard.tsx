import { BlogPost } from "@/app/blog/_data/posts"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

export function PostCard({ post }: { post: BlogPost }) {
  const coverImage = post.imageUrl ?? "/armada_white.svg"
  return (
    <Link href={`/blog/${post.id}`} className="group block">
      <Card className="h-full overflow-hidden border-2 p-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-4">
            <h3 className="font-bebas-neue text-xl leading-tight text-white drop-shadow-md sm:text-2xl">
              {post.title}
            </h3>
            <p className="mt-1 text-xs text-white/80">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              })}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
