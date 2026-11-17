--
-- PostgreSQL database dump
--

\restrict 8qkOgWyA5QClqKeS6y2GboC7MqFnk7c5HP9on0IN3b6CNDgfPJOwqOVYkMYNGQ7

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-11-16 09:36:14

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
432899	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1791	RENGARAJAN	0101202862000	\N	\N	\N	2400	\N	\N	\N	\N	2026-11-15 14:14:35.397023	\N	\N	\N	\N	\N	\N
432900	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1759	 KUPPAN  	0101210821000	\N	\N	774	\N	\N	\N	\N	\N	2026-11-15 14:14:35.425054	\N	\N	\N	\N	\N	\N
432901	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1805	 MURUGAN T S  	0101003201000	\N	\N	\N	422	\N	\N	\N	\N	2026-11-15 14:14:35.426689	\N	\N	\N	\N	\N	\N
432902	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1800	 KANNIYAMMAL  	0100320698IRD	\N	\N	\N	1500	\N	\N	\N	\N	2026-11-15 14:14:35.428075	\N	\N	\N	\N	\N	\N
432903	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1800	 KANNIYAMMAL  	0100320698IRD	\N	\N	\N	1500	\N	\N	\N	\N	2026-11-15 14:14:35.429601	\N	\N	\N	\N	\N	\N
432904	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1793	 SAGULHAMEED Z & SONS  	0101107901000	\N	\N	2980	\N	\N	\N	\N	\N	2026-11-15 14:14:35.431293	\N	\N	\N	\N	\N	\N
432905	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1793	 SAGULHAMEED Z & SONS  	0101107901000	\N	\N	2980	\N	\N	\N	\N	\N	2026-11-15 14:14:35.613736	\N	\N	\N	\N	\N	\N
432906	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1815	G YOGANANDHAN	0101202477000	\N	\N	\N	6442	\N	\N	\N	\N	2026-11-15 14:14:35.630958	\N	\N	\N	\N	\N	\N
432907	\N	01-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/1738	R VENKATRAMAN	0100500532000	\N	\N	934	\N	\N	\N	\N	\N	2026-11-15 14:14:35.63482	\N	\N	\N	\N	\N	\N
432908	\N	44930	\N	\N	\N	\N	22-23/Z01/2/17601	 S VARALAKS	\N	\N	\N	3400	\N	\N	\N	\N	\N	2026-11-15 14:14:35.636254	\N	\N	\N	\N	\N	\N
432909	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/17488	SIMON    	\N	\N	\N	2500	\N	\N	\N	\N	\N	2026-11-15 14:14:35.637643	\N	\N	\N	\N	\N	\N
432910	\N	02-JAN-2023	\N	\N	\N	\N	22-23/Z01/2/17488	SIMON 	\N	\N	\N	2500	\N	\N	\N	\N	\N	2026-11-15 14:14:35.638971	\N	\N	\N	RECONCILED	32	\N
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
31404	02-JAN-2023	22-23/Z01/2/1805	 MURUGAN T S  	422	\N	\N	\N	\N	2026-11-15 17:32:28.259619	\N	\N	\N	\N	\N	\N	\N
31405	02-JAN-2023	22-23/Z01/2/1761	 VARALAKS	\N	1700	\N	\N	\N	2026-11-15 17:32:28.261183	\N	\N	\N	\N	\N	\N	\N
31406	02-JAN-2023	22-23/Z01/2/1761	 VARALAKS	\N	1700	\N	\N	\N	2026-11-15 17:32:28.266687	\N	\N	\N	\N	\N	\N	\N
31407	02-JAN-2023	22-23/Z01/2/1800	 KANNIYAMMAL  	3000	\N	\N	\N	\N	2026-11-15 17:32:28.268002	\N	\N	\N	\N	\N	\N	\N
31408	02-JAN-2023	\N	 SAGULHAMEED Z & SONS  	\N	5960	\N	\N	\N	2026-11-15 17:32:28.26943	\N	\N	\N	\N	\N	\N	\N
31409	02-JAN-2023	\N	AROKIYA	\N	500	\N	\N	\N	2026-11-15 17:32:28.270549	\N	\N	\N	\N	\N	\N	\N
31410	02-JAN-2023	\N	AJITH	\N	1800	\N	\N	\N	2026-11-15 17:32:28.271777	\N	\N	\N	\N	\N	\N	\N
31411	02-JAN-2023	\N	AJITH	\N	300	\N	\N	\N	2026-11-15 17:32:28.272937	\N	\N	\N	\N	\N	\N	\N
31413	02-JAN-2023	\N	R VENKATRAMAN	\N	2400	\N	\N	\N	2026-11-15 17:32:28.275502	\N	\N	\N	\N	\N	\N	\N
31412	02-JAN-2023	22-23/Z01/2/1748	 JOHNSON SIMON  	\N	5000	\N	\N	\N	2026-11-15 17:32:28.274011	\N	\N	\N	RECONCILED	\N	32	\N
31403	02-JAN-2023	22-23/Z01/2/1759	 KUPPAN  	\N	774	\N	\N	\N	2026-11-15 17:32:28.255671	\N	\N	\N	\N	\N	\N	Ajithram
31402	02-JAN-2023	22-23/Z01/2/1791	RENGARAJAN	2400	\N	\N	\N	\N	2026-11-15 17:32:28.230361	\N	\N	\N	\N	\N	\N	Ram
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
245341	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1791	\N	RENGARAJAN	RENGARAJAN	0101202862000	\N	\N	\N	\N	\N	2400	\N	\N	\N	\N	2026-11-15 14:15:59.642866	\N	\N	\N	\N	\N	\N
245342	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1759	\N	 KUPPAN  	 KUPPAN  	0101210821000	\N	\N	\N	\N	774	\N	\N	\N	\N	\N	2026-11-15 14:15:59.656067	\N	\N	\N	\N	\N	\N
245343	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1800	\N	 KANNIYAMMAL  	 KANNIYAMMAL  	0100320698IRD	\N	\N	\N	\N	\N	1500	\N	\N	\N	\N	2026-11-15 14:15:59.6578	\N	\N	\N	\N	\N	\N
245344	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1800	\N	 KANNIYAMMAL  	 KANNIYAMMAL  	0100320698IRD	\N	\N	\N	\N	\N	1500	\N	\N	\N	\N	2026-11-15 14:15:59.659387	\N	\N	\N	\N	\N	\N
245345	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1793	\N	 SAGULHAMEED Z & SONS  	 SAGULHAMEED Z & SONS  	0101107901000	\N	\N	\N	\N	5960	\N	\N	\N	\N	\N	2026-11-15 14:15:59.661459	\N	\N	\N	\N	\N	\N
245346	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/1815	\N	G YOGANANDHAN	G YOGANANDHAN	0101202477000	\N	\N	\N	\N	\N	6442	\N	\N	\N	\N	2026-11-15 14:15:59.662883	\N	\N	\N	\N	\N	\N
245347	\N	\N	\N	\N	\N	\N	44930	22-23/Z01/2/17601	\N	 S VARALAKS	 S VARALAKS	\N	\N	\N	\N	\N	3400	\N	\N	\N	\N	\N	2026-11-15 14:15:59.664319	\N	\N	\N	\N	\N	\N
245348	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/17488	\N	SIMON    	SIMON JOHNSON   	\N	\N	\N	\N	\N	2500	\N	\N	\N	\N	\N	2026-11-15 14:15:59.665747	\N	\N	\N	\N	\N	\N
245349	\N	\N	\N	\N	\N	\N	02-JAN-2023	22-23/Z01/2/17488	\N	SIMON 	SIMON JOHNSON   	\N	\N	\N	\N	\N	2500	\N	\N	\N	\N	\N	2026-11-15 14:15:59.667095	\N	\N	\N	RECONCILED	32	\N
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
9ac1434f-600e-4e75-8e62-deab20ef9f04	ram	15544	ram@gmail.com	$2b$10$nSd6rzLaAzqAX0jy/.NQ0OFZjZVxFmtDk4G2f5pq3Dp5W99qbb7fq	ADMIN	t	\N	\N	2026-11-14 15:32:44.867081	2026-11-14 15:32:44.867081
b87e2b08-407f-4a79-abd3-899f3130176f	AJITH ŘÃM	23564758678	ajith128879@gmail.com	$2b$10$DUXkGsfRXxU2eyL4YZQYkORsc83w6XopJJ.aCsK6jyzark3NzyZkC	ADMIN	t	\N	\N	2026-11-14 15:18:49.163784	2026-11-14 19:13:35.627606
766608ba-fe43-4344-bd10-418f998dab18	anitha	+918903472854	anitha@gmail.com	$2b$10$sbx3GRwdwNG1RhW.VukuHuQxls/XGHFHWzIRtPa9t5DStzW6wuzT2	USER	f	\N	\N	2026-11-14 18:43:58.597485	2026-11-15 13:00:43.625779
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

SELECT pg_catalog.setval('public.ap_upload_ap_id_seq', 432910, true);


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

SELECT pg_catalog.setval('public.bank_statemant_bs_id_seq', 31413, true);


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

SELECT pg_catalog.setval('public.gl_upload_gl_id_seq', 245349, true);


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


-- Completed on 2026-11-16 09:36:15

--
-- PostgreSQL database dump complete
--

\unrestrict 8qkOgWyA5QClqKeS6y2GboC7MqFnk7c5HP9on0IN3b6CNDgfPJOwqOVYkMYNGQ7

