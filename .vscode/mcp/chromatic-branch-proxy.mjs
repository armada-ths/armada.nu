import { execFileSync, spawn } from "node:child_process";
import process from "node:process";

function sanitizeBranchName(branchName) {
    return branchName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getCurrentBranch() {
    const branch = process.env.CHROMATIC_MCP_BRANCH?.trim();
    if (branch) {
        return branch;
    }

    return execFileSync("git", ["branch", "--show-current"], {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
    }).trim();
}

const branchName = getCurrentBranch();
if (!branchName) {
    console.error("Unable to determine the current git branch for Chromatic MCP.");
    process.exit(1);
}

const projectId = process.env.CHROMATIC_MCP_PROJECT_ID?.trim() ?? "6a03536f317199e55901df86";
const branchSlug = sanitizeBranchName(branchName);
const url = process.env.CHROMATIC_MCP_URL?.trim() || `https://${branchSlug}--${projectId}.chromatic.com/mcp`;
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";

const child = spawn(
    npxCommand,
    ["-y", "mcp-remote@0.1.38", url, "--transport", "http-only", "--silent"],
    {
        cwd: process.cwd(),
        env: process.env,
        stdio: ["pipe", "pipe", "pipe"],
        shell: process.platform === "win32",
    },
);

process.stdin.pipe(child.stdin);
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.stdin.on("error", (error) => {
    if (error.code !== "EPIPE") {
        console.error(`Chromatic MCP stdin error: ${error.message}`);
    }
});

child.on("exit", (code, signal) => {
    if (signal) {
        process.kill(process.pid, signal);
        return;
    }

    process.exit(code ?? 1);
});

child.on("error", (error) => {
    console.error(`Failed to start the Chromatic MCP proxy: ${error.message}`);
    process.exit(1);
});
