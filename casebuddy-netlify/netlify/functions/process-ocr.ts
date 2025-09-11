import { TextractClient, StartDocumentTextDetectionCommand, GetDocumentTextDetectionCommand } from '@aws-sdk/client-textract'
import { supa } from './lib/supa'

const textract = new TextractClient({ region: process.env.AWS_REGION })

async function waitForAll(jobId: string) {
  let nextToken: string | undefined = undefined
  let text = ''
  while (true) {
    const out = await textract.send(new GetDocumentTextDetectionCommand({ JobId: jobId, NextToken: nextToken }))
    if (out.Blocks) text += out.Blocks.filter(b => b.BlockType === 'LINE').map(b => b.Text).join('\n')
    if (!out.NextToken) break
    nextToken = out.NextToken
  }
  return text.slice(0, 400) // preview
}

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  const { key, id } = JSON.parse(event.body || '{}')
  if (!key || !id) return { statusCode: 400, body: 'key + id required' }

  const start = await textract.send(new StartDocumentTextDetectionCommand({
    DocumentLocation: { S3Object: { Bucket: process.env.AWS_S3_BUCKET!, Name: key } }
  }))

  const jobId = start.JobId!
  // Simplified polling for demo. (Prod: SNS callback)
  const preview = await waitForAll(jobId)

  await supa.from('documents').update({ ocr_preview: preview }).eq('id', id)
  await supa.from('activities').insert({
    id: crypto.randomUUID(), title: 'OCR complete', description: key, created_at: new Date().toISOString()
  })

  return { statusCode: 200, body: JSON.stringify({ ok: true }) }
}
