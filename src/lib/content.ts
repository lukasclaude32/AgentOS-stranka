import { SiteContent } from "./types";
import { defaultContent } from "./default-content";
import fs from "fs/promises";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "content.json");

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    return { ...defaultContent, ...JSON.parse(raw) };
  } catch {
    return defaultContent;
  }
}

export async function saveContent(content: SiteContent): Promise<void> {
  await fs.writeFile(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}
