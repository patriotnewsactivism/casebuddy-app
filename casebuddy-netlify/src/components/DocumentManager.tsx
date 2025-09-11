import React, { useState } from 'react'

type Uploaded = { id: string; originalFilename: string; mimeType: string; fileSize: number; ocrPreview?: string }

export const DocumentManager: React.FC = () => {
  const [uploads, setUploads] = useState<Uploaded[]>([])
  const [busy, setBusy] = useState(false)
  const [pct, setPct] = useState(0)

  const onFile = async (files: FileList | null) => {
    if (!files || !files.length) return
    const file = files[0]
    setBusy(true); setPct(0)

    // 1) Pre-signed URL
    const presign = await fetch('/.netlify/functions/create-upload-url', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, contentType: file.type || 'application/octet-stream' })
    }).then(r => r.json())

    // 2) Upload to S3 with progress
    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', presign.uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream')
      xhr.upload.onprogress = (e) => { if (e.lengthComputable) setPct(Math.round(e.loaded / e.total * 100)) }
      xhr.onload = () => xhr.status < 400 ? resolve(true) : reject(new Error('Upload failed'))
      xhr.onerror = reject
      xhr.send(file)
    })

    // 3) Save DB row + start OCR
    const saved = await fetch('/.netlify/functions/save-document', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: presign.key, filename: file.name, mimeType: file.type, size: file.size })
    }).then(r => r.json())

    setUploads(u => [saved, ...u])
    setBusy(false)

    fetch('/.netlify/functions/process-ocr', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: presign.key, id: saved.id, mimeType: file.type })
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <label className="btn cursor-pointer" htmlFor="file-input">{busy ? `Uploading… ${pct}%` : 'Upload Document'}</label>
        <input id="file-input" type="file" className="hidden" onChange={(e) => onFile(e.target.files)} />
      </div>

      {busy && (
        <div className="w-full bg-white/10 rounded-xl overflow-hidden">
          <div className="h-2 bg-brand" style={{ width: `${pct}%` }} />
        </div>
      )}

      <table className="table w-full">
        <thead><tr><th className="text-left">Filename</th><th>Type</th><th>Size</th><th>OCR</th></tr></thead>
        <tbody>
          {uploads.map(u => (
            <tr key={u.id} className="hover:bg-white/5 transition">
              <td>{u.originalFilename}</td>
              <td className="text-center"><span className="badge">{u.mimeType}</span></td>
              <td className="text-center">{(u.fileSize/1024).toFixed(1)} KB</td>
              <td className="text-sm">{u.ocrPreview || 'processing…'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
