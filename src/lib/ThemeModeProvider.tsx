'use client'

import { ThemeProvider } from '@mui/material/styles'
import type { CssVarsTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { createAppTheme } from './theme'

const theme = createAppTheme()
// The class-setting script is unavailable without JavaScript. Reuse MUI's own dark variables
// under the system media query until a light/dark class has been set.
const systemDarkVariables = (theme as typeof theme & Pick<CssVarsTheme, 'generateStyleSheets'>)
  .generateStyleSheets()
  .find((sheet) => sheet['.dark'])?.['.dark']

export function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme} defaultMode='system' disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '@media (prefers-color-scheme: dark)': {
            'html:not(.light):not(.dark)': systemDarkVariables,
          },
        }}
      />
      {children}
    </ThemeProvider>
  )
}
