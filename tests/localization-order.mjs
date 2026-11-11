import assert from "node:assert/strict"
import process from "node:process"
import { createServer } from "node:http"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { readFile, mkdir } from "node:fs/promises"
import { setTimeout as delay } from "node:timers/promises"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { chromium } from "playwright"
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const en = JSON.parse(
  await readFile(
    path.join(root, "apps/order/src/i18n/messages/en.json"),
    "utf8"
  )
)
const sv = JSON.parse(
  await readFile(
    path.join(root, "apps/order/src/i18n/messages/sv.json"),
    "utf8"
  )
)
let storage = "fail",
  closed = false,
  app,
  browser,
  logs = ""
const delivered = []
const saved = new Map()
const attempts = []
const categories = [{ id: 1, name: "Drinks", nameSv: "Dryck", sortOrder: 0 }]
const items = [
  {
    id: 1,
    categoryId: 1,
    name: "Coffee",
    nameSv: "Kaffe",
    description: "Fresh coffee",
    descriptionSv: "Nybryggt kaffe",
    sortOrder: 0,
    soldOut: false
  }
]
const cms = createServer(async (request, response) => {
  response.setHeader("Content-Type", "application/json")
  if (request.url === "/api/v1/lounge-orders/availability") {
    response.end(JSON.stringify({ open: !closed }))
    return
  }
  if (request.url?.startsWith("/api/v1/exhibitors?")) {
    response.end(JSON.stringify([{ id: 1, name: "Example AB", tier: "Gold" }]))
    return
  }
  if (request.url === "/api/v1/lounge-items") {
    response.end(JSON.stringify(items))
    return
  }
  if (request.url === "/api/v1/lounge-catalogue") {
    response.end(JSON.stringify({ revision: 0, items, categories }))
    return
  }
  if (request.url === "/api/v1/lounge-categories") {
    response.end(JSON.stringify(categories))
    return
  }
  if (request.url === "/api/v1/lounge-orders/submit") {
    assert.equal(request.headers.authorization, "Bearer fixture-test-service")
    let body = ""
    for await (const chunk of request) body += chunk
    const input = JSON.parse(body)
    attempts.push(input)
    if (!saved.has(input.idempotencyKey))
      saved.set(input.idempotencyKey, {
        id: 42,
        companyName: "Example AB",
        isTest: true,
        status: "pending",
        deliveryStatus: "pending",
        lines: [
          {
            itemId: 1,
            categoryId: 1,
            itemName: "Coffee",
            categoryName: "Drinks",
            quantity: 1
          }
        ]
      })
    if (storage === "fail") {
      response.statusCode = 503
      response.end(JSON.stringify({ errorCode: "submission_failed" }))
      return
    }
    response.end(JSON.stringify(saved.get(input.idempotencyKey)))
    return
  }
  if (request.url === "/api/v1/lounge-orders/42/claim") {
    const order = [...saved.values()][0]
    response.end(
      JSON.stringify({ claimed: true, claimToken: "fixture-claim", order })
    )
    return
  }
  if (request.url === "/api/v1/lounge-orders/42/delivery") {
    let body = ""
    for await (const chunk of request) body += chunk
    const outcome = JSON.parse(body)
    const order = [...saved.values()][0]
    order.deliveryStatus = outcome.status
    response.end(JSON.stringify({ success: true }))
    return
  }
  if (request.url === "/__slack") {
    let body = ""
    for await (const chunk of request) body += chunk
    delivered.push(JSON.parse(body))
    response.statusCode = 503
    response.end("{}")
    return
  }
  response.statusCode = 404
  response.end("{}")
})
const origin = "http://127.0.0.1:18002"
try {
  cms.listen(19080, "127.0.0.1")
  await once(cms, "listening")
  app = spawn(
    process.execPath,
    [
      "--import",
      pathToFileURL(path.join(root, "tests/order-fetch-fixture.mjs")).href,
      path.join(root, "node_modules/next/dist/bin/next"),
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      "18002"
    ],
    {
      cwd: path.join(root, "apps/order"),
      env: {
        ...process.env,
        NEXT_PUBLIC_API_URL: "http://127.0.0.1:19080",
        ORDER_FIXTURE_URL: "http://127.0.0.1:19080",
        EXPO_ACCESS_TOKEN: "local-order-fixture",
        LOUNGE_ORDER_TEST_SUBMISSION_SECRET: "fixture-test-service",
        SLACK_ORDER_TEST_HOOK_URL:
          "https://hooks.slack.com/services/local-fixture",
        VERCEL_ENV: "preview",
        NEXT_TELEMETRY_DISABLED: "1"
      },
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    }
  )
  app.stdout.on("data", data => (logs += data))
  app.stderr.on("data", data => (logs += data))
  for (let attempt = 0; attempt < 100; attempt++) {
    if (app.exitCode !== null)
      throw new Error("Order fixture server exited during startup")
    try {
      if ((await fetch(origin + "/robots.txt")).ok) break
    } catch {
      /* Await startup. */
    }
    await delay(200)
  }
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  })
  const page = await context.newPage(),
    errors = []
  page.on("pageerror", error => errors.push(error.message))
  await page.goto(origin + "/sv?access=local-order-fixture&source=test#cart")
  assert.equal(new URL(page.url()).pathname, "/sv")
  assert.equal(new URL(page.url()).search, "?source=test")
  assert.equal(new URL(page.url()).hash, "#cart")
  assert.equal(
    await page.locator('meta[property="og:locale"]').getAttribute("content"),
    "sv_SE"
  )
  const cookie = (await context.cookies()).find(cookie => cookie.name === "_ea")
  assert.equal(cookie?.httpOnly, true)
  await page
    .getByRole("button", { name: sv.Order.send, exact: true })
    .isDisabled()
  await page.getByRole("heading", { name: "Dryck", exact: true }).waitFor()
  await page.getByRole("button", { name: sv.Common.switchLanguage }).click()
  await page.getByRole("heading", { name: "Drinks", exact: true }).waitFor()
  await page.getByRole("button", { name: en.Common.switchLanguage }).click()
  await page
    .getByRole("combobox", { name: sv.Order.companyLabel, exact: true })
    .fill("Example AB")
  await page.getByRole("option", { name: "Example AB", exact: true }).click()
  await page
    .getByRole("button", { name: sv.Order.controls.increase, exact: true })
    .first()
    .click()
  await page.getByRole("button", { name: sv.Common.switchLanguage }).click()
  await page.waitForURL("**/en?source=test#cart")
  await page
    .locator('meta[property="og:locale"][content="en_GB"]')
    .waitFor({ state: "attached" })
  assert.equal(
    await page.locator('meta[property="og:locale"]').getAttribute("content"),
    "en_GB"
  )
  assert.equal(
    await page
      .getByRole("combobox", { name: en.Order.companyLabel, exact: true })
      .inputValue(),
    "Example AB"
  )
  assert.equal(
    await page
      .getByLabel(en.Order.controls.quantity, { exact: true })
      .first()
      .inputValue(),
    "1"
  )
  await page.getByRole("button", { name: en.Order.send, exact: true }).click()
  await page
    .getByText(en.OrderErrors.submission_failed, { exact: true })
    .waitFor()
  await page.getByRole("button", { name: en.Common.switchLanguage }).click()
  await page.waitForURL("**/sv?source=test#cart")
  await page
    .getByText(sv.OrderErrors.submission_failed, { exact: true })
    .waitFor()
  await page.getByText(sv.Order.pendingSubmission, { exact: true }).waitFor()
  assert.equal(saved.size, 1)
  closed = true
  await page.reload()
  await page.getByText(sv.Order.pendingSubmission, { exact: true }).waitFor()
  storage = "ok"
  await page.getByRole("button", { name: sv.Order.send, exact: true }).click()
  await page
    .getByRole("heading", { name: sv.Order.submittedHeading, exact: true })
    .waitFor()
  assert.equal(delivered.length, 1)
  assert.match(delivered[0].text, /Order #42 .* Example AB:/)
  assert.match(delivered[0].text, /- Coffee x 1/)
  assert.equal(saved.size, 1)
  assert.equal([...saved.values()][0].deliveryStatus, "failed")
  assert.equal(attempts[0].idempotencyKey, attempts[1].idempotencyKey)
  await page.getByText("Beställningsnummer: #42", { exact: true }).waitFor()
  closed = true
  await page.goto(origin + "/sv")
  await page.getByText(sv.OrderErrors.orders_closed, { exact: true }).waitFor()
  await page.getByRole("button", { name: sv.Common.switchLanguage }).click()
  await page.waitForURL("**/en")
  await page.getByText(en.OrderErrors.orders_closed, { exact: true }).waitFor()
  const anonymous = await browser.newContext()
  const denied = await anonymous.newPage()
  await denied.goto(origin + "/sv")
  await denied
    .getByText(sv.OrderErrors.access_required, { exact: true })
    .waitFor()
  assert.equal(
    await denied.locator('a[href="https://armada.nu/sv"]').count(),
    1
  )
  await mkdir(path.join(root, "output/playwright"), { recursive: true })
  await denied.screenshot({
    path: path.join(root, "output/playwright/order-swedish-access.png"),
    fullPage: true
  })
  assert.deepEqual(errors, [])
  console.log(
    "PASS: localized categories/access, idempotency after language change and reload, persisted acceptance despite failed Slack, closed and denied states"
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
