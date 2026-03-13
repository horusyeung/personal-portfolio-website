describe('Open Source Page', () => {
  beforeEach(() => {
    cy.visit('/open-source')
  })

  it('displays the page title', () => {
    cy.contains('Open Source').should('be.visible')
  })

  it('shows all project cards', () => {
    cy.contains('project-structures').should('exist')
    cy.contains('personal-portfolio-website').should('exist')
    cy.contains('react-native-starter').should('exist')
    cy.contains('nextjs-nestjs-fullstack-starter').should('exist')
    cy.contains('ai-augmented-dev-workflow').should('exist')
  })

  it('shows correct status badges', () => {
    cy.contains('Live').should('exist')
    cy.contains('Coming Soon').should('exist')
  })

  it('project cards link to GitHub', () => {
    cy.get('a[href*="github.com/horusyeung"]').should('have.length.at.least', 5)
  })

  it('shows technology tags on projects', () => {
    cy.contains('Next.js').should('exist')
    cy.contains('React Native').should('exist')
    cy.contains('NestJS').should('exist')
  })
})
