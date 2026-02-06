export interface UserLocation {
  city: string
  state: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  state?: string
  city?: string
  created_at: string
  updated_at: string
} 