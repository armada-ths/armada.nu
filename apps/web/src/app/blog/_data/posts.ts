export interface BlogPost {
  id: number
  userId: number
  title: string
  text: string
  author: string
  createdAt: string
  imageUrl?: string
  imageUrls?: string[]
  showCoverInPost?: boolean
}
