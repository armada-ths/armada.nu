import { z } from "zod"
import { readCmsResponse, blogPostSchema } from "@/lib/cmsResponse"
import { BlogPost } from "@/app/blog/_data/posts"
import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export type { BlogPost }

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/blogposts`, {
    next: { revalidate: 86400, tags: ["blog-posts"] }
  })
  return readCmsResponse<BlogPost[]>(res, "blog posts", z.array(blogPostSchema))
}

export async function fetchBlogPostById(id: number): Promise<BlogPost> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/blogposts/${id}`, {
    next: { revalidate: 86400, tags: ["blog-posts"] }
  })
  return readCmsResponse<BlogPost>(res, "blog post", blogPostSchema)
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blogposts"],
    queryFn: fetchBlogPosts
  })
}
