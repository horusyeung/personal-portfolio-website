describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the hero section with name and role', () => {
    cy.contains('Horus Yeung').should('be.visible')
    cy.contains('Software Architect & Team Lead').should('be.visible')
  })

  it('displays the professional summary without company names', () => {
    cy.get('body').should('not.contain', 'Currently leading')
    cy.contains('Senior Software Architect and Team Lead').should('exist')
  })

  it('shows stats with key metrics', () => {
    cy.contains('6+ Years').should('exist')
    cy.contains('50K+ Users').should('exist')
    cy.contains('12+ Apps').should('exist')
    cy.contains('4 Countries').should('exist')
  })

  it('has working navigation to Experience page', () => {
    cy.contains('View Experience').click()
    cy.url().should('include', '/experience')
    cy.contains('Experience').should('be.visible')
  })

  it('has working navigation to Contact page', () => {
    cy.contains('Get in Touch').first().click()
    cy.url().should('include', '/contact')
  })

  it('displays the about section', () => {
    cy.contains('Building products that scale.').should('exist')
  })

  it('displays the technical skills section with all categories', () => {
    cy.contains('Technologies I work with.').should('exist')
    cy.contains('Frontend').should('exist')
    cy.contains('Backend').should('exist')
    cy.contains('Database').should('exist')
    cy.contains('Architecture').should('exist')
    cy.contains('Cloud & DevOps').should('exist')
    cy.contains('Testing').should('exist')
    cy.contains('AI & Tooling').should('exist')
    cy.contains('Process').should('exist')
  })

  it('displays the CTA section', () => {
    cy.contains("Let's work together.").should('exist')
  })
})
