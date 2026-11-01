import { getLocale, getTranslations } from "next-intl/server"
import { PhotoText } from "@photos/i18n/text"
import { Page } from "@armada/shared/Page"
import type { Metadata } from "next"
import { Link } from "@armada/shared/i18n/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Photos")
  return {
    title: t("privacyTitle"),
    openGraph: {
      title: t("privacyTitle"),
      description: t("privacyDescription"),
      locale: (await getLocale()) === "sv" ? "sv_SE" : "en_GB"
    },
    description: t("privacyDescription"),
    robots: { index: false, follow: false }
  }
}

const sectionClass = "space-y-3 border-t border-slate-200 pt-8"
const headingClass = "text-2xl font-semibold tracking-tight"

export default function PhotoPrivacyPage() {
  return (
    <main className="px-5 pt-10 pb-20 sm:px-8">
      <Page.Boundary className="mt-0 gap-8" maxWidth={760}>
        <div>
          <Link className="text-sm font-semibold underline" href="/">
            <PhotoText id="armadaPhotos" />
          </Link>
          <Page.Header className="mt-6">
            <PhotoText id="photoPrivacyNotice" />
          </Page.Header>
          <p className="mt-4 text-lg leading-7">
            <PhotoText id="privacyNoticeIntro" />
          </p>
          <p className="mt-3 text-sm">
            <PhotoText id="privacyLastUpdated" />
          </p>
        </div>

        <div className="space-y-8 leading-7">
          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="whoIsResponsible" />
            </h2>
            <p>
              <PhotoText id="privacyControllerDetails" />{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="whatInformationIsProcessed" />
            </h2>
            <p>
              <PhotoText id="privacyGuestPhotoData" />
            </p>
            <p>
              <PhotoText id="privacyImageProcessing" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="howArePhotosUsedAndShared" />
            </h2>
            <p>
              <PhotoText id="privacyPhotoPurposes" />
            </p>
            <p>
              <PhotoText id="privacyGalleryAccess" />
            </p>
            <p>
              <PhotoText id="privacyAutomaticChecks" />
            </p>
          </section>

          <section id="cookies" className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="browserStorageAndAbusePrevention" />
            </h2>
            <p>
              <PhotoText id="privacyGuestIdentifierPrefix" />{" "}
              <code>armada-photo-guest</code>
              <PhotoText id="privacyGuestIdentifierDetails" />
            </p>
            <p>
              <PhotoText id="privacyRecaptchaPrefix" /> <code>_GRECAPTCHA</code>{" "}
              <PhotoText id="privacyRecaptchaAnalysis" />{" "}
              <a
                className="underline"
                href="https://cloud.google.com/recaptcha/docs/faq">
                <PhotoText id="recaptchaInformation" />
              </a>{" "}
              <PhotoText id="privacyRecaptchaDetails" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="serviceProviders" />
            </h2>
            <p>
              <PhotoText id="privacyServiceProviders" />
            </p>
            <p>
              <PhotoText id="privacyInternationalTransfers" />{" "}
              <a
                className="underline"
                href="https://cloud.google.com/terms/data-processing-addendum">
                Google Cloud
              </a>
              ,{" "}
              <a className="underline" href="https://supabase.com/legal/dpa">
                Supabase
              </a>{" "}
              <PhotoText id="privacyAnd" />{" "}
              <a className="underline" href="https://vercel.com/legal/dpa">
                Vercel
              </a>
              <PhotoText id="privacyProviderTerms" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="howLongIsInformationKept" />
            </h2>
            <p>
              <PhotoText id="privacyEventRetention" />
            </p>
            <p>
              <PhotoText id="privacyRejectedPhotoRetention" />
            </p>
            <p>
              <PhotoText id="privacyCopiesOutsideControl" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="yourChoicesAndRights" />
            </h2>
            <p>
              <PhotoText id="privacyOptionalUpload" />{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>{" "}
              <PhotoText id="privacyRightsRequests" />
            </p>
            <p>
              <PhotoText id="privacyImyInformation" />{" "}
              <a
                className="underline"
                href="https://www.imy.se/privatperson/dataskydd/dina-rattigheter/">
                <PhotoText id="yourRights" />
              </a>{" "}
              <PhotoText id="privacyAnd" />{" "}
              <a
                className="underline"
                href="https://www.imy.se/privatperson/utfora-arenden/lamna-ett-klagomal/">
                <PhotoText id="howToMakeAComplaint" />
              </a>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="questionsAndUpdates" />
            </h2>
            <p>
              <PhotoText id="privacyContact" />{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>
              <PhotoText id="privacyNoticeUpdates" />
            </p>
          </section>
        </div>
      </Page.Boundary>
    </main>
  )
}
