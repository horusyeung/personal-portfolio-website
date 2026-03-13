describe('Responsive Design', () => {
  const viewports: [number, number][] = [
    [375, 812], // Mobile
    [768, 1024], // Tablet
    [1280, 800], // Desktop
  ]

  viewports.forEach(([width, height]) => {
    describe(`Viewport ${width}x${height}`, () => {
      beforeEach(() => {
        cy.viewport(width, height)
        cy.visit('/')
      })

      it('renders the home page without horizontal overflow', () => {
        cy.get('body')
          .invoke('prop', 'scrollWidth')
          .then((scrollWidth) => {
            cy.window()
              .its('innerWidth')
              .should('be.gte', (scrollWidth as number) - 1)
          })
      })

      it('hero text is visible', () => {
        cy.contains('Horus Yeung').should('be.visible')
      })
    })
  })
})
