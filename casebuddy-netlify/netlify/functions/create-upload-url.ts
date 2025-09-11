import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3 = new S3Client({ region: process.env.AWS_REGION })

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' }
  const { filename, contentType } = JSON.parse(event.body || '{}')
  if (!filename || !contentType) return { statusCode: 400, body: 'filename + contentType required' }

  const key = `uploads/${Date.now()}_${filename}`
  const cmd = new PutObjectCommand({ Bucket: process.env.AWS_S3_BUCKET!, Key: key, ContentType: contentType })
  const url = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 })
  return { statusCode: 200, body: JSON.stringify({ uploadUrl: url, key }) }
}
