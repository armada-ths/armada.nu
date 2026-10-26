import { Buffer } from "node:buffer"
import assert from "node:assert/strict"
import process from "node:process"
import { createServer } from "node:http"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { readFile, mkdir } from "node:fs/promises"
import { setTimeout as delay } from "node:timers/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { chromium, devices } from "playwright"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const en = JSON.parse(
  await readFile(
    path.join(root, "apps/photos/src/i18n/messages/en.json"),
    "utf8"
  )
)
const sv = JSON.parse(
  await readFile(
    path.join(root, "apps/photos/src/i18n/messages/sv.json"),
    "utf8"
  )
)
const image = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
  "base64"
)
let page,
  app,
  browser,
  logs = "",
  uploads = 0,
  releaseUpload,
  postBody = ""
const cms = createServer(async (request, response) => {
  response.setHeader("Access-Control-Allow-Origin", "*")
  response.setHeader("Access-Control-Allow-Headers", "*")
  response.setHeader("Access-Control-Expose-Headers", "X-Armada-Error-Code")
  if (request.method === "OPTIONS") {
    response.end()
    return
  }
  if (request.url.startsWith("/image")) {
    response.setHeader("Content-Type", "image/png")
    response.end(image)
    return
  }
  response.setHeader("Content-Type", "application/json")
  if (request.url.includes("invalid.token")) {
    response.statusCode = 410
    response.setHeader("X-Armada-Error-Code", "invalid_event_link")
    response.end("private English server error")
    return
  }
  if (request.url.includes("unknown.token")) {
    response.statusCode = 503
    response.setHeader("X-Armada-Error-Code", "future_error")
    response.end("private server detail")
    return
  }
  if (request.url.includes("/photos") && request.method === "POST") {
    uploads++
    for await (const chunk of request) postBody += chunk.toString()
    await new Promise(resolve => (releaseUpload = resolve))
    response.statusCode = 201
    response.end(JSON.stringify({ status: "pending" }))
    return
  }
  if (request.url.includes("/gallery")) {
    response.end(
      JSON.stringify({
        items: [1, 2].map(id => ({
          id,
          url: `http://127.0.0.1:19080/image-full-${id}.png`,
          thumbnail_url: `http://127.0.0.1:19080/image-thumb-${id}.png`,
          urls_expires_at: "2099-01-01T00:00:00Z",
          width: 1,
          height: 1,
          approved_at: "2026-10-26T10:00:00Z"
        })),
        next_cursor: ""
      })
    )
    return
  }
  if (request.url.startsWith("/api/v1/photo-events/access/")) {
    response.end(
      JSON.stringify({
        name: "Banquet fixture",
        nameSv: "Bankett på svenska",
        description: "Original description",
        descriptionSv: "  ",
        uploads_open: true,
        gallery_open: true,
        remaining: 25 - uploads
      })
    )
    return
  }
  response.statusCode = 404
  response.end("{}")
})
const origin = "http://127.0.0.1:8002"
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
      "8002"
    ],
    {
      cwd: path.join(root, "apps/photos"),
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    }
  )
  app.stdout.on("data", data => (logs += data))
  app.stderr.on("data", data => (logs += data))
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(origin + "/robots.txt")).ok) break
    } catch {
      /* Await startup. */
    }
    await delay(200)
  }
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ ...devices["iPhone 13"] })
  await context.route("https://**/*", route => route.abort())
  await context.addInitScript(() => {
    window.grecaptcha = {
      enterprise: {
        ready: callback => callback(),
        execute: async () => "local-verification"
      }
    }
  })
  page = await context.newPage()
  const errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(origin + "/sv/e/event.with.dots?source=test#selection")
  await page
    .getByRole("heading", { name: "Bankett på svenska", exact: true })
    .waitFor()
  await page.getByText("Original description", { exact: true }).waitFor()
  await page
    .getByRole("heading", {
      name: sv.PhotosStatic.shareYourPhotos,
      exact: true
    })
    .waitFor()
  await page.getByRole("checkbox").check()
  await page
    .getByLabel(sv.PhotosStatic.takePhotoWithCamera)
    .setInputFiles({ name: "camera.png", mimeType: "image/png", buffer: image })
  await page
    .getByAltText("Foto 1 redo att laddas upp", { exact: true })
    .waitFor()
  const preview = await page
    .getByAltText("Foto 1 redo att laddas upp", { exact: true })
    .getAttribute("src")
  await page.getByRole("button", { name: sv.Common.switchLanguage }).click()
  await page.waitForURL("**/en/e/event.with.dots?source=test#selection")
  await page
    .getByRole("heading", { name: "Banquet fixture", exact: true })
    .waitFor()
  assert.equal(await page.getByRole("checkbox").isChecked(), true)
  assert.equal(
    await page
      .getByAltText("Photo 1 ready to upload", { exact: true })
      .getAttribute("src"),
    preview
  )
  await page
    .getByRole("button", { name: "Upload photos (1)", exact: true })
    .click()
  for (let i = 0; i < 100 && !releaseUpload; i++) await delay(50)
  assert.equal(uploads, 1)
  assert.match(postBody, /camera.png/)
  assert.match(postBody, /local-verification/)
  await page.getByRole("button", { name: en.Common.switchLanguage }).click()
  await page.waitForURL("**/sv/e/event.with.dots?source=test#selection")
  assert.equal(uploads, 1)
  releaseUpload()
  releaseUpload = undefined
  await page.getByText(sv.Photos.awaiting, { exact: true }).waitFor()
  assert.equal(uploads, 1)
  await page
    .getByRole("button", { name: sv.PhotosStatic.gallery, exact: true })
    .click()
  await page.evaluate(() => window.scrollTo(0, 0))
  const thumb = page.getByAltText("Foto 1 från Bankett på svenska", {
    exact: true
  })
  await thumb.waitFor()
  assert.match(await thumb.getAttribute("src"), /image-thumb-1/)
  await thumb.click()
  let viewer = page.getByRole("dialog", { name: sv.PhotosStatic.photoViewer })
  assert.match(
    await viewer.getByRole("img").getAttribute("src"),
    /image-full-1/
  )
  await viewer.getByRole("button", { name: sv.PhotosStatic.nextPhoto }).click()
  assert.match(
    await viewer.getByRole("img").getAttribute("src"),
    /image-full-2/
  )
  await viewer.getByRole("button", { name: sv.Common.switchLanguage }).click()
  viewer = page.getByRole("dialog", { name: en.PhotosStatic.photoViewer })
  await viewer.waitFor()
  assert.match(
    await viewer.getByRole("img").getAttribute("src"),
    /image-full-2/
  )
  await viewer
    .getByRole("button", { name: en.PhotosStatic.close, exact: true })
    .click()
  await page
    .getByRole("button", { name: en.PhotosStatic.refreshGallery, exact: true })
    .waitFor()
  await page.goto(origin + "/sv/privacy")
  await page
    .getByRole("heading", {
      name: sv.PhotosStatic.photoPrivacyNotice,
      exact: true
    })
    .waitFor()
  assert.equal(await page.title(), sv.Photos.privacyTitle)
  await page.goto(origin + "/sv/e/invalid.token")
  await page
    .getByText(sv.PhotoErrors.invalid_event_link, { exact: true })
    .waitFor()
  await page.getByRole("button", { name: sv.Common.switchLanguage }).click()
  await page
    .getByText(en.PhotoErrors.invalid_event_link, { exact: true })
    .waitFor()
  await page.goto(origin + "/sv/e/unknown.token")
  await page.getByText(sv.PhotoErrors.unknown_error, { exact: true }).waitFor()
  assert.equal(await page.getByText("private server detail").count(), 0)
  const desktop = await browser.newContext({ locale: "sv-SE" }),
    desktopPage = await desktop.newPage()
  await desktop.route("https://**/*", route => route.abort())
  await desktopPage.goto(origin + "/e/event.with.dots")
  await desktopPage.waitForURL("**/sv/e/event.with.dots")
  await desktopPage
    .getByRole("heading", { name: sv.PhotosStatic.uploadFromYourPhone })
    .waitFor()
  assert.equal(await desktopPage.getByRole("checkbox").count(), 0)
  await mkdir(path.join(root, "output/playwright"), { recursive: true })
  await desktopPage.screenshot({
    path: path.join(root, "output/playwright/photos-swedish.png"),
    fullPage: true
  })
  assert.deepEqual(errors, [])
  console.log(
    "PASS: dotted-token routing, per-field CMS fallback, camera files and active upload preserved, full-quality viewer and selection preserved, privacy, error codes and desktop restriction"
  )
} catch (error) {
  console.error(logs)
  if (page) console.error(await page.locator("body").innerText())
  throw error
} finally {
  if (releaseUpload) releaseUpload()
  if (browser) await browser.close()
  if (app && app.exitCode === null) {
    app.kill()
    await once(app, "exit")
  }
  cms.closeAllConnections()
  await new Promise(resolve => cms.close(resolve))
}
