export function parseProjectQuery(search: string, validIds: readonly string[]) {
  const values = new URLSearchParams(search).getAll('project')
  if (values.length === 0) return { id: null, invalid: false }
  const id = values[0]
  if (values.length !== 1 || !id || !validIds.includes(id)) {
    return { id: null, invalid: true }
  }
  return { id, invalid: false }
}

export function projectQueryUrl(projectId: string | null) {
  const url = new URL(window.location.href)
  url.searchParams.delete('project')
  if (projectId) url.searchParams.set('project', projectId)
  return `${url.pathname}${url.search}${url.hash}`
}
