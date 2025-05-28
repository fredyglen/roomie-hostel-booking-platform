export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string
          end_date: string
          id: string
          property_id: string
          start_date: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          property_id: string
          start_date: string
          status: string
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          property_id?: string
          start_date?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings_enhanced: {
        Row: {
          booking_reference: string
          check_in_date: string
          check_out_date: string
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          id: string
          payment_status: string
          property_id: string | null
          room_id: string | null
          special_requests: string | null
          status: string
          student_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          booking_reference?: string
          check_in_date: string
          check_out_date: string
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          payment_status?: string
          property_id?: string | null
          room_id?: string | null
          special_requests?: string | null
          status?: string
          student_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          booking_reference?: string
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          id?: string
          payment_status?: string
          property_id?: string | null
          room_id?: string | null
          special_requests?: string | null
          status?: string
          student_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_enhanced_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_enhanced_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          created_at: string
          description: string | null
          floors_count: number
          id: string
          name: string
          property_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          floors_count?: number
          id?: string
          name: string
          property_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          floors_count?: number
          id?: string
          name?: string
          property_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buildings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      floors: {
        Row: {
          building_id: string
          created_at: string
          description: string | null
          floor_number: number
          id: string
          name: string | null
          rooms_count: number
          updated_at: string
        }
        Insert: {
          building_id: string
          created_at?: string
          description?: string | null
          floor_number: number
          id?: string
          name?: string | null
          rooms_count?: number
          updated_at?: string
        }
        Update: {
          building_id?: string
          created_at?: string
          description?: string | null
          floor_number?: number
          id?: string
          name?: string | null
          rooms_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "floors_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          advance_payment_months: number | null
          allow_bill_sharing: boolean | null
          amenities: string[] | null
          available_from: string
          available_to: string | null
          bathrooms: number
          bedrooms: number
          beds_available: number | null
          beds_per_room: number | null
          cancellation_policy: string | null
          city: string
          created_at: string
          description: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          gender_restriction: string | null
          has_accessibility_features: boolean | null
          has_bedframes: boolean | null
          has_fan: boolean | null
          has_individual_meters: boolean | null
          has_mattresses: boolean | null
          has_tiled_room: boolean | null
          has_wardrobes: boolean | null
          id: string
          images: string[] | null
          internet_speed: string | null
          is_available: boolean | null
          is_furnished: boolean | null
          max_occupants: number | null
          meter_type: string | null
          owner_id: string
          parking_available: boolean | null
          parking_cost: number | null
          pet_policy: string | null
          property_category: string | null
          property_type: string
          rent: number
          rooms_available: number | null
          security_features: string[] | null
          semester_availability: string[] | null
          shared_meter_count: number | null
          shared_washroom_count: number | null
          size: number | null
          state: string
          title: string
          total_rooms: number | null
          updated_at: string
          verification_status: string | null
          virtual_tour_url: string | null
          washroom_type: string | null
          zip: string
        }
        Insert: {
          address: string
          advance_payment_months?: number | null
          allow_bill_sharing?: boolean | null
          amenities?: string[] | null
          available_from: string
          available_to?: string | null
          bathrooms: number
          bedrooms: number
          beds_available?: number | null
          beds_per_room?: number | null
          cancellation_policy?: string | null
          city: string
          created_at?: string
          description: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender_restriction?: string | null
          has_accessibility_features?: boolean | null
          has_bedframes?: boolean | null
          has_fan?: boolean | null
          has_individual_meters?: boolean | null
          has_mattresses?: boolean | null
          has_tiled_room?: boolean | null
          has_wardrobes?: boolean | null
          id?: string
          images?: string[] | null
          internet_speed?: string | null
          is_available?: boolean | null
          is_furnished?: boolean | null
          max_occupants?: number | null
          meter_type?: string | null
          owner_id: string
          parking_available?: boolean | null
          parking_cost?: number | null
          pet_policy?: string | null
          property_category?: string | null
          property_type: string
          rent: number
          rooms_available?: number | null
          security_features?: string[] | null
          semester_availability?: string[] | null
          shared_meter_count?: number | null
          shared_washroom_count?: number | null
          size?: number | null
          state: string
          title: string
          total_rooms?: number | null
          updated_at?: string
          verification_status?: string | null
          virtual_tour_url?: string | null
          washroom_type?: string | null
          zip: string
        }
        Update: {
          address?: string
          advance_payment_months?: number | null
          allow_bill_sharing?: boolean | null
          amenities?: string[] | null
          available_from?: string
          available_to?: string | null
          bathrooms?: number
          bedrooms?: number
          beds_available?: number | null
          beds_per_room?: number | null
          cancellation_policy?: string | null
          city?: string
          created_at?: string
          description?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          gender_restriction?: string | null
          has_accessibility_features?: boolean | null
          has_bedframes?: boolean | null
          has_fan?: boolean | null
          has_individual_meters?: boolean | null
          has_mattresses?: boolean | null
          has_tiled_room?: boolean | null
          has_wardrobes?: boolean | null
          id?: string
          images?: string[] | null
          internet_speed?: string | null
          is_available?: boolean | null
          is_furnished?: boolean | null
          max_occupants?: number | null
          meter_type?: string | null
          owner_id?: string
          parking_available?: boolean | null
          parking_cost?: number | null
          pet_policy?: string | null
          property_category?: string | null
          property_type?: string
          rent?: number
          rooms_available?: number | null
          security_features?: string[] | null
          semester_availability?: string[] | null
          shared_meter_count?: number | null
          shared_washroom_count?: number | null
          size?: number | null
          state?: string
          title?: string
          total_rooms?: number | null
          updated_at?: string
          verification_status?: string | null
          virtual_tour_url?: string | null
          washroom_type?: string | null
          zip?: string
        }
        Relationships: []
      }
      property_verifications: {
        Row: {
          created_at: string
          documents: string[] | null
          id: string
          notes: string | null
          property_id: string | null
          status: string
          updated_at: string
          verification_date: string | null
          verification_type: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          documents?: string[] | null
          id?: string
          notes?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
          verification_date?: string | null
          verification_type: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          documents?: string[] | null
          id?: string
          notes?: string | null
          property_id?: string | null
          status?: string
          updated_at?: string
          verification_date?: string | null
          verification_type?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_verifications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_verifications_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      room_occupancy: {
        Row: {
          bed_number: number | null
          check_in_date: string
          check_out_date: string | null
          created_at: string
          id: string
          room_id: string
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          bed_number?: number | null
          check_in_date: string
          check_out_date?: string | null
          created_at?: string
          id?: string
          room_id: string
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          bed_number?: number | null
          check_in_date?: string
          check_out_date?: string | null
          created_at?: string
          id?: string
          room_id?: string
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_occupancy_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          bed_count: number
          beds_available: number
          created_at: string
          description: string | null
          floor_id: string
          id: string
          images: string[] | null
          is_available: boolean
          max_occupants: number
          rent_amount: number | null
          room_number: string
          room_type: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          bed_count?: number
          beds_available?: number
          created_at?: string
          description?: string | null
          floor_id: string
          id?: string
          images?: string[] | null
          is_available?: boolean
          max_occupants?: number
          rent_amount?: number | null
          room_number: string
          room_type: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          bed_count?: number
          beds_available?: number
          created_at?: string
          description?: string | null
          floor_id?: string
          id?: string
          images?: string[] | null
          is_available?: boolean
          max_occupants?: number
          rent_amount?: number | null
          room_number?: string
          room_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rooms_floor_id_fkey"
            columns: ["floor_id"]
            isOneToOne: false
            referencedRelation: "floors"
            referencedColumns: ["id"]
          },
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
