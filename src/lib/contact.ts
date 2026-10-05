/** Contact form rules, shared by the form (instant feedback) and /api/contact (enforcement). */

export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 } as const

export const CONTACT_FIELDS = ['name', 'email', 'message'] as const
export type ContactField = (typeof CONTACT_FIELDS)[number]
export type ContactInput = Record<ContactField, string>
export type ContactErrors = Partial<Record<ContactField, string>>

/** Hidden field humans never see; bots that fill it get a fake success. */
export const HONEYPOT_FIELD = 'website'

export const CONTACT_SEND_ERROR = 'Failed to send message. Please try again or email me directly.'

// One plain address: no spaces, angle brackets, quotes, commas or semicolons (which would
// let a sender smuggle extra recipients or a display name into the reply-to header)
const EMAIL_PATTERN = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]+$/

const tooLong = (max: number) => `Please use ${max.toLocaleString('en-US')} characters or fewer.`

export function normalizeContact({ name, email, message }: ContactInput): ContactInput {
  return {
    // The name ends up in the email subject, so it must stay on one line
    name: name.replace(/[\r\n\t]+/g, ' ').trim(),
    email: email.trim(),
    message: message.trim(),
  }
}

export function validateContact({ name, email, message }: ContactInput): ContactErrors {
  const errors: ContactErrors = {}

  if (!name) errors.name = 'Please enter your name.'
  else if (name.length > CONTACT_LIMITS.name) errors.name = tooLong(CONTACT_LIMITS.name)

  if (!email) errors.email = 'Please enter your email address.'
  else if (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!message) errors.message = 'Please enter a message.'
  else if (message.length > CONTACT_LIMITS.message) errors.message = tooLong(CONTACT_LIMITS.message)

  return errors
}
