describe('Contact Page', () => {
  beforeEach(() => {
    cy.visit('/contact')
  })

  it('displays the page title', () => {
    cy.contains('Get in Touch').should('be.visible')
  })

  it('shows contact information', () => {
    cy.contains('horusyeungg@gmail.com').should('exist')
    cy.contains('linkedin.com/in/horusyeung').should('exist')
    cy.contains('github.com/horusyeung').should('exist')
    cy.contains('medium.com/@horusyeung').should('exist')
    cy.contains('Vancouver, BC, Canada').should('exist')
    cy.contains('horusyeung.com').should('exist')
  })

  it('does not show phone number', () => {
    cy.get('body').should('not.contain', '778-688-6905')
  })

  it('has a contact form with required fields', () => {
    cy.contains('Send a Message').should('exist')
    cy.get('input[name="name"]').should('exist')
    cy.get('input[name="email"]').should('exist')
    cy.get('textarea[name="message"]').should('exist')
    cy.contains('button', 'Send Message').should('exist')
  })

  it('shows send message button', () => {
    cy.contains('button', 'Send Message').should('exist')
  })

  it('form fields have required attribute', () => {
    cy.get('input[name="name"]').should('have.attr', 'required')
    cy.get('input[name="email"]').should('have.attr', 'required')
    cy.get('textarea[name="message"]').should('have.attr', 'required')
  })

  it('form validation prevents empty submission', () => {
    cy.contains('button', 'Send Message').click()
    cy.url().should('include', '/contact')
  })
})
