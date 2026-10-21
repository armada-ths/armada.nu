export type CookieInformationProps = { site: "web" | "photos" | "order" }

function RecaptchaInformation({ site }: { site: "web" | "photos" }) {
  const Heading = site === "photos" ? "h3" : "h2"
  return (
    <section className="space-y-3">
      <Heading className="text-xl font-semibold">
        Security checks: _GRECAPTCHA
      </Heading>
      <p>
        {site === "web"
          ? "Our contact form uses Google reCAPTCHA Enterprise to help prevent spam and automated submissions. It loads when you open the form."
          : "Photo uploads use Google reCAPTCHA Enterprise to help prevent automated uploads and abuse. It loads on supported mobile devices when an event is opened."}
      </p>
      <p>
        Google sets the third-party _GRECAPTCHA cookie to support its risk
        analysis. It contains a security identifier. The service also processes
        technical information about your browser and interaction with the site.
        Google controls the cookie expiry, which you can inspect in your
        browser&apos;s cookie settings.
      </p>
      <p>
        See Google&apos;s{" "}
        <a
          className="underline underline-offset-4"
          href="https://docs.cloud.google.com/recaptcha/docs/faq#does_fraud_defense_use_cookies">
          reCAPTCHA cookie information
        </a>{" "}
        and{" "}
        <a
          className="underline underline-offset-4"
          href="https://policies.google.com/privacy">
          privacy policy
        </a>
        .
      </p>
    </section>
  )
}

export function CookieInformation({ site }: CookieInformationProps) {
  const Heading = site === "photos" ? "h3" : "h2"
  return (
    <div className="space-y-8 leading-7">
      <p>
        Cookies are small pieces of information stored by your browser. We use
        the storage described here to provide access and protect the features
        you use.
      </p>
      {site === "order" ? (
        <section className="space-y-3">
          <Heading className="text-xl font-semibold">
            Access to the order form: _ea
          </Heading>
          <p>
            When you open a valid exhibitor access link, this website stores the
            access token in a first-party cookie named _ea. It keeps the order
            form available as you navigate or return to the website.
          </p>
          <p>
            The cookie expires seven days after it is set. It is restricted to
            this website, is sent over HTTPS in production, and cannot be read
            by JavaScript. Deleting or blocking it means you will need to open
            your access link again before placing an order.
          </p>
        </section>
      ) : (
        <RecaptchaInformation site={site} />
      )}
      {site === "photos" && (
        <section className="space-y-3">
          <Heading className="text-xl font-semibold">
            Upload limits: armada-photo-guest
          </Heading>
          <p>
            We store a randomly generated guest identifier in local storage on
            this website. This is browser storage rather than a cookie. The
            identifier is sent with event requests and uploads so the service
            can apply upload limits without requiring an account. The server
            stores an event-specific protected hash of it.
          </p>
          <p>
            The identifier has no automatic expiry and stays until you clear
            this website&apos;s browser data. Blocking this storage may prevent
            the photo service from working.
          </p>
        </section>
      )}
      <section className="space-y-3">
        <Heading className="text-xl font-semibold">
          Managing browser storage
        </Heading>
        <p>
          You can inspect, delete or block cookies and site data in your browser
          settings. Blocking the storage described above may stop the related
          form, access or upload features from working. For questions, contact{" "}
          <a className="underline underline-offset-4" href="mailto:a@armada.nu">
            a@armada.nu
          </a>
          .
        </p>
      </section>
    </div>
  )
}
