// Run with: pnpm exec node tests/cms-isr.mjs
// Exercise the real blog fetcher in a minimal production Next.js app.
// Only its revalidation interval is shortened from 24 hours to one second.
import assert from "node:assert/strict"
import process from "node:process"
import { spawn } from "node:child_process"
import { once } from "node:events"
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  symlink,
  rm
} from "node:fs/promises"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { setTimeout as delay } from "node:timers/promises"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const fixture = await mkdtemp(path.join(tmpdir(), "armada-cms-isr-"))
let mode = "ok"
let title = "Original cached content"
let requests = 0
let app
let logs = ""
const cms = createServer((request, response) => {
  requests++
  if (mode === "network") return request.socket.destroy()
  response.setHeader("Content-Type", "application/json")
  response.statusCode = mode === "http" ? 503 : 200
  response.end(
    mode === "json"
      ? "invalid JSON"
      : JSON.stringify(
          mode === "shape"
            ? { error: "invalid payload" }
            : [
                {
                  id: 1,
                  userId: 1,
                  title,
                  text: "Body",
                  author: "Armada",
                  createdAt: "2026-10-13"
                }
              ]
        )
  )
})

function next(args, env) {
  const child = spawn(
    process.execPath,
    [path.join(root, "node_modules/next/dist/bin/next"), ...args],
    {
      cwd: fixture,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", ...env },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    }
  )
  child.stdout.on("data", data => {
    logs += data
  })
  child.stderr.on("data", data => {
    logs += data
  })
  return child
}

async function poll(check, label) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await check()) return
    await delay(200)
  }
  throw new Error(`Timed out: ${label}`)
}

try {
  cms.listen(0, "127.0.0.1")
  await once(cms, "listening")
  const apiUrl = `http://127.0.0.1:${cms.address().port}`
  await symlink(
    path.join(root, "apps/web/node_modules"),
    path.join(fixture, "node_modules"),
    "junction"
  )
  await mkdir(path.join(fixture, "app"))
  const src = path.join(root, "apps/web/src").replaceAll("\\", "/")
  await writeFile(
    path.join(fixture, "package.json"),
    JSON.stringify({ private: true })
  )
  await writeFile(
    path.join(fixture, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "esnext"],
        jsx: "react-jsx",
        module: "esnext",
        moduleResolution: "bundler",
        esModuleInterop: true,
        skipLibCheck: true,
        paths: { "@/*": [`${src}/*`] }
      }
    })
  )
  await writeFile(
    path.join(fixture, "next.config.mjs"),
    `export default {
  experimental: { externalDir: true },
  webpack(config) {
    config.resolve.alias["@"] = ${JSON.stringify(src)}
    config.resolve.modules = [${JSON.stringify(path.join(root, "apps/web/node_modules"))}, ${JSON.stringify(path.join(root, "node_modules"))}, "node_modules"]
    return config
  }
}`
  )
  const hook = await readFile(
    path.join(src, "components/shared/hooks/api/useBlogPosts.tsx"),
    "utf8"
  )
  await writeFile(
    path.join(fixture, "fetchPosts.tsx"),
    hook.replaceAll("86400", "1")
  )
  await writeFile(
    path.join(fixture, "app/layout.tsx"),
    "export default function Layout({children}) { return <html><body>{children}</body></html> }"
  )
  await writeFile(
    path.join(fixture, "app/page.tsx"),
    `import { fetchBlogPosts } from "../fetchPosts"
export const revalidate = 1
export default async function Page() {
  const posts = await fetchBlogPosts()
  return <main>{posts.map(post => <h1 key={post.id}>{post.title}</h1>)}</main>
}`
  )
  const env = { NEXT_PUBLIC_API_URL: apiUrl }
  const build = next(["build", "--webpack"], env)
  const [code] = await once(build, "exit")
  assert.equal(code, 0, logs)
  logs = ""
  app = next(["start", "-p", "0", "-H", "127.0.0.1"], env)
  await poll(() => /http:\/\/127.0.0.1:\d+/.test(logs), "server startup")
  const url = logs.match(/http:\/\/127.0.0.1:\d+/)[0]
  const getPage = async () => {
    const response = await fetch(url)
    assert.equal(response.status, 200)
    return response.text()
  }
  assert.match(await getPage(), /Original cached content/)
  for (const failure of ["http", "json", "shape", "network"]) {
    mode = failure
    await delay(1200)
    const before = requests
    const logStart = logs.length
    assert.match(await getPage(), /Original cached content/)
    await poll(async () => {
      assert.match(await getPage(), /Original cached content/)
      return (
        requests > before &&
        /Failed to fetch|Invalid CMS response|SyntaxError|fetch failed/.test(
          logs.slice(logStart)
        )
      )
    }, `${failure} regeneration failure`)
    assert.match(await getPage(), /Original cached content/)
    console.log(`PASS: ${failure} regeneration retains cached page`)
  }
  mode = "ok"
  title = "Recovered CMS content"
  await poll(
    async () => (await getPage()).includes(title),
    "successful recovery"
  )
  console.log("PASS: successful CMS recovery updates the page")
} catch (error) {
  console.error(logs)
  throw error
} finally {
  if (app && app.exitCode === null) {
    app.kill()
    await once(app, "exit")
  }
  cms.closeAllConnections()
  await new Promise(resolve => cms.close(resolve))
  // Remove the dependency junction first, then only this test's temp directory.
  await rm(path.join(fixture, "node_modules"), { force: true })
  await rm(fixture, { recursive: true, force: true })
}
