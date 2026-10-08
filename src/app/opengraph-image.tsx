import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { JOB_TITLE, SITE_DOMAIN, SITE_TITLE } from '@/content/site'

export const alt = SITE_TITLE
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const logoData = await readFile(join(process.cwd(), 'public/favicon.svg'), 'base64')
const logoSrc = `data:image/svg+xml;base64,${logoData}`

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        // A social image has one fixed appearance. Use the site's light palette so it stays
        // legible in both light and dark LinkedIn feeds, without loading the client theme.
        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f7 100%)',
        color: '#1d1d1f',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: 72,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -220,
          right: -100,
          width: 650,
          height: 650,
          borderRadius: 325,
          background:
            'radial-gradient(circle, rgba(41, 151, 255, 0.2) 0%, rgba(41, 151, 255, 0) 70%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <img src={logoSrc} alt='HY' width={88} height={88} />
        <div style={{ fontSize: 20, color: '#6e6e73', letterSpacing: '0.08em' }}>
          DEVELOPER PORTFOLIO
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
          }}
        >
          Horus Yeung
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.3, color: '#6e6e73', marginTop: 20 }}>
          {JOB_TITLE}
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #d2d2d7',
          paddingTop: 28,
        }}
      >
        <div style={{ fontSize: 28, color: '#0071e3', fontWeight: 600 }}>{SITE_DOMAIN}</div>
        <div style={{ fontSize: 24, color: '#6e6e73' }}>Web · Mobile · Systems</div>
      </div>
    </div>,
    { ...size },
  )
}
