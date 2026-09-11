'use client'

import { useConfig, useField } from '@payloadcms/ui'
import { useEffect, useRef, useState } from 'react'
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './CircularImageUploadField.scss'

type MediaValue = {
  id: number | string
  alt?: string | null
  url?: string | null
  sizes?: {
    avatar?: { url?: string | null } | null
    thumbnail?: { url?: string | null } | null
  } | null
}

type CircularImageUploadFieldProps = {
  field: {
    name?: string
    required?: boolean
  }
  path: string
  readOnly?: boolean
}

const getMediaID = (value: MediaValue | number | string | null | undefined) =>
  value && typeof value === 'object' ? value.id : value

const getMediaURL = (value: MediaValue | number | string | null | undefined) =>
  value && typeof value === 'object'
    ? value.sizes?.avatar?.url || value.sizes?.thumbnail?.url || value.url || null
    : null

const createInitialCrop = (width: number, height: number) =>
  centerCrop(
    makeAspectCrop({ height: 88, unit: '%', width: 88 }, 1, width, height),
    width,
    height,
  )

const cropToFile = async (image: HTMLImageElement, crop: PixelCrop, source: File) => {
  const canvas = document.createElement('canvas')
  const outputSize = 800
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const context = canvas.getContext('2d')

  if (!context) throw new Error('Browser tidak dapat memproses gambar ini.')

  canvas.width = outputSize
  canvas.height = outputSize
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    outputSize,
    outputSize,
  )

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('Gagal membuat hasil crop.'))),
      'image/jpeg',
      0.92,
    )
  })
  const baseName = source.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]+/g, '-')

  return new File([blob], `${baseName || 'avatar'}-cropped.jpg`, { type: 'image/jpeg' })
}

export default function CircularImageUploadField({
  field,
  path,
  readOnly = false,
}: CircularImageUploadFieldProps) {
  const { config } = useConfig()
  const { setValue, value } = useField<MediaValue | number | string | null>({ path })
  const inputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [currentURL, setCurrentURL] = useState(() => getMediaURL(value))
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceURL, setSourceURL] = useState<string | null>(null)
  const [alt, setAlt] = useState('')
  const [isOpen, setOpen] = useState(false)
  const [isUploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const label = field.name === 'portrait' ? 'Foto tokoh' : 'Avatar'
  const apiRoute = config.routes.api
  const mediaID = getMediaID(value)
  const displayedURL = mediaID ? getMediaURL(value) || currentURL : null

  useEffect(() => {
    const inlineURL = getMediaURL(value)
    if (inlineURL || !mediaID) return

    const controller = new AbortController()
    void fetch(`${apiRoute}/media/${mediaID}?depth=0`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((media: MediaValue | null) => setCurrentURL(getMediaURL(media)))
      .catch((fetchError: unknown) => {
        if (fetchError instanceof Error && fetchError.name !== 'AbortError') setCurrentURL(null)
      })

    return () => controller.abort()
  }, [apiRoute, mediaID, value])

  useEffect(
    () => () => {
      if (sourceURL) URL.revokeObjectURL(sourceURL)
    },
    [sourceURL],
  )

  useEffect(() => {
    if (!isOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isUploading) setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isOpen, isUploading])

  const selectFile = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Pilih file gambar (JPG, PNG, atau WebP).')
      return
    }
    if (sourceURL) URL.revokeObjectURL(sourceURL)
    const nextURL = URL.createObjectURL(file)
    setSourceFile(file)
    setSourceURL(nextURL)
    setAlt(file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '))
    setCrop(undefined)
    setCompletedCrop(undefined)
    setError(null)
    setOpen(true)
  }

  const uploadCrop = async () => {
    if (!sourceFile || !imageRef.current || !completedCrop || !alt.trim()) return
    setUploading(true)
    setError(null)

    try {
      const croppedFile = await cropToFile(imageRef.current, completedCrop, sourceFile)
      const formData = new FormData()
      formData.append('file', croppedFile)
      formData.append('_payload', JSON.stringify({ alt: alt.trim() }))
      const response = await fetch(`${apiRoute}/media`, {
        body: formData,
        credentials: 'include',
        method: 'POST',
      })
      const result = (await response.json()) as MediaValue | { doc?: MediaValue; message?: string }
      const media = 'doc' in result && result.doc ? result.doc : (result as MediaValue)

      if (!response.ok || !media?.id) {
        throw new Error(('message' in result && result.message) || 'Upload avatar gagal.')
      }

      setValue(media.id)
      setCurrentURL(getMediaURL(media))
      setOpen(false)
      setSourceFile(null)
      if (sourceURL) URL.revokeObjectURL(sourceURL)
      setSourceURL(null)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload avatar gagal.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="circular-image-field">
      <div className="circular-image-field__label">
        {label}{field.required ? <span aria-hidden="true"> *</span> : null}
      </div>
      <div className="circular-image-field__control">
        <div className="circular-image-field__preview">
          {displayedURL ? (
            // The admin preview can be a temporary blob or an authenticated media URL.
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={`Pratinjau ${label.toLowerCase()}`} src={displayedURL} />
          ) : <span aria-hidden="true">+</span>}
        </div>
        <div>
          <p className="circular-image-field__help">Gambar akan dipotong 1:1 dengan panduan bundar.</p>
          <div className="circular-image-field__actions">
            <button disabled={readOnly} onClick={() => inputRef.current?.click()} type="button">
              {mediaID ? 'Ganti & crop ulang' : 'Pilih & crop foto'}
            </button>
            {mediaID ? (
              <button className="circular-image-field__remove" disabled={readOnly} onClick={() => setValue(null)} type="button">
                Hapus
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <input
        accept="image/jpeg,image/png,image/webp"
        className="circular-image-field__file"
        onChange={(event) => {
          selectFile(event.target.files?.[0])
          event.target.value = ''
        }}
        ref={inputRef}
        type="file"
      />

      {isOpen && sourceURL ? (
        <div aria-labelledby={`${path}-crop-title`} aria-modal="true" className="avatar-crop-modal" role="dialog">
          <button aria-label="Tutup crop avatar" className="avatar-crop-modal__backdrop" disabled={isUploading} onClick={() => setOpen(false)} type="button" />
          <div className="avatar-crop-modal__panel">
            <header>
              <div>
                <p>Foto profil</p>
                <h2 id={`${path}-crop-title`}>Atur crop bundar</h2>
              </div>
              <button aria-label="Tutup" disabled={isUploading} onClick={() => setOpen(false)} type="button">×</button>
            </header>
            <div className="avatar-crop-modal__body">
              <div className="avatar-crop-modal__stage">
                <ReactCrop
                  aspect={1}
                  circularCrop
                  crop={crop}
                  keepSelection
                  minHeight={80}
                  minWidth={80}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                >
                  {/* A native image exposes rendered and natural dimensions for canvas cropping. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Foto yang akan dipotong"
                    onLoad={(event) => setCrop(createInitialCrop(event.currentTarget.width, event.currentTarget.height))}
                    ref={imageRef}
                    src={sourceURL}
                  />
                </ReactCrop>
              </div>
              <label>
                Teks alternatif
                <input onChange={(event) => setAlt(event.target.value)} required value={alt} />
              </label>
              <p className="avatar-crop-modal__hint">Geser dan ubah ukuran lingkaran hingga wajah berada di tengah.</p>
              {error ? <p className="avatar-crop-modal__error" role="alert">{error}</p> : null}
            </div>
            <footer>
              <button disabled={isUploading} onClick={() => setOpen(false)} type="button">Batal</button>
              <button disabled={isUploading || !completedCrop || !alt.trim()} onClick={uploadCrop} type="button">
                {isUploading ? 'Mengunggah…' : 'Gunakan hasil crop'}
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  )
}
