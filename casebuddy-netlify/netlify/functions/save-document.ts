import { supa } from './lib/supa'

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  const { key, filename, mimeType, size } = JSON.parse(event.body || '{}')
  if (!key || !filename) return { statusCode: 400, body: 'key + filename required' }

  const row = {
    id: crypto.randomUUID(),
    s3_key: key,
    original_filename: filename,
    mime_type: mimeType,
    file_size: size,
    created_at: new Date().toISOString()
  }

  const { error } = await supa.from('documents').insert(row)
  if (error) return { statusCode: 500, body: JSON.stringify({ error: error.message }) }

  await supa.from('activities').insert({
    id: crypto.randomUUID(),
    title: 'Document added',
    description: filename,
    created_at: new Date().toISOString()
  })

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: row.id, originalFilename: filename, mimeType, fileSize: size })
  }
}
