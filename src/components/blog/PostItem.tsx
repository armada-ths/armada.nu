import { BlogPost } from "@/app/blog/page"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"

export function PostItem({ post }: { post: BlogPost }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 mx-auto mt-4">
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
          className="object-contain w-[1000px] h-[400px]"
        />
        {post.text.split(/\n\s*\n/).map((paragraph, i) => (
          <p key={i} className="mb-4 text-muted-foreground text-base">
            {paragraph}
          </p>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-muted-foreground">By {post.author}</div>
        {/* <Button variant="link" className="text-primary px-0">
          Read more
        </Button> */}
      </CardFooter>
    </Card>
  )
}
