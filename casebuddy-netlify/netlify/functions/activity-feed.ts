import { supa } from './lib/supa'

export const handler = async (event: any) => {
  const qs = new URLSearchParams(event.rawQuery || '')
  const limit = Number(qs.get('limit') || 20)
  const { data, error } = await supa.from('activities').select('*').order('created_at', { ascending: false }).limit(limit)
  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) }
  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data || []) }
}
