import { Page } from "@/components/shared/Page"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Photo privacy notice | Armada Photos",
  description: "Draft privacy information for Armada event photo sharing.",
  robots: { index: false, follow: false }
}

const sectionClass = "space-y-3 border-t border-slate-200 pt-8"
const headingClass = "text-2xl font-semibold tracking-tight"

export default function PhotoPrivacyPage() {
  return (
    <main className="px-5 pt-10 pb-20 sm:px-8">
      <Page.Boundary className="mt-0 gap-8" maxWidth={760}>
        <div>
          <Link className="text-sm font-semibold underline" href="/photos">
            Armada Photos
          </Link>
          <Page.Header className="mt-6">Photo privacy notice</Page.Header>
          <p className="mt-4 text-lg leading-7">
            This notice explains how guest photos from Armada events are handled
            in the photo-sharing service.
          </p>
        </div>

        <aside className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm leading-6">
          <p className="font-semibold">Draft for review — not yet approved</p>
          <p className="mt-2">
            Before using this notice for a live event, THS must assess the
            proposed legal basis and review its provider agreements and any
            international transfers. Square-bracketed text below still needs a
            decision before publication.
          </p>
        </aside>

        <div className="space-y-8 leading-7">
          <section className={sectionClass}>
            <h2 className={headingClass}>Who is responsible?</h2>
            <p>
              Tekniska Högskolans Studentkår (THS), organisation number
              802005-9153, Ref: Armada, Drottning Kristinas Väg 15-19, 114 28
              Stockholm, Sweden. For questions about personal data or a photo,
              email{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>
              . THS is the controller of this photo service. [Add data
              protection officer details if applicable.]
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>What do we collect?</h2>
            <p>
              We process the photos guests submit, which may show identifiable
              people. For each photo, we also store its event, upload and
              moderation times, status, file size and dimensions. A random guest
              identifier is kept in your browser and sent with uploads; the
              service stores an event-specific protected hash of it to apply the
              upload limit. We do not ask guests to create an account.
            </p>
            <p>
              Camera images are converted to smaller JPEG files before storage.
              The original is not retained and image metadata is removed from
              the stored version. The service also processes technical request
              data needed to operate and protect the website, including a
              reCAPTCHA Enterprise risk assessment for each upload. Google says
              reCAPTCHA uses a necessary cookie (_GRECAPTCHA) for this purpose.
              The website also loads Vercel Analytics and Speed Insights to
              measure usage and performance. The event token is masked in the
              URL sent to those two measurement tools; it remains in the event
              link itself and may still be handled by the hosting infrastructure
              when the page is requested.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Why do we use the data?</h2>
            <p>
              We use photos to let event guests share memories in a moderated
              gallery. THS may also select approved photos to promote Armada on
              its website, in marketing materials and on social media. We use
              the guest identifier, technical data and reCAPTCHA assessment to
              limit misuse and keep the service working. Photos are not
              automatically published: Armada reviews them first.
            </p>
            <p>
              THS proposes legitimate interests under GDPR Article 6(1)(f) as
              the legal basis for the moderated gallery, selected promotional
              use and abuse prevention. Its interests are sharing memories from
              the banquet, communicating about Armada and protecting the
              service. Before using that basis, THS must document whether each
              use is necessary and whether the rights and interests of everyone
              pictured outweigh those interests. Wider social-media publication
              needs its own assessment. If that assessment does not support a
              use, THS must not rely on this proposed basis for it. Checking the
              upload confirmation is not, by itself, consent from everyone
              pictured.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Who can see the photos?</h2>
            <p>
              Armada moderators can review submitted photos. Only approved
              photos appear in the event gallery. Anyone with the event link or
              QR code can see approved photos while the gallery is open, so
              please treat the link as shareable. Images are served through
              time-limited links. Although the guest page has no download
              button, viewers may still save or capture what they can see.
              Administrators can export approved photos as a ZIP archive. A
              photo chosen for marketing or social media may be seen and copied
              by a wider audience, including people outside the event.
            </p>
            <p>
              Vercel serves the website and currently provides website usage and
              performance measurements. Google Cloud runs the photo API and its
              background jobs, while Google reCAPTCHA Enterprise evaluates
              uploads for abuse. Supabase hosts the photo database and private
              image and export storage. The production configuration places the
              main Supabase data and Google Cloud service in Stockholm, Sweden.
              Vercel functions are also configured for Stockholm, but its
              delivery network and other processing are not necessarily limited
              to Sweden.
            </p>
            <p>
              These providers and their subprocessors may process limited data
              outside the EU/EEA. Their published data processing terms include
              international-transfer provisions. THS has not yet reviewed its
              own provider agreements or assessed the relevant transfers and
              safeguards; this must happen before the notice is approved.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>How long do we keep the data?</h2>
            <p>
              Each event has an upload closing time and a gallery closing time.
              THS intends to keep gallery photos, selected marketing copies and
              published posts only while they remain relevant to the purposes
              described above. There is no fixed retention period or automatic
              deletion date. When THS decides the photos are no longer needed,
              an administrator closes access and requests permanent deletion of
              the event photos and exports; THS separately removes marketing
              copies and posts it controls. Rejected photo files are deleted
              immediately; a limited moderation record may remain until event
              deletion. An administrator&apos;s ZIP export expires after 24
              hours. [Confirm separate retention for security logs, backups and
              provider data.]
            </p>
            <p>
              THS can remove copies it controls after the purpose ends, but
              copies saved by viewers or social-media platforms may remain
              outside its control.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Your choices and rights</h2>
            <p>
              Uploading is optional. Please avoid sharing photos of people who
              do not want to appear in the gallery, and do not upload sensitive
              or inappropriate images. You can contact{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>{" "}
              to ask about a photo, object to its use, request access or
              correction, or request deletion. The applicable right depends on
              the circumstances and the legal basis. Please include the event
              and enough detail to identify the photo; do not send extra
              sensitive information unnecessarily.
            </p>
            <p>
              You can also complain to the Swedish Authority for Privacy
              Protection (IMY). See its information about{" "}
              <a
                className="underline"
                href="https://www.imy.se/verksamhet/dataskydd/det-har-galler-enligt-gdpr/de-registrerades-rattigheter/">
                data subject rights
              </a>
              . [Confirm whether any other rights or contact channels need to be
              stated for this controller.]
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Questions or changes</h2>
            <p>
              Contact{" "}
              <a className="underline" href="mailto:a@armada.nu">
                a@armada.nu
              </a>{" "}
              before the event if you have questions about this notice. [Add the
              effective date and describe how material changes will be
              communicated.]
            </p>
          </section>
        </div>
      </Page.Boundary>
    </main>
  )
}
