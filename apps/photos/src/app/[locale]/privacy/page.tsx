import { getTranslations } from "next-intl/server"
import { PhotoText } from "@photos/i18n/text"
import { Page } from "@armada/shared/Page"
import type { Metadata } from "next"
import { Link } from "@armada/shared/i18n/navigation"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Photos")
  return {
    title: t("privacyTitle"),
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
            <PhotoText id="thisNoticeExplainsHowGuestPhotosFromArmada" />
          </p>
        </div>

        <aside className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6">
          <p className="font-semibold">
            <PhotoText id="draftForReviewNotYetApproved" />
          </p>
          <p className="mt-2">
            <PhotoText id="beforeUsingThisNoticeForALiveEvent" />
          </p>
        </aside>

        <div className="space-y-8 leading-7">
          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="whoIsResponsible" />
            </h2>
            <p>
              <PhotoText id="tekniskaHgskolansStudentkrTHSOrganisationNumber8020059153Ref" />{" "}
              <a className="underline" href="mailto:a@armada.nu">
                <PhotoText id="aarmadanu" />
              </a>
              <PhotoText id="tHSIsTheControllerOfThisPhotoService" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="whatDoWeCollect" />
            </h2>
            <p>
              <PhotoText id="weProcessThePhotosGuestsSubmitWhichMay" />
            </p>
            <p>
              <PhotoText id="cameraImagesAreConvertedToSmallerJPEGFiles" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="whyDoWeUseTheData" />
            </h2>
            <p>
              <PhotoText id="weUsePhotosToLetEventGuestsShare" />
            </p>
            <p>
              <PhotoText id="tHSProposesLegitimateInterestsUnderGDPRArticle61f" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="whoCanSeeThePhotos" />
            </h2>
            <p>
              <PhotoText id="armadaModeratorsCanReviewSubmittedPhotosGoogleCloud" />
            </p>
            <p>
              <PhotoText id="vercelServesTheWebsiteAndCurrentlyProvidesWebsite" />{" "}
              <a
                className="underline"
                href="https://cloud.google.com/vision/docs/data-usage">
                <PhotoText id="dataUsageInformation" />
              </a>
              <PhotoText id="supabaseHostsThePhotoDatabaseAndPrivateImage" />
            </p>
            <p>
              <PhotoText id="theseProvidersAndTheirSubprocessorsMayProcessLimited" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="howLongDoWeKeepTheData" />
            </h2>
            <p>
              <PhotoText id="eachEventHasAnUploadClosingTimeAnd" />
            </p>
            <p>
              <PhotoText id="tHSCanRemoveCopiesItControlsAfterThe" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="yourChoicesAndRights" />
            </h2>
            <p>
              <PhotoText id="uploadingIsOptionalPleaseAvoidSharingPhotosOf" />{" "}
              <a className="underline" href="mailto:a@armada.nu">
                <PhotoText id="aarmadanu" />
              </a>{" "}
              <PhotoText id="toAskAboutAPhotoObjectToIts" />
            </p>
            <p>
              <PhotoText id="youCanAlsoComplainToTheSwedishAuthority" />{" "}
              <a
                className="underline"
                href="https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/de-registrerades-rattigheter/">
                <PhotoText id="dataSubjectRights" />
              </a>
              <PhotoText id="confirmWhetherAnyOtherRightsOrContactChannels" />
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>
              <PhotoText id="questionsOrChanges" />
            </h2>
            <p>
              <PhotoText id="contact" />{" "}
              <a className="underline" href="mailto:a@armada.nu">
                <PhotoText id="aarmadanu" />
              </a>{" "}
              <PhotoText id="beforeTheEventIfYouHaveQuestionsAbout" />
            </p>
          </section>
        </div>
      </Page.Boundary>
    </main>
  )
}
