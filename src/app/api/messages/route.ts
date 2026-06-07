import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export interface Message {
  id: string;
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const MESSAGES_PATH = path.join(process.cwd(), "messages.json");

async function getMessages(): Promise<Message[]> {
  try {
    const raw = await fs.readFile(MESSAGES_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveMessages(messages: Message[]): Promise<void> {
  await fs.writeFile(MESSAGES_PATH, JSON.stringify(messages, null, 2), "utf-8");
}

// GET — admin reads messages
export async function GET() {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const messages = await getMessages();
  return NextResponse.json(messages);
}

// POST — contact form submits a message (public)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, company, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const messages = await getMessages();
  const newMsg: Message = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: String(name).slice(0, 200),
    email: String(email).slice(0, 200),
    company: String(company || "").slice(0, 200),
    subject: String(subject || "").slice(0, 200),
    message: String(message).slice(0, 5000),
    createdAt: new Date().toISOString(),
    read: false,
  };

  messages.unshift(newMsg);
  // Keep max 500 messages
  if (messages.length > 500) messages.length = 500;
  await saveMessages(messages);

  return NextResponse.json({ ok: true, id: newMsg.id });
}

// PUT — admin marks messages as read / deletes
export async function PUT(req: NextRequest) {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, id } = body;
  const messages = await getMessages();

  if (action === "markRead" && id) {
    const msg = messages.find((m) => m.id === id);
    if (msg) msg.read = true;
  } else if (action === "markAllRead") {
    messages.forEach((m) => (m.read = true));
  } else if (action === "delete" && id) {
    const idx = messages.findIndex((m) => m.id === id);
    if (idx !== -1) messages.splice(idx, 1);
  }

  await saveMessages(messages);
  return NextResponse.json({ ok: true });
}
