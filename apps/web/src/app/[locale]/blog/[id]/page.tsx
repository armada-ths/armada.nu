import { getLocale } from "next-intl/server"
import { normalizeLocale, localizedText } from "@armada/shared/i18n/routing"
import { pageMetadata } from "@/i18n/metadata"
import { LocalizedText } from "@/i18n/text"
import { PostItem } from "@/components/blog/PostItem"
import { fetchBlogPostById } from "@/components/shared/hooks/api/useBlogPosts"
import { Page } from "@/components/shared/Page"
import { Link } from "@armada/shared/i18n/navigation"
import { notFound } from "next/navigation"

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const locale = normalizeLocale(await getLocale())
  const post = await fetchBlogPostById(Number(id))
  if (!post) notFound()
  const title = localizedText(locale, post.title, post.titleSv)
  return pageMetadata("/blog/" + id, { title })
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numId = Number(id)
  if (!Number.isFinite(numId)) notFound()
  const post = await fetchBlogPostById(numId)

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
          <LocalizedText id="backToBlog" />
        </Link>
        <PostItem post={post} />
      </Page.Boundary>
    </Page.Background>
  )
}
