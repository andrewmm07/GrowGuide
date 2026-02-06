export interface Profile {
  id: string
  name: string
  email: string
  state: string
  city: string
  created_at: string
  updated_at?: string
  location: string
  // Add other profile fields as needed
}

export interface ProfileUpdate {
  location?: string
  // Add other profile fields as needed
} 