import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Edit2, Plus, Trash2, Upload, X } from 'lucide-react'
import { Popconfirm } from 'antd'
import { Avatar, SearchingInput, Pagination } from '../../components/share'
import {
  useCreateDevice,
  useDeleteDevice,
  useDevices,
  useUpdateDevice,
} from '../../hooks/useDevices'
import type { DeviceItem } from '../../types/devices'

export default function Devices() {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10

  const { data: devicesResponse, isLoading } = useDevices({
    page,
    limit,
    searchTerm: search,
  })

  const createDevice = useCreateDevice()
  const updateDevice = useUpdateDevice()
  const deleteDevice = useDeleteDevice()

  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadInfo, setUploadInfo] = useState<string | null>(null)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingDevice, setEditingDevice] = useState<DeviceItem | null>(null)
  const [uidInput, setUidInput] = useState('')
  const [notesInput, setNotesInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const devicesList = devicesResponse?.data?.data || []
  const meta = devicesResponse?.data?.meta

  useEffect(() => {
    if (!showModal) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [showModal])

  const openAddModal = () => {
    setEditingDevice(null)
    setUidInput('')
    setNotesInput('')
    setFormError(null)
    setShowModal(true)
  }

  const openEditModal = (device: DeviceItem) => {
    setEditingDevice(device)
    setUidInput(device.uid || '')
    setNotesInput(device.notes || '')
    setFormError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingDevice(null)
    setUidInput('')
    setNotesInput('')
    setFormError(null)
  }

  const handleSearchChange = (newSearch: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (newSearch.trim()) {
      newParams.set('search', newSearch.trim())
    } else {
      newParams.delete('search')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', String(newPage))
    setSearchParams(newParams)
  }

  const handleSubmitForm = async () => {
    const uid = uidInput.trim()
    const notes = notesInput.trim()

    if (!uid) {
      setFormError('UID is required.')
      return
    }

    if (editingDevice) {
      updateDevice.mutate(
        { id: editingDevice._id, payload: { uid, notes } },
        {
          onSuccess: () => {
            closeModal()
          },
        }
      )
    } else {
      createDevice.mutate(
        { uid, notes },
        {
          onSuccess: () => {
            closeModal()
          },
        }
      )
    }
  }

  const handleUploadClick = () => {
    setUploadError(null)
    setUploadInfo(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!/\.csv$/i.test(file.name)) {
      setUploadError('Please upload a .csv file.')
      return
    }

    try {
      const text = await file.text()
      const rows = parseCsv(text)
      if (rows.length === 0) {
        setUploadError('CSV is empty.')
        return
      }

      const startsWithHeader =
        rows[0][0]?.trim().toLowerCase().includes('uid') ||
        rows[0][0]?.trim().toLowerCase().includes('serial')
      const dataRows = startsWithHeader ? rows.slice(1) : rows

      let successCount = 0
      for (const row of dataRows) {
        const uid = (row[0] ?? '').trim()
        const notes = (row[1] ?? '').trim()
        if (!uid) continue

        try {
          await createDevice.mutateAsync({ uid, notes })
          successCount++
        } catch {
          // continue with remaining rows
        }
      }

      if (successCount > 0) {
        setUploadInfo(`${successCount} device(s) uploaded successfully.`)
      } else {
        setUploadError('No valid devices were uploaded.')
      }
    } catch (err) {
      setUploadError('Failed to read CSV file.')
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SearchingInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by serial no or UID..."
            className="w-full max-w-md"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              className="flex h-10 items-center gap-2 rounded-md border border-surface-border bg-surface-elevated px-3 text-sm text-gray-200 transition-colors hover:text-white"
            >
              <Upload size={16} />
              Bulk Upload CSV
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="flex h-10 items-center gap-2 rounded-md bg-gradient-to-r from-brand to-brand-hover px-4 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <Plus size={16} />
              Add Device
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {(uploadError || uploadInfo) && (
          <div
            className={`mt-3 rounded-md border px-3 py-2 text-xs ${
              uploadError
                ? 'border-accent-danger/40 bg-accent-danger/10 text-accent-danger'
                : 'border-accent-success/30 bg-accent-pitchSoft/30 text-accent-success'
            }`}
          >
            {uploadError ?? uploadInfo}
          </div>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400">
                <th className="border-b border-surface-border pb-3 pl-1 font-medium">Serial No</th>
                <th className="border-b border-surface-border pb-3 font-medium">UID</th>
                <th className="border-b border-surface-border pb-3 font-medium">User</th>
                <th className="border-b border-surface-border pb-3 font-medium">Platform / Model</th>
                <th className="border-b border-surface-border pb-3 font-medium">Status</th>
                <th className="border-b border-surface-border pb-3 font-medium">Notes</th>
                <th className="border-b border-surface-border pb-3 pr-1 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                    Loading devices...
                  </td>
                </tr>
              ) : devicesList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-gray-400">
                    No devices found matching criteria.
                  </td>
                </tr>
              ) : (
                devicesList.map((device) => (
                  <tr key={device._id} className="text-gray-200 hover:bg-surface-elevated/30">
                    <td className="py-3 pl-1 font-medium text-white">{device.serialNo || 'N/A'}</td>
                    <td className="py-3 text-gray-300 font-mono text-xs">{device.uid}</td>
                    <td className="py-3">
                      {device.userId ? (
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={device.userId.profileImage}
                            name={device.userId.name}
                            className="h-6 w-6 bg-brand/30 text-[10px] font-semibold text-brand-ring"
                          />
                          <div className="text-xs">
                            <div className="font-medium text-white">{device.userId.name}</div>
                            <div className="text-gray-400">{device.userId.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Unpaired</span>
                      )}
                    </td>
                    <td className="py-3 text-xs text-gray-300">
                      {device.platform || device.deviceModel ? (
                        <span>
                          <span className="capitalize">{device.platform || 'N/A'}</span>
                          {device.deviceModel && (
                            <span className="text-gray-400"> ({device.deviceModel})</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                          device.status === 'ACTIVE'
                            ? 'bg-accent-pitchSoft/40 text-accent-success border border-accent-success/30'
                            : 'bg-surface-elevated text-gray-400 border border-surface-border'
                        }`}
                      >
                        {device.status === 'ACTIVE' ? 'Active' : device.status === 'INACTIVE' ? 'Inactive' : device.status || 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-gray-300 max-w-[200px] truncate">
                      {device.notes || <span className="text-gray-500">-</span>}
                    </td>
                    <td className="py-3 pr-1 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(device)}
                          aria-label={`Edit ${device.serialNo}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-brand/15 hover:text-brand"
                        >
                          <Edit2 size={15} />
                        </button>

                        <Popconfirm
                          title="Delete Device"
                          description="Are you sure you want to delete this device?"
                          onConfirm={() => deleteDevice.mutate(device._id)}
                          okText="Yes, Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true }}
                        >
                          <button
                            type="button"
                            disabled={deleteDevice.isPending}
                            aria-label={`Delete ${device.serialNo}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-accent-danger/15 hover:text-accent-danger"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPage}
            totalItems={meta.total}
            itemsPerPage={limit}
            onPageChange={handlePageChange}
          />
        )}
      </section>

      {/* Add / Edit Device Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="device-modal-title"
            className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-surface-border px-6 py-4">
              <div>
                <h3 id="device-modal-title" className="text-base font-semibold text-white">
                  {editingDevice ? 'Edit Device' : 'Add Device'}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {editingDevice
                    ? 'Update the UID or notes for this device.'
                    : 'Enter the UID for this device. The serial number will be generated automatically.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleSubmitForm()
              }}
              className="space-y-4 px-6 py-5"
            >
              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  UID
                </span>
                <input
                  type="text"
                  value={uidInput}
                  onChange={(e) => {
                    setUidInput(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  placeholder="e.g. 045A897AD92290"
                  autoFocus
                  className="mt-2 h-11 w-full rounded-md border border-surface-border bg-surface-elevated px-3 text-sm font-mono text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Notes
                </span>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Admin notes about this NFC device."
                  rows={3}
                  className="mt-2 w-full rounded-md border border-surface-border bg-surface-elevated p-3 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
                />
              </label>

              {formError && (
                <div className="rounded-md border border-accent-danger/40 bg-accent-danger/10 px-3 py-2 text-xs text-accent-danger">
                  {formError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-md border border-surface-border bg-surface-elevated px-4 text-sm text-gray-200 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uidInput.trim() || createDevice.isPending || updateDevice.isPending}
                  className="h-10 rounded-md bg-gradient-to-r from-brand to-brand-hover px-5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {createDevice.isPending || updateDevice.isPending
                    ? 'Saving...'
                    : editingDevice
                    ? 'Update Device'
                    : 'Save Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let current: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }
    if (char === ',') {
      current.push(field)
      field = ''
      continue
    }
    if (char === '\r') continue
    if (char === '\n') {
      current.push(field)
      rows.push(current)
      current = []
      field = ''
      continue
    }
    field += char
  }

  if (field.length > 0 || current.length > 0) {
    current.push(field)
    rows.push(current)
  }

  return rows.filter((r) => r.some((c) => c.trim().length > 0))
}
