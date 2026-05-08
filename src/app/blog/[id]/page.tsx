import { BlogPost } from "@/app/blog/_data/posts"
import { PostItem } from "@/components/blog/PostItem"
import { fetchBlogPostById } from "@/components/shared/hooks/api/useBlogPosts"
import { Page } from "@/components/shared/Page"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getPost(id: number): Promise<BlogPost | null> {
  try {
    return await fetchBlogPostById(id)
  } catch {
    return null
  }
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numId = Number(id)
  if (!Number.isFinite(numId)) notFound()
  const post = await getPost(numId)

  if (!post) {
    notFound()
  }

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={800}>
        <Link
          href="/blog"
          className="text-licorice/60 hover:text-melon mb-4 inline-flex items-center gap-1 text-sm transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to blog
        </Link>
        <PostItem post={post} />
      </Page.Boundary>
    </Page.Background>
  )
}
