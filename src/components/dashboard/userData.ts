export type UserStatus = 'Active' | 'Pending' | 'Inactive'

export type UserRecord = {
  key: string
  sl: string
  name: string
  email: string
  phone: string
  registeredAt: string
  nfcDeviceId: string
  nfcDeviceModel: string
  status: UserStatus
}

export const USER_STATUSES: UserStatus[] = ['Active', 'Pending', 'Inactive']

export const initialUsers: UserRecord[] = [
  {
    key: 'u1',
    sl: '01',
    name: 'Sabbir Ahmed',
    email: 'sabbir.ahmed@gmail.com',
    phone: '+880 1711-234567',
    registeredAt: '08 May 2026, 10:24',
    nfcDeviceId: 'NFC-A21F9C',
    nfcDeviceModel: 'ScreenSafe Tag v2',
    status: 'Active',
  },
  {
    key: 'u2',
    sl: '02',
    name: 'Tahmid Hasan',
    email: 'tahmid.hasan@outlook.com',
    phone: '+880 1812-998211',
    registeredAt: '08 May 2026, 09:12',
    nfcDeviceId: 'NFC-B47D02',
    nfcDeviceModel: 'ScreenSafe Tag v2',
    status: 'Active',
  },
  {
    key: 'u3',
    sl: '03',
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@gmail.com',
    phone: '+880 1922-114403',
    registeredAt: '07 May 2026, 22:48',
    nfcDeviceId: '—',
    nfcDeviceModel: '—',
    status: 'Pending',
  },
  {
    key: 'u4',
    sl: '04',
    name: 'Rafiul Islam',
    email: 'rafiul.islam@yahoo.com',
    phone: '+880 1611-552008',
    registeredAt: '07 May 2026, 18:35',
    nfcDeviceId: 'NFC-C90E14',
    nfcDeviceModel: 'ScreenSafe Tag v1',
    status: 'Active',
  },
  {
    key: 'u5',
    sl: '05',
    name: 'Maliha Rahman',
    email: 'maliha.rahman@gmail.com',
    phone: '+880 1755-308812',
    registeredAt: '07 May 2026, 14:02',
    nfcDeviceId: 'NFC-D12A77',
    nfcDeviceModel: 'ScreenSafe Tag v2',
    status: 'Active',
  },
  {
    key: 'u6',
    sl: '06',
    name: 'Arif Hossain',
    email: 'arif.hossain@gmail.com',
    phone: '+880 1844-771230',
    registeredAt: '06 May 2026, 20:11',
    nfcDeviceId: 'NFC-E55B89',
    nfcDeviceModel: 'ScreenSafe Tag v2',
    status: 'Inactive',
  },
  {
    key: 'u7',
    sl: '07',
    name: 'Sumaiya Akter',
    email: 'sumaiya.akter@outlook.com',
    phone: '+880 1933-440021',
    registeredAt: '06 May 2026, 16:47',
    nfcDeviceId: '—',
    nfcDeviceModel: '—',
    status: 'Pending',
  },
  {
    key: 'u8',
    sl: '08',
    name: 'Imran Khan',
    email: 'imran.khan@gmail.com',
    phone: '+880 1722-665512',
    registeredAt: '05 May 2026, 11:29',
    nfcDeviceId: 'NFC-F73C24',
    nfcDeviceModel: 'ScreenSafe Tag v1',
    status: 'Active',
  },
  {
    key: 'u9',
    sl: '09',
    name: 'Farhana Yasmin',
    email: 'farhana.yasmin@gmail.com',
    phone: '+880 1888-220045',
    registeredAt: '04 May 2026, 19:53',
    nfcDeviceId: 'NFC-G18D60',
    nfcDeviceModel: 'ScreenSafe Tag v2',
    status: 'Active',
  },
  {
    key: 'u10',
    sl: '10',
    name: 'Mehedi Hasan',
    email: 'mehedi.hasan@yahoo.com',
    phone: '+880 1677-119988',
    registeredAt: '04 May 2026, 09:18',
    nfcDeviceId: 'NFC-H29E45',
    nfcDeviceModel: 'ScreenSafe Tag v2',
    status: 'Active',
  },
  {
    key: 'u11',
    sl: '11',
    name: 'Anika Tabassum',
    email: 'anika.tabassum@gmail.com',
    phone: '+880 1955-882201',
    registeredAt: '03 May 2026, 21:41',
    nfcDeviceId: '—',
    nfcDeviceModel: '—',
    status: 'Pending',
  },
  {
    key: 'u12',
    sl: '12',
    name: 'Shakil Mahmud',
    email: 'shakil.mahmud@outlook.com',
    phone: '+880 1733-009921',
    registeredAt: '02 May 2026, 13:07',
    nfcDeviceId: 'NFC-J64F12',
    nfcDeviceModel: 'ScreenSafe Tag v1',
    status: 'Inactive',
  },
]
