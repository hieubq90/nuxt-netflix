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

export interface Movie {
  id: string
  title?: string | null
  desc?: string | null
  trailer_host?: string | null
  trailer_source?: string | null
  trailer_url?: string | null
  thumbnail_url?: string | null
  release?: number | null
  release_full?: boolean | null
  rate?: number | null
  rate_count?: number | null
  genre_ids?: string[] | null
  one_shot?: boolean | null
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
      movies: {
        Row: {
          id: string
          title?: string | null
          desc?: string | null
          trailer_host?: string | null
          trailer_source?: string | null
          thumbnail_url?: string | null
          release?: number | null
          release_full?: boolean | null
          rate?: number | null
          rate_count?: number | null
          genre_ids?: string[] | null
          one_shot?: boolean | null
        }
        Insert: {
          title?: string | null
          desc?: string | null
          trailer_host?: string | null
          trailer_source?: string | null
          thumbnail_url?: string | null
          release?: number | null
          release_full?: boolean | null
          genre_ids?: string[] | null
          one_shot?: boolean | null
        }
        Update: {
          title?: string | null
          desc?: string | null
          trailer_host?: string | null
          trailer_source?: string | null
          trailer_url?: string | null
          thumbnail_url?: string | null
          release?: number | null
          release_full?: boolean | null
          rate?: number | null
          rate_count?: number | null
          genre_ids?: string[] | null
          one_shot?: boolean | null
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
