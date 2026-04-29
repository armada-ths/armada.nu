import { env } from "@/env"
import { useQuery } from "@tanstack/react-query"

export interface BlogPostData {
  id: number
  userId: number
  title: string
  text: string
  author: string
  imageUrl?: string
  createdAt: string
}

export async function fetchBlogPosts(): Promise<BlogPostData[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/blogposts`, {
    next: { revalidate: 60 }
  })
  if (!res.ok) return []
  return res.json() as Promise<BlogPostData[]>
}

export async function fetchBlogPostById(
  id: number
): Promise<BlogPostData | null> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/v1/blogposts/${id}`, {
    next: { revalidate: 60 }
  })
  if (!res.ok) return null
  return res.json() as Promise<BlogPostData>
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blogposts"],
    queryFn: fetchBlogPosts
  })
}
