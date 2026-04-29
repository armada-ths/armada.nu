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
  return (
    <Card className="mx-auto overflow-hidden transition-shadow duration-300">
      <div className="relative aspect-2/1 w-full overflow-hidden -mt-6">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 1000px) 100vw, 1000px"
          priority
        />
      </div>
      <CardHeader className="space-y-2">
        <CardTitle className="font-bebas-neue text-3xl leading-tight sm:text-4xl">
          {post.title}
        </CardTitle>
        <div className="text-sm text-licorice/60">
          {post.createdAt.toLocaleDateString("en-US", {
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
              <p className="mb-4 text-base leading-relaxed text-licorice/80">
                {props.children}
              </p>
            ),
            strong: props => (
              <strong className="font-bold">{props.children}</strong>
            ),
            em: props => <em className="italic">{props.children}</em>,
            ul: props => (
              <ul className="mb-4 list-disc space-y-1 pl-5 text-licorice/80">
                {props.children}
              </ul>
            ),
            ol: props => (
              <ol className="mb-4 list-decimal space-y-1 pl-5 text-licorice/80">
                {props.children}
              </ol>
            ),
            li: props => (
              <li className="text-base leading-relaxed">{props.children}</li>
            ),
            h1: props => (
              <h1 className="mt-6 mb-2 text-2xl font-bold text-licorice">
                {props.children}
              </h1>
            ),
            h2: props => (
              <h2 className="mt-5 mb-2 text-xl font-bold text-licorice">
                {props.children}
              </h2>
            ),
            h3: props => (
              <h3 className="mt-4 mb-2 text-lg font-bold text-licorice">
                {props.children}
              </h3>
            ),
            img: props => {
              const src = typeof props.src === "string" ? props.src : ""
              return (
                <span className="my-4 block">
                  <Image
                    src={src}
                    alt={props.alt ?? ""}
                    width={800}
                    height={450}
                    className="rounded-base w-full object-cover"
                  />
                </span>
              )
            },
            blockquote: props => (
              <blockquote className="my-4 border-l-4 border-melon pl-4 italic text-licorice/60">
                {props.children}
              </blockquote>
            ),
            a: props => (
              <a
                href={props.href}
                className="text-melon underline hover:text-melon/80"
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
        <div className="text-sm text-licorice/60">By {post.author}</div>
      </CardFooter>
    </Card>
  )
}
