import { PhotoExperience } from "./photo-experience"

export default async function EventPhotosPage({
  params
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  return <PhotoExperience token={token} />
}
