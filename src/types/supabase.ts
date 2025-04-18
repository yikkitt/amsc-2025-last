export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          company_name: string | null
          booth_number: string | null
          job_title: string | null
          address: string | null
          telephone: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          booth_number?: string | null
          job_title?: string | null
          address?: string | null
          telephone?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          booth_number?: string | null
          job_title?: string | null
          address?: string | null
          telephone?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      forms: {
        Row: {
          id: string
          created_at: string
          user_id: string
          form_type: string
          status: string
          data: Json
          updated_at: string | null
          submitted_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          form_type: string
          status?: string
          data: Json
          updated_at?: string | null
          submitted_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          form_type?: string
          status?: string
          data?: Json
          updated_at?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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