import assert from "node:assert/strict"
import process from "node:process"
import { createServer } from "node:http"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { readFile, mkdir } from "node:fs/promises"
import { setTimeout as delay } from "node:timers/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
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
let delivery = "fail",
  closed = false,
  app,
  browser,
  logs = ""
const delivered = []
const cms = createServer(async (request, response) => {
  response.setHeader("Content-Type", "application/json")
  if (request.url === "/api/v1/dates") {
    response.end(
      JSON.stringify({
        fair: {
          days: closed
            ? ["2020-11-01", "2020-11-02"]
            : ["2099-11-01", "2099-11-02"]
        }
      })
    )
    return
  }
  if (request.url === "/api/v1/exhibitors") {
    response.end(JSON.stringify([{ name: "Example AB" }]))
    return
  }
  if (request.url === "/__slack") {
    let body = ""
    for await (const chunk of request) body += chunk
    if (delivery === "fail") {
      response.statusCode = 503
      response.end("{}")
      return
    }
    delivered.push(JSON.parse(body))
    response.end("{}")
    return
  }
  response.statusCode = 404
  response.end("{}")
})
const origin = "http://127.0.0.1:8001"
try {
  cms.listen(19080, "127.0.0.1")
  await once(cms, "listening")
  app = spawn(
    process.execPath,
    [
      "--import",
      path.join(root, "tests/order-fetch-fixture.mjs"),
      path.join(root, "node_modules/next/dist/bin/next"),
      "start",
      "-H",
      "127.0.0.1",
      "-p",
      "8001"
    ],
    {
      cwd: path.join(root, "apps/order"),
      env: {
        ...process.env,
        NEXT_PUBLIC_API_URL: "http://127.0.0.1:19080",
        ORDER_FIXTURE_URL: "http://127.0.0.1:19080",
        EXPO_ACCESS_TOKEN: "local-order-fixture",
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
  const cookie = (await context.cookies()).find(cookie => cookie.name === "_ea")
  assert.equal(cookie?.httpOnly, true)
  await page.getByRole("button", { name: sv.Order.send, exact: true }).click()
  await page.getByText(sv.Order.emptyCompany, { exact: true }).waitFor()
  await page.getByRole("button", { name: sv.Common.switchLanguage }).click()
  await page.getByText(en.Order.emptyCompany, { exact: true }).waitFor()
  await page.getByRole("button", { name: en.Common.switchLanguage }).click()
  await page
    .getByRole("textbox", { name: sv.Order.companyLabel, exact: true })
    .fill("Example AB")
  await page.getByRole("button", { name: "Example AB", exact: true }).click()
  await page
    .getByRole("button", { name: sv.Order.controls.increase, exact: true })
    .first()
    .click()
  await page.getByRole("button", { name: sv.Common.switchLanguage }).click()
  await page.waitForURL("**/en?source=test#cart")
  assert.equal(
    await page
      .getByRole("textbox", { name: en.Order.companyLabel, exact: true })
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
    .getByText(en.OrderErrors.delivery_failed, { exact: true })
    .waitFor()
  await page.getByRole("button", { name: en.Common.switchLanguage }).click()
  await page.waitForURL("**/sv?source=test#cart")
  await page
    .getByText(sv.OrderErrors.delivery_failed, { exact: true })
    .waitFor()
  assert.equal(
    await page
      .getByLabel(sv.Order.controls.quantity, { exact: true })
      .first()
      .inputValue(),
    "1"
  )
  delivery = "ok"
  await page.getByRole("button", { name: sv.Order.send, exact: true }).click()
  await page
    .getByRole("heading", { name: sv.Order.submittedHeading, exact: true })
    .waitFor()
  assert.equal(delivered.length, 1)
  assert.match(delivered[0].text, /Order for Example AB:/)
  assert.match(delivered[0].text, /- Sandwich \(Turkey\) x1/)
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
    "PASS: localized access, cart preservation, reactive errors, real server action with mocked delivery, closed and denied states"
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
