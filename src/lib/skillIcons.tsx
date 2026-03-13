'use client'

import { type ComponentType } from 'react'
import { SvgIcon, type SvgIconProps } from '@mui/material'
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiNestjs,
  SiExpress,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiRabbitmq,
  SiRedis,
  SiDocker,
  SiGithubactions,
  SiJenkins,
  SiCypress,
  SiSelenium,
  SiPostman,
  SiClaude,
  SiN8N,
  SiPython,
  SiJira,
  SiCoderabbit,
} from 'react-icons/si'
import { type IconType } from 'react-icons'

// ── Custom SVG Icons for skills without Simple Icons ─────────────────────────

function RestApiIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2zM3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm1 2v14h16V5H4z' />
    </SvgIcon>
  )
}

function MicroservicesIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M12 2a3 3 0 013 3c0 .85-.36 1.62-.93 2.16l2.1 3.64A3 3 0 0121 14a3 3 0 01-5.83 1H8.83A3 3 0 013 14a3 3 0 014.83-2.36l2.1-3.48A2.99 2.99 0 019 5a3 3 0 013-3zm0 2a1 1 0 100 2 1 1 0 000-2zM6 13a1 1 0 100 2 1 1 0 000-2zm12 0a1 1 0 100 2 1 1 0 000-2z' />
    </SvgIcon>
  )
}

function ApiGatewayIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      {/* Three source boxes at top */}
      <path d='M2 3h5v4H2V3zm7.5 0h5v4h-5V3zm7.5 0h5v4h-5V3z' />
      {/* Central gateway box */}
      <path d='M8 10h8v4H8v-4z' />
      {/* Destination box at bottom */}
      <path d='M8 18h8v3H8v-3z' />
      {/* Connecting lines from top boxes to gateway (filled as thin rects) */}
      <path d='M4 7h1.5v3H4V7zm7.25 0h1.5v3h-1.5V7zm7.25 0h1.5v3h-1.5V7z' />
      {/* Connecting line from gateway to bottom */}
      <path d='M11.25 14h1.5v4h-1.5v-4z' />
    </SvgIcon>
  )
}

function CiCdIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M12 4V1L8 5l4 4V6a6 6 0 016 6 6 6 0 01-.74 2.9l1.46 1.46A8 8 0 0012 4zm0 16a6 6 0 01-6-6 6 6 0 01.74-2.9L5.28 9.64A8 8 0 0012 20v3l4-4-4-4v5z' />
    </SvgIcon>
  )
}

function AwsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M6.763 10.036a4.556 4.556 0 00.087.87c.06.23.136.47.228.7a.485.485 0 01.074.243c0 .1-.065.2-.194.3l-.645.43a.48.48 0 01-.262.1c-.1 0-.2-.05-.3-.15a3.07 3.07 0 01-.36-.47 7.57 7.57 0 01-.31-.593c-.78.92-1.76 1.38-2.94 1.38-.84 0-1.51-.24-2.01-.72s-.75-1.12-.75-1.93c0-.85.3-1.54.9-2.07.6-.53 1.4-.79 2.41-.79.33 0 .68.03 1.04.07.37.05.74.12 1.13.21v-.73c0-.76-.16-1.3-.48-1.6-.32-.31-.87-.46-1.66-.46-.36 0-.72.04-1.1.13-.37.09-.74.2-1.1.34-.16.07-.28.12-.35.14a.606.606 0 01-.16.03c-.14 0-.21-.1-.21-.31v-.5c0-.16.02-.28.07-.35.05-.07.14-.14.28-.21.36-.18.79-.33 1.3-.45A6.07 6.07 0 015.08 4c1 0 1.74.23 2.22.68.47.45.71 1.14.71 2.06v2.71l-.25.586zm-4.06 1.52c.32 0 .66-.06 1.01-.18.35-.12.66-.34.92-.64.16-.19.28-.4.34-.64.06-.24.1-.53.1-.87v-.42c-.28-.07-.58-.12-.89-.16a7.73 7.73 0 00-.91-.06c-.66 0-1.14.13-1.46.39-.32.26-.47.63-.47 1.11 0 .45.12.79.35 1.01.23.23.56.34 1 .34l.01.02zM11.4 11.85c-.18 0-.3-.03-.38-.1-.08-.07-.15-.21-.21-.42L8.81 4.13a1.634 1.634 0 01-.08-.42c0-.17.08-.26.25-.26h1c.19 0 .32.03.39.1.08.07.14.21.2.42l1.4 5.51 1.3-5.51c.05-.22.11-.35.19-.42a.68.68 0 01.4-.1h.82c.19 0 .32.03.4.1.08.07.14.21.19.42l1.31 5.58 1.44-5.58c.06-.22.13-.35.2-.42.08-.07.21-.1.39-.1h.95c.17 0 .26.08.26.26 0 .05-.01.1-.02.17a1.624 1.624 0 01-.07.26l-2.01 7.2c-.06.22-.13.35-.21.42-.08.07-.21.1-.38.1h-.88c-.19 0-.32-.03-.4-.1-.08-.08-.14-.21-.19-.43l-1.29-5.37-1.28 5.37c-.05.22-.11.35-.19.43-.08.07-.22.1-.4.1h-.88l.01-.02zM21.69 12.11c-.51 0-1.02-.06-1.52-.18-.5-.12-.89-.26-1.15-.42-.17-.1-.28-.2-.32-.31a.776.776 0 01-.06-.3v-.52c0-.21.08-.31.23-.31.06 0 .12.01.18.03.06.02.15.07.25.12.34.15.71.27 1.1.36.4.09.78.13 1.18.13.62 0 1.1-.11 1.44-.33.33-.22.5-.54.5-.95 0-.28-.09-.51-.27-.69-.18-.18-.52-.34-1-.49l-1.45-.45c-.73-.23-1.27-.57-1.6-1.01a2.36 2.36 0 01-.49-1.43c0-.41.09-.77.27-1.08.18-.31.42-.58.73-.8.31-.22.66-.38 1.07-.5.41-.11.84-.17 1.3-.17.23 0 .47.01.71.04.24.03.47.07.69.12.21.06.42.12.62.19.2.07.35.14.46.22a.934.934 0 01.31.29c.06.1.09.22.09.37v.48c0 .21-.08.32-.23.32-.08 0-.21-.04-.38-.13a5.108 5.108 0 00-2.15-.43c-.56 0-1.01.09-1.33.27-.32.18-.48.46-.48.85 0 .28.1.52.29.71.2.19.56.38 1.08.54l1.42.44c.72.23 1.24.55 1.56.96.31.41.47.88.47 1.4 0 .42-.09.81-.26 1.15-.18.34-.42.64-.73.88-.31.25-.68.43-1.11.56-.44.14-.92.21-1.43.21z' />
      <path d='M22.03 17.33c-2.73 2.02-6.7 3.09-10.12 3.09-4.79 0-9.1-1.77-12.36-4.71-.26-.23-.03-.55.28-.37 3.52 2.05 7.87 3.28 12.37 3.28 3.03 0 6.36-.63 9.43-1.93.46-.2.85.3.4.64z' />
      <path d='M23.18 16.04c-.35-.45-2.31-.21-3.19-.11-.27.03-.31-.2-.07-.37 1.56-1.1 4.13-.78 4.43-.41.3.37-.08 2.93-1.55 4.16-.22.19-.44.09-.34-.16.33-.82 1.07-2.66.72-3.11z' />
    </SvgIcon>
  )
}

function PlaywrightIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      {/* Theater/drama mask representing Playwright testing framework */}
      <path d='M2 4c0 6.63 3.6 12 8 12s8-5.37 8-12H2zm4 3.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm4.5 5.5c-1.38 0-2.63-.56-3.54-1.46l1.06-1.06c.63.63 1.51 1.02 2.48 1.02s1.85-.39 2.48-1.02l1.06 1.06C13.13 12.44 11.88 13 10.5 13zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3z' />
      <path d='M18 7c0 5.52-2.61 10.2-6.36 11.74C13.11 19.55 14.5 20 16 20c4.4 0 8-5.37 8-12h-6v-.5c0 .17 0 .33-.01.5z' />
    </SvgIcon>
  )
}

function CursorIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23' />
    </SvgIcon>
  )
}

function AgileIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M12 6V1.5l-4.5 4.5L12 10.5V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H3c0 4.97 4.03 9 9 9s9-4.03 9-9-4.03-9-9-9z' />
    </SvgIcon>
  )
}

function ScrumIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox='0 0 24 24'>
      <path d='M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h4v4H7V7zm6 0h4v4h-4V7zm-6 6h4v4H7v-4z' />
    </SvgIcon>
  )
}

// ── Wrapper to make react-icons consistent with MUI SvgIcon usage ────────────

function wrapReactIcon(
  Icon: IconType,
): ComponentType<{ size?: number; style?: React.CSSProperties }> {
  const Wrapped = ({ size = 20, style }: { size?: number; style?: React.CSSProperties }) => (
    <Icon size={size} style={{ display: 'block', ...style }} />
  )
  Wrapped.displayName = Icon.name || 'WrappedIcon'
  return Wrapped
}

function wrapMuiIcon(
  Icon: ComponentType<SvgIconProps>,
): ComponentType<{ size?: number; style?: React.CSSProperties }> {
  const Wrapped = ({ size = 20, style }: { size?: number; style?: React.CSSProperties }) => (
    <Icon sx={{ fontSize: size }} style={style} />
  )
  Wrapped.displayName = 'WrappedMuiIcon'
  return Wrapped
}

// ── Skill Data ───────────────────────────────────────────────────────────────

export interface SkillItem {
  name: string
  icon: ComponentType<{ size?: number; style?: React.CSSProperties }>
  brandColor?: string
}

export interface SkillCategory {
  title: string
  skills: SkillItem[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming Languages',
    skills: [
      { name: 'TypeScript', icon: wrapReactIcon(SiTypescript), brandColor: '#3178C6' },
      { name: 'JavaScript', icon: wrapReactIcon(SiJavascript), brandColor: '#F7DF1E' },
      { name: 'Python', icon: wrapReactIcon(SiPython), brandColor: '#3776AB' },
    ],
  },
  {
    title: 'Frontend',
    skills: [
      { name: 'React.js', icon: wrapReactIcon(SiReact), brandColor: '#61DAFB' },
      { name: 'Next.js', icon: wrapReactIcon(SiNextdotjs) },
      { name: 'React Native', icon: wrapReactIcon(SiReact), brandColor: '#61DAFB' },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', icon: wrapReactIcon(SiNodedotjs), brandColor: '#5FA04E' },
      { name: 'Nest.js', icon: wrapReactIcon(SiNestjs), brandColor: '#E0234E' },
      { name: 'Express.js', icon: wrapReactIcon(SiExpress) },
      { name: 'GraphQL', icon: wrapReactIcon(SiGraphql), brandColor: '#E10098' },
      { name: 'REST APIs', icon: wrapMuiIcon(RestApiIcon) },
    ],
  },
  {
    title: 'Database',
    skills: [
      { name: 'PostgreSQL', icon: wrapReactIcon(SiPostgresql), brandColor: '#4169E1' },
      { name: 'MongoDB', icon: wrapReactIcon(SiMongodb), brandColor: '#47A248' },
      { name: 'MySQL', icon: wrapReactIcon(SiMysql), brandColor: '#4479A1' },
    ],
  },
  {
    title: 'Architecture',
    skills: [
      { name: 'Microservices', icon: wrapMuiIcon(MicroservicesIcon) },
      { name: 'RabbitMQ', icon: wrapReactIcon(SiRabbitmq), brandColor: '#FF6600' },
      { name: 'API Gateway', icon: wrapMuiIcon(ApiGatewayIcon) },
      { name: 'Redis', icon: wrapReactIcon(SiRedis), brandColor: '#FF4438' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    skills: [
      { name: 'AWS', icon: wrapMuiIcon(AwsIcon), brandColor: '#FF9900' },
      { name: 'Docker', icon: wrapReactIcon(SiDocker), brandColor: '#2496ED' },
      { name: 'CI/CD', icon: wrapMuiIcon(CiCdIcon) },
      { name: 'GitHub Actions', icon: wrapReactIcon(SiGithubactions), brandColor: '#2088FF' },
      { name: 'Jenkins', icon: wrapReactIcon(SiJenkins), brandColor: '#D24939' },
    ],
  },
  {
    title: 'Testing',
    skills: [
      { name: 'Playwright', icon: wrapMuiIcon(PlaywrightIcon), brandColor: '#2EAD33' },
      { name: 'Cypress', icon: wrapReactIcon(SiCypress), brandColor: '#69D3A7' },
      { name: 'Selenium', icon: wrapReactIcon(SiSelenium), brandColor: '#43B02A' },
      { name: 'Postman', icon: wrapReactIcon(SiPostman), brandColor: '#FF6C37' },
    ],
  },
  {
    title: 'AI & Tooling',
    skills: [
      { name: 'Claude Code', icon: wrapReactIcon(SiClaude), brandColor: '#D97757' },
      { name: 'Cursor', icon: wrapMuiIcon(CursorIcon), brandColor: '#00B4D8' },
      { name: 'CodeRabbit', icon: wrapReactIcon(SiCoderabbit), brandColor: '#FF570A' },
      { name: 'n8n', icon: wrapReactIcon(SiN8N), brandColor: '#EA4B71' },
    ],
  },
  {
    title: 'Process',
    skills: [
      { name: 'Agile', icon: wrapMuiIcon(AgileIcon) },
      { name: 'Scrum', icon: wrapMuiIcon(ScrumIcon) },
      { name: 'Jira', icon: wrapReactIcon(SiJira), brandColor: '#0052CC' },
    ],
  },
]
