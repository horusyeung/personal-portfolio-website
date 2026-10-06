// Keep the nav below feedback, dialogs above both, and the skip link above every overlay.
export const siteLayers = {
  nav: 1100,
  island: 1200,
  dialog: 1300,
  skipLink: 2000,
} as const

export const layerVariables = {
  '--site-z-nav': siteLayers.nav,
  '--site-z-island': siteLayers.island,
  '--site-z-dialog': siteLayers.dialog,
  '--site-z-skip-link': siteLayers.skipLink,
}
