describe('Navigation', () => {
  it('navbar is visible on all pages', () => {
    cy.visit('/')
    cy.contains('HY').should('be.visible')
    cy.contains('Experience').should('be.visible')
    cy.contains('Open Source').should('be.visible')
    cy.contains('Contact').should('be.visible')

    cy.visit('/experience')
    cy.contains('HY').should('be.visible')

    cy.visit('/open-source')
    cy.contains('HY').should('be.visible')

    cy.visit('/contact')
    cy.contains('HY').should('be.visible')
  })

  it('logo links to home page', () => {
    cy.visit('/experience')
    cy.get('a').contains('HY').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('navbar links navigate correctly', () => {
    cy.visit('/')
    cy.get('nav a, header a').contains('Experience').click()
    cy.url().should('include', '/experience')

    cy.get('nav a, header a').contains('Open Source').click()
    cy.url().should('include', '/open-source')

    cy.get('nav a, header a').contains('Contact').click()
    cy.url().should('include', '/contact')
  })

  it('has a theme toggle button', () => {
    cy.visit('/')
    cy.get('button[aria-label]').should('exist')
  })

  it('footer is visible on all pages', () => {
    cy.visit('/')
    cy.scrollTo('bottom')
    cy.contains('Horus Yeung').should('exist')
  })

  it('/projects returns 404', () => {
    cy.request({ url: '/projects', failOnStatusCode: false }).its('status').should('eq', 404)
  })
})
