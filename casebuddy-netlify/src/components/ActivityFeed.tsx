import React, { useEffect, useState } from 'react'

type Activity = { id: string; title: string; description?: string; created_at: string }

export const ActivityFeed: React.FC = () => {
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const data = await fetch('/.netlify/functions/activity-feed?limit=50').then(r => r.json())
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="space-y-2">
      {loading && <div className="text-sm text-[var(--muted)]">Loading…</div>}
      {items.map(a => (
        <div key={a.id} className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-brand"></div>
          <div>
            <div className="font-semibold">{a.title}</div>
            {a.description && <div className="text-sm text-[var(--muted)]">{a.description}</div>}
            <div className="text-[10px] text-[var(--muted)] mt-1">{new Date(a.created_at).toLocaleString()}</div>
          </div>
        </div>
      ))}
      {!loading && items.length === 0 && <div className="text-sm text-[var(--muted)]">No activity yet.</div>}
    </div>
  )
}
