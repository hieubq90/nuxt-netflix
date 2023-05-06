export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Genre {
  id: string
  name: string | null
  created_at: number | null
}

export interface Database {
  public: {
    Tables: {
      genres: {
        Row: {
          id: string
          name: string | null
          created_at: number | null
        }
        Insert: {
          name: string
        }
        Update: {
          name: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
