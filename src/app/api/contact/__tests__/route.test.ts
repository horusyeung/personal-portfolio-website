// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CONTACT_SEND_ERROR } from '@/lib/contact'

const { send, checkBotId } = vi.hoisted(() => ({ send: vi.fn(), checkBotId: vi.fn() }))

vi.mock('resend', () => ({
  Resend: class {
    emails = { send }
  },
}))
vi.mock('botid/server', () => ({ checkBotId }))

import { POST } from '@/app/api/contact/route'

const valid = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello there' }

const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  )

beforeEach(() => {
  send.mockReset().mockResolvedValue({ data: { id: 'email_1' }, error: null })
  checkBotId.mockReset().mockResolvedValue({ isBot: false })
  vi.stubEnv('RESEND_API_KEY', 're_test')
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('POST /api/contact', () => {
  it('sends a valid message and returns only success', async () => {
    const res = await post(valid)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true })
    expect(send).toHaveBeenCalledWith({
      from: 'Portfolio Contact <contact@horusyeung.com>',
      to: 'horusyeungg@gmail.com',
      subject: 'Portfolio Contact from Ada Lovelace',
      replyTo: 'ada@example.com',
      text: 'From: Ada Lovelace (ada@example.com)\n\nHello there',
    })
  })

  it('trims input and keeps the name on one line', async () => {
    await post({ name: ' Ada\r\nBcc: x@evil.test ', email: ' ada@example.com ', message: ' Hi ' })

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: 'Portfolio Contact from Ada Bcc: x@evil.test',
        replyTo: 'ada@example.com',
        text: 'From: Ada Bcc: x@evil.test (ada@example.com)\n\nHi',
      }),
    )
  })

  it('rejects bots with 403', async () => {
    checkBotId.mockResolvedValue({ isBot: true })
    const res = await post(valid)

    expect(res.status).toBe(403)
    expect(send).not.toHaveBeenCalled()
  })

  it('fails open when the BotID check itself errors', async () => {
    checkBotId.mockRejectedValue(new Error('VERCEL_OIDC_TOKEN is not set'))
    const res = await post(valid)

    expect(res.status).toBe(200)
    expect(send).toHaveBeenCalledOnce()
  })

  it('rejects oversized bodies with 413', async () => {
    const declared = await post(valid, { 'content-length': '20000' })
    const actual = await post({ ...valid, message: 'x'.repeat(10_001) })

    expect(declared.status).toBe(413)
    expect(actual.status).toBe(413)
    expect(send).not.toHaveBeenCalled()
  })

  it.each([
    ['malformed JSON', '{"name":'],
    ['null', 'null'],
    ['an array', '[]'],
    ['a non-string field', { ...valid, email: ['a@example.com', 'b@example.com'] }],
    ['a missing field', { name: 'Ada', email: 'ada@example.com' }],
  ])('rejects %s with 400', async (_label, body) => {
    const res = await post(body)

    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it('pretends success for a filled honeypot without sending', async () => {
    const res = await post({ ...valid, website: 'https://spam.example' })

    expect(res.status).toBe(200)
    expect(send).not.toHaveBeenCalled()
  })

  it.each([
    ['whitespace-only name', { name: '   ' }, 'name'],
    ['invalid email', { email: 'not-an-email' }, 'email'],
    ['email with a display name', { email: 'Ada <ada@example.com>' }, 'email'],
    ['several emails', { email: 'ada@example.com, eve@example.com' }, 'email'],
    ['name over 100 characters', { name: 'a'.repeat(101) }, 'name'],
    ['email over 254 characters', { email: `${'a'.repeat(243)}@example.com` }, 'email'],
    ['message over 5,000 characters', { message: 'a'.repeat(5001) }, 'message'],
  ])('returns a field error for %s', async (_label, override, field) => {
    const res = await post({ ...valid, ...override })

    expect(res.status).toBe(400)
    expect((await res.json()).fields).toHaveProperty(field)
    expect(send).not.toHaveBeenCalled()
  })

  it('accepts values exactly at the limits', async () => {
    const res = await post({
      name: 'a'.repeat(100),
      email: `${'a'.repeat(242)}@example.com`,
      message: 'a'.repeat(5000),
    })

    expect(res.status).toBe(200)
    expect(send).toHaveBeenCalledOnce()
  })

  it('returns 503 when the Resend key is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const res = await post(valid)

    expect(res.status).toBe(503)
    expect(send).not.toHaveBeenCalled()
  })

  it('hides provider errors behind a generic 502', async () => {
    send.mockResolvedValue({ data: null, error: { message: 'API key is invalid' } })
    const res = await post(valid)

    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ error: CONTACT_SEND_ERROR })
  })

  it('returns 502 when sending throws', async () => {
    send.mockRejectedValue(new Error('network down'))
    const res = await post(valid)

    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ error: CONTACT_SEND_ERROR })
  })
})
