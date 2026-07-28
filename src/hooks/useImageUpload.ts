import axios from 'axios'
import { createSignal } from 'solid-js'

import api from '@/apis'

// Shared by the profile avatar picker and the post composer: pick a file,
// push it to POST /uploads/image, get an absolute URL back.
export function useImageUpload() {
  const [uploading, setUploading] = createSignal(false)
  const [uploadError, setUploadError] = createSignal<string | null>(null)

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true)
    setUploadError(null)
    try {
      const res = await api.upload.uploadImage(file)
      return res.data.data.url as string
    } catch (err: unknown) {
      setUploadError(
        axios.isAxiosError(err) ? err.response?.data?.message || 'Upload failed' : 'Upload failed',
      )
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploading, uploadError, uploadImage }
}
