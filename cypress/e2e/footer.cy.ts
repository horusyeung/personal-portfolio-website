describe('Footer', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.scrollTo('bottom')
  })

  it('displays explore links', () => {
    cy.get('footer').within(() => {
      cy.contains('Experience').should('exist')
      cy.contains('Open Source').should('exist')
      cy.contains('Contact').should('exist')
    })
  })

  it('displays connect links', () => {
    cy.get('footer').within(() => {
      cy.contains('Email').should('exist')
      cy.contains('LinkedIn').should('exist')
      cy.contains('GitHub').should('exist')
      cy.contains('Medium').should('exist')
    })
  })

  it('displays copyright', () => {
    cy.get('footer').within(() => {
      cy.contains('2026 Horus Yeung').should('exist')
    })
  })

  it('footer links navigate correctly', () => {
    cy.get('footer').contains('Experience').click()
    cy.url().should('include', '/experience')
  })
})
