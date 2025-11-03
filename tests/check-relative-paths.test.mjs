import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// このスクリプトは Next.js コンポーネント内でサイト内リンクが絶対パス（例: "/event"）になっていないかを検査し、相対パスへ統一するための安全網です。

const targetExtensions = new Set([".tsx", ".ts"]);
const projectRoot = process.cwd();
const findings = [];

const isTargetFile = (name) => {
  for (const ext of targetExtensions) {
    if (name.endsWith(ext)) {
      return true;
    }
  }
  return false;
};

const collectFiles = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath);
      continue;
    }
    if (!isTargetFile(entry.name)) continue;
    analyzeFile(fullPath);
  }
};

const invalidLinkPattern = /<Link[\s\S]*?href="\/(?!\/)/g;

const analyzeFile = (filePath) => {
  const content = readFileSync(filePath, "utf-8");
  const matches = content.matchAll(invalidLinkPattern);
  for (const match of matches) {
    const index = match.index ?? 0;
    const preceding = content.slice(0, index);
    const line = preceding.split("\n").length;
    findings.push({ filePath, line });
  }
};

collectFiles(join(projectRoot, "app"));

if (findings.length > 0) {
  console.error("次のファイルで絶対パスの Link が検出されました。相対パスへ修正してください。");
  for (const finding of findings) {
    console.error(`- ${finding.filePath.replace(`${projectRoot}/`, "")}:${finding.line}`);
  }
  process.exit(1);
}

console.log("Link の href はすべて相対パスです。");
