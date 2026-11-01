export interface BlogPost {
  id: number
  userId: number
  title: string
  titleSv?: string | null
  text: string
  textSv?: string | null
  author: string
  createdAt: string
  imageUrl?: string
  imageUrls?: string[]
  showCoverInPost?: boolean
}
