import { pageMetadata } from "@/i18n/metadata"
import { localeAlternates } from "@/i18n/metadata"
import { PostCard } from "@/components/blog/PostCard"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchBlogPosts } from "@/components/shared/hooks/api/useBlogPosts"
import { Page } from "@/components/shared/Page"
import { translations } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"

import { blogText } from "@/i18n/dictionaries"

export async function generateMetadata() {
  const locale = await getRequestLocale()
  return pageMetadata("/blog", {
    ...(await localeAlternates("/blog")),
    title: translations[locale].blog
  })
}

export default async function BlogPage() {
  const locale = await getRequestLocale()
  const dict = blogText[locale]
  const showBlog = await feature("ARMADA_BLOG_PAGE")
  if (!showBlog) {
    return <ComingSoonPage title={translations[locale].blog} />
  }

  const posts = (await fetchBlogPosts()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={1100}>
        <Page.Header>{dict.title}</Page.Header>
        <p className="text-licorice/70 mt-2 mb-8">{dict.intro}</p>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-licorice/50 py-16 text-center">
            <p className="text-lg">{dict.emptyTitle}</p>
            <p className="mt-1 text-sm">{dict.emptyBody}</p>
          </div>
        )}
      </Page.Boundary>
    </Page.Background>
  )
}
