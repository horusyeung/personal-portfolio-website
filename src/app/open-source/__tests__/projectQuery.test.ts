import { describe, expect, it } from 'vitest'
import { githubProjects } from '@/content/projects'
import { parseProjectQuery } from '../projectQuery'

const ids = githubProjects.map(({ name }) => name)

describe('parseProjectQuery', () => {
  it.each(ids)('accepts the exact project ID %s', (id) => {
    expect(parseProjectQuery(`?project=${encodeURIComponent(id)}`, ids)).toEqual({
      id,
      invalid: false,
    })
  })

  it.each(['', '?sort=recent', '?projectId=project-structures'])(
    'leaves missing project queries closed: %s',
    (search) => {
      expect(parseProjectQuery(search, ids)).toEqual({ id: null, invalid: false })
    },
  )

  it.each([
    '?project=',
    '?project=unknown',
    '?project=constructor',
    '?project=__proto__',
    '?project=Project-structures',
    '?project=%20project-structures%20',
    '?project=%3Cscript%3E',
    '?project=%ZZ',
  ])('rejects a noncanonical project ID without selecting a default: %s', (search) => {
    expect(parseProjectQuery(search, ids)).toEqual({ id: null, invalid: true })
  })

  it.each([
    '?project=project-structures&project=react-native-starter',
    '?project=project-structures&project=project-structures',
    '?project=unknown&project=project-structures',
    '?project=&project=project-structures',
  ])('rejects ambiguous repeated parameters: %s', (search) => {
    expect(parseProjectQuery(search, ids)).toEqual({ id: null, invalid: true })
  })

  it('decodes the URL value before matching the exact allowlist', () => {
    expect(parseProjectQuery('?project=%70roject-structures&sort=recent', ids)).toEqual({
      id: 'project-structures',
      invalid: false,
    })
  })
})
