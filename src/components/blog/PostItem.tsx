import { BlogPost } from "@/app/blog/page"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import Image from "next/image"

export function PostItem({ post }: { post: BlogPost }) {
  return (
    <Card className="mx-auto mt-4 transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold leading-tight">
          {post.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {post.createdAt.toDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Image
          src={"/armada_white.svg"}
          alt="Cover image"
          width="1000"
          height="400"
          className="h-[400px] w-[1000px] object-contain"
        />
        {post.text.split(/\n\s*\n/).map((paragraph, i) => (
          <p key={i} className="text-muted-foreground mb-4 text-base">
            {paragraph}
          </p>
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="text-muted-foreground text-sm">By {post.author}</div>
        {/* <Button variant="link" className="text-primary px-0">
          Read more
        </Button> */}
      </CardFooter>
    </Card>
  )
}
