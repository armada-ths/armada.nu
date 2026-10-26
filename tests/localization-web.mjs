import process from "node:process"
import assert from "node:assert/strict"
import { createServer } from "node:http"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { mkdir, readFile } from "node:fs/promises"
import { setTimeout as delay } from "node:timers/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { chromium } from "playwright"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const english = JSON.parse(
  await readFile(path.join(root, "apps/web/src/i18n/messages/en.json"), "utf8")
)
const fixtures = {
  dates: {
    fair: {
      description: "Fair description",
      descriptionSv: "Mässbeskrivning",
      days: ["2099-11-01", "2099-11-02"]
    },
    ir: { start: "2099-01-01", end: "2099-02-01", acceptance: "2099-03-01" },
    fr: { start: "2099-04-01", end: "2099-05-01" },
    events: { start: "2099-11-01" }
  },
  featureflags: [],
  highlightcards: [
    {
      id: 1,
      title: "English highlight",
      titleSv: "Svensk höjdpunkt",
      subtitle: "Original subtitle",
      subtitleSv: "  ",
      description: "English description",
      descriptionSv: "Svensk kortbeskrivning",
      linkText: "Read more",
      linkTextSv: "Läs vidare",
      linkUrl: "/about"
    }
  ],
  recruitment: {
    name: "Recruitment",
    nameSv: "Rekrytering",
    start_date: "2020-01-01",
    end_date: "2099-11-01",
    link: "https://example.invalid/apply",
    groupNamesSv: { Engineering: "Teknik" },
    groups: {
      Engineering: [
        {
          name: "Developer",
          nameSv: "Utvecklare",
          description: "Build websites",
          descriptionSv: "Bygg webbplatser"
        }
      ]
    }
  },
  organization: [
    {
      name: "Engineering",
      nameSv: "Teknik",
      people: [
        {
          id: 1,
          name: "Example Person",
          rank: "Project Group",
          role: "Developer",
          roleSv: "Utvecklare",
          email: "example@example.invalid",
          picture: "",
          linkedin_url: null
        }
      ]
    }
  ],
  blogposts: [
    {
      id: 1,
      userId: 1,
      title: "English article",
      titleSv: "Svensk artikel",
      text: "English article body",
      textSv: "Svensk artikeltext",
      author: "Example Person",
      createdAt: "2026-10-01"
    }
  ],
  events: [
    {
      id: 1,
      name: "English event",
      nameSv: "Svenskt event",
      description: "English event body",
      descriptionSv: "<p>Svensk eventtext</p>",
      location: "Original location",
      locationSv: "Svensk plats",
      openTo: "All students",
      openToSv: "Alla studenter",
      food: "English food",
      foodSv: "Svensk mat",
      fee: "Free",
      feeSv: "Gratis",
      eventStart: "2099-11-01T12:00:00+01:00",
      eventEnd: "2099-11-01T13:00:00+01:00",
      registrationRequired: false,
      imageUrl: ""
    }
  ],
  exhibitors: [
    {
      id: 1,
      name: "Example AB",
      type: "Company",
      tier: "Gold",
      about: "",
      aboutSv: "Svensk företagsbeskrivning",
      fairLocation: "booth1",
      climateCompensation: false,
      flyer: "",
      industries: [{ id: 1, name: "Engineering", nameSv: "Teknikbransch" }],
      programs: [],
      employments: []
    }
  ],
  industries: [{ id: 1, name: "Engineering", nameSv: "Teknikbransch" }],
  programs: [],
  employments: [],
  "timeline-entries": [
    {
      id: 1,
      title: "English milestone",
      titleSv: "Svensk milstolpe",
      body: "English history body",
      bodySv: "Svensk historietext",
      eraId: 1,
      eraTitle: "English era",
      eraTitleSv: "Svensk era",
      sortOrder: 1
    }
  ]
}
const cms = createServer((request, response) => {
  const url = new URL(request.url, "http://localhost")
  const key = url.pathname.replace("/api/v1/", "")
  let data = fixtures[key]
  if (key === "blogposts/1") data = fixtures.blogposts[0]
  response.setHeader("Content-Type", "application/json")
  response.setHeader("Access-Control-Allow-Origin", "*")
  if (data === undefined) {
    response.statusCode = 404
    response.end(JSON.stringify({ error: "Unknown fixture route " + key }))
    return
  }
  response.end(JSON.stringify(data))
})
const origin = "http://127.0.0.1:8000"
let app,
  browser,
  logs = ""
async function ready() {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(origin + "/robots.txt")).ok) return
    } catch {
      /* The server may still be starting. */
    }
    await delay(200)
  }
  throw new Error("Next server did not start: " + logs)
}
try {
  cms.listen(19080, "127.0.0.1")
  await once(cms, "listening")
  app = spawn(
    process.execPath,
    [
      path.join(root, "node_modules/next/dist/bin/next"),
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      "8000"
    ],
    {
      cwd: path.join(root, "apps/web"),
      env: {
        ...process.env,
        NEXT_PUBLIC_API_URL: "http://127.0.0.1:19080",
        NEXT_TELEMETRY_DISABLED: "1"
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    }
  )
  app.stdout.on("data", data => (logs += data))
  app.stderr.on("data", data => (logs += data))
  await ready()
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    locale: "sv-SE",
    viewport: { width: 1280, height: 900 }
  })
  const page = await context.newPage(),
    errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(origin + "/")
  assert.equal(new URL(page.url()).pathname, "/sv")
  await page.getByText("Svensk höjdpunkt", { exact: true }).waitFor()
  await page.getByRole("heading", { name: /Original subtitle/ }).waitFor()
  assert.equal(
    await page
      .getByRole("link", { name: "Läs vidare", exact: true })
      .getAttribute("href"),
    "/sv/about"
  )
  assert.equal(await page.locator("html").getAttribute("lang"), "sv")
  assert.equal(await page.locator('a[href*="/sv/sv"]').count(), 0)
  for (const [route, phrase] of [
    ["/about/team", "Utvecklare"],
    ["/about/history", "Svensk historietext"],
    ["/blog/1", "Svensk artikeltext"],
    ["/student/recruitment", "Utvecklare"]
  ]) {
    await page.goto(origin + "/sv" + route)
    await page.getByText(phrase, { exact: true }).first().waitFor()
    if (route === "/student/recruitment") {
      await page
        .getByRole("button", { name: "Utvecklare", exact: true })
        .click()
      await page.getByText("Bygg webbplatser", { exact: true }).waitFor()
    }
  }
  await page.getByRole("button", { name: "Byt språk till engelska" }).click()
  await page.waitForURL("**/en/student/recruitment")
  await page.getByText("Build websites", { exact: true }).waitFor()
  await page.goto(origin + "/en/student/exhibitors")
  await page.getByPlaceholder("Search by company name").fill("Example")
  await page
    .getByRole("button", { name: english.Common.switchLanguage })
    .click()
  await page.waitForURL("**/sv/student/exhibitors")
  assert.equal(
    await page
      .locator("input[type=search],input[placeholder]")
      .first()
      .inputValue(),
    "Example"
  )
  await page.goto(origin + "/sv/student/events?id=1#details")
  await page
    .getByRole("dialog")
    .getByText("Svensk eventtext", { exact: true })
    .waitFor()
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Byt språk till engelska" })
    .click()
  await page.waitForURL("**/en/student/events?id=1#details")
  await page
    .getByRole("dialog")
    .getByText("English event body", { exact: true })
    .waitFor()
  await page.goto(origin + "/sv/student/exhibitors?id=1")
  await page
    .getByRole("dialog")
    .getByText("Svensk företagsbeskrivning", { exact: true })
    .waitFor()
  await page
    .getByRole("dialog")
    .getByText("Teknikbransch", { exact: true })
    .waitFor()
  await page.goto(origin + "/en/student/recruitment?source=i18n#signup")
  await page
    .locator("#recruitment-signup-email")
    .fill("fixture@example.invalid")
  await page.locator("#recruitment-signup-first-name").fill("Example")
  await page
    .getByRole("button", { name: english.Common.switchLanguage })
    .click()
  await page.waitForURL("**/sv/student/recruitment?source=i18n#signup")
  assert.equal(
    await page.locator("#recruitment-signup-email").inputValue(),
    "fixture@example.invalid"
  )
  assert.equal(
    await page.locator("#recruitment-signup-first-name").inputValue(),
    "Example"
  )
  await page.goto(origin + "/en/exhibitor")
  await page
    .getByRole("button", {
      name: english.contactSalesText.trigger,
      exact: true
    })
    .click()
  await page.locator("#name").fill("Example Person")
  await page.locator("#email").fill("fixture@example.invalid")
  await page.locator("#message").fill("A preserved contact message")
  await page
    .getByRole("button", { name: english.Common.switchLanguage })
    .click()
  await page.waitForURL("**/sv/exhibitor")
  assert.equal(await page.locator("#name").inputValue(), "Example Person")
  assert.equal(
    await page.locator("#message").inputValue(),
    "A preserved contact message"
  )
  await page.goto(origin + "/sv/missing-page")
  await page.getByRole("heading", { name: "Sidan hittades inte" }).waitFor()
  await page.goto(origin + "/sv")
  await delay(1200)
  await mkdir(path.join(root, "output/playwright"), { recursive: true })
  await page.screenshot({
    path: path.join(root, "output/playwright/web-swedish.png"),
    fullPage: true
  })
  assert.deepEqual(errors, [])
  console.log(
    "PASS: CMS Swedish fields, per-field fallback, localized links, modal/query/fragment and form preservation"
  )
} catch (error) {
  console.error(logs)
  throw error
} finally {
  if (browser) await browser.close()
  if (app && app.exitCode === null) {
    app.kill()
    await once(app, "exit")
  }
  cms.closeAllConnections()
  await new Promise(resolve => cms.close(resolve))
}
