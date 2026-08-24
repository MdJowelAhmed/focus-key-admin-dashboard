export type SetupStage = 'Setup Completed' | 'NFC Linking' | 'Profile Setup' | 'Invite Sent'
export type NfcStatus = 'Linked' | 'Not Linked'
export type DirectoryStatus = 'Active' | 'Pending' | 'Inactive'

export type DirectoryUser = {
  key: string
  initials: string
  email: string
  registered: string
  setupStage: SetupStage
  nfcStatus: NfcStatus
  lastActive: string
  totalSessions: number
  status: DirectoryStatus
}

export const SETUP_STAGES: SetupStage[] = [
  'Setup Completed',
  'NFC Linking',
  'Profile Setup',
  'Invite Sent',
]

export const DIRECTORY_STATUSES: DirectoryStatus[] = ['Active', 'Pending', 'Inactive']

export const directoryUsers: DirectoryUser[] = [
  {
    key: 'd1',
    initials: 'AV',
    email: 'alex.vargas@example.com',
    registered: 'May 2, 2025',
    setupStage: 'Setup Completed',
    nfcStatus: 'Linked',
    lastActive: 'May 8, 2025 9:41 AM',
    totalSessions: 24,
    status: 'Active',
  },
  {
    key: 'd2',
    initials: 'CS',
    email: 'chris.sanders@example.com',
    registered: 'May 1, 2025',
    setupStage: 'NFC Linking',
    nfcStatus: 'Linked',
    lastActive: 'May 8, 2025 8:15 AM',
    totalSessions: 16,
    status: 'Active',
  },
  {
    key: 'd3',
    initials: 'JT',
    email: 'jordan.taylor@example.com',
    registered: 'Apr 30, 2025',
    setupStage: 'Profile Setup',
    nfcStatus: 'Not Linked',
    lastActive: 'May 7, 2025 6:32 PM',
    totalSessions: 7,
    status: 'Pending',
  },
  {
    key: 'd4',
    initials: 'MK',
    email: 'morgan.kim@example.com',
    registered: 'Apr 29, 2025',
    setupStage: 'Invite Sent',
    nfcStatus: 'Not Linked',
    lastActive: 'May 6, 2025 11:20 AM',
    totalSessions: 0,
    status: 'Pending',
  },
  {
    key: 'd5',
    initials: 'RL',
    email: 'riley.lewis@example.com',
    registered: 'Apr 27, 2025',
    setupStage: 'Setup Completed',
    nfcStatus: 'Linked',
    lastActive: 'May 8, 2025 10:02 AM',
    totalSessions: 31,
    status: 'Active',
  },
  {
    key: 'd6',
    initials: 'SP',
    email: 'sam.patel@example.com',
    registered: 'Apr 25, 2025',
    setupStage: 'NFC Linking',
    nfcStatus: 'Not Linked',
    lastActive: 'May 4, 2025 4:18 PM',
    totalSessions: 3,
    status: 'Pending',
  },
  {
    key: 'd7',
    initials: 'TW',
    email: 'taylor.wong@example.com',
    registered: 'Apr 20, 2025',
    setupStage: 'Setup Completed',
    nfcStatus: 'Linked',
    lastActive: 'May 7, 2025 9:05 PM',
    totalSessions: 18,
    status: 'Active',
  },
  {
    key: 'd8',
    initials: 'DB',
    email: 'david.brown@example.com',
    registered: 'Apr 15, 2025',
    setupStage: 'Invite Sent',
    nfcStatus: 'Not Linked',
    lastActive: 'Apr 28, 2025 2:11 PM',
    totalSessions: 0,
    status: 'Inactive',
  },
  {
    key: 'd9',
    initials: 'LH',
    email: 'lisa.hart@example.com',
    registered: 'Apr 10, 2025',
    setupStage: 'Profile Setup',
    nfcStatus: 'Not Linked',
    lastActive: 'Apr 26, 2025 10:47 AM',
    totalSessions: 2,
    status: 'Inactive',
  },
  {
    key: 'd10',
    initials: 'ZM',
    email: 'zach.miller@example.com',
    registered: 'Apr 5, 2025',
    setupStage: 'Setup Completed',
    nfcStatus: 'Linked',
    lastActive: 'May 8, 2025 7:12 AM',
    totalSessions: 12,
    status: 'Active',
  },
]
