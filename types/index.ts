export type Jewel = {
  id: string
  title: string
  description: string | null
  category: string | null
  images: string[] | null
  is_available: boolean
  created_at: string
}

export type ContactRequest = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  budget: string | null
  status: string
  created_at: string
}

export type ContactFormData = Omit<ContactRequest, 'id' | 'status' | 'created_at'>
