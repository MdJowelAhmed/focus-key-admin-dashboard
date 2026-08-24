import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Plus, Search, Trash2, Upload, X } from 'lucide-react'

type Device = {
  id: string
  serialNo: string
  uidName: string
}

const initialDevices: Device[] = [
  { id: 'dev-1', serialNo: 'SN-100001', uidName: 'UID-AX-001' },
  { id: 'dev-2', serialNo: 'SN-100002', uidName: 'UID-AX-002' },
  { id: 'dev-3', serialNo: 'SN-100003', uidName: 'UID-AX-003' },
  { id: 'dev-4', serialNo: 'SN-100004', uidName: 'UID-AX-004' },
  { id: 'dev-5', serialNo: 'SN-100005', uidName: 'UID-AX-005' },
]

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [search, setSearch] = useState('')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadInfo, setUploadInfo] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUid, setNewUid] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!showAddModal) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAddModal()
    }
    document.addEventListener('keydown', handleKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = prevOverflow
    }
  }, [showAddModal])

  const closeAddModal = () => {
    setShowAddModal(false)
    setNewUid('')
    setFormError(null)
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return devices
    return devices.filter(
      (d) =>
        d.serialNo.toLowerCase().includes(term) ||
        d.uidName.toLowerCase().includes(term),
    )
  }, [search, devices])

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
        rows[0][0]?.trim().toLowerCase() === 'serial no' &&
        rows[0][1]?.trim().toLowerCase() === 'uid name'
      const dataRows = startsWithHeader ? rows.slice(1) : rows

      const parsed: Device[] = []
      dataRows.forEach((row, idx) => {
        const serialNo = (row[0] ?? '').trim()
        const uidName = (row[1] ?? '').trim()
        if (!serialNo && !uidName) return
        parsed.push({
          id: `csv-${Date.now()}-${idx}`,
          serialNo,
          uidName,
        })
      })

      if (parsed.length === 0) {
        setUploadError('No valid rows found in the CSV.')
        return
      }

      setDevices((prev) => [...parsed, ...prev])
      setUploadInfo(`${parsed.length} device${parsed.length === 1 ? '' : 's'} added from CSV.`)
    } catch (err) {
      setUploadError('Failed to read CSV file.')
      console.error(err)
    }
  }

  const handleAddDevice = () => {
    const uid = newUid.trim()
    if (!uid) {
      setFormError('UID Name is required.')
      return
    }
    const duplicate = devices.some(
      (d) => d.uidName.toLowerCase() === uid.toLowerCase(),
    )
    if (duplicate) {
      setFormError('A device with this UID Name already exists.')
      return
    }
    setDevices((prev) => [
      { id: `dev-${Date.now()}`, serialNo: 'Pending…', uidName: uid },
      ...prev,
    ])
    closeAddModal()
  }

  const handleDelete = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="flex flex-col gap-6 pb-6">
      <section className="rounded-2xl border border-surface-border bg-surface-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by serial no or UID name..."
              className="h-10 w-full rounded-full border border-surface-border bg-surface-elevated/70 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
            />
          </div>

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
              onClick={() => setShowAddModal(true)}
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
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th className="border-b border-surface-border pb-3 pl-1 font-medium">Serial No</th>
                <th className="border-b border-surface-border pb-3 font-medium">UID Name</th>
                <th className="w-20 border-b border-surface-border pb-3 pr-1 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.map((device) => (
                <tr key={device.id} className="text-gray-200">
                  <td className="py-3 pl-1 font-medium text-white">{device.serialNo}</td>
                  <td className="py-3 text-gray-300">{device.uidName}</td>
                  <td className="py-3 pr-1 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(device.id)}
                      aria-label={`Delete ${device.serialNo}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-accent-danger/15 hover:text-accent-danger"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-sm text-gray-500">
                    No devices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Showing {filtered.length} of {devices.length} devices
        </div>
      </section>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={closeAddModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-device-title"
            className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-surface-border px-6 py-4">
              <div>
                <h3 id="add-device-title" className="text-base font-semibold text-white">
                  Add Device
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Enter the UID name for this device. The serial number will be generated automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                aria-label="Close"
                className="text-gray-400 transition-colors hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleAddDevice()
              }}
              className="space-y-4 px-6 py-5"
            >
              <label className="block">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                  UID Name
                </span>
                <input
                  type="text"
                  value={newUid}
                  onChange={(e) => {
                    setNewUid(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  placeholder="e.g. UID-AX-006"
                  autoFocus
                  className="mt-2 h-11 w-full rounded-md border border-surface-border bg-surface-elevated px-3 text-sm text-white placeholder:text-gray-500 focus:border-brand focus:outline-none"
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
                  onClick={closeAddModal}
                  className="h-10 rounded-md border border-surface-border bg-surface-elevated px-4 text-sm text-gray-200 transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newUid.trim()}
                  className="h-10 rounded-md bg-gradient-to-r from-brand to-brand-hover px-5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Device
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
