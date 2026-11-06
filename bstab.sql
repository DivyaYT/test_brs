--
-- PostgreSQL database dump
--

\restrict 9oBGOj903pw5z6XIJqGTXnl37Tn97zMV8p3qruAKKX0AmpRdqDBPRGlZ5gMt1tS

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-10-28 16:04:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 271 (class 1259 OID 49892)
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    label character varying(50) DEFAULT 'Home'::character varying,
    address_line text NOT NULL,
    city character varying(100),
    state character varying(100),
    pincode character varying(10),
    latitude numeric(10,8),
    longitude numeric(11,8),
    is_default boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 41161)
-- Name: ap_upload; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ap_upload (
    ap_id bigint NOT NULL,
    accounting_date character varying(50),
    gl_date character varying(50),
    voucher_date character varying(50),
    period_name character varying(50),
    type character varying(50),
    voucher_no character varying(100),
    check_receipt_number character varying(100),
    vendor_name character varying(150),
    cmc_no character varying(100),
    check_or_dd_num character varying(100),
    description character varying(255),
    receipts numeric,
    payments numeric,
    bank_account_name character varying(150),
    bank_account_num character varying(100),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint,
    status character varying(20) DEFAULT NULL::character varying,
    reconcile_id integer,
    remarks character varying(1000)
);


ALTER TABLE public.ap_upload OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 41160)
-- Name: ap_upload_ap_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ap_upload ALTER COLUMN ap_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.ap_upload_ap_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 235 (class 1259 OID 24669)
-- Name: app_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_user (
    user_id bigint NOT NULL,
    user_code character varying(50),
    user_name character varying(150),
    mob_no character varying(20),
    mail_id character varying(150),
    role character varying(100),
    status character varying(50),
    password character varying(255),
    eff_from date,
    eff_to date,
    attach bytea,
    file_name character varying(150),
    mime_type character varying(100),
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint
);


ALTER TABLE public.app_user OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 24668)
-- Name: app_user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.app_user_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.app_user_user_id_seq OWNER TO postgres;

--
-- TOC entry 5418 (class 0 OID 0)
-- Dependencies: 234
-- Name: app_user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.app_user_user_id_seq OWNED BY public.app_user.user_id;


--
-- TOC entry 243 (class 1259 OID 41107)
-- Name: bank_statemant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_statemant (
    bs_id bigint NOT NULL,
    transfer_date character varying(50),
    invoice_number character varying(50),
    transfer_name character varying(200),
    withdrawals numeric,
    deposits numeric,
    balance numeric,
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint,
    status character varying(50),
    new_name character varying(100),
    reconcile_id integer,
    remarks character varying(1000)
);


ALTER TABLE public.bank_statemant OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 41106)
-- Name: bank_statemant_bs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.bank_statemant ALTER COLUMN bs_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.bank_statemant_bs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 279 (class 1259 OID 50093)
-- Name: banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banners (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(200),
    image_url text,
    link text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.banners OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 49462)
-- Name: brs_match; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brs_match (
    id bigint NOT NULL,
    group_id bigint,
    ref character varying(100),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.brs_match OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 49461)
-- Name: brs_match_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.brs_match ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.brs_match_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 273 (class 1259 OID 49927)
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    code character varying(50) NOT NULL,
    discount_type character varying(20) NOT NULL,
    discount_value numeric(10,2) NOT NULL,
    min_order_value numeric(10,2) DEFAULT 0 NOT NULL,
    max_discount numeric(10,2),
    valid_from timestamp without time zone NOT NULL,
    valid_until timestamp without time zone NOT NULL,
    usage_limit integer DEFAULT 1 NOT NULL,
    used_count integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 58392)
-- Name: customer_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_master (
    customer_id bigint NOT NULL,
    customer_name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(10) NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_customer_name CHECK ((char_length(btrim((customer_name)::text)) >= 3)),
    CONSTRAINT chk_customer_phone CHECK (((phone)::text ~ '^[0-9]{10}$'::text)),
    CONSTRAINT chk_customer_status CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.customer_master OWNER TO postgres;

--
-- TOC entry 283 (class 1259 OID 58391)
-- Name: customer_master_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_master ALTER COLUMN customer_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.customer_master_customer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 274 (class 1259 OID 49951)
-- Name: delivery_agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_agents (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    vehicle_no character varying(20),
    is_available boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.delivery_agents OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 24658)
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    dept_id bigint NOT NULL,
    dept_code character varying(50),
    dept_name character varying(150),
    status character varying(50),
    notes text,
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint
);


ALTER TABLE public.department OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 24657)
-- Name: department_dept_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.department_dept_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.department_dept_id_seq OWNER TO postgres;

--
-- TOC entry 5419 (class 0 OID 0)
-- Dependencies: 232
-- Name: department_dept_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.department_dept_id_seq OWNED BY public.department.dept_id;


--
-- TOC entry 241 (class 1259 OID 40997)
-- Name: doc_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doc_master (
    doc_id bigint NOT NULL,
    doc_type character varying(50),
    doc_prefix character varying(50),
    current_val character varying(255),
    attribute1 character varying(255),
    attribute2 character varying(255),
    attribute3 character varying(255),
    attribute4 character varying(255),
    attribute5 character varying(255),
    user_id bigint,
    created_by bigint,
    created_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp with time zone,
    organization_id bigint
);


ALTER TABLE public.doc_master OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 40996)
-- Name: doc_master_doc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.doc_master ALTER COLUMN doc_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.doc_master_doc_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 247 (class 1259 OID 41171)
-- Name: gl_upload; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gl_upload (
    gl_id bigint NOT NULL,
    effective_date character varying(50),
    trx_date character varying(50),
    segment1 character varying(50),
    segment4 character varying(50),
    ae_header_id character varying(100),
    ae_line_num character varying(100),
    month character varying(50),
    invoice_number character varying(100),
    description character varying(255),
    name character varying(255),
    cmc_name character varying(255),
    cmc_no character varying(100),
    check_or_dd_num character varying(100),
    receipt_method character varying(150),
    bank_name character varying(100),
    bank_account_number character varying(100),
    accounted_dr numeric,
    accounted_cr numeric,
    je_category character varying(150),
    source character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint,
    status character varying(20) DEFAULT NULL::character varying,
    reconcile_id integer,
    remarks character varying(1000)
);


ALTER TABLE public.gl_upload OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 41170)
-- Name: gl_upload_gl_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.gl_upload ALTER COLUMN gl_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.gl_upload_gl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 257 (class 1259 OID 49396)
-- Name: inv_item_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inv_item_category (
    cat_no integer NOT NULL,
    category_name character varying(100) NOT NULL
);


ALTER TABLE public.inv_item_category OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 49395)
-- Name: inv_item_category_cat_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inv_item_category_cat_no_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inv_item_category_cat_no_seq OWNER TO postgres;

--
-- TOC entry 5420 (class 0 OID 0)
-- Dependencies: 256
-- Name: inv_item_category_cat_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inv_item_category_cat_no_seq OWNED BY public.inv_item_category.cat_no;


--
-- TOC entry 249 (class 1259 OID 49341)
-- Name: inv_item_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inv_item_master (
    item_id integer NOT NULL,
    item_code character varying(30) NOT NULL,
    item_short_name character varying(100) NOT NULL,
    item_desc character varying(200),
    ref_part_no character varying(30),
    status integer NOT NULL,
    category integer NOT NULL,
    hsn_no character varying(30),
    primary_uom integer NOT NULL,
    purchase_uom integer NOT NULL,
    stock_uom integer NOT NULL,
    sales_uom integer NOT NULL,
    warehouse integer NOT NULL,
    locator integer NOT NULL,
    min_qty numeric,
    max_qty numeric
);


ALTER TABLE public.inv_item_master OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 49340)
-- Name: inv_item_master_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inv_item_master_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inv_item_master_item_id_seq OWNER TO postgres;

--
-- TOC entry 5421 (class 0 OID 0)
-- Dependencies: 248
-- Name: inv_item_master_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inv_item_master_item_id_seq OWNED BY public.inv_item_master.item_id;


--
-- TOC entry 251 (class 1259 OID 49361)
-- Name: inv_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inv_location (
    location_id integer NOT NULL,
    location_code character varying(10) NOT NULL,
    location_name character varying(100) NOT NULL,
    location_type character varying(10),
    status integer,
    address character varying(200),
    country_id integer,
    state_id integer,
    city_id integer,
    landline character varying(15),
    mobile_no character varying(15),
    email character varying(100),
    contact character varying(100)
);


ALTER TABLE public.inv_location OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 49360)
-- Name: inv_location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inv_location_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inv_location_location_id_seq OWNER TO postgres;

--
-- TOC entry 5422 (class 0 OID 0)
-- Dependencies: 250
-- Name: inv_location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inv_location_location_id_seq OWNED BY public.inv_location.location_id;


--
-- TOC entry 255 (class 1259 OID 49383)
-- Name: inv_tax_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inv_tax_mapping (
    map_id integer NOT NULL,
    map_no character varying(20) NOT NULL,
    item_id integer,
    purchase_tax_id integer NOT NULL,
    sale_tax_id integer NOT NULL,
    category integer NOT NULL,
    status integer NOT NULL
);


ALTER TABLE public.inv_tax_mapping OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 49382)
-- Name: inv_tax_mapping_map_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inv_tax_mapping_map_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inv_tax_mapping_map_id_seq OWNER TO postgres;

--
-- TOC entry 5423 (class 0 OID 0)
-- Dependencies: 254
-- Name: inv_tax_mapping_map_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inv_tax_mapping_map_id_seq OWNED BY public.inv_tax_mapping.map_id;


--
-- TOC entry 253 (class 1259 OID 49373)
-- Name: inv_uom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inv_uom (
    uom_id integer NOT NULL,
    uom_code character varying(10) NOT NULL,
    uom_name character varying(100) NOT NULL,
    description character varying(300)
);


ALTER TABLE public.inv_uom OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 49372)
-- Name: inv_uom_uom_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inv_uom_uom_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inv_uom_uom_id_seq OWNER TO postgres;

--
-- TOC entry 5424 (class 0 OID 0)
-- Dependencies: 252
-- Name: inv_uom_uom_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inv_uom_uom_id_seq OWNED BY public.inv_uom.uom_id;


--
-- TOC entry 269 (class 1259 OID 49775)
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    name text,
    barcode text,
    price numeric
);


ALTER TABLE public.items OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 49774)
-- Name: items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.items_id_seq OWNER TO postgres;

--
-- TOC entry 5425 (class 0 OID 0)
-- Dependencies: 268
-- Name: items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.items_id_seq OWNED BY public.items.id;


--
-- TOC entry 276 (class 1259 OID 50021)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    service_id uuid NOT NULL,
    item_type character varying(10) NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 50046)
-- Name: order_status_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    status character varying(30) NOT NULL,
    note text,
    changed_by uuid,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.order_status_logs OWNER TO postgres;

--
-- TOC entry 275 (class 1259 OID 49970)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_number character varying(20) NOT NULL,
    user_id uuid NOT NULL,
    address_id uuid,
    coupon_id uuid,
    agent_id uuid,
    status character varying(30) DEFAULT 'PENDING'::character varying NOT NULL,
    pickup_date date,
    pickup_time_slot character varying(50),
    delivery_date date,
    delivery_time_slot character varying(50),
    special_instructions text,
    subtotal numeric(10,2) DEFAULT 0 NOT NULL,
    tax_percent numeric(5,2) DEFAULT 18 NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0 NOT NULL,
    discount_amount numeric(10,2) DEFAULT 0 NOT NULL,
    total_amount numeric(10,2) DEFAULT 0 NOT NULL,
    payment_status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    payment_method character varying(20),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 24691)
-- Name: organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization (
    org_id bigint NOT NULL,
    org_code character varying(50),
    short_name character varying(100),
    org_name character varying(200),
    effective_from date,
    effective_to date,
    industry character varying(100),
    currency character varying(50),
    status character varying(50),
    landline_no character varying(20),
    mobile_no character varying(20),
    email character varying(150),
    website character varying(150),
    linkedin character varying(150),
    twitter character varying(150),
    address text,
    country_id bigint,
    state_id bigint,
    city_id bigint,
    bank_name character varying(150),
    branch_name character varying(150),
    ifsc_code character varying(50),
    acc_no character varying(50),
    acc_holder character varying(150),
    noof_users integer,
    modules text,
    reg_no character varying(100),
    reg_place character varying(100),
    pan_no character varying(50),
    gstin character varying(50),
    logo bytea,
    logo_mime character varying(100),
    logo_filename character varying(150),
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone
);


ALTER TABLE public.organization OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 50151)
-- Name: organization_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organization_master (
    org_id bigint NOT NULL,
    org_code character varying(10),
    short_name character varying(100),
    org_name character varying(200),
    effective_from date,
    effective_to date,
    industry character varying(100),
    currency bigint,
    status integer,
    landline_no character varying(15),
    mobile_no character varying(15),
    email character varying(100),
    website character varying(100),
    linkedin character varying(100),
    twitter character varying(100),
    address text,
    country_id bigint,
    state_id bigint,
    city_id bigint,
    bank_name character varying(100),
    branch_name character varying(100),
    ifsc_code character varying(30),
    acc_no character varying(30),
    acc_holder character varying(30),
    noof_users integer,
    modules character varying(100),
    reg_no character varying(15),
    reg_place character varying(100),
    pan_no character varying(15),
    gstin character varying(15),
    logo bytea,
    logo_mime character varying(500),
    logo_filename character varying(500),
    logo_url character varying(200),
    user_id bigint,
    created_by character varying(100),
    created_date timestamp with time zone,
    updated_by character varying(100),
    updated_date timestamp with time zone
);


ALTER TABLE public.organization_master OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 24690)
-- Name: organization_org_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organization_org_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organization_org_id_seq OWNER TO postgres;

--
-- TOC entry 5426 (class 0 OID 0)
-- Dependencies: 238
-- Name: organization_org_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organization_org_id_seq OWNED BY public.organization.org_id;


--
-- TOC entry 221 (class 1259 OID 24577)
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    org_id integer NOT NULL,
    org_code character varying(50),
    short_name character varying(100),
    org_name character varying(255) NOT NULL,
    effective_from date,
    effective_to date,
    industry character varying(100),
    currency character varying(10),
    status character varying(20),
    landline_no character varying(20),
    mobile_no character varying(20),
    email character varying(150),
    website character varying(255),
    linkedin character varying(255),
    twitter character varying(255),
    address text,
    country_id integer,
    state_id integer,
    city_id integer,
    bank_name character varying(150),
    branch_name character varying(150),
    ifsc_code character varying(20),
    acc_no character varying(50),
    acc_holder character varying(150),
    noof_users integer,
    modules text,
    reg_no character varying(100),
    reg_place character varying(150),
    pan_no character varying(20),
    gstin character varying(20),
    logo bytea,
    logo_mime character varying(50),
    logo_filename character varying(255),
    attribute1 character varying(255),
    attribute2 character varying(255),
    attribute3 character varying(255),
    attribute4 character varying(255),
    attribute5 character varying(255),
    created_by integer,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by integer,
    updated_date timestamp without time zone
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24576)
-- Name: organizations_org_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organizations_org_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organizations_org_id_seq OWNER TO postgres;

--
-- TOC entry 5427 (class 0 OID 0)
-- Dependencies: 220
-- Name: organizations_org_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizations_org_id_seq OWNED BY public.organizations.org_id;


--
-- TOC entry 278 (class 1259 OID 50069)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    user_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    method character varying(20),
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    transaction_id character varying(100),
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24680)
-- Name: project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project (
    project_id bigint NOT NULL,
    project_name character varying(200),
    proposal_id bigint,
    project_no character varying(100),
    prospect_id bigint,
    customer_id bigint,
    start_date date,
    end_date date,
    closure_date date,
    currency_id bigint,
    contact_person character varying(150),
    sales_rep bigint,
    assign_to bigint,
    status character varying(50),
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint
);


ALTER TABLE public.project OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 24679)
-- Name: project_project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_project_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_project_id_seq OWNER TO postgres;

--
-- TOC entry 5428 (class 0 OID 0)
-- Dependencies: 236
-- Name: project_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_project_id_seq OWNED BY public.project.project_id;


--
-- TOC entry 265 (class 1259 OID 49752)
-- Name: quote_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quote_items (
    id integer NOT NULL,
    quote_id integer,
    item_id integer,
    qty integer,
    price numeric
);


ALTER TABLE public.quote_items OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 49751)
-- Name: quote_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quote_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quote_items_id_seq OWNER TO postgres;

--
-- TOC entry 5429 (class 0 OID 0)
-- Dependencies: 264
-- Name: quote_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quote_items_id_seq OWNED BY public.quote_items.id;


--
-- TOC entry 267 (class 1259 OID 49763)
-- Name: quotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quotes (
    id integer NOT NULL,
    customer_name text,
    total numeric DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.quotes OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 49762)
-- Name: quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quotes_id_seq OWNER TO postgres;

--
-- TOC entry 5430 (class 0 OID 0)
-- Dependencies: 266
-- Name: quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quotes_id_seq OWNED BY public.quotes.id;


--
-- TOC entry 229 (class 1259 OID 24636)
-- Name: role_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_master (
    role_id bigint NOT NULL,
    role_code character varying(50),
    role_name character varying(150),
    description text,
    purpose character varying(150),
    notes text,
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint
);


ALTER TABLE public.role_master OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24635)
-- Name: role_master_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_master_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_master_role_id_seq OWNER TO postgres;

--
-- TOC entry 5431 (class 0 OID 0)
-- Dependencies: 228
-- Name: role_master_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_master_role_id_seq OWNED BY public.role_master.role_id;


--
-- TOC entry 272 (class 1259 OID 49913)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price_per_kg numeric(10,2),
    price_per_item numeric(10,2),
    estimated_hours integer,
    is_active boolean DEFAULT true NOT NULL,
    image_url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 49430)
-- Name: so_customer_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.so_customer_category (
    category_id integer NOT NULL,
    category_name character varying(100) NOT NULL,
    description character varying(300),
    price_list_id integer,
    credit_limit numeric,
    gst_applicable character(1) DEFAULT 'Y'::bpchar,
    status integer
);


ALTER TABLE public.so_customer_category OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 49429)
-- Name: so_customer_category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.so_customer_category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.so_customer_category_category_id_seq OWNER TO postgres;

--
-- TOC entry 5432 (class 0 OID 0)
-- Dependencies: 260
-- Name: so_customer_category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.so_customer_category_category_id_seq OWNED BY public.so_customer_category.category_id;


--
-- TOC entry 259 (class 1259 OID 49405)
-- Name: so_customer_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.so_customer_master (
    customer_id integer NOT NULL,
    customer_code character varying(15) NOT NULL,
    customer_name character varying(100) NOT NULL,
    classification integer NOT NULL,
    status integer NOT NULL,
    mobile character varying(20),
    email character varying(100),
    website character varying(100),
    address1 character varying(100),
    address2 character varying(100),
    address3 character varying(100),
    country integer,
    state integer,
    city integer,
    zipcode character varying(10),
    gstin character varying(15),
    cin character varying(30)
);


ALTER TABLE public.so_customer_master OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 49404)
-- Name: so_customer_master_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.so_customer_master_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.so_customer_master_customer_id_seq OWNER TO postgres;

--
-- TOC entry 5433 (class 0 OID 0)
-- Dependencies: 258
-- Name: so_customer_master_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.so_customer_master_customer_id_seq OWNED BY public.so_customer_master.customer_id;


--
-- TOC entry 281 (class 1259 OID 58002)
-- Name: status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status (
    status_id bigint NOT NULL,
    status_code integer,
    status_name character varying(100),
    description character varying(300),
    purpose character varying(50),
    notes text,
    color character varying(100),
    user_id bigint,
    created_by character varying(100),
    created_date timestamp with time zone,
    updated_by character varying(100),
    updated_date timestamp with time zone,
    organization_id bigint
);


ALTER TABLE public.status OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24647)
-- Name: status_master; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.status_master (
    status_id bigint NOT NULL,
    status_code character varying(50),
    status_name character varying(150),
    description text,
    purpose character varying(150),
    notes text,
    color character varying(50),
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint
);


ALTER TABLE public.status_master OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 24646)
-- Name: status_master_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.status_master_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.status_master_status_id_seq OWNER TO postgres;

--
-- TOC entry 5434 (class 0 OID 0)
-- Dependencies: 230
-- Name: status_master_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.status_master_status_id_seq OWNED BY public.status_master.status_id;


--
-- TOC entry 227 (class 1259 OID 24625)
-- Name: tax_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tax_group (
    tax_id bigint NOT NULL,
    group_code character varying(50),
    tax_name character varying(150),
    tax_type character varying(50),
    tax_per numeric(10,2),
    flat_amt numeric(12,2),
    gst numeric(10,2),
    cgst numeric(10,2),
    sgst numeric(10,2),
    igst numeric(10,2),
    utgst numeric(10,2),
    status character varying(50),
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint
);


ALTER TABLE public.tax_group OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24624)
-- Name: tax_group_tax_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tax_group_tax_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tax_group_tax_id_seq OWNER TO postgres;

--
-- TOC entry 5435 (class 0 OID 0)
-- Dependencies: 226
-- Name: tax_group_tax_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tax_group_tax_id_seq OWNED BY public.tax_group.tax_id;


--
-- TOC entry 270 (class 1259 OID 49870)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100),
    phone character varying(15) NOT NULL,
    email character varying(100),
    password_hash text,
    role character varying(20) DEFAULT 'customer'::character varying NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    otp character varying(6),
    otp_expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24603)
-- Name: vendor_classification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_classification (
    cl_id bigint NOT NULL,
    cl_code character varying(50),
    cl_name character varying(150),
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint
);


ALTER TABLE public.vendor_classification OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24602)
-- Name: vendor_classification_cl_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_classification_cl_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_classification_cl_id_seq OWNER TO postgres;

--
-- TOC entry 5436 (class 0 OID 0)
-- Dependencies: 222
-- Name: vendor_classification_cl_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_classification_cl_id_seq OWNED BY public.vendor_classification.cl_id;


--
-- TOC entry 225 (class 1259 OID 24614)
-- Name: vendor_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_type (
    v_type_no bigint NOT NULL,
    vendor_type character varying(150),
    attribute1 character varying(150),
    attribute2 character varying(150),
    attribute3 character varying(150),
    attribute4 character varying(150),
    attribute5 character varying(150),
    user_id bigint,
    created_by bigint,
    created_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by bigint,
    updated_date timestamp without time zone,
    organization_id bigint
);


ALTER TABLE public.vendor_type OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24613)
-- Name: vendor_type_v_type_no_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_type_v_type_no_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_type_v_type_no_seq OWNER TO postgres;

--
-- TOC entry 5437 (class 0 OID 0)
-- Dependencies: 224
-- Name: vendor_type_v_type_no_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_type_v_type_no_seq OWNED BY public.vendor_type.v_type_no;


--
-- TOC entry 5017 (class 2604 OID 24672)
-- Name: app_user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user ALTER COLUMN user_id SET DEFAULT nextval('public.app_user_user_id_seq'::regclass);


--
-- TOC entry 5015 (class 2604 OID 24661)
-- Name: department dept_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department ALTER COLUMN dept_id SET DEFAULT nextval('public.department_dept_id_seq'::regclass);


--
-- TOC entry 5033 (class 2604 OID 49399)
-- Name: inv_item_category cat_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_item_category ALTER COLUMN cat_no SET DEFAULT nextval('public.inv_item_category_cat_no_seq'::regclass);


--
-- TOC entry 5029 (class 2604 OID 49344)
-- Name: inv_item_master item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_item_master ALTER COLUMN item_id SET DEFAULT nextval('public.inv_item_master_item_id_seq'::regclass);


--
-- TOC entry 5030 (class 2604 OID 49364)
-- Name: inv_location location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_location ALTER COLUMN location_id SET DEFAULT nextval('public.inv_location_location_id_seq'::regclass);


--
-- TOC entry 5032 (class 2604 OID 49386)
-- Name: inv_tax_mapping map_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_tax_mapping ALTER COLUMN map_id SET DEFAULT nextval('public.inv_tax_mapping_map_id_seq'::regclass);


--
-- TOC entry 5031 (class 2604 OID 49376)
-- Name: inv_uom uom_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_uom ALTER COLUMN uom_id SET DEFAULT nextval('public.inv_uom_uom_id_seq'::regclass);


--
-- TOC entry 5042 (class 2604 OID 49778)
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.items_id_seq'::regclass);


--
-- TOC entry 5021 (class 2604 OID 24694)
-- Name: organization org_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization ALTER COLUMN org_id SET DEFAULT nextval('public.organization_org_id_seq'::regclass);


--
-- TOC entry 5003 (class 2604 OID 24580)
-- Name: organizations org_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations ALTER COLUMN org_id SET DEFAULT nextval('public.organizations_org_id_seq'::regclass);


--
-- TOC entry 5019 (class 2604 OID 24683)
-- Name: project project_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project ALTER COLUMN project_id SET DEFAULT nextval('public.project_project_id_seq'::regclass);


--
-- TOC entry 5038 (class 2604 OID 49755)
-- Name: quote_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_items ALTER COLUMN id SET DEFAULT nextval('public.quote_items_id_seq'::regclass);


--
-- TOC entry 5039 (class 2604 OID 49766)
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes ALTER COLUMN id SET DEFAULT nextval('public.quotes_id_seq'::regclass);


--
-- TOC entry 5011 (class 2604 OID 24639)
-- Name: role_master role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_master ALTER COLUMN role_id SET DEFAULT nextval('public.role_master_role_id_seq'::regclass);


--
-- TOC entry 5035 (class 2604 OID 49433)
-- Name: so_customer_category category_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.so_customer_category ALTER COLUMN category_id SET DEFAULT nextval('public.so_customer_category_category_id_seq'::regclass);


--
-- TOC entry 5034 (class 2604 OID 49408)
-- Name: so_customer_master customer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.so_customer_master ALTER COLUMN customer_id SET DEFAULT nextval('public.so_customer_master_customer_id_seq'::regclass);


--
-- TOC entry 5013 (class 2604 OID 24650)
-- Name: status_master status_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_master ALTER COLUMN status_id SET DEFAULT nextval('public.status_master_status_id_seq'::regclass);


--
-- TOC entry 5009 (class 2604 OID 24628)
-- Name: tax_group tax_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_group ALTER COLUMN tax_id SET DEFAULT nextval('public.tax_group_tax_id_seq'::regclass);


--
-- TOC entry 5005 (class 2604 OID 24606)
-- Name: vendor_classification cl_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_classification ALTER COLUMN cl_id SET DEFAULT nextval('public.vendor_classification_cl_id_seq'::regclass);


--
-- TOC entry 5007 (class 2604 OID 24617)
-- Name: vendor_type v_type_no; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_type ALTER COLUMN v_type_no SET DEFAULT nextval('public.vendor_type_v_type_no_seq'::regclass);


--
-- TOC entry 5400 (class 0 OID 49892)
-- Dependencies: 271
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, user_id, label, address_line, city, state, pincode, latitude, longitude, is_default, created_at) FROM stdin;
\.


--
-- TOC entry 5374 (class 0 OID 41161)
-- Dependencies: 245
-- Data for Name: ap_upload; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ap_upload (ap_id, accounting_date, gl_date, voucher_date, period_name, type, voucher_no, check_receipt_number, vendor_name, cmc_no, check_or_dd_num, description, receipts, payments, bank_account_name, bank_account_num, user_id, created_by, created_date, updated_by, updated_date, organization_id, status, reconcile_id, remarks) FROM stdin;
75948	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1791	RENGARAJAN	0101202862000	\N	\N	\N	2400	\N	\N	\N	\N	2026-10-28 14:59:17.931893	\N	\N	\N	\N	\N	\N
75949	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1759	 KUPPAN  	0101210821000	\N	\N	774	\N	\N	\N	\N	\N	2026-10-28 14:59:17.940051	\N	\N	\N	\N	\N	\N
75950	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1805	 MURUGAN T S  	0101003201000	\N	\N	\N	422	\N	\N	\N	\N	2026-10-28 14:59:17.941004	\N	\N	\N	\N	\N	\N
75951	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1800	 KANNIYAMMAL  	0100320698IRD	\N	\N	\N	1500	\N	\N	\N	\N	2026-10-28 14:59:17.942031	\N	\N	\N	\N	\N	\N
75952	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1800	 KANNIYAMMAL  	0100320698IRD	\N	\N	\N	1500	\N	\N	\N	\N	2026-10-28 14:59:17.942991	\N	\N	\N	\N	\N	\N
75953	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1793	 SAGULHAMEED Z & SONS  	0101107901000	\N	\N	2980	\N	\N	\N	\N	\N	2026-10-28 14:59:17.943548	\N	\N	\N	\N	\N	\N
75954	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1793	 SAGULHAMEED Z & SONS  	0101107901000	\N	\N	2980	\N	\N	\N	\N	\N	2026-10-28 14:59:17.944189	\N	\N	\N	\N	\N	\N
75955	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1815	G YOGANANDHAN	0101202477000	\N	\N	\N	6442	\N	\N	\N	\N	2026-10-28 14:59:17.944719	\N	\N	\N	\N	\N	\N
75956	\N	01-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1738	R VENKATRAMAN	0100500532000	\N	\N	2400	\N	\N	\N	\N	\N	2026-10-28 14:59:17.945319	\N	\N	\N	\N	\N	\N
75958	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/17488	SIMON    	\N	\N	\N	2500	\N	\N	\N	\N	\N	2026-10-28 14:59:17.948218	\N	\N	\N	\N	\N	\N
75959	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/17488	SIMON 	\N	\N	\N	2500	\N	\N	\N	\N	\N	2026-10-28 14:59:17.949307	\N	\N	\N	\N	\N	\N
75957	\N	44930	\N	\N	\N	\N	22-23/Z01/2/17601	 S VARALAKS	\N	\N	\N	3400	\N	\N	\N	\N	\N	2026-10-28 14:59:17.946423	\N	\N	\N	RECONCILED	20	\N
\.


--
-- TOC entry 5364 (class 0 OID 24669)
-- Dependencies: 235
-- Data for Name: app_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_user (user_id, user_code, user_name, mob_no, mail_id, role, status, password, eff_from, eff_to, attach, file_name, mime_type, attribute1, attribute2, attribute3, attribute4, attribute5, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
\.


--
-- TOC entry 5372 (class 0 OID 41107)
-- Dependencies: 243
-- Data for Name: bank_statemant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_statemant (bs_id, transfer_date, invoice_number, transfer_name, withdrawals, deposits, balance, user_id, created_by, created_date, updated_by, updated_date, organization_id, status, new_name, reconcile_id, remarks) FROM stdin;
31144	02-JAN-2023	22-23/Z01/2/1791	RENGARAJAN	2400	\N	\N	\N	\N	2026-10-28 14:55:15.729093	\N	\N	\N	\N	\N	\N	\N
31145	02-JAN-2023	22-23/Z01/2/1759	 KUPPAN  	\N	774	\N	\N	\N	2026-10-28 14:55:15.756629	\N	\N	\N	\N	\N	\N	\N
31146	02-JAN-2023	22-23/Z01/2/1805	 MURUGAN 	422	\N	\N	\N	\N	2026-10-28 14:55:15.760262	\N	\N	\N	\N	\N	\N	\N
31147	02-JAN-2023	22-23/Z01/2/1761	 VARALAKS	\N	1700	\N	\N	\N	2026-10-28 14:55:15.762105	\N	\N	\N	\N	\N	\N	\N
31149	02-JAN-2023	22-23/Z01/2/1800	 KANNIYAMMAL  	3000	\N	\N	\N	\N	2026-10-28 14:55:15.765916	\N	\N	\N	\N	\N	\N	\N
31150	02-JAN-2023	\N	 SAGULHAMEED Z & SONS  	\N	5960	\N	\N	\N	2026-10-28 14:55:15.767329	\N	\N	\N	\N	\N	\N	\N
31151	02-JAN-2023	\N	AROKIYA	\N	500	\N	\N	\N	2026-10-28 14:55:15.769258	\N	\N	\N	\N	\N	\N	\N
31152	02-JAN-2023	\N	AJITH	\N	1800	\N	\N	\N	2026-10-28 14:55:15.770699	\N	\N	\N	\N	\N	\N	\N
31153	02-JAN-2023	\N	AJITH	\N	300	\N	\N	\N	2026-10-28 14:55:15.773533	\N	\N	\N	\N	\N	\N	\N
31154	02-JAN-2023	22-23/Z01/2/1748	 JOHNSON SIMON  	\N	5000	\N	\N	\N	2026-10-28 14:55:15.775104	\N	\N	\N	\N	\N	\N	\N
31155	02-JAN-2023	\N	R VENKATRAMAN	\N	2400	\N	\N	\N	2026-10-28 14:55:15.77713	\N	\N	\N	\N	\N	\N	\N
31148	02-JAN-2023	\N	 VARALAKS	\N	1700	\N	\N	\N	2026-10-28 14:55:15.764286	\N	\N	\N	RECONCILED	\N	\N	\N
\.


--
-- TOC entry 5408 (class 0 OID 50093)
-- Dependencies: 279
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.banners (id, title, image_url, link, is_active, created_at) FROM stdin;
\.


--
-- TOC entry 5392 (class 0 OID 49462)
-- Dependencies: 263
-- Data for Name: brs_match; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brs_match (id, group_id, ref, created_at) FROM stdin;
\.


--
-- TOC entry 5402 (class 0 OID 49927)
-- Dependencies: 273
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, code, discount_type, discount_value, min_order_value, max_discount, valid_from, valid_until, usage_limit, used_count, is_active, created_at) FROM stdin;
1dff9a77-4d72-4cdf-8b36-7f54019bbd5c	FIRST50	PERCENTAGE	50.00	100.00	100.00	2026-04-16 20:53:06.316665	2026-05-16 20:53:06.316665	500	0	t	2026-04-16 20:53:06.316665
7dc17f13-75cb-4064-a4fb-be010cc6b26c	FLAT30	FLAT	30.00	99.00	\N	2026-04-16 20:53:06.316665	2026-05-16 20:53:06.316665	200	0	t	2026-04-16 20:53:06.316665
ff361279-2dd3-48bc-ae32-5e460919f6ac	WELCOME20	PERCENTAGE	20.00	200.00	200.00	2026-04-16 20:53:06.316665	2026-06-15 20:53:06.316665	1000	0	t	2026-04-16 20:53:06.316665
\.


--
-- TOC entry 5412 (class 0 OID 58392)
-- Dependencies: 284
-- Data for Name: customer_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customer_master (customer_id, customer_name, email, phone, status, created_at, updated_at) FROM stdin;
1	Arun Kumar	arun@example.com	9876543210	ACTIVE	2026-10-23 13:48:20.07968+05:30	2026-10-23 13:48:20.07968+05:30
2	AJITH ŘÃM	ajith128879@gmail.com	8903472854	ACTIVE	2026-10-23 14:11:16.718071+05:30	2026-10-23 14:11:16.718071+05:30
3	Prasanna	prasanna@gmail.com	8903472854	ACTIVE	2026-10-23 15:06:27.068001+05:30	2026-10-23 15:06:27.068001+05:30
4	Gopal	gopal@gmail.com	8903472854	ACTIVE	2026-10-23 15:06:40.469533+05:30	2026-10-23 15:06:40.469533+05:30
5	Anitha	anitha128879@gmail.com	8903472854	ACTIVE	2026-10-23 15:07:42.820278+05:30	2026-10-23 15:07:42.820278+05:30
7	AJITH ŘÃM	ajith1128879@gmail.com	8903472854	ACTIVE	2026-10-23 18:31:26.174748+05:30	2026-10-23 18:31:26.174748+05:30
\.


--
-- TOC entry 5403 (class 0 OID 49951)
-- Dependencies: 274
-- Data for Name: delivery_agents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_agents (id, user_id, vehicle_no, is_available, created_at) FROM stdin;
\.


--
-- TOC entry 5362 (class 0 OID 24658)
-- Dependencies: 233
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department (dept_id, dept_code, dept_name, status, notes, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
\.


--
-- TOC entry 5370 (class 0 OID 40997)
-- Dependencies: 241
-- Data for Name: doc_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doc_master (doc_id, doc_type, doc_prefix, current_val, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
1	INVOICE	INV	1	attr1 value	attr2 value	attr3 value	attr4 value	attr5 value	101	101	2026-03-23 22:06:58.071347+05:30	\N	\N	1
2	PO	PO-2026	1000	\N	\N	\N	\N	\N	5	5	2026-03-23 22:07:02.952793+05:30	\N	\N	2
3	2	3	23	\N	\N	\N	\N	\N	\N	\N	2026-03-23 22:09:17.891841+05:30	\N	\N	\N
\.


--
-- TOC entry 5376 (class 0 OID 41171)
-- Dependencies: 247
-- Data for Name: gl_upload; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gl_upload (gl_id, effective_date, trx_date, segment1, segment4, ae_header_id, ae_line_num, month, invoice_number, description, name, cmc_name, cmc_no, check_or_dd_num, receipt_method, bank_name, bank_account_number, accounted_dr, accounted_cr, je_category, source, user_id, created_by, created_date, updated_by, updated_date, organization_id, status, reconcile_id, remarks) FROM stdin;
74871	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1791	\N	RENGARAJAN	RENGARAJAN	0101202862000	\N	\N	\N	\N	0	2400	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74872	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1759	\N	 KUPPAN  	 KUPPAN  	0101210821000	\N	\N	\N	\N	774	0	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74873	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1787	\N	 A. RAVICHANDRAN  	 A. RAVICHANDRAN  	0101201356000	\N	\N	\N	\N	964	0	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74874	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1800	\N	 KANNIYAMMAL  	 KANNIYAMMAL  	0100320698IRD	\N	\N	\N	\N	0	1500	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74875	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1800	\N	 KANNIYAMMAL  	 KANNIYAMMAL  	0100320698IRD	\N	\N	\N	\N	0	1500	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74876	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1793	\N	 SAGULHAMEED Z & SONS  	 SAGULHAMEED Z & SONS  	0101107901000	\N	\N	\N	\N	5960	0	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74877	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1815	\N	G YOGANANDHAN	G YOGANANDHAN	0101202477000	\N	\N	\N	\N	0	6442	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74878	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/W001/1/3164	\N	AROKIYASELVI J	AROKIYASELVI J	0100320596IRD	\N	\N	\N	\N	480	0	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74879	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/17891	\N	AJITH	AJITH	1005016890010	\N	\N	\N	\N	2100	0	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74880	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1789	\N	K.MUTHUKUMAR, K.SAKTHIKUMAR	K.MUTHUKUMAR	0100501689000	\N	\N	\N	\N	0	2500	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74882	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/17488	\N	SIMON    	SIMON JOHNSON   	\N	\N	\N	\N	\N	2500	0	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74883	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/17488	\N	SIMON 	SIMON JOHNSON   	\N	\N	\N	\N	\N	2500	0	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	\N	\N	\N
74881	\N	\N	\N	\N	\N	\N	44930	22-23/Z01/2/17601	\N	 S VARALAKS	 S VARALAKS	\N	\N	\N	\N	\N	3400	0	\N	\N	\N	\N	2026-10-28 14:57:33.857258	\N	\N	\N	RECONCILED	20	\N
\.


--
-- TOC entry 5386 (class 0 OID 49396)
-- Dependencies: 257
-- Data for Name: inv_item_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inv_item_category (cat_no, category_name) FROM stdin;
\.


--
-- TOC entry 5378 (class 0 OID 49341)
-- Dependencies: 249
-- Data for Name: inv_item_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inv_item_master (item_id, item_code, item_short_name, item_desc, ref_part_no, status, category, hsn_no, primary_uom, purchase_uom, stock_uom, sales_uom, warehouse, locator, min_qty, max_qty) FROM stdin;
\.


--
-- TOC entry 5380 (class 0 OID 49361)
-- Dependencies: 251
-- Data for Name: inv_location; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inv_location (location_id, location_code, location_name, location_type, status, address, country_id, state_id, city_id, landline, mobile_no, email, contact) FROM stdin;
\.


--
-- TOC entry 5384 (class 0 OID 49383)
-- Dependencies: 255
-- Data for Name: inv_tax_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inv_tax_mapping (map_id, map_no, item_id, purchase_tax_id, sale_tax_id, category, status) FROM stdin;
\.


--
-- TOC entry 5382 (class 0 OID 49373)
-- Dependencies: 253
-- Data for Name: inv_uom; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inv_uom (uom_id, uom_code, uom_name, description) FROM stdin;
\.


--
-- TOC entry 5398 (class 0 OID 49775)
-- Dependencies: 269
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, name, barcode, price) FROM stdin;
\.


--
-- TOC entry 5405 (class 0 OID 50021)
-- Dependencies: 276
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, service_id, item_type, quantity, unit_price, total_price, created_at) FROM stdin;
\.


--
-- TOC entry 5406 (class 0 OID 50046)
-- Dependencies: 277
-- Data for Name: order_status_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_status_logs (id, order_id, status, note, changed_by, created_at) FROM stdin;
\.


--
-- TOC entry 5404 (class 0 OID 49970)
-- Dependencies: 275
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_number, user_id, address_id, coupon_id, agent_id, status, pickup_date, pickup_time_slot, delivery_date, delivery_time_slot, special_instructions, subtotal, tax_percent, tax_amount, discount_amount, total_amount, payment_status, payment_method, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5368 (class 0 OID 24691)
-- Dependencies: 239
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organization (org_id, org_code, short_name, org_name, effective_from, effective_to, industry, currency, status, landline_no, mobile_no, email, website, linkedin, twitter, address, country_id, state_id, city_id, bank_name, branch_name, ifsc_code, acc_no, acc_holder, noof_users, modules, reg_no, reg_place, pan_no, gstin, logo, logo_mime, logo_filename, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date) FROM stdin;
1	ORG003	EduTech	Education Technology Services	\N	\N	Education	USD	PENDING	\N	\N	hello@edutech.com	\N	\N	\N	456 Mount Road, Tambaram, Chennai	1	26	123	\N	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	2026-02-10 08:47:31.348103	\N	\N
2	ORG002	RetailHub	Retail Hub Solutions LLP	2024-06-15	\N	Retail	INR	ACTIVE	044-87654321	+919123456789	info@retailhub.in	https://retailhub.in	\N	\N	Plot 45, GST Road, Tambaram, Chennai 600047	1	26	123	ICICI Bank	Tambaram Branch	ICIC0000456	987654321098	Retail Hub Solutions LLP	15	["POS","Inventory"]	R87654321	Mumbai ROC	AAABC5678C	27AAABC5678C1Z2	\N	\N	\N	Retail Sector	\N	\N	\N	\N	\N	1	2026-02-10 08:47:40.022285	\N	\N
\.


--
-- TOC entry 5409 (class 0 OID 50151)
-- Dependencies: 280
-- Data for Name: organization_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organization_master (org_id, org_code, short_name, org_name, effective_from, effective_to, industry, currency, status, landline_no, mobile_no, email, website, linkedin, twitter, address, country_id, state_id, city_id, bank_name, branch_name, ifsc_code, acc_no, acc_holder, noof_users, modules, reg_no, reg_place, pan_no, gstin, logo, logo_mime, logo_filename, logo_url, user_id, created_by, created_date, updated_by, updated_date) FROM stdin;
1	ORG001	ABC	ABC Pvt Ltd	2024-01-01	\N	Manufacturing	1	1	04412345678	9876543210	info@abc.com	https://abc.com	https://linkedin.com/abc	https://twitter.com/abc	Chennai, Tamil Nadu, India	101	201	301	HDFC Bank	T Nagar	HDFC0001234	1234567890	ABC Pvt Ltd	50	ERP,CRM	REG12345	Chennai	ABCDE1234F	33ABCDE1234F1Z5	\N	\N	\N	\N	1001	admin	2026-04-19 12:22:23.325125+05:30	\N	\N
\.


--
-- TOC entry 5350 (class 0 OID 24577)
-- Dependencies: 221
-- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.organizations (org_id, org_code, short_name, org_name, effective_from, effective_to, industry, currency, status, landline_no, mobile_no, email, website, linkedin, twitter, address, country_id, state_id, city_id, bank_name, branch_name, ifsc_code, acc_no, acc_holder, noof_users, modules, reg_no, reg_place, pan_no, gstin, logo, logo_mime, logo_filename, attribute1, attribute2, attribute3, attribute4, attribute5, created_by, created_date, updated_by, updated_date) FROM stdin;
1	ORG003	EduTech	Education Technology Services	\N	\N	Education	USD	PENDING	\N	\N	hello@edutech.com	\N	\N	\N	456 Mount Road, Tambaram, Chennai	1	26	123	\N	\N	\N	\N	\N	8	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	2026-01-21 20:53:17.705351	\N	\N
2	3	\N	Fetch Row from KMT_SALES_DELETED	\N	\N	\N	\N	ACTIVE	\N	08903472854	ajithram.gopal@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-01-21 21:56:53.994466	\N	\N
7		\N		\N	\N	\N	\N	ACTIVE	\N			\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-01-21 22:47:36.224423	\N	\N
8	1	\N	2	\N	\N	\N	\N	ACTIVE	\N	4	3	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-01-21 22:48:40.718603	\N	\N
9	346	\N	6346	\N	\N	\N	\N	ACTIVE	\N	634646346	6346	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-02 19:29:04.496025	\N	\N
10	13	\N	31231	\N	\N	\N	\N	ACTIVE	\N	41414	141414	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-02-02 19:29:13.642834	\N	\N
\.


--
-- TOC entry 5407 (class 0 OID 50069)
-- Dependencies: 278
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, order_id, user_id, amount, method, status, transaction_id, paid_at, created_at) FROM stdin;
\.


--
-- TOC entry 5366 (class 0 OID 24680)
-- Dependencies: 237
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project (project_id, project_name, proposal_id, project_no, prospect_id, customer_id, start_date, end_date, closure_date, currency_id, contact_person, sales_rep, assign_to, status, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
\.


--
-- TOC entry 5394 (class 0 OID 49752)
-- Dependencies: 265
-- Data for Name: quote_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quote_items (id, quote_id, item_id, qty, price) FROM stdin;
\.


--
-- TOC entry 5396 (class 0 OID 49763)
-- Dependencies: 267
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quotes (id, customer_name, total, created_at) FROM stdin;
\.


--
-- TOC entry 5358 (class 0 OID 24636)
-- Dependencies: 229
-- Data for Name: role_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_master (role_id, role_code, role_name, description, purpose, notes, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
\.


--
-- TOC entry 5401 (class 0 OID 49913)
-- Dependencies: 272
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, name, description, price_per_kg, price_per_item, estimated_hours, is_active, image_url, created_at) FROM stdin;
7f23ea8b-3581-424c-b69f-1a50abb0a9fa	Wash & Fold	Machine wash, dry, and neatly fold your clothes	50.00	\N	24	t	/icons/wash.png	2026-04-16 20:52:57.187624
392ba0c0-e27a-48b7-9e0a-20978d0b0707	Dry Clean	Professional dry cleaning for delicate garments	\N	150.00	48	t	/icons/dryclean.png	2026-04-16 20:52:57.187624
355a4480-3813-471a-be58-c1dd443f8a7c	Iron Only	Steam iron for freshly washed clothes	\N	15.00	12	t	/icons/iron.png	2026-04-16 20:52:57.187624
b4133696-80d2-488e-bdc7-9ea1c34d0cf4	Express Wash	Same-day delivery wash & fold service	80.00	\N	6	t	/icons/express.png	2026-04-16 20:52:57.187624
\.


--
-- TOC entry 5390 (class 0 OID 49430)
-- Dependencies: 261
-- Data for Name: so_customer_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.so_customer_category (category_id, category_name, description, price_list_id, credit_limit, gst_applicable, status) FROM stdin;
\.


--
-- TOC entry 5388 (class 0 OID 49405)
-- Dependencies: 259
-- Data for Name: so_customer_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.so_customer_master (customer_id, customer_code, customer_name, classification, status, mobile, email, website, address1, address2, address3, country, state, city, zipcode, gstin, cin) FROM stdin;
1	CUST001	ABC Pvt Ltd	1	1	9876543210	abc@example.com	www.abc.com	No.10, First Street	Anna Nagar	Near Bus Stand	91	33	101	600001	33ABCDE1234F1Z5	U12345TN2020PTC123456
2	1	1	1	1	1	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	1	Ajithram Gopal	1	1	08903472854	ajithram.gopal@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
4	123	456	789	10	11	121	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
5	1	2	3	4	08903472854	1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
6	111	Ajithram Gopal	1	2	08903472854	ajithram.gopal@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
7	111	Ajithram Gopal	1	2	08903472854	ajithram.gopal@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
8	111	222	333	444	08903472854	ajithram.gopal@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
9	111	222	333	444	08903472854	ajithram.gopal@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5410 (class 0 OID 58002)
-- Dependencies: 281
-- Data for Name: status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status (status_id, status_code, status_name, description, purpose, notes, color, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
1	100	ACTIVE	Active status	GENERAL	Active records	GREEN	\N	\N	\N	\N	\N	\N
2	200	INACTIVE	Inactive status	GENERAL	Disabled records	RED	\N	\N	\N	\N	\N	\N
3	300	PENDING	Pending approval	WORKFLOW	Waiting approval	YELLOW	\N	\N	\N	\N	\N	\N
11	2	3	4	5	dsvxv	2	\N	\N	\N	\N	\N	\N
12	23	ajith	325	5325	5325	5325	\N	\N	\N	\N	\N	\N
214	4124	4214	4124	412412	1241241241	21421	\N	\N	\N	\N	\N	\N
6666	46	634	366346	6346	\N	634	\N	\N	\N	\N	\N	\N
951	712	954	214	4214	421424214	4214	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5360 (class 0 OID 24647)
-- Dependencies: 231
-- Data for Name: status_master; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.status_master (status_id, status_code, status_name, description, purpose, notes, color, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
\.


--
-- TOC entry 5356 (class 0 OID 24625)
-- Dependencies: 227
-- Data for Name: tax_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tax_group (tax_id, group_code, tax_name, tax_type, tax_per, flat_amt, gst, cgst, sgst, igst, utgst, status, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
\.


--
-- TOC entry 5399 (class 0 OID 49870)
-- Dependencies: 270
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, phone, email, password_hash, role, is_active, otp, otp_expires_at, created_at, updated_at) FROM stdin;
081216d3-9c83-438c-9277-7ebe5b734a4d	Admin	9000000000	admin@cleanease.com	$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi	admin	t	\N	\N	2026-04-16 20:52:52.947524	2026-04-16 20:52:52.947524
\.


--
-- TOC entry 5352 (class 0 OID 24603)
-- Dependencies: 223
-- Data for Name: vendor_classification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_classification (cl_id, cl_code, cl_name, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
\.


--
-- TOC entry 5354 (class 0 OID 24614)
-- Dependencies: 225
-- Data for Name: vendor_type; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendor_type (v_type_no, vendor_type, attribute1, attribute2, attribute3, attribute4, attribute5, user_id, created_by, created_date, updated_by, updated_date, organization_id) FROM stdin;
\.


--
-- TOC entry 5438 (class 0 OID 0)
-- Dependencies: 244
-- Name: ap_upload_ap_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ap_upload_ap_id_seq', 75959, true);


--
-- TOC entry 5439 (class 0 OID 0)
-- Dependencies: 234
-- Name: app_user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.app_user_user_id_seq', 1, false);


--
-- TOC entry 5440 (class 0 OID 0)
-- Dependencies: 242
-- Name: bank_statemant_bs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bank_statemant_bs_id_seq', 31155, true);


--
-- TOC entry 5441 (class 0 OID 0)
-- Dependencies: 262
-- Name: brs_match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brs_match_id_seq', 1, false);


--
-- TOC entry 5442 (class 0 OID 0)
-- Dependencies: 283
-- Name: customer_master_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customer_master_customer_id_seq', 7, true);


--
-- TOC entry 5443 (class 0 OID 0)
-- Dependencies: 232
-- Name: department_dept_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_dept_id_seq', 1, false);


--
-- TOC entry 5444 (class 0 OID 0)
-- Dependencies: 240
-- Name: doc_master_doc_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doc_master_doc_id_seq', 3, true);


--
-- TOC entry 5445 (class 0 OID 0)
-- Dependencies: 246
-- Name: gl_upload_gl_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gl_upload_gl_id_seq', 74883, true);


--
-- TOC entry 5446 (class 0 OID 0)
-- Dependencies: 256
-- Name: inv_item_category_cat_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inv_item_category_cat_no_seq', 1, false);


--
-- TOC entry 5447 (class 0 OID 0)
-- Dependencies: 248
-- Name: inv_item_master_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inv_item_master_item_id_seq', 1, false);


--
-- TOC entry 5448 (class 0 OID 0)
-- Dependencies: 250
-- Name: inv_location_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inv_location_location_id_seq', 1, false);


--
-- TOC entry 5449 (class 0 OID 0)
-- Dependencies: 254
-- Name: inv_tax_mapping_map_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inv_tax_mapping_map_id_seq', 1, false);


--
-- TOC entry 5450 (class 0 OID 0)
-- Dependencies: 252
-- Name: inv_uom_uom_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inv_uom_uom_id_seq', 1, false);


--
-- TOC entry 5451 (class 0 OID 0)
-- Dependencies: 268
-- Name: items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.items_id_seq', 1, false);


--
-- TOC entry 5452 (class 0 OID 0)
-- Dependencies: 238
-- Name: organization_org_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organization_org_id_seq', 2, true);


--
-- TOC entry 5453 (class 0 OID 0)
-- Dependencies: 220
-- Name: organizations_org_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organizations_org_id_seq', 10, true);


--
-- TOC entry 5454 (class 0 OID 0)
-- Dependencies: 236
-- Name: project_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_project_id_seq', 1, false);


--
-- TOC entry 5455 (class 0 OID 0)
-- Dependencies: 264
-- Name: quote_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quote_items_id_seq', 1, false);


--
-- TOC entry 5456 (class 0 OID 0)
-- Dependencies: 266
-- Name: quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quotes_id_seq', 1, false);


--
-- TOC entry 5457 (class 0 OID 0)
-- Dependencies: 228
-- Name: role_master_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_master_role_id_seq', 1, false);


--
-- TOC entry 5458 (class 0 OID 0)
-- Dependencies: 260
-- Name: so_customer_category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.so_customer_category_category_id_seq', 1, false);


--
-- TOC entry 5459 (class 0 OID 0)
-- Dependencies: 258
-- Name: so_customer_master_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.so_customer_master_customer_id_seq', 12, true);


--
-- TOC entry 5460 (class 0 OID 0)
-- Dependencies: 230
-- Name: status_master_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.status_master_status_id_seq', 1, false);


--
-- TOC entry 5461 (class 0 OID 0)
-- Dependencies: 226
-- Name: tax_group_tax_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tax_group_tax_id_seq', 1, false);


--
-- TOC entry 5462 (class 0 OID 0)
-- Dependencies: 222
-- Name: vendor_classification_cl_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendor_classification_cl_id_seq', 1, false);


--
-- TOC entry 5463 (class 0 OID 0)
-- Dependencies: 224
-- Name: vendor_type_v_type_no_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendor_type_v_type_no_seq', 1, false);


--
-- TOC entry 5153 (class 2606 OID 49907)
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 5117 (class 2606 OID 41169)
-- Name: ap_upload ap_upload_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ap_upload
    ADD CONSTRAINT ap_upload_pkey PRIMARY KEY (ap_id);


--
-- TOC entry 5107 (class 2606 OID 24678)
-- Name: app_user app_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_user
    ADD CONSTRAINT app_user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 5115 (class 2606 OID 41115)
-- Name: bank_statemant bank_statemant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_statemant
    ADD CONSTRAINT bank_statemant_pkey PRIMARY KEY (bs_id);


--
-- TOC entry 5182 (class 2606 OID 50105)
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- TOC entry 5135 (class 2606 OID 49468)
-- Name: brs_match brs_match_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brs_match
    ADD CONSTRAINT brs_match_pkey PRIMARY KEY (id);


--
-- TOC entry 5158 (class 2606 OID 49950)
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- TOC entry 5160 (class 2606 OID 49948)
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- TOC entry 5188 (class 2606 OID 58409)
-- Name: customer_master customer_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_master
    ADD CONSTRAINT customer_master_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 5163 (class 2606 OID 49962)
-- Name: delivery_agents delivery_agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_agents
    ADD CONSTRAINT delivery_agents_pkey PRIMARY KEY (id);


--
-- TOC entry 5165 (class 2606 OID 49964)
-- Name: delivery_agents delivery_agents_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_agents
    ADD CONSTRAINT delivery_agents_user_id_key UNIQUE (user_id);


--
-- TOC entry 5105 (class 2606 OID 24667)
-- Name: department department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pkey PRIMARY KEY (dept_id);


--
-- TOC entry 5113 (class 2606 OID 41005)
-- Name: doc_master doc_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doc_master
    ADD CONSTRAINT doc_master_pkey PRIMARY KEY (doc_id);


--
-- TOC entry 5119 (class 2606 OID 41179)
-- Name: gl_upload gl_upload_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gl_upload
    ADD CONSTRAINT gl_upload_pkey PRIMARY KEY (gl_id);


--
-- TOC entry 5129 (class 2606 OID 49403)
-- Name: inv_item_category inv_item_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_item_category
    ADD CONSTRAINT inv_item_category_pkey PRIMARY KEY (cat_no);


--
-- TOC entry 5121 (class 2606 OID 49359)
-- Name: inv_item_master inv_item_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_item_master
    ADD CONSTRAINT inv_item_master_pkey PRIMARY KEY (item_id);


--
-- TOC entry 5123 (class 2606 OID 49371)
-- Name: inv_location inv_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_location
    ADD CONSTRAINT inv_location_pkey PRIMARY KEY (location_id);


--
-- TOC entry 5127 (class 2606 OID 49394)
-- Name: inv_tax_mapping inv_tax_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_tax_mapping
    ADD CONSTRAINT inv_tax_mapping_pkey PRIMARY KEY (map_id);


--
-- TOC entry 5125 (class 2606 OID 49381)
-- Name: inv_uom inv_uom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inv_uom
    ADD CONSTRAINT inv_uom_pkey PRIMARY KEY (uom_id);


--
-- TOC entry 5141 (class 2606 OID 49785)
-- Name: items items_barcode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_barcode_key UNIQUE (barcode);


--
-- TOC entry 5143 (class 2606 OID 49783)
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- TOC entry 5175 (class 2606 OID 50035)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5178 (class 2606 OID 50058)
-- Name: order_status_logs order_status_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_logs
    ADD CONSTRAINT order_status_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5170 (class 2606 OID 50000)
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- TOC entry 5172 (class 2606 OID 49998)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 5184 (class 2606 OID 50158)
-- Name: organization_master organization_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization_master
    ADD CONSTRAINT organization_master_pkey PRIMARY KEY (org_id);


--
-- TOC entry 5111 (class 2606 OID 24700)
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (org_id);


--
-- TOC entry 5091 (class 2606 OID 24589)
-- Name: organizations organizations_org_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_org_code_key UNIQUE (org_code);


--
-- TOC entry 5093 (class 2606 OID 24587)
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (org_id);


--
-- TOC entry 5180 (class 2606 OID 50082)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5109 (class 2606 OID 24689)
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (project_id);


--
-- TOC entry 5137 (class 2606 OID 49760)
-- Name: quote_items quote_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quote_items
    ADD CONSTRAINT quote_items_pkey PRIMARY KEY (id);


--
-- TOC entry 5139 (class 2606 OID 49773)
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- TOC entry 5101 (class 2606 OID 24645)
-- Name: role_master role_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_master
    ADD CONSTRAINT role_master_pkey PRIMARY KEY (role_id);


--
-- TOC entry 5156 (class 2606 OID 49926)
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- TOC entry 5133 (class 2606 OID 49440)
-- Name: so_customer_category so_customer_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.so_customer_category
    ADD CONSTRAINT so_customer_category_pkey PRIMARY KEY (category_id);


--
-- TOC entry 5131 (class 2606 OID 49417)
-- Name: so_customer_master so_customer_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.so_customer_master
    ADD CONSTRAINT so_customer_master_pkey PRIMARY KEY (customer_id);


--
-- TOC entry 5103 (class 2606 OID 24656)
-- Name: status_master status_master_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status_master
    ADD CONSTRAINT status_master_pkey PRIMARY KEY (status_id);


--
-- TOC entry 5186 (class 2606 OID 58009)
-- Name: status status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT status_pkey PRIMARY KEY (status_id);


--
-- TOC entry 5099 (class 2606 OID 24634)
-- Name: tax_group tax_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tax_group
    ADD CONSTRAINT tax_group_pkey PRIMARY KEY (tax_id);


--
-- TOC entry 5147 (class 2606 OID 49891)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5149 (class 2606 OID 49889)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 5151 (class 2606 OID 49887)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5095 (class 2606 OID 24612)
-- Name: vendor_classification vendor_classification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_classification
    ADD CONSTRAINT vendor_classification_pkey PRIMARY KEY (cl_id);


--
-- TOC entry 5097 (class 2606 OID 24623)
-- Name: vendor_type vendor_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_type
    ADD CONSTRAINT vendor_type_pkey PRIMARY KEY (v_type_no);


--
-- TOC entry 5154 (class 1259 OID 50111)
-- Name: idx_addresses_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_addresses_user ON public.addresses USING btree (user_id);


--
-- TOC entry 5161 (class 1259 OID 50114)
-- Name: idx_coupons_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_coupons_code ON public.coupons USING btree (code);


--
-- TOC entry 5173 (class 1259 OID 50109)
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- TOC entry 5166 (class 1259 OID 50108)
-- Name: idx_orders_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_created_at ON public.orders USING btree (created_at DESC);


--
-- TOC entry 5167 (class 1259 OID 50107)
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- TOC entry 5168 (class 1259 OID 50106)
-- Name: idx_orders_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_user_id ON public.orders USING btree (user_id);


--
-- TOC entry 5176 (class 1259 OID 50110)
-- Name: idx_status_logs_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_status_logs_order ON public.order_status_logs USING btree (order_id);


--
-- TOC entry 5144 (class 1259 OID 50112)
-- Name: idx_users_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_phone ON public.users USING btree (phone);


--
-- TOC entry 5145 (class 1259 OID 50113)
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- TOC entry 5189 (class 1259 OID 58410)
-- Name: uq_customer_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_customer_email ON public.customer_master USING btree (lower((email)::text));


--
-- TOC entry 5190 (class 2606 OID 49908)
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5191 (class 2606 OID 49965)
-- Name: delivery_agents delivery_agents_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_agents
    ADD CONSTRAINT delivery_agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5196 (class 2606 OID 50036)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 5197 (class 2606 OID 50041)
-- Name: order_items order_items_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id);


--
-- TOC entry 5198 (class 2606 OID 50064)
-- Name: order_status_logs order_status_logs_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_logs
    ADD CONSTRAINT order_status_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.users(id);


--
-- TOC entry 5199 (class 2606 OID 50059)
-- Name: order_status_logs order_status_logs_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_logs
    ADD CONSTRAINT order_status_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 5192 (class 2606 OID 50006)
-- Name: orders orders_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- TOC entry 5193 (class 2606 OID 50016)
-- Name: orders orders_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.delivery_agents(id);


--
-- TOC entry 5194 (class 2606 OID 50011)
-- Name: orders orders_coupon_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES public.coupons(id);


--
-- TOC entry 5195 (class 2606 OID 50001)
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5200 (class 2606 OID 50083)
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 5201 (class 2606 OID 50088)
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-10-28 16:04:02

--
-- PostgreSQL database dump complete
--

\unrestrict 9oBGOj903pw5z6XIJqGTXnl37Tn97zMV8p3qruAKKX0AmpRdqDBPRGlZ5gMt1tS

