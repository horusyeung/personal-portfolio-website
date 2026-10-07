'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { parseProjectQuery, projectQueryUrl } from './projectQuery'

export default function ProjectSheetController({
  validIds,
  onChange,
}: {
  validIds: readonly string[]
  onChange: (id: string | null) => void
}) {
  const search = useSearchParams().toString()

  useEffect(() => {
    // A newer click or history traversal can supersede a queued query effect.
    if (new URLSearchParams(window.location.search).toString() !== search) return
    const query = parseProjectQuery(search, validIds)
    if (query.invalid) {
      window.history.replaceState(null, '', projectQueryUrl(null))
    }
    onChange(query.id)
  }, [search, validIds, onChange])

  return null
}
