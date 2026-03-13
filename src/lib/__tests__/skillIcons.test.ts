import { describe, it, expect } from 'vitest'
import { skillCategories } from '@/lib/skillIcons'

describe('skillCategories', () => {
  it('is an array with 9 categories', () => {
    expect(Array.isArray(skillCategories)).toBe(true)
    expect(skillCategories).toHaveLength(9)
  })

  it('each category has a title and non-empty skills array', () => {
    skillCategories.forEach((category) => {
      expect(category.title).toBeDefined()
      expect(typeof category.title).toBe('string')
      expect(category.title.length).toBeGreaterThan(0)
      expect(Array.isArray(category.skills)).toBe(true)
      expect(category.skills.length).toBeGreaterThan(0)
    })
  })

  it('contains the expected category titles', () => {
    const titles = skillCategories.map((c) => c.title)
    expect(titles).toContain('Programming Languages')
    expect(titles).toContain('Frontend')
    expect(titles).toContain('Backend')
    expect(titles).toContain('Database')
    expect(titles).toContain('Architecture')
    expect(titles).toContain('Cloud & DevOps')
    expect(titles).toContain('Testing')
    expect(titles).toContain('AI & Tooling')
    expect(titles).toContain('Process')
  })

  it('each skill has a name and icon component', () => {
    skillCategories.forEach((category) => {
      category.skills.forEach((skill) => {
        expect(skill.name).toBeDefined()
        expect(typeof skill.name).toBe('string')
        expect(skill.name.length).toBeGreaterThan(0)
        expect(skill.icon).toBeDefined()
        expect(typeof skill.icon).toBe('function')
      })
    })
  })

  it('Python exists in the Programming Languages category', () => {
    const langs = skillCategories.find((c) => c.title === 'Programming Languages')
    expect(langs).toBeDefined()
    const python = langs!.skills.find((s) => s.name === 'Python')
    expect(python).toBeDefined()
  })

  it('Jira exists in the Process category', () => {
    const process = skillCategories.find((c) => c.title === 'Process')
    expect(process).toBeDefined()
    const jira = process!.skills.find((s) => s.name === 'Jira')
    expect(jira).toBeDefined()
  })
})
