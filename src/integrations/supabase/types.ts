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
      admin_settings: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_public: boolean | null
          setting_description: string | null
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          setting_description?: string | null
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          setting_description?: string | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          agent_fee: number | null
          agent_id: string | null
          booking_reference: string
          check_in_date: string
          check_out_date: string
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          package_type: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          paystack_access_code: string | null
          paystack_reference: string | null
          platform_fee: number | null
          property_id: string | null
          property_owner_id: string | null
          property_rent: number | null
          room_id: string | null
          special_requests: string | null
          start_date: string | null
          status: string
          student_id: string | null
          total_amount: number
          total_price: number | null
          transaction_reference: string | null
          updated_at: string
        }
        Insert: {
          agent_fee?: number | null
          agent_id?: string | null
          booking_reference?: string
          check_in_date: string
          check_out_date: string
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          package_type?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          paystack_access_code?: string | null
          paystack_reference?: string | null
          platform_fee?: number | null
          property_id?: string | null
          property_owner_id?: string | null
          property_rent?: number | null
          room_id?: string | null
          special_requests?: string | null
          start_date?: string | null
          status?: string
          student_id?: string | null
          total_amount: number
          total_price?: number | null
          transaction_reference?: string | null
          updated_at?: string
        }
        Update: {
          agent_fee?: number | null
          agent_id?: string | null
          booking_reference?: string
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          package_type?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          paystack_access_code?: string | null
          paystack_reference?: string | null
          platform_fee?: number | null
          property_id?: string | null
          property_owner_id?: string | null
          property_rent?: number | null
          room_id?: string | null
          special_requests?: string | null
          start_date?: string | null
          status?: string
          student_id?: string | null
          total_amount?: number
          total_price?: number | null
          transaction_reference?: string | null
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
          {
            foreignKeyName: "bookings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings_enhanced: {
        Row: {
          agent_fee: number | null
          agent_id: string | null
          booking_reference: string
          check_in_date: string
          check_out_date: string
          created_at: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          end_date: string | null
          id: string
          metadata: Json | null
          package_type: string | null
          payment_method: string | null
          payment_reference: string | null
          payment_status: string
          paystack_access_code: string | null
          paystack_reference: string | null
          platform_fee: number | null
          property_id: string | null
          property_owner_id: string | null
          property_rent: number | null
          room_id: string | null
          special_requests: string | null
          start_date: string | null
          status: string
          student_id: string | null
          total_amount: number
          total_price: number | null
          transaction_reference: string | null
          updated_at: string
        }
        Insert: {
          agent_fee?: number | null
          agent_id?: string | null
          booking_reference?: string
          check_in_date: string
          check_out_date: string
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          package_type?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          paystack_access_code?: string | null
          paystack_reference?: string | null
          platform_fee?: number | null
          property_id?: string | null
          property_owner_id?: string | null
          property_rent?: number | null
          room_id?: string | null
          special_requests?: string | null
          start_date?: string | null
          status?: string
          student_id?: string | null
          total_amount: number
          total_price?: number | null
          transaction_reference?: string | null
          updated_at?: string
        }
        Update: {
          agent_fee?: number | null
          agent_id?: string | null
          booking_reference?: string
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          end_date?: string | null
          id?: string
          metadata?: Json | null
          package_type?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          payment_status?: string
          paystack_access_code?: string | null
          paystack_reference?: string | null
          platform_fee?: number | null
          property_id?: string | null
          property_owner_id?: string | null
          property_rent?: number | null
          room_id?: string | null
          special_requests?: string | null
          start_date?: string | null
          status?: string
          student_id?: string | null
          total_amount?: number
          total_price?: number | null
          transaction_reference?: string | null
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
      owner_settings: {
        Row: {
          allow_pets: boolean | null
          auto_accept_bookings: boolean | null
          booking_advance_notice: number | null
          business_address: string | null
          business_email: string | null
          business_name: string | null
          business_phone: string | null
          cancellation_policy: string | null
          check_in_time: string | null
          check_out_time: string | null
          cleaning_fee: number | null
          created_at: string
          email_notifications: boolean | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          id: string
          late_payment_fee: number | null
          maintenance_contact_name: string | null
          maintenance_contact_phone: string | null
          maximum_stay_days: number | null
          minimum_stay_days: number | null
          notifications_enabled: boolean | null
          owner_id: string
          payment_methods: string[] | null
          preferred_payment_method: string | null
          privacy_policy: string | null
          refund_policy: string | null
          require_deposit: boolean | null
          security_deposit_amount: number | null
          smoking_allowed: boolean | null
          sms_notifications: boolean | null
          terms_and_conditions: string | null
          updated_at: string
          utilities_included: boolean | null
          wifi_included: boolean | null
        }
        Insert: {
          allow_pets?: boolean | null
          auto_accept_bookings?: boolean | null
          booking_advance_notice?: number | null
          business_address?: string | null
          business_email?: string | null
          business_name?: string | null
          business_phone?: string | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          cleaning_fee?: number | null
          created_at?: string
          email_notifications?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          late_payment_fee?: number | null
          maintenance_contact_name?: string | null
          maintenance_contact_phone?: string | null
          maximum_stay_days?: number | null
          minimum_stay_days?: number | null
          notifications_enabled?: boolean | null
          owner_id: string
          payment_methods?: string[] | null
          preferred_payment_method?: string | null
          privacy_policy?: string | null
          refund_policy?: string | null
          require_deposit?: boolean | null
          security_deposit_amount?: number | null
          smoking_allowed?: boolean | null
          sms_notifications?: boolean | null
          terms_and_conditions?: string | null
          updated_at?: string
          utilities_included?: boolean | null
          wifi_included?: boolean | null
        }
        Update: {
          allow_pets?: boolean | null
          auto_accept_bookings?: boolean | null
          booking_advance_notice?: number | null
          business_address?: string | null
          business_email?: string | null
          business_name?: string | null
          business_phone?: string | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          cleaning_fee?: number | null
          created_at?: string
          email_notifications?: boolean | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          id?: string
          late_payment_fee?: number | null
          maintenance_contact_name?: string | null
          maintenance_contact_phone?: string | null
          maximum_stay_days?: number | null
          minimum_stay_days?: number | null
          notifications_enabled?: boolean | null
          owner_id?: string
          payment_methods?: string[] | null
          preferred_payment_method?: string | null
          privacy_policy?: string | null
          refund_policy?: string | null
          require_deposit?: boolean | null
          security_deposit_amount?: number | null
          smoking_allowed?: boolean | null
          sms_notifications?: boolean | null
          terms_and_conditions?: string | null
          updated_at?: string
          utilities_included?: boolean | null
          wifi_included?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "owner_settings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_distributions: {
        Row: {
          agent_amount: number
          agent_id: string
          booking_id: string | null
          created_at: string | null
          id: string
          payment_reference: string
          paystack_fees: number
          platform_amount: number
          platform_net: number
          property_owner_amount: number
          property_owner_id: string
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          agent_amount: number
          agent_id: string
          booking_id?: string | null
          created_at?: string | null
          id?: string
          payment_reference: string
          paystack_fees: number
          platform_amount: number
          platform_net: number
          property_owner_amount: number
          property_owner_id: string
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          agent_amount?: number
          agent_id?: string
          booking_id?: string | null
          created_at?: string | null
          id?: string
          payment_reference?: string
          paystack_fees?: number
          platform_amount?: number
          platform_net?: number
          property_owner_amount?: number
          property_owner_id?: string
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_distributions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_webhooks: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          paystack_event_id: string | null
          processed: boolean | null
          reference: string | null
          status: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          paystack_event_id?: string | null
          processed?: boolean | null
          reference?: string | null
          status: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          paystack_event_id?: string | null
          processed?: boolean | null
          reference?: string | null
          status?: string
        }
        Relationships: []
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
          subscription_expires_at: string | null
          subscription_status: string | null
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
          subscription_expires_at?: string | null
          subscription_status?: string | null
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
          subscription_expires_at?: string | null
          subscription_status?: string | null
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
          admin_notes: string | null
          created_at: string
          documents: string[] | null
          id: string
          notes: string | null
          priority_level: string | null
          property_id: string | null
          rejection_reason: string | null
          resubmission_count: number | null
          status: string
          updated_at: string
          verification_date: string | null
          verification_deadline: string | null
          verification_requirements: string[] | null
          verification_type: string
          verified_by: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          documents?: string[] | null
          id?: string
          notes?: string | null
          priority_level?: string | null
          property_id?: string | null
          rejection_reason?: string | null
          resubmission_count?: number | null
          status?: string
          updated_at?: string
          verification_date?: string | null
          verification_deadline?: string | null
          verification_requirements?: string[] | null
          verification_type: string
          verified_by?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          documents?: string[] | null
          id?: string
          notes?: string | null
          priority_level?: string | null
          property_id?: string | null
          rejection_reason?: string | null
          resubmission_count?: number | null
          status?: string
          updated_at?: string
          verification_date?: string | null
          verification_deadline?: string | null
          verification_requirements?: string[] | null
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
      split_payments: {
        Row: {
          created_at: string
          id: string
          owner_amount: number
          owner_id: string
          platform_amount: number
          split_code: string | null
          split_type: string
          status: string
          transaction_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_amount: number
          owner_id: string
          platform_amount: number
          split_code?: string | null
          split_type?: string
          status?: string
          transaction_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_amount?: number
          owner_id?: string
          platform_amount?: number
          split_code?: string | null
          split_type?: string
          status?: string
          transaction_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_split_payments_owner"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_split_payments_transaction"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      subaccounts: {
        Row: {
          account_number: string
          bank_code: string
          business_name: string
          created_at: string
          id: string
          is_active: boolean | null
          owner_id: string
          percentage_charge: number | null
          subaccount_code: string
          updated_at: string
        }
        Insert: {
          account_number: string
          bank_code: string
          business_name: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          owner_id: string
          percentage_charge?: number | null
          subaccount_code: string
          updated_at?: string
        }
        Update: {
          account_number?: string
          bank_code?: string
          business_name?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          owner_id?: string
          percentage_charge?: number | null
          subaccount_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_subaccounts_owner"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string
          customer_id: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          paystack_reference: string | null
          paystack_response: Json | null
          reference: string
          status: string
          updated_at: string
          webhook_verified: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          paystack_reference?: string | null
          paystack_response?: Json | null
          reference: string
          status?: string
          updated_at?: string
          webhook_verified?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string
          customer_id?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          paystack_reference?: string | null
          paystack_response?: Json | null
          reference?: string
          status?: string
          updated_at?: string
          webhook_verified?: boolean | null
        }
        Relationships: []
      }
      verification_requirements: {
        Row: {
          created_at: string
          documents_required: string[] | null
          id: string
          is_mandatory: boolean | null
          property_category: string
          requirement_description: string | null
          requirement_title: string
          requirement_type: string
        }
        Insert: {
          created_at?: string
          documents_required?: string[] | null
          id?: string
          is_mandatory?: boolean | null
          property_category: string
          requirement_description?: string | null
          requirement_title: string
          requirement_type: string
        }
        Update: {
          created_at?: string
          documents_required?: string[] | null
          id?: string
          is_mandatory?: boolean | null
          property_category?: string
          requirement_description?: string | null
          requirement_title?: string
          requirement_type?: string
        }
        Relationships: []
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
