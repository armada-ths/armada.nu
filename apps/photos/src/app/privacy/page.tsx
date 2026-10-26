import { Page } from "@armada/shared/Page"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Photo privacy notice | Armada Photos",
  description: "How Armada Photos handles event photos and personal data.",
  robots: { index: false, follow: false }
}

const sectionClass = "space-y-3 border-t border-slate-200 pt-8"
const headingClass = "text-2xl font-semibold tracking-tight"

export default function PhotoPrivacyPage() {
  return (
    <main className="px-5 pt-10 pb-20 sm:px-8">
      <Page.Boundary className="mt-0 gap-8" maxWidth={760}>
        <div>
          <Link className="text-sm font-semibold underline" href="/">
            Armada Photos
          </Link>
          <Page.Header className="mt-6">Photo privacy notice</Page.Header>
          <p className="mt-4 text-lg leading-7">
            This notice explains how guest photos and personal data are handled
            in Armada Photos. It applies both to guests uploading photos and to
            people pictured in them.
          </p>
          <p className="mt-3 text-sm">Last updated: 26 October 2026</p>
        </div>

        <div className="space-y-8 leading-7">
          <section className={sectionClass}>
            <h2 className={headingClass}>Who is responsible?</h2>
            <p>
              Tekniska Högskolans Studentkår (THS), organisation number
              802005-9153, is the controller of this photo service. Its postal
              address is Ref: Armada, Drottning Kristinas Väg 15-19, 114 28
              Stockholm, Sweden. For questions about personal data or a photo,
              email{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>What information is processed?</h2>
            <p>
              Guests supply the photos, which may show identifiable people. The
              service stores the event, upload and moderation times, status,
              file size and dimensions for each photo. When automatic checks are
              enabled, it also stores the content assessment and whether
              approval was automatic or manual. Guests do not need an account or
              have to provide their name or email address to upload.
            </p>
            <p>
              Uploaded images are converted to JPEG files with size limits and
              image metadata removed. The service stores these processed images
              and gallery thumbnails rather than the original uploaded file.
              Technical request data is also processed to deliver and protect
              the website and measure usage and performance. Event links contain
              an access token, which is handled when the page is requested.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>How are photos used and shared?</h2>
            <p>
              Photos are used to let event guests share memories in a moderated
              gallery. THS may also select approved photos to promote Armada on
              its website, in marketing materials and on social media.
            </p>
            <p>
              Armada moderators can review submitted photos. Only approved
              photos appear in the event gallery. Anyone with the event link or
              QR code can view them while the gallery is open; access is not
              restricted to named or signed-in guests. Please treat the link as
              shareable. Images are served through time-limited links, but
              viewers can still save or capture what they see. Administrators
              can export approved photos as a ZIP archive. Promotional use can
              make a photo available to a wider audience outside the event.
            </p>
            <p>
              For events with automatic checking enabled, Google Cloud Vision
              SafeSearch receives a smaller copy to check for potentially
              explicit content. Photos assessed as clearly low-risk may be
              approved automatically. Uncertain results and failed checks wait
              for a moderator. This check does not establish that a photo
              belongs to the event or that everyone pictured agrees to
              publication. Contact us if you want a moderator to review a photo.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Legal basis</h2>
            <p>
              THS has not yet established the legal basis for the gallery,
              promotional use and abuse prevention described in this notice.
              This notice does not establish that these uses are lawful. The
              upload confirmation acknowledges that the uploader has read this
              notice and has the right to share the photos; it is not consent
              from everyone pictured.
            </p>
          </section>

          <section id="cookies" className={sectionClass}>
            <h2 className={headingClass}>
              Browser storage and abuse prevention
            </h2>
            <p>
              The service stores a random guest identifier in your
              browser&apos;s local storage under <code>armada-photo-guest</code>
              . It is sent with upload and quota requests, and an event-specific
              protected hash is stored on the server to apply the upload limit.
              The browser identifier has no automatic expiry in the application;
              it remains until browser storage is cleared. Clearing it removes
              the identifier from that browser, not photos already uploaded.
            </p>
            <p>
              Google reCAPTCHA Enterprise assesses upload requests to help
              prevent abuse. Google states that reCAPTCHA sets a necessary
              cookie named <code>_GRECAPTCHA</code> for its risk analysis. See
              Google&apos;s{" "}
              <a
                className="underline"
                href="https://cloud.google.com/recaptcha/docs/faq">
                reCAPTCHA information
              </a>{" "}
              for details.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Service providers</h2>
            <p>
              Vercel hosts the website. Google Cloud runs the photo API and
              background jobs; Google reCAPTCHA Enterprise assesses uploads for
              abuse, and Cloud Vision SafeSearch can check image content.
              Supabase provides the database and private image and export
              storage. These providers process data involved in delivering their
              respective services.
            </p>
            <p>
              Processing by providers and their subprocessors may take place
              outside the EU/EEA. A storage or server location does not mean all
              processing is confined to that location. The providers publish
              data processing and international-transfer terms:{" "}
              <a
                className="underline"
                href="https://cloud.google.com/terms/data-processing-addendum">
                Google Cloud
              </a>
              ,{" "}
              <a className="underline" href="https://supabase.com/legal/dpa">
                Supabase
              </a>{" "}
              and{" "}
              <a className="underline" href="https://vercel.com/legal/dpa">
                Vercel
              </a>
              . These describe the providers&apos; terms, rather than a
              service-specific assessment by THS of the transfers and safeguards
              that apply. Contact THS for questions about these arrangements.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>How long is information kept?</h2>
            <p>
              Each event has an upload closing time and a gallery closing time.
              Closing the gallery ends guest access; it does not delete the
              photos. There is currently no fixed retention period or automatic
              deletion date for event photos. Unless an administrator deletes
              them, they remain stored after the event. No fixed deletion date
              has been set for selected marketing copies or published posts
              either.
            </p>
            <p>
              Rejected photos are hidden from the gallery immediately and can be
              restored by a moderator for 24 hours. After that deadline, the
              cleanup job is scheduled to delete their image files; a limited
              moderation record may remain until event deletion. Administrator
              ZIP exports expire after 24 hours. Administrators can also request
              deletion of an event&apos;s photos and exports. This notice does
              not specify retention periods for provider logs or backups.
            </p>
            <p>
              You can ask us to remove a photo and copies used by Armada. Copies
              saved by viewers or shared by others may remain outside THS&apos;s
              control.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Your choices and rights</h2>
            <p>
              Uploading is optional. Avoid sharing photos of people who do not
              want to appear, and do not upload sensitive or inappropriate
              images. Contact{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>{" "}
              to ask about a photo, object to its use, or request access,
              correction, deletion or restriction of processing. You can also
              ask about data portability where applicable. Which rights apply
              depends on the circumstances and legal basis. Include the event
              and enough detail to identify the photo, without sending extra
              sensitive information unnecessarily.
            </p>
            <p>
              You can complain to the Swedish Authority for Privacy Protection
              (IMY). Read IMY&apos;s information about{" "}
              <a
                className="underline"
                href="https://www.imy.se/privatperson/dataskydd/dina-rattigheter/">
                your rights
              </a>{" "}
              and{" "}
              <a
                className="underline"
                href="https://www.imy.se/privatperson/utfora-arenden/lamna-ett-klagomal/">
                how to make a complaint
              </a>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Questions and updates</h2>
            <p>
              For questions about this notice, contact{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>
              . Updates to this notice will appear on this page with a revised
              last-updated date.
            </p>
          </section>
        </div>
      </Page.Boundary>
    </main>
  )
}
