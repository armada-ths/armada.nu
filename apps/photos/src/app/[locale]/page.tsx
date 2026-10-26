import { PhotoText } from "@photos/i18n/text"
import { Link } from "@armada/shared/i18n/navigation"

export default function PhotosHome() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold">
        <PhotoText id="armadaPhotos" />
      </h1>
      <p className="mt-4">
        <PhotoText id="scanYourEventsQRCodeToUploadAnd" />
      </p>
      <Link className="mt-8 text-sm underline" href="/privacy">
        <PhotoText id="photoPrivacyNoticeDraft" />
      </Link>
    </main>
  )
}
