export interface DeviceUser {
  _id: string
  name: string
  role: string
  email: string
  profileImage?: string | null
}

export interface DeviceItem {
  _id: string
  serialNo: string
  uid: string
  deviceFingerprint?: string
  platform?: string
  deviceModel?: string
  userId?: DeviceUser | null
  status: 'ACTIVE' | 'INACTIVE' | string
  notes?: string
  pairedAt?: string | null
  firstPairedAt?: string | null
  lastPairedAt?: string | null
  lastUnpairedAt?: string | null
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface DevicesMeta {
  page: number
  limit: number
  total: number
  totalPage: number
}

export interface DevicesResponse {
  success: boolean
  message: string
  data: {
    data: DeviceItem[]
    meta: DevicesMeta
  }
}

export interface CreateDevicePayload {
  uid: string
  notes?: string
}

export interface UpdateDevicePayload {
  uid: string
  notes?: string
}
