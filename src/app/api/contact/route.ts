import { NextResponse } from 'next/server'
import { checkBotId } from 'botid/server'
import { Resend } from 'resend'
import {
  CONTACT_SEND_ERROR,
  HONEYPOT_FIELD,
  normalizeContact,
  validateContact,
} from '@/lib/contact'

const MAX_BODY_BYTES = 10_000
const FROM = 'Portfolio Contact <onboarding@resend.dev>'
const TO = 'horusyeungg@gmail.com'

async function isBot(): Promise<boolean> {
  try {
    // Real checks only on Vercel; local and CI builds have no BotID challenge
    // (see src/instrumentation-client.ts)
    const { isBot } = await checkBotId({
      developmentOptions: { isDevelopment: !process.env.VERCEL },
    })
    return isBot
  } catch (err) {
    // Fail open: a BotID outage or misconfiguration must not take the contact form down
    console.error('BotID check failed:', err)
    return false
  }
}

const invalidRequest = () => NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

export async function POST(request: Request) {
  if (await isBot()) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  const raw = declaredLength > MAX_BODY_BYTES ? '' : await request.text()
  if (declaredLength > MAX_BODY_BYTES || Buffer.byteLength(raw) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Message is too large.' }, { status: 413 })
  }

  let body: unknown
  try {
    body = JSON.parse(raw)
  } catch {
    return invalidRequest()
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return invalidRequest()

  const { name, email, message, [HONEYPOT_FIELD]: honeypot } = body as Record<string, unknown>
  if (typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return invalidRequest()
  }

  // Humans never see the honeypot; report success so bots have no reason to retry
  if (typeof honeypot === 'string' && honeypot.trim() !== '') {
    return NextResponse.json({ success: true })
  }

  const input = normalizeContact({ name, email, message })
  const fields = validateContact(input)
  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: 'Please check the highlighted fields.', fields },
      { status: 400 },
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return NextResponse.json({ error: CONTACT_SEND_ERROR }, { status: 503 })
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: FROM,
      to: TO,
      subject: `Portfolio Contact from ${input.name}`,
      replyTo: input.email,
      text: `From: ${input.name} (${input.email})\n\n${input.message}`,
    })
    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: CONTACT_SEND_ERROR }, { status: 502 })
    }
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: CONTACT_SEND_ERROR }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
