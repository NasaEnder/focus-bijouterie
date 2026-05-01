import { createClient } from '@supabase/supabase-js'
import type { Jewel, ContactFormData } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getJewels(): Promise<Jewel[]> {
  const { data, error } = await supabase
    .from('jewels')
    .select('*')
    .eq('is_available', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function createContactRequest(form: ContactFormData): Promise<void> {
  const { error } = await supabase.from('contact_requests').insert(form)
  if (error) throw error
}
