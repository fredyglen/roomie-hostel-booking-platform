

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."auto_verify_review"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.booking_id IS NOT NULL THEN
    NEW.is_verified = TRUE;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."auto_verify_review"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    role = COALESCE(EXCLUDED.role, profiles.role);
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.role in ('supreme_admin','campus_admin')
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_property_views_hour_bucket"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.viewed_hour_epoch := (extract(epoch FROM NEW.viewed_at)::bigint) / 3600;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_property_views_hour_bucket"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at := now();
  return new;
end;$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_property_verification_status"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if (tg_op = 'INSERT') then
    -- Nothing to sync on insert; status defaults to 'pending'
    return new;
  end if;

  if (tg_op = 'UPDATE') then
    if new.status is distinct from old.status then
      update public.properties
        set verification_status = new.status,
            updated_at = now()
        where id = new.property_id;
    end if;
    return new;
  end if;

  return new;
end;$$;


ALTER FUNCTION "public"."sync_property_verification_status"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_maintenance_requests_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_maintenance_requests_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_monthly_analytics_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_monthly_analytics_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_property_reviews_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_property_reviews_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "setting_key" "text" NOT NULL,
    "setting_value" "jsonb" NOT NULL,
    "setting_description" "text",
    "category" "text" DEFAULT 'general'::"text",
    "is_public" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."booking_roommates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid",
    "roommate_name" "text" NOT NULL,
    "roommate_email" "text",
    "roommate_phone" "text",
    "roommate_student_id" "text",
    "is_primary_booker" boolean DEFAULT false,
    "payment_responsibility" "text" DEFAULT 'individual'::"text",
    "payment_amount" numeric,
    "payment_status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."booking_roommates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "bookings_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings_enhanced" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "student_id" "uuid",
    "room_id" "uuid",
    "booking_reference" "text" DEFAULT (((((('BK-'::"text" || EXTRACT(year FROM "now"())) || '-'::"text") || "lpad"((EXTRACT(doy FROM "now"()))::"text", 3, '0'::"text")) || '-'::"text") || "lpad"((EXTRACT(hour FROM "now"()))::"text", 2, '0'::"text")) || "lpad"((EXTRACT(minute FROM "now"()))::"text", 2, '0'::"text")) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "check_in_date" "date" NOT NULL,
    "check_out_date" "date" NOT NULL,
    "total_amount" numeric NOT NULL,
    "payment_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "special_requests" "text",
    "emergency_contact_name" "text",
    "emergency_contact_phone" "text",
    "emergency_contact_relationship" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "transaction_reference" "text",
    "payment_method" "text",
    "paystack_reference" "text",
    "property_owner_id" "uuid",
    "agent_id" "uuid",
    "start_date" "date",
    "end_date" "date",
    "total_price" numeric,
    "property_rent" numeric,
    "platform_fee" numeric,
    "agent_fee" numeric,
    "package_type" "text",
    "payment_reference" "text",
    "paystack_access_code" "text",
    "metadata" "jsonb",
    "semester_period" "text",
    "room_type" "text",
    "bed_number" integer,
    "roommates_count" integer DEFAULT 1,
    "student_id_number" "text",
    "university" "text",
    "program" "text",
    "student_verification_status" "text" DEFAULT 'pending'::"text",
    "mobile_money_network" "text",
    "mobile_money_number" "text"
);


ALTER TABLE "public"."bookings_enhanced" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."buildings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "floors_count" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."buildings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."commission_configurations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "platform_rate" numeric(5,4) NOT NULL,
    "agent_rate" numeric(5,4) NOT NULL,
    "paystack_rate" numeric(5,4) NOT NULL,
    "vat_rate" numeric(5,4) NOT NULL,
    "platform_fixed_fee" numeric(10,2) NOT NULL,
    "agent_minimum_fee" numeric(10,2) NOT NULL,
    "currency" character varying(3) DEFAULT 'GHS'::character varying NOT NULL,
    "version" character varying(20) NOT NULL,
    "environment" character varying(20) DEFAULT 'production'::character varying NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "change_event" "jsonb",
    "changed_by" character varying(255),
    "change_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "commission_configurations_agent_minimum_fee_check" CHECK (("agent_minimum_fee" >= (0)::numeric)),
    CONSTRAINT "commission_configurations_agent_rate_check" CHECK ((("agent_rate" >= (0)::numeric) AND ("agent_rate" <= (1)::numeric))),
    CONSTRAINT "commission_configurations_paystack_rate_check" CHECK ((("paystack_rate" >= (0)::numeric) AND ("paystack_rate" <= (1)::numeric))),
    CONSTRAINT "commission_configurations_platform_fixed_fee_check" CHECK (("platform_fixed_fee" >= (0)::numeric)),
    CONSTRAINT "commission_configurations_platform_rate_check" CHECK ((("platform_rate" >= (0)::numeric) AND ("platform_rate" <= (1)::numeric))),
    CONSTRAINT "commission_configurations_vat_rate_check" CHECK ((("vat_rate" >= (0)::numeric) AND ("vat_rate" <= (1)::numeric)))
);


ALTER TABLE "public"."commission_configurations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


COMMENT ON TABLE "public"."favorites" IS 'Student property favorites system';



COMMENT ON COLUMN "public"."favorites"."user_id" IS 'Reference to the user who favorited the property';



COMMENT ON COLUMN "public"."favorites"."property_id" IS 'Reference to the favorited property';



COMMENT ON COLUMN "public"."favorites"."created_at" IS 'When the property was favorited';



CREATE TABLE IF NOT EXISTS "public"."floors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "building_id" "uuid" NOT NULL,
    "floor_number" integer NOT NULL,
    "name" "text",
    "description" "text",
    "rooms_count" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."floors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."maintenance_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "priority" character varying(20) DEFAULT 'medium'::character varying,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "category" character varying(50) NOT NULL,
    "images" "text"[],
    "estimated_cost" numeric(10,2),
    "actual_cost" numeric(10,2),
    "assigned_to" character varying(255),
    "scheduled_date" timestamp with time zone,
    "completed_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "maintenance_requests_category_check" CHECK ((("category")::"text" = ANY (ARRAY[('plumbing'::character varying)::"text", ('electrical'::character varying)::"text", ('heating'::character varying)::"text", ('cleaning'::character varying)::"text", ('security'::character varying)::"text", ('appliances'::character varying)::"text", ('other'::character varying)::"text"]))),
    CONSTRAINT "maintenance_requests_priority_check" CHECK ((("priority")::"text" = ANY (ARRAY[('low'::character varying)::"text", ('medium'::character varying)::"text", ('high'::character varying)::"text", ('urgent'::character varying)::"text"]))),
    CONSTRAINT "maintenance_requests_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('pending'::character varying)::"text", ('in_progress'::character varying)::"text", ('completed'::character varying)::"text", ('cancelled'::character varying)::"text"])))
);


ALTER TABLE "public"."maintenance_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."monthly_analytics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "owner_id" "uuid" NOT NULL,
    "year" integer NOT NULL,
    "month" integer NOT NULL,
    "total_revenue" numeric(12,2) DEFAULT 0,
    "booking_revenue" numeric(12,2) DEFAULT 0,
    "commission_paid" numeric(12,2) DEFAULT 0,
    "net_revenue" numeric(12,2) DEFAULT 0,
    "total_bookings" integer DEFAULT 0,
    "new_bookings" integer DEFAULT 0,
    "repeat_bookings" integer DEFAULT 0,
    "cancelled_bookings" integer DEFAULT 0,
    "occupancy_rate" numeric(5,2) DEFAULT 0,
    "average_stay_duration" numeric(5,2) DEFAULT 0,
    "total_nights_booked" integer DEFAULT 0,
    "available_nights" integer DEFAULT 0,
    "unique_guests" integer DEFAULT 0,
    "new_guests" integer DEFAULT 0,
    "repeat_guests" integer DEFAULT 0,
    "total_reviews" integer DEFAULT 0,
    "average_rating" numeric(3,2) DEFAULT 0,
    "maintenance_requests" integer DEFAULT 0,
    "maintenance_completed" integer DEFAULT 0,
    "maintenance_cost" numeric(10,2) DEFAULT 0,
    "direct_bookings" integer DEFAULT 0,
    "platform_bookings" integer DEFAULT 0,
    "referral_bookings" integer DEFAULT 0,
    "other_bookings" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "monthly_analytics_month_check" CHECK ((("month" >= 1) AND ("month" <= 12)))
);


ALTER TABLE "public"."monthly_analytics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text" NOT NULL,
    "type" character varying(50) NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "data" "jsonb" DEFAULT '{}'::"jsonb",
    CONSTRAINT "notifications_message_check" CHECK ((("char_length"("message") >= 1) AND ("char_length"("message") <= 1000))),
    CONSTRAINT "notifications_title_check" CHECK ((("char_length"("title") >= 1) AND ("char_length"("title") <= 200))),
    CONSTRAINT "notifications_type_check" CHECK ((("type")::"text" = ANY (ARRAY[('info'::character varying)::"text", ('success'::character varying)::"text", ('warning'::character varying)::"text", ('error'::character varying)::"text", ('booking'::character varying)::"text", ('payment'::character varying)::"text", ('property'::character varying)::"text", ('system'::character varying)::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


COMMENT ON TABLE "public"."notifications" IS 'User notifications for the ROOMi platform';



CREATE TABLE IF NOT EXISTS "public"."owner_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "business_name" "text",
    "business_phone" "text",
    "business_email" "text",
    "business_address" "text",
    "terms_and_conditions" "text",
    "privacy_policy" "text",
    "refund_policy" "text",
    "cancellation_policy" "text",
    "check_in_time" time without time zone DEFAULT '14:00:00'::time without time zone,
    "check_out_time" time without time zone DEFAULT '11:00:00'::time without time zone,
    "booking_advance_notice" integer DEFAULT 24,
    "minimum_stay_days" integer DEFAULT 1,
    "maximum_stay_days" integer DEFAULT 365,
    "security_deposit_amount" numeric DEFAULT 0,
    "late_payment_fee" numeric DEFAULT 0,
    "cleaning_fee" numeric DEFAULT 0,
    "utilities_included" boolean DEFAULT true,
    "wifi_included" boolean DEFAULT true,
    "maintenance_contact_name" "text",
    "maintenance_contact_phone" "text",
    "emergency_contact_name" "text",
    "emergency_contact_phone" "text",
    "payment_methods" "text"[] DEFAULT ARRAY['cash'::"text", 'mobile_money'::"text"],
    "preferred_payment_method" "text" DEFAULT 'mobile_money'::"text",
    "auto_accept_bookings" boolean DEFAULT false,
    "require_deposit" boolean DEFAULT false,
    "allow_pets" boolean DEFAULT false,
    "smoking_allowed" boolean DEFAULT false,
    "notifications_enabled" boolean DEFAULT true,
    "email_notifications" boolean DEFAULT true,
    "sms_notifications" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."owner_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_audit_log" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid",
    "payment_reference" "text",
    "event_type" "text" NOT NULL,
    "commission_snapshot" "jsonb",
    "rates_snapshot" "jsonb",
    "metadata_valid" boolean,
    "discrepancy_notes" "text",
    "paystack_response" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."payment_audit_log" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_distributions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid",
    "payment_reference" "text" NOT NULL,
    "property_owner_id" "uuid" NOT NULL,
    "agent_id" "uuid" NOT NULL,
    "property_owner_amount" numeric NOT NULL,
    "agent_amount" numeric NOT NULL,
    "platform_amount" numeric NOT NULL,
    "paystack_fees" numeric NOT NULL,
    "platform_net" numeric NOT NULL,
    "status" "text" DEFAULT 'pending_distribution'::"text" NOT NULL,
    "total_amount" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payment_distributions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_webhooks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "event_type" "text" NOT NULL,
    "paystack_event_id" "text",
    "reference" "text",
    "status" "text" NOT NULL,
    "payload" "jsonb" NOT NULL,
    "processed" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."payment_webhooks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reference" "text" NOT NULL,
    "paystack_reference" "text",
    "user_id" "uuid" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "currency" "text" DEFAULT 'GHS'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "payment_method" "text",
    "channel" "text",
    "gateway_response" "jsonb",
    "transaction_date" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "payments_amount_check" CHECK (("amount" > (0)::numeric)),
    CONSTRAINT "payments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'success'::"text", 'failed'::"text", 'cancelled'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


COMMENT ON TABLE "public"."payments" IS 'Comprehensive payment transaction tracking with Paystack integration';



COMMENT ON COLUMN "public"."payments"."metadata" IS 'Additional payment context and business data';



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "phone" "text",
    "role" "text" NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['student'::"text", 'owner'::"text", 'agent'::"text", 'admin'::"text", 'supreme_admin'::"text", 'campus_admin'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."properties" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "address" "text" NOT NULL,
    "city" "text" NOT NULL,
    "state" "text" NOT NULL,
    "zip" "text" NOT NULL,
    "property_type" "text" NOT NULL,
    "rent" numeric NOT NULL,
    "bedrooms" integer NOT NULL,
    "bathrooms" integer NOT NULL,
    "size" numeric,
    "available_from" "date" NOT NULL,
    "available_to" "date",
    "is_furnished" boolean DEFAULT false,
    "is_available" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "images" "text"[] DEFAULT '{}'::"text"[],
    "amenities" "text"[] DEFAULT '{}'::"text"[],
    "verification_status" "text" DEFAULT 'pending'::"text",
    "emergency_contact_name" "text",
    "emergency_contact_phone" "text",
    "has_accessibility_features" boolean DEFAULT false,
    "pet_policy" "text",
    "parking_available" boolean DEFAULT false,
    "parking_cost" numeric(10,2),
    "security_features" "text"[],
    "internet_speed" "text",
    "gender_restriction" "text",
    "semester_availability" "text"[],
    "cancellation_policy" "text",
    "virtual_tour_url" "text",
    "property_category" "text" DEFAULT 'Hostel'::"text",
    "total_rooms" integer,
    "rooms_available" integer,
    "beds_per_room" integer,
    "beds_available" integer,
    "max_occupants" integer,
    "has_bedframes" boolean DEFAULT false,
    "has_mattresses" boolean DEFAULT false,
    "has_wardrobes" boolean DEFAULT false,
    "has_fan" boolean DEFAULT false,
    "has_tiled_room" boolean DEFAULT false,
    "has_individual_meters" boolean DEFAULT false,
    "washroom_type" "text",
    "shared_washroom_count" integer,
    "meter_type" "text",
    "shared_meter_count" integer,
    "advance_payment_months" integer,
    "allow_bill_sharing" boolean DEFAULT false,
    "subscription_status" "text" DEFAULT 'free'::"text",
    "subscription_expires_at" timestamp with time zone,
    "base_price_per_semester" numeric(10,2),
    "currency" character varying(3) DEFAULT 'GHS'::character varying,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."properties" OWNER TO "postgres";


COMMENT ON COLUMN "public"."properties"."base_price_per_semester" IS 'Semester-based pricing for student housing';



COMMENT ON COLUMN "public"."properties"."currency" IS 'Currency code for property pricing (ISO 4217)';



CREATE TABLE IF NOT EXISTS "public"."property_reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "student_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "booking_id" "uuid",
    "rating" integer NOT NULL,
    "title" character varying(255),
    "review_text" "text",
    "cleanliness_rating" integer,
    "location_rating" integer,
    "value_rating" integer,
    "communication_rating" integer,
    "amenities_rating" integer,
    "images" "text"[],
    "is_verified" boolean DEFAULT false,
    "is_anonymous" boolean DEFAULT false,
    "helpful_count" integer DEFAULT 0,
    "reported_count" integer DEFAULT 0,
    "status" character varying(20) DEFAULT 'published'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "property_reviews_amenities_rating_check" CHECK ((("amenities_rating" >= 1) AND ("amenities_rating" <= 5))),
    CONSTRAINT "property_reviews_cleanliness_rating_check" CHECK ((("cleanliness_rating" >= 1) AND ("cleanliness_rating" <= 5))),
    CONSTRAINT "property_reviews_communication_rating_check" CHECK ((("communication_rating" >= 1) AND ("communication_rating" <= 5))),
    CONSTRAINT "property_reviews_location_rating_check" CHECK ((("location_rating" >= 1) AND ("location_rating" <= 5))),
    CONSTRAINT "property_reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "property_reviews_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('draft'::character varying)::"text", ('published'::character varying)::"text", ('hidden'::character varying)::"text", ('flagged'::character varying)::"text"]))),
    CONSTRAINT "property_reviews_value_rating_check" CHECK ((("value_rating" >= 1) AND ("value_rating" <= 5)))
);


ALTER TABLE "public"."property_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."property_verifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_id" "uuid",
    "verification_type" "text" DEFAULT 'standard'::"text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "verified_by" "uuid",
    "verification_date" timestamp with time zone,
    "notes" "text",
    "documents" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "verification_requirements" "text"[],
    "admin_notes" "text",
    "rejection_reason" "text",
    "resubmission_count" integer DEFAULT 0,
    "priority_level" "text" DEFAULT 'normal'::"text",
    "verification_deadline" "date"
);


ALTER TABLE "public"."property_verifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."property_views" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "property_id" "uuid" NOT NULL,
    "viewed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "session_id" "text",
    "user_agent" "text",
    "ip_address" "inet",
    "view_duration" integer,
    "source_page" "text",
    "device_type" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "viewed_hour_epoch" bigint,
    CONSTRAINT "property_views_device_type_check" CHECK (("device_type" = ANY (ARRAY['mobile'::"text", 'tablet'::"text", 'desktop'::"text"])))
);


ALTER TABLE "public"."property_views" OWNER TO "postgres";


COMMENT ON TABLE "public"."property_views" IS 'Tracks property viewing analytics for business intelligence';



CREATE TABLE IF NOT EXISTS "public"."room_occupancy" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "room_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "bed_number" integer,
    "check_in_date" "date" NOT NULL,
    "check_out_date" "date",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."room_occupancy" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."rooms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "floor_id" "uuid" NOT NULL,
    "room_number" "text" NOT NULL,
    "room_type" "text" NOT NULL,
    "bed_count" integer DEFAULT 1 NOT NULL,
    "beds_available" integer DEFAULT 1 NOT NULL,
    "max_occupants" integer DEFAULT 1 NOT NULL,
    "rent_amount" numeric(10,2),
    "is_available" boolean DEFAULT true NOT NULL,
    "amenities" "text"[],
    "description" "text",
    "images" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."rooms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."split_payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "transaction_id" "uuid" NOT NULL,
    "split_code" "text",
    "platform_amount" numeric NOT NULL,
    "owner_amount" numeric NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "split_type" "text" DEFAULT 'percentage'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."split_payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subaccounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "subaccount_code" "text" NOT NULL,
    "business_name" "text" NOT NULL,
    "bank_code" "text" NOT NULL,
    "account_number" "text" NOT NULL,
    "percentage_charge" numeric DEFAULT 90.0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."subaccounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscription_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text" NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "currency" character varying(3) DEFAULT 'GHS'::character varying NOT NULL,
    "duration_months" integer NOT NULL,
    "features" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    CONSTRAINT "subscription_plans_description_check" CHECK ((("char_length"("description") >= 10) AND ("char_length"("description") <= 500))),
    CONSTRAINT "subscription_plans_duration_months_check" CHECK (("duration_months" > 0)),
    CONSTRAINT "subscription_plans_name_check" CHECK ((("char_length"(("name")::"text") >= 1) AND ("char_length"(("name")::"text") <= 100))),
    CONSTRAINT "subscription_plans_price_check" CHECK (("price" >= (0)::numeric))
);


ALTER TABLE "public"."subscription_plans" OWNER TO "postgres";


COMMENT ON TABLE "public"."subscription_plans" IS 'Available subscription plans for property owners';



CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reference" "text" NOT NULL,
    "paystack_reference" "text",
    "amount" numeric NOT NULL,
    "currency" "text" DEFAULT 'GHS'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "payment_method" "text",
    "customer_email" "text" NOT NULL,
    "customer_id" "uuid",
    "metadata" "jsonb",
    "paystack_response" "jsonb",
    "webhook_verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "plan_id" "uuid" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "current_period_start" timestamp with time zone NOT NULL,
    "current_period_end" timestamp with time zone NOT NULL,
    "cancel_at_period_end" boolean DEFAULT false,
    "cancelled_at" timestamp with time zone,
    "payment_reference" "text",
    "last_payment_date" timestamp with time zone,
    "next_billing_date" timestamp with time zone,
    "subscription_metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "user_subscriptions_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'cancelled'::"text", 'expired'::"text", 'suspended'::"text"])))
);


ALTER TABLE "public"."user_subscriptions" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_subscriptions" IS 'User subscription management for premium features';



COMMENT ON COLUMN "public"."user_subscriptions"."subscription_metadata" IS 'Subscription-specific configuration and preferences';



CREATE TABLE IF NOT EXISTS "public"."verification_requirements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "property_category" "text" NOT NULL,
    "requirement_type" "text" NOT NULL,
    "requirement_title" "text" NOT NULL,
    "requirement_description" "text",
    "is_mandatory" boolean DEFAULT true,
    "documents_required" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."verification_requirements" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_settings"
    ADD CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_settings"
    ADD CONSTRAINT "admin_settings_setting_key_key" UNIQUE ("setting_key");



ALTER TABLE ONLY "public"."booking_roommates"
    ADD CONSTRAINT "booking_roommates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings_enhanced"
    ADD CONSTRAINT "bookings_enhanced_booking_reference_key" UNIQUE ("booking_reference");



ALTER TABLE ONLY "public"."bookings_enhanced"
    ADD CONSTRAINT "bookings_enhanced_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."buildings"
    ADD CONSTRAINT "buildings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."commission_configurations"
    ADD CONSTRAINT "commission_configurations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_property_id_key" UNIQUE ("user_id", "property_id");



ALTER TABLE ONLY "public"."floors"
    ADD CONSTRAINT "floors_building_id_floor_number_key" UNIQUE ("building_id", "floor_number");



ALTER TABLE ONLY "public"."floors"
    ADD CONSTRAINT "floors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."maintenance_requests"
    ADD CONSTRAINT "maintenance_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monthly_analytics"
    ADD CONSTRAINT "monthly_analytics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."owner_settings"
    ADD CONSTRAINT "owner_settings_owner_id_key" UNIQUE ("owner_id");



ALTER TABLE ONLY "public"."owner_settings"
    ADD CONSTRAINT "owner_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_audit_log"
    ADD CONSTRAINT "payment_audit_log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_distributions"
    ADD CONSTRAINT "payment_distributions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_webhooks"
    ADD CONSTRAINT "payment_webhooks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_paystack_reference_key" UNIQUE ("paystack_reference");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_reference_key" UNIQUE ("reference");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."property_reviews"
    ADD CONSTRAINT "property_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."property_reviews"
    ADD CONSTRAINT "property_reviews_student_id_property_id_key" UNIQUE ("student_id", "property_id");



ALTER TABLE ONLY "public"."property_verifications"
    ADD CONSTRAINT "property_verifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."property_views"
    ADD CONSTRAINT "property_views_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."room_occupancy"
    ADD CONSTRAINT "room_occupancy_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_floor_id_room_number_key" UNIQUE ("floor_id", "room_number");



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."split_payments"
    ADD CONSTRAINT "split_payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subaccounts"
    ADD CONSTRAINT "subaccounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subaccounts"
    ADD CONSTRAINT "subaccounts_subaccount_code_key" UNIQUE ("subaccount_code");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."subscription_plans"
    ADD CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_reference_key" UNIQUE ("reference");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_user_id_plan_id_current_period_start_key" UNIQUE ("user_id", "plan_id", "current_period_start");



ALTER TABLE ONLY "public"."verification_requirements"
    ADD CONSTRAINT "verification_requirements_pkey" PRIMARY KEY ("id");



CREATE INDEX "bookings_enhanced_created_at_idx" ON "public"."bookings_enhanced" USING "btree" ("created_at");



CREATE INDEX "idx_admin_settings_category" ON "public"."admin_settings" USING "btree" ("category");



CREATE INDEX "idx_admin_settings_public" ON "public"."admin_settings" USING "btree" ("is_public");



CREATE INDEX "idx_bookings_enhanced_owner_id" ON "public"."bookings_enhanced" USING "btree" ("property_owner_id");



CREATE INDEX "idx_bookings_enhanced_payment_reference" ON "public"."bookings_enhanced" USING "btree" ("payment_reference");



CREATE INDEX "idx_bookings_enhanced_property_id" ON "public"."bookings_enhanced" USING "btree" ("property_id");



CREATE UNIQUE INDEX "idx_bookings_enhanced_reference" ON "public"."bookings_enhanced" USING "btree" ("booking_reference");



CREATE INDEX "idx_bookings_enhanced_status" ON "public"."bookings_enhanced" USING "btree" ("status");



CREATE INDEX "idx_bookings_enhanced_student_id" ON "public"."bookings_enhanced" USING "btree" ("student_id");



CREATE INDEX "idx_buildings_property_id" ON "public"."buildings" USING "btree" ("property_id");



CREATE INDEX "idx_commission_config_active" ON "public"."commission_configurations" USING "btree" ("is_active", "created_at" DESC) WHERE ("is_active" = true);



CREATE INDEX "idx_commission_config_changes" ON "public"."commission_configurations" USING "btree" ("changed_by", "created_at");



CREATE INDEX "idx_commission_config_environment" ON "public"."commission_configurations" USING "btree" ("environment", "is_active");



CREATE INDEX "idx_commission_config_version" ON "public"."commission_configurations" USING "btree" ("version");



CREATE INDEX "idx_favorites_property_id" ON "public"."favorites" USING "btree" ("property_id");



CREATE INDEX "idx_favorites_user_created" ON "public"."favorites" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "idx_favorites_user_id" ON "public"."favorites" USING "btree" ("user_id");



CREATE INDEX "idx_floors_building_id" ON "public"."floors" USING "btree" ("building_id");



CREATE INDEX "idx_maintenance_requests_created_at" ON "public"."maintenance_requests" USING "btree" ("created_at");



CREATE INDEX "idx_maintenance_requests_property_id" ON "public"."maintenance_requests" USING "btree" ("property_id");



CREATE INDEX "idx_maintenance_requests_status" ON "public"."maintenance_requests" USING "btree" ("status");



CREATE INDEX "idx_maintenance_requests_student_id" ON "public"."maintenance_requests" USING "btree" ("student_id");



CREATE INDEX "idx_monthly_analytics_created_at" ON "public"."monthly_analytics" USING "btree" ("created_at");



CREATE INDEX "idx_monthly_analytics_owner_id" ON "public"."monthly_analytics" USING "btree" ("owner_id");



CREATE UNIQUE INDEX "idx_monthly_analytics_owner_month" ON "public"."monthly_analytics" USING "btree" ("owner_id", "year", "month") WHERE ("property_id" IS NULL);



CREATE UNIQUE INDEX "idx_monthly_analytics_property_month" ON "public"."monthly_analytics" USING "btree" ("property_id", "year", "month") WHERE ("property_id" IS NOT NULL);



CREATE INDEX "idx_monthly_analytics_year_month" ON "public"."monthly_analytics" USING "btree" ("year", "month");



CREATE INDEX "idx_notifications_created_at" ON "public"."notifications" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_notifications_read" ON "public"."notifications" USING "btree" ("read");



CREATE INDEX "idx_notifications_type" ON "public"."notifications" USING "btree" ("type");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_owner_settings_owner_id" ON "public"."owner_settings" USING "btree" ("owner_id");



CREATE INDEX "idx_payment_audit_log_booking" ON "public"."payment_audit_log" USING "btree" ("booking_id");



CREATE INDEX "idx_payment_audit_log_created_at" ON "public"."payment_audit_log" USING "btree" ("created_at");



CREATE INDEX "idx_payment_audit_log_reference" ON "public"."payment_audit_log" USING "btree" ("payment_reference");



CREATE INDEX "idx_payment_distributions_booking_id" ON "public"."payment_distributions" USING "btree" ("booking_id");



CREATE INDEX "idx_payment_distributions_payment_reference" ON "public"."payment_distributions" USING "btree" ("payment_reference");



CREATE INDEX "idx_payment_webhooks_created_at" ON "public"."payment_webhooks" USING "btree" ("created_at");



CREATE INDEX "idx_payment_webhooks_reference" ON "public"."payment_webhooks" USING "btree" ("reference");



CREATE INDEX "idx_payments_date" ON "public"."payments" USING "btree" ("transaction_date" DESC);



CREATE INDEX "idx_payments_date_status" ON "public"."payments" USING "btree" ("transaction_date" DESC, "status");



CREATE INDEX "idx_payments_metadata" ON "public"."payments" USING "gin" ("metadata");



CREATE INDEX "idx_payments_reference" ON "public"."payments" USING "btree" ("reference");



CREATE INDEX "idx_payments_status" ON "public"."payments" USING "btree" ("status");



CREATE INDEX "idx_payments_user_id" ON "public"."payments" USING "btree" ("user_id");



CREATE INDEX "idx_payments_user_status" ON "public"."payments" USING "btree" ("user_id", "status");



CREATE INDEX "idx_properties_availability" ON "public"."properties" USING "btree" ("is_available", "verification_status");



CREATE INDEX "idx_properties_gender_restriction" ON "public"."properties" USING "btree" ("gender_restriction");



CREATE INDEX "idx_properties_owner" ON "public"."properties" USING "btree" ("owner_id");



CREATE INDEX "idx_properties_verification_status" ON "public"."properties" USING "btree" ("verification_status");



CREATE INDEX "idx_property_reviews_created_at" ON "public"."property_reviews" USING "btree" ("created_at");



CREATE INDEX "idx_property_reviews_property_id" ON "public"."property_reviews" USING "btree" ("property_id");



CREATE INDEX "idx_property_reviews_rating" ON "public"."property_reviews" USING "btree" ("rating");



CREATE INDEX "idx_property_reviews_status" ON "public"."property_reviews" USING "btree" ("status");



CREATE INDEX "idx_property_reviews_student_id" ON "public"."property_reviews" USING "btree" ("student_id");



CREATE INDEX "idx_property_verifications_property" ON "public"."property_verifications" USING "btree" ("property_id");



CREATE INDEX "idx_property_verifications_property_id" ON "public"."property_verifications" USING "btree" ("property_id");



CREATE INDEX "idx_property_views_property_date" ON "public"."property_views" USING "btree" ("property_id", "viewed_at" DESC);



CREATE INDEX "idx_property_views_session" ON "public"."property_views" USING "btree" ("session_id") WHERE ("session_id" IS NOT NULL);



CREATE INDEX "idx_property_views_user_property" ON "public"."property_views" USING "btree" ("user_id", "property_id");



CREATE UNIQUE INDEX "idx_property_views_user_property_hour" ON "public"."property_views" USING "btree" ("user_id", "property_id", "viewed_hour_epoch");



CREATE INDEX "idx_room_occupancy_room_id" ON "public"."room_occupancy" USING "btree" ("room_id");



CREATE INDEX "idx_room_occupancy_student_id" ON "public"."room_occupancy" USING "btree" ("student_id");



CREATE INDEX "idx_rooms_floor_id" ON "public"."rooms" USING "btree" ("floor_id");



CREATE INDEX "idx_split_payments_transaction_id" ON "public"."split_payments" USING "btree" ("transaction_id");



CREATE INDEX "idx_subaccounts_owner_id" ON "public"."subaccounts" USING "btree" ("owner_id");



CREATE INDEX "idx_subscription_plans_active" ON "public"."subscription_plans" USING "btree" ("is_active");



CREATE INDEX "idx_subscription_plans_price" ON "public"."subscription_plans" USING "btree" ("price");



CREATE INDEX "idx_transactions_created_at" ON "public"."transactions" USING "btree" ("created_at");



CREATE INDEX "idx_transactions_customer" ON "public"."transactions" USING "btree" ("customer_id");



CREATE INDEX "idx_transactions_customer_id" ON "public"."transactions" USING "btree" ("customer_id");



CREATE INDEX "idx_transactions_reference" ON "public"."transactions" USING "btree" ("reference");



CREATE INDEX "idx_transactions_status" ON "public"."transactions" USING "btree" ("status");



CREATE INDEX "idx_user_subscriptions_period" ON "public"."user_subscriptions" USING "btree" ("current_period_end") WHERE ("status" = 'active'::"text");



CREATE INDEX "idx_user_subscriptions_user_status" ON "public"."user_subscriptions" USING "btree" ("user_id", "status");



CREATE INDEX "idx_verification_requirements_category" ON "public"."verification_requirements" USING "btree" ("property_category");



CREATE OR REPLACE TRIGGER "set_property_views_hour_bucket_trg" BEFORE INSERT OR UPDATE OF "viewed_at" ON "public"."property_views" FOR EACH ROW EXECUTE FUNCTION "public"."set_property_views_hour_bucket"();



CREATE OR REPLACE TRIGGER "trg_property_verifications_updated_at" BEFORE UPDATE ON "public"."property_verifications" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "trg_sync_property_verification_status" AFTER UPDATE OF "status" ON "public"."property_verifications" FOR EACH ROW EXECUTE FUNCTION "public"."sync_property_verification_status"();



CREATE OR REPLACE TRIGGER "trigger_auto_verify_review" BEFORE INSERT ON "public"."property_reviews" FOR EACH ROW EXECUTE FUNCTION "public"."auto_verify_review"();



CREATE OR REPLACE TRIGGER "trigger_update_maintenance_requests_updated_at" BEFORE UPDATE ON "public"."maintenance_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_maintenance_requests_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_monthly_analytics_updated_at" BEFORE UPDATE ON "public"."monthly_analytics" FOR EACH ROW EXECUTE FUNCTION "public"."update_monthly_analytics_updated_at"();



CREATE OR REPLACE TRIGGER "trigger_update_property_reviews_updated_at" BEFORE UPDATE ON "public"."property_reviews" FOR EACH ROW EXECUTE FUNCTION "public"."update_property_reviews_updated_at"();



CREATE OR REPLACE TRIGGER "update_notifications_updated_at" BEFORE UPDATE ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payments_updated_at" BEFORE UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_subscription_plans_updated_at" BEFORE UPDATE ON "public"."subscription_plans" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_subscriptions_updated_at" BEFORE UPDATE ON "public"."user_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."booking_roommates"
    ADD CONSTRAINT "booking_roommates_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings_enhanced"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings_enhanced"
    ADD CONSTRAINT "bookings_enhanced_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings_enhanced"
    ADD CONSTRAINT "bookings_enhanced_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."buildings"
    ADD CONSTRAINT "buildings_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "fk_properties_owner" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."split_payments"
    ADD CONSTRAINT "fk_split_payments_owner" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."split_payments"
    ADD CONSTRAINT "fk_split_payments_transaction" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."subaccounts"
    ADD CONSTRAINT "fk_subaccounts_owner" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."floors"
    ADD CONSTRAINT "floors_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "public"."buildings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."maintenance_requests"
    ADD CONSTRAINT "maintenance_requests_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."maintenance_requests"
    ADD CONSTRAINT "maintenance_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."monthly_analytics"
    ADD CONSTRAINT "monthly_analytics_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."monthly_analytics"
    ADD CONSTRAINT "monthly_analytics_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."owner_settings"
    ADD CONSTRAINT "owner_settings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payment_distributions"
    ADD CONSTRAINT "payment_distributions_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings_enhanced"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."properties"
    ADD CONSTRAINT "properties_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_reviews"
    ADD CONSTRAINT "property_reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."property_reviews"
    ADD CONSTRAINT "property_reviews_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_reviews"
    ADD CONSTRAINT "property_reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_verifications"
    ADD CONSTRAINT "property_verifications_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_verifications"
    ADD CONSTRAINT "property_verifications_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."property_views"
    ADD CONSTRAINT "property_views_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."property_views"
    ADD CONSTRAINT "property_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."room_occupancy"
    ADD CONSTRAINT "room_occupancy_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "public"."floors"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."user_subscriptions"
    ADD CONSTRAINT "user_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admin can manage payment webhooks" ON "public"."payment_webhooks" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can delete all properties" ON "public"."properties" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['supreme_admin'::"text", 'campus_admin'::"text"]))))));



CREATE POLICY "Admins can modify settings" ON "public"."admin_settings" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can read all audit logs" ON "public"."payment_audit_log" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can read all bookings (finance)" ON "public"."bookings_enhanced" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['supreme_admin'::"text", 'campus_admin'::"text"]))))));



CREATE POLICY "Admins can read all bookings_enhanced" ON "public"."bookings_enhanced" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can read all profiles" ON "public"."profiles" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can read all properties" ON "public"."properties" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['supreme_admin'::"text", 'campus_admin'::"text"]))))));



CREATE POLICY "Admins can read all property verifications" ON "public"."property_verifications" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can read all transactions" ON "public"."transactions" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can read all webhooks" ON "public"."payment_webhooks" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins can update all properties" ON "public"."properties" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['supreme_admin'::"text", 'campus_admin'::"text"]))))));



CREATE POLICY "Admins can update all property verifications" ON "public"."property_verifications" FOR UPDATE USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admins can view all settings" ON "public"."admin_settings" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can view all settings" ON "public"."owner_settings" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Anyone can view available buildings" ON "public"."buildings" FOR SELECT USING (("property_id" IN ( SELECT "properties"."id"
   FROM "public"."properties"
  WHERE ("properties"."is_available" = true))));



CREATE POLICY "Anyone can view available rooms" ON "public"."rooms" FOR SELECT USING (("floor_id" IN ( SELECT "f"."id"
   FROM (("public"."floors" "f"
     JOIN "public"."buildings" "b" ON (("f"."building_id" = "b"."id")))
     JOIN "public"."properties" "p" ON (("b"."property_id" = "p"."id")))
  WHERE ("p"."is_available" = true))));



CREATE POLICY "Anyone can view floors in available properties" ON "public"."floors" FOR SELECT USING (("building_id" IN ( SELECT "b"."id"
   FROM ("public"."buildings" "b"
     JOIN "public"."properties" "p" ON (("b"."property_id" = "p"."id")))
  WHERE ("p"."is_available" = true))));



CREATE POLICY "Anyone can view properties" ON "public"."properties" FOR SELECT USING (true);



CREATE POLICY "Anyone can view public settings" ON "public"."admin_settings" FOR SELECT USING (("is_public" = true));



CREATE POLICY "Anyone can view published reviews" ON "public"."property_reviews" FOR SELECT USING ((("status")::"text" = 'published'::"text"));



CREATE POLICY "Authenticated users can view subscription plans" ON "public"."subscription_plans" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Owners can create their own subaccounts" ON "public"."subaccounts" FOR INSERT WITH CHECK (("owner_id" = "auth"."uid"()));



CREATE POLICY "Owners can create verification requests" ON "public"."property_verifications" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."properties" "p"
  WHERE (("p"."id" = "property_verifications"."property_id") AND ("p"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Owners can delete their own properties" ON "public"."properties" FOR DELETE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can insert properties" ON "public"."properties" FOR INSERT WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can insert their own properties" ON "public"."properties" FOR INSERT WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can insert their own settings" ON "public"."owner_settings" FOR INSERT WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can read their properties" ON "public"."properties" FOR SELECT USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can read their property verifications" ON "public"."property_verifications" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties" "p"
  WHERE (("p"."id" = "property_verifications"."property_id") AND ("p"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Owners can update their own properties" ON "public"."properties" FOR UPDATE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can update their own settings" ON "public"."owner_settings" FOR UPDATE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can update their properties" ON "public"."properties" FOR UPDATE USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can view their own analytics" ON "public"."monthly_analytics" FOR SELECT USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can view their own settings" ON "public"."owner_settings" FOR SELECT USING (("auth"."uid"() = "owner_id"));



CREATE POLICY "Owners can view their own subaccounts" ON "public"."subaccounts" FOR SELECT USING (("owner_id" = "auth"."uid"()));



CREATE POLICY "Owners can view their split payments" ON "public"."split_payments" FOR SELECT USING (("owner_id" = "auth"."uid"()));



CREATE POLICY "Property owners can manage floors in their buildings" ON "public"."floors" USING (("building_id" IN ( SELECT "b"."id"
   FROM ("public"."buildings" "b"
     JOIN "public"."properties" "p" ON (("b"."property_id" = "p"."id")))
  WHERE ("p"."owner_id" = "auth"."uid"()))));



CREATE POLICY "Property owners can manage occupancy records" ON "public"."room_occupancy" USING (("room_id" IN ( SELECT "r"."id"
   FROM ((("public"."rooms" "r"
     JOIN "public"."floors" "f" ON (("r"."floor_id" = "f"."id")))
     JOIN "public"."buildings" "b" ON (("f"."building_id" = "b"."id")))
     JOIN "public"."properties" "p" ON (("b"."property_id" = "p"."id")))
  WHERE ("p"."owner_id" = "auth"."uid"()))));



CREATE POLICY "Property owners can manage rooms in their properties" ON "public"."rooms" USING (("floor_id" IN ( SELECT "f"."id"
   FROM (("public"."floors" "f"
     JOIN "public"."buildings" "b" ON (("f"."building_id" = "b"."id")))
     JOIN "public"."properties" "p" ON (("b"."property_id" = "p"."id")))
  WHERE ("p"."owner_id" = "auth"."uid"()))));



CREATE POLICY "Property owners can manage their buildings" ON "public"."buildings" USING (("property_id" IN ( SELECT "properties"."id"
   FROM "public"."properties"
  WHERE ("properties"."owner_id" = "auth"."uid"()))));



CREATE POLICY "Property owners can update requests for their properties" ON "public"."maintenance_requests" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "maintenance_requests"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Property owners can view bookings for their properties" ON "public"."bookings" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "bookings"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Property owners can view bookings for their properties" ON "public"."bookings_enhanced" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "bookings_enhanced"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Property owners can view occupancy of their rooms" ON "public"."room_occupancy" FOR SELECT USING (("room_id" IN ( SELECT "r"."id"
   FROM ((("public"."rooms" "r"
     JOIN "public"."floors" "f" ON (("r"."floor_id" = "f"."id")))
     JOIN "public"."buildings" "b" ON (("f"."building_id" = "b"."id")))
     JOIN "public"."properties" "p" ON (("b"."property_id" = "p"."id")))
  WHERE ("p"."owner_id" = "auth"."uid"()))));



CREATE POLICY "Property owners can view requests for their properties" ON "public"."maintenance_requests" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "maintenance_requests"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Property owners can view reviews for their properties" ON "public"."property_reviews" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "property_reviews"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Property owners can view their property views" ON "public"."property_views" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "property_views"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Property owners can view their verifications" ON "public"."property_verifications" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."properties"
  WHERE (("properties"."id" = "property_verifications"."property_id") AND ("properties"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Public can read verified available properties" ON "public"."properties" FOR SELECT USING (((COALESCE("is_available", false) = true) AND (COALESCE("verification_status", 'pending'::"text") = 'verified'::"text") AND ("deleted_at" IS NULL)));



CREATE POLICY "Service role can create profiles" ON "public"."profiles" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "Students can create maintenance requests for their bookings" ON "public"."maintenance_requests" FOR INSERT WITH CHECK ((("auth"."uid"() = "student_id") AND (EXISTS ( SELECT 1
   FROM "public"."bookings"
  WHERE (("bookings"."student_id" = "auth"."uid"()) AND ("bookings"."property_id" = "maintenance_requests"."property_id") AND ("bookings"."status" = 'confirmed'::"text"))))));



CREATE POLICY "Students can create reviews for properties they've booked" ON "public"."property_reviews" FOR INSERT WITH CHECK ((("auth"."uid"() = "student_id") AND (EXISTS ( SELECT 1
   FROM "public"."bookings"
  WHERE (("bookings"."student_id" = "auth"."uid"()) AND ("bookings"."property_id" = "property_reviews"."property_id") AND ("bookings"."status" = 'confirmed'::"text") AND ("bookings"."end_date" < CURRENT_DATE))))));



CREATE POLICY "Students can create their own bookings" ON "public"."bookings" FOR INSERT WITH CHECK (("auth"."uid"() = "student_id"));



CREATE POLICY "Students can update their own bookings" ON "public"."bookings" FOR UPDATE USING (("auth"."uid"() = "student_id"));



CREATE POLICY "Students can update their own reviews" ON "public"."property_reviews" FOR UPDATE USING (("auth"."uid"() = "student_id"));



CREATE POLICY "Students can view their own bookings" ON "public"."bookings" FOR SELECT USING (("auth"."uid"() = "student_id"));



CREATE POLICY "Students can view their own maintenance requests" ON "public"."maintenance_requests" FOR SELECT USING (("auth"."uid"() = "student_id"));



CREATE POLICY "Students can view their own occupancy records" ON "public"."room_occupancy" FOR SELECT USING (("student_id" = "auth"."uid"()));



CREATE POLICY "Students can view their own reviews" ON "public"."property_reviews" FOR SELECT USING (("auth"."uid"() = "student_id"));



CREATE POLICY "System can insert/update analytics" ON "public"."monthly_analytics" USING (true);



CREATE POLICY "Users can create their own bookings" ON "public"."bookings_enhanced" FOR INSERT WITH CHECK (("auth"."uid"() = "student_id"));



CREATE POLICY "Users can create their own profiles" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can create their own transactions" ON "public"."transactions" FOR INSERT WITH CHECK (("customer_id" = "auth"."uid"()));



CREATE POLICY "Users can insert their own payments" ON "public"."payments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert their own profile" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can insert their own property views" ON "public"."property_views" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own favorites" ON "public"."favorites" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can manage their own subscriptions" ON "public"."user_subscriptions" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can read own profile" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "Users can read their own profiles" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can read their own transactions" ON "public"."transactions" FOR SELECT USING (("auth"."uid"() = "customer_id"));



CREATE POLICY "Users can update their own bookings" ON "public"."bookings_enhanced" FOR UPDATE USING (("auth"."uid"() = "student_id"));



CREATE POLICY "Users can update their own notifications" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own bookings" ON "public"."bookings_enhanced" FOR SELECT USING (("auth"."uid"() = "student_id"));



CREATE POLICY "Users can view their own notifications" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own payments" ON "public"."payments" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view their own property views" ON "public"."property_views" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own subscriptions" ON "public"."user_subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view their own transactions" ON "public"."transactions" FOR SELECT USING (("customer_id" = "auth"."uid"()));



ALTER TABLE "public"."admin_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings_enhanced" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."buildings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."floors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."maintenance_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."monthly_analytics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."owner_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_audit_log" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_webhooks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."properties" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_verifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."property_views" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."room_occupancy" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."rooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."split_payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subaccounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscription_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."verification_requirements" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."auto_verify_review"() TO "anon";
GRANT ALL ON FUNCTION "public"."auto_verify_review"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auto_verify_review"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_property_views_hour_bucket"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_property_views_hour_bucket"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_property_views_hour_bucket"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_property_verification_status"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_property_verification_status"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_property_verification_status"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_maintenance_requests_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_maintenance_requests_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_maintenance_requests_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_monthly_analytics_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_monthly_analytics_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_monthly_analytics_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_property_reviews_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_property_reviews_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_property_reviews_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."admin_settings" TO "anon";
GRANT ALL ON TABLE "public"."admin_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_settings" TO "service_role";



GRANT ALL ON TABLE "public"."booking_roommates" TO "anon";
GRANT ALL ON TABLE "public"."booking_roommates" TO "authenticated";
GRANT ALL ON TABLE "public"."booking_roommates" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON TABLE "public"."bookings_enhanced" TO "anon";
GRANT ALL ON TABLE "public"."bookings_enhanced" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings_enhanced" TO "service_role";



GRANT ALL ON TABLE "public"."buildings" TO "anon";
GRANT ALL ON TABLE "public"."buildings" TO "authenticated";
GRANT ALL ON TABLE "public"."buildings" TO "service_role";



GRANT ALL ON TABLE "public"."commission_configurations" TO "anon";
GRANT ALL ON TABLE "public"."commission_configurations" TO "authenticated";
GRANT ALL ON TABLE "public"."commission_configurations" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON TABLE "public"."floors" TO "anon";
GRANT ALL ON TABLE "public"."floors" TO "authenticated";
GRANT ALL ON TABLE "public"."floors" TO "service_role";



GRANT ALL ON TABLE "public"."maintenance_requests" TO "anon";
GRANT ALL ON TABLE "public"."maintenance_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."maintenance_requests" TO "service_role";



GRANT ALL ON TABLE "public"."monthly_analytics" TO "anon";
GRANT ALL ON TABLE "public"."monthly_analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."monthly_analytics" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."owner_settings" TO "anon";
GRANT ALL ON TABLE "public"."owner_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."owner_settings" TO "service_role";



GRANT ALL ON TABLE "public"."payment_audit_log" TO "anon";
GRANT ALL ON TABLE "public"."payment_audit_log" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_audit_log" TO "service_role";



GRANT ALL ON TABLE "public"."payment_distributions" TO "anon";
GRANT ALL ON TABLE "public"."payment_distributions" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_distributions" TO "service_role";



GRANT ALL ON TABLE "public"."payment_webhooks" TO "anon";
GRANT ALL ON TABLE "public"."payment_webhooks" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_webhooks" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."properties" TO "anon";
GRANT ALL ON TABLE "public"."properties" TO "authenticated";
GRANT ALL ON TABLE "public"."properties" TO "service_role";



GRANT ALL ON TABLE "public"."property_reviews" TO "anon";
GRANT ALL ON TABLE "public"."property_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."property_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."property_verifications" TO "anon";
GRANT ALL ON TABLE "public"."property_verifications" TO "authenticated";
GRANT ALL ON TABLE "public"."property_verifications" TO "service_role";



GRANT ALL ON TABLE "public"."property_views" TO "anon";
GRANT ALL ON TABLE "public"."property_views" TO "authenticated";
GRANT ALL ON TABLE "public"."property_views" TO "service_role";



GRANT ALL ON TABLE "public"."room_occupancy" TO "anon";
GRANT ALL ON TABLE "public"."room_occupancy" TO "authenticated";
GRANT ALL ON TABLE "public"."room_occupancy" TO "service_role";



GRANT ALL ON TABLE "public"."rooms" TO "anon";
GRANT ALL ON TABLE "public"."rooms" TO "authenticated";
GRANT ALL ON TABLE "public"."rooms" TO "service_role";



GRANT ALL ON TABLE "public"."split_payments" TO "anon";
GRANT ALL ON TABLE "public"."split_payments" TO "authenticated";
GRANT ALL ON TABLE "public"."split_payments" TO "service_role";



GRANT ALL ON TABLE "public"."subaccounts" TO "anon";
GRANT ALL ON TABLE "public"."subaccounts" TO "authenticated";
GRANT ALL ON TABLE "public"."subaccounts" TO "service_role";



GRANT ALL ON TABLE "public"."subscription_plans" TO "anon";
GRANT ALL ON TABLE "public"."subscription_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription_plans" TO "service_role";



GRANT ALL ON TABLE "public"."transactions" TO "anon";
GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."transactions" TO "service_role";



GRANT ALL ON TABLE "public"."user_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."user_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."verification_requirements" TO "anon";
GRANT ALL ON TABLE "public"."verification_requirements" TO "authenticated";
GRANT ALL ON TABLE "public"."verification_requirements" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






RESET ALL;
