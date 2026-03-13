describe('Theme', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('uses light theme', () => {
    cy.get('body').should('have.css', 'background-color', 'rgb(255, 255, 255)')
  })
})
