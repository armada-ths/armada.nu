import { BlogPost } from "@/app/blog/_data/posts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import Image from "next/image"
import ReactMarkdown from "react-markdown"

export function PostItem({ post }: { post: BlogPost }) {
  const coverImage = post.imageUrl ?? "/armada_white.svg"
  const showCover = post.showCoverInPost !== false
  return (
    <Card className="mx-auto w-full max-w-4xl overflow-hidden transition-shadow duration-300">
      {showCover && (
        <div className="relative -mt-6 aspect-2/1 w-full overflow-hidden">
          <Image
            src={coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 1000px) 100vw, 1000px"
            priority
          />
        </div>
      )}
      <CardHeader className="space-y-2">
        <CardTitle className="font-bebas-neue text-3xl leading-tight sm:text-4xl">
          {post.title}
        </CardTitle>
        <div className="text-licorice/60 text-sm">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </div>
      </CardHeader>
      <CardContent>
        <ReactMarkdown
          components={{
            p: props => (
              <p className="text-licorice/80 mb-4 text-base leading-relaxed">
                {props.children}
              </p>
            ),
            strong: props => (
              <strong className="font-bold">{props.children}</strong>
            ),
            em: props => <em className="italic">{props.children}</em>,
            ul: props => (
              <ul className="text-licorice/80 mb-4 list-disc space-y-1 pl-5">
                {props.children}
              </ul>
            ),
            ol: props => (
              <ol className="text-licorice/80 mb-4 list-decimal space-y-1 pl-5">
                {props.children}
              </ol>
            ),
            li: props => (
              <li className="text-base leading-relaxed">{props.children}</li>
            ),
            h1: props => (
              <h1 className="text-licorice mt-6 mb-2 text-2xl font-bold">
                {props.children}
              </h1>
            ),
            h2: props => (
              <h2 className="text-licorice mt-5 mb-2 text-xl font-bold">
                {props.children}
              </h2>
            ),
            h3: props => (
              <h3 className="text-licorice mt-4 mb-2 text-lg font-bold">
                {props.children}
              </h3>
            ),
            img: props => {
              const src = typeof props.src === "string" ? props.src : ""
              if (!src) return null
              // Support size syntax: ![alt|WIDTHxHEIGHT](url)
              const altRaw = props.alt ?? ""
              const sizeMatch = altRaw.match(/^(.+?)\|(\d+)x(\d+)$/)
              const alt = sizeMatch ? sizeMatch[1] : altRaw
              const width = sizeMatch ? Number(sizeMatch[2]) : 800
              const height = sizeMatch ? Number(sizeMatch[3]) : 450
              return (
                <span className="my-4 block">
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="rounded-base object-cover"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </span>
              )
            },
            blockquote: props => (
              <blockquote className="border-melon text-licorice/60 my-4 border-l-4 pl-4 italic">
                {props.children}
              </blockquote>
            ),
            a: props => (
              <a
                href={props.href}
                className="text-melon hover:text-melon/80 underline"
                target="_blank"
                rel="noopener noreferrer">
                {props.children}
              </a>
            )
          }}>
          {post.text}
        </ReactMarkdown>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="text-licorice/60 text-sm">By {post.author}</div>
      </CardFooter>
    </Card>
  )
}
