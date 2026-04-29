import { mockPosts } from "@/app/blog/_data/posts"
import { PostCard } from "@/components/blog/PostCard"
import { ComingSoonPage } from "@/components/shared/ComingSoonPage"
import { feature } from "@/components/shared/feature"
import { Page } from "@/components/shared/Page"

export default async function BlogPage() {
  const showBlog = await feature("ARMADA_BLOG_PAGE")
  if (!showBlog) {
    return <ComingSoonPage title="The Armada Blog" />
  }

  const posts = [...mockPosts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={1100}>
        <Page.Header>The Armada Blog</Page.Header>
        <p className="mt-2 mb-8 text-licorice/70">
          Stay up to date with behind-the-scenes stories and write-ups from the
          team.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Page.Boundary>
    </Page.Background>
  )
}
