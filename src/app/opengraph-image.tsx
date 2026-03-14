import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Horus Yeung — Software Architect'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: 16,
          background: '#ffffff',
          color: '#0a0a0a',
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 32,
        }}
      >
        HY
      </div>
      <div
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          marginBottom: 16,
        }}
      >
        Horus Yeung
      </div>
      <div
        style={{
          fontSize: 28,
          color: '#a0a0b0',
          letterSpacing: '0.05em',
        }}
      >
        Software Architect & Team Lead
      </div>
      <div
        style={{
          fontSize: 18,
          color: '#606070',
          marginTop: 24,
        }}
      >
        horusyeung.com
      </div>
    </div>,
    { ...size },
  )
}
