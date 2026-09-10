import { BlogPost } from "@/app/blog/_data/posts"
import { PostCard } from "@/components/blog/PostCard"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { fetchBlogPosts } from "@/components/shared/hooks/api/useBlogPosts"
import { Page } from "@/components/shared/Page"
import { translations, type Locale } from "@/lib/i18n"
import { getRequestLocale } from "@/lib/i18n-server"

const blogText: Record<
  Locale,
  {
    title: string
    intro: string
    emptyTitle: string
    emptyBody: string
  }
> = {
  en: {
    title: "The Armada Blog",
    intro:
      "Stay up to date with behind-the-scenes stories and write-ups from the team.",
    emptyTitle: "No blog posts yet.",
    emptyBody: "Check back soon!"
  },
  sv: {
    title: "Armadabloggen",
    intro:
      "Håll dig uppdaterad med berättelser bakom kulisserna och texter från teamet.",
    emptyTitle: "Inga blogginlägg ännu.",
    emptyBody: "Titta gärna in snart igen!"
  }
}

async function getPosts(): Promise<BlogPost[]> {
  try {
    return await fetchBlogPosts()
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const locale = await getRequestLocale()
  const dict = blogText[locale]
  const showBlog = await feature("ARMADA_BLOG_PAGE")
  if (!showBlog) {
    return <ComingSoonPage title={translations[locale].blog} />
  }

  const posts = (await getPosts()).sort(
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
