describe('Theme Toggle', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('has a theme toggle button', () => {
    cy.get('button[aria-label*="Switch to"]').should('exist')
  })

  it('cycles through theme modes', () => {
    cy.get('button[aria-label*="Switch to"]').click()
    cy.get('button[aria-label*="Switch to"]').click()
    cy.get('button[aria-label*="Switch to"]').click()
  })
})
