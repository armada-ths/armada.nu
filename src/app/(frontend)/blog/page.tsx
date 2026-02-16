import { P } from "@/app/(frontend)/_components/Paragraph"
import { PostItem } from "@/components/blog/PostItem"
import { Page } from "@/components/shared/Page"

export interface BlogPost {
  id: number
  userId: number
  title: string
  text: string
  author: string
  createdAt: Date
}

export default async function BlogPage() {
  const mockPosts: BlogPost[] = [
    {
      id: 1,
      userId: 101,
      title: "Message from the web team",
      text: "Hello students and exhibitors! \n\nWe are the web team responsible for this site. We are currently working on rebranding this site but are rolling out a new feature for you in the likes of The Armada Blog. The Armada Blog will consists of write-ups and behind-the-scenes information going forward. \n\nSet sail for success!",
      author: "The web development team",
      createdAt: new Date("2025-06-26T09:00:00")
    }
  ]

  return (
    <Page.Background withIndents>
      <Page.Boundary maxWidth={1000}>
        <Page.Header>The Armada Blog</Page.Header>
        <P>
          Stay up to date with the work fair through behind-the-scenes and
          write-ups from the team.
        </P>
        {mockPosts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </Page.Boundary>
    </Page.Background>
  )
}
