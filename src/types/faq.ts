export interface FaqItem {
  _id: string
  question: string
  answer: string
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface FaqResponse {
  success: boolean
  message: string
  data: FaqItem[]
}

export interface CreateFaqPayload {
  question: string
  answer: string
}

export interface UpdateFaqPayload {
  question: string
  answer: string
}
