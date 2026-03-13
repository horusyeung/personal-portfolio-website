describe('Experience Page', () => {
  beforeEach(() => {
    cy.visit('/experience')
  })

  it('displays the page title and subtitle', () => {
    cy.contains('Experience').should('be.visible')
    cy.contains('continuous growth and technical leadership').should('exist')
  })

  it('shows all work experience entries', () => {
    cy.contains('Frontend Developer Team Lead').should('exist')
    cy.contains('Senior Full Stack Developer').should('exist')
    cy.contains('Full Stack Developer & QA Lead').should('exist')
    cy.contains('Software Development Engineer in Test').should('exist')
  })

  it('shows companies with accent color', () => {
    cy.contains('Juno Markets').should('exist')
    cy.contains('Beta Labs (Lane Crawford Joyce Group)').should('exist')
    cy.contains('The Hong Kong Jockey Club').should('exist')
    cy.contains('Pure Group').should('exist')
  })

  it('displays education section with both degrees', () => {
    cy.contains('Education').should('exist')
    cy.contains('BBA (Hons) Business Analysis').should('exist')
    cy.contains('City University of Hong Kong').should('exist')
    cy.contains('Associate in Business, Hospitality Management (Distinction)').should('exist')
    cy.contains('PolyU Hong Kong Community College').should('exist')
  })

  it('displays certifications section', () => {
    cy.contains('Certifications').should('exist')
    cy.contains('Meta React Native Specialization').should('exist')
    cy.contains('Automated Software Testing with Playwright').should('exist')
    cy.contains('Agile with Atlassian Jira').should('exist')
  })

  it('shows updated resume content with detailed bullets', () => {
    cy.contains('50K+ users').should('exist')
    cy.contains('80% automated code review coverage').should('exist')
    cy.contains('reducing developer costs by 50%').should('exist')
  })
})
