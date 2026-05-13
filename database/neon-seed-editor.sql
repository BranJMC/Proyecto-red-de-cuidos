--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at) VALUES ('11111111-1111-1111-1111-111111111112', 'carlos@familia.com', '$2b$10$7lrS1CXOsA.Lo5oossTGjegFlaCxLYEvUS99WUf/49V.LL6tuqeUa', 'client', 'active', 'Carlos Robles', '+50688882222', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', '2026-04-24 21:52:27.741313-06', NULL, NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at) VALUES ('22222222-2222-2222-2222-222222222221', 'valeria@cuidados.com', '$2b$10$stUkG0F.J0UEQ//1qxoW1.9FvKNSCfguPgvTp0rTo.R8GsPtDP8BC', 'caregiver', 'active', 'Valeria Rojas', '+50688883333', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80', '2026-04-24 21:52:27.741313-06', NULL, NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at) VALUES ('22222222-2222-2222-2222-222222222222', 'daniel@cuidados.com', '$2b$10$ttNdUsCBKFV2jdBESItDKO7Gmq4APvVW7/1wniqKihV5HV.WpkaJy', 'caregiver', 'active', 'Daniel Castro', '+50688884444', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', '2026-04-24 21:52:27.741313-06', NULL, NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at) VALUES ('22222222-2222-2222-2222-222222222223', 'monica@cuidados.com', '$2b$10$.s6fPMeSnyJReTD/xeMRDObN7lvGtS5kZChPgQqfbb1CvnBkACKDy', 'caregiver', 'active', 'Monica Arias', '+50688885555', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df2?auto=format&fit=crop&w=900&q=80', '2026-04-24 21:52:27.741313-06', NULL, NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at) VALUES ('22222222-2222-2222-2222-222222222224', 'sofia@cuidados.com', '$2b$10$BipnsuAdNxfr4rtvBAEI9uoXQnZz9egz2TOTCj24FmkxpsWZjlwPS', 'caregiver', 'active', 'Sofia Meneses', '+50688886666', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80', '2026-04-24 21:52:27.741313-06', NULL, NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at) VALUES ('33333333-3333-3333-3333-333333333331', 'admin@redcuidados.com', '$2b$10$BForLpnyeD4/NmuxN586FueYPb5PP10XqJQgohyl1nUMIBnEwDiIS', 'admin', 'active', 'Lucia Herrera', '+50688887777', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80', '2026-04-24 21:52:27.741313-06', NULL, NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at) VALUES ('3d21a1ea-9b3e-4953-bde0-af93196808e3', 'branj3112@gmail.com', '$2b$10$FxKCjB0QihtI6MOCuTNmCuDN.f9NMaf/ttBrCfK5zDyOQhsgqV41a', 'client', 'active', 'Brandon', '72721111', NULL, '2026-04-24 22:07:25.661874-06', NULL, NULL, '2026-04-24 22:07:25.661874-06', '2026-04-24 22:07:25.661874-06');
INSERT INTO public.users (id, email, password_hash, role, status, full_name, phone, avatar_url, email_verified_at, phone_verified_at, last_login_at, created_at, updated_at) VALUES ('11111111-1111-1111-1111-111111111111', 'ana@familia.com', '$2b$10$hDuQCOwOPB15LAJzrdTkJeBcZNAKIEU0tWfRJLW1aY23Kf9tg2prK', 'client', 'active', 'Ana Gutierrez', '+50688881111', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', '2026-04-24 21:52:27.741313-06', NULL, '2026-05-01 21:55:57.532182-06', '2026-04-24 21:38:16.249589-06', '2026-05-01 21:55:57.532182-06');


--
-- Data for Name: admin_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.admin_profiles (user_id, title, department, permissions, require_email_otp, created_at, updated_at) VALUES ('33333333-3333-3333-3333-333333333331', 'Operations Lead', 'Trust & Safety', '{"all": true}', true, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: ai_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.ai_reviews (id, target_type, target_id, provider, decision, confidence, summary, flags, raw_result, reviewed_by, created_at) VALUES ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'payment_proof', '9d4ea6c0-4f33-4615-af11-0c26e35531b1', 'dev-seed', 'manual_review', 0.8100, 'El comprobante requiere revision por recorte y referencia incompleta.', '{"Referencia parcial"}', '{}', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.ai_reviews (id, target_type, target_id, provider, decision, confidence, summary, flags, raw_result, reviewed_by, created_at) VALUES ('cccccccc-cccc-cccc-cccc-ccccccccccc2', 'payment_proof', 'de1ec996-5d0b-4d34-b45a-1e2dd9654b8d', 'dev-seed', 'approved', 0.9600, 'El comprobante coincide con el monto y la referencia.', '{"Sin anomalÃ­as"}', '{}', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: analytics_series_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.analytics_series_points (id, series_name, point_label, "values", sort_order, created_at) VALUES ('1a25ab6c-cbb7-415b-9157-be8d49b0340f', 'earnings', 'Lun', '{"platform": 320, "caregiver": 1800}', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.analytics_series_points (id, series_name, point_label, "values", sort_order, created_at) VALUES ('9ef527bb-880b-4b29-9640-a1de096359c0', 'earnings', 'Mar', '{"platform": 410, "caregiver": 2200}', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.analytics_series_points (id, series_name, point_label, "values", sort_order, created_at) VALUES ('f70cad2b-cf2c-4c8f-bfef-018e495f14ff', 'earnings', 'Mie', '{"platform": 395, "caregiver": 2100}', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.analytics_series_points (id, series_name, point_label, "values", sort_order, created_at) VALUES ('0e8f08db-31a5-4425-aeae-89dbc1738ade', 'platform', 'Lun', '{"bookings": 12, "messages": 44, "payments": 7}', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.analytics_series_points (id, series_name, point_label, "values", sort_order, created_at) VALUES ('71db1bee-3f36-409f-91d0-32a96a2fef64', 'platform', 'Mar', '{"bookings": 14, "messages": 51, "payments": 9}', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.analytics_series_points (id, series_name, point_label, "values", sort_order, created_at) VALUES ('eb58fb4e-137e-4de1-a4eb-5d87db9dfa1d', 'platform', 'Mie', '{"bookings": 16, "messages": 47, "payments": 8}', 0, '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: app_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.audit_logs (id, actor_id, action, target_type, target_id, ip_address, metadata, created_at) VALUES ('80b75248-76f3-4efa-9e68-321f7c3a0cfb', '33333333-3333-3333-3333-333333333331', 'Aprobo cuidador', 'caregiver', '22222222-2222-2222-2222-222222222223', NULL, '{"target": "Monica Arias"}', '2026-04-22 21:52:27.741313-06');
INSERT INTO public.audit_logs (id, actor_id, action, target_type, target_id, ip_address, metadata, created_at) VALUES ('8c31d18a-1dc5-4ed8-be76-5fdcc16c535b', '33333333-3333-3333-3333-333333333331', 'Marco alerta', 'payment_proof', '9d4ea6c0-4f33-4615-af11-0c26e35531b1', NULL, '{"target": "Comprobante TRX-88421"}', '2026-04-23 21:52:27.741313-06');
INSERT INTO public.audit_logs (id, actor_id, action, target_type, target_id, ip_address, metadata, created_at) VALUES ('959a71e4-e9dd-4b83-9da8-c7b4480dda74', '33333333-3333-3333-3333-333333333331', 'Cerro ticket', 'support_ticket', '4df3666d-29c1-4156-8941-b225c1dc13be', NULL, '{"target": "Soporte comprobante"}', '2026-04-24 15:52:27.741313-06');


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.provinces (id, name) VALUES ('44444444-4444-4444-4444-444444444441', 'San Jose');
INSERT INTO public.provinces (id, name) VALUES ('44444444-4444-4444-4444-444444444442', 'Heredia');
INSERT INTO public.provinces (id, name) VALUES ('44444444-4444-4444-4444-444444444443', 'Alajuela');
INSERT INTO public.provinces (id, name) VALUES ('44444444-4444-4444-4444-444444444444', 'Cartago');


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.cities (id, province_id, name) VALUES ('55555555-5555-5555-5555-555555555551', '44444444-4444-4444-4444-444444444441', 'Escazu');
INSERT INTO public.cities (id, province_id, name) VALUES ('55555555-5555-5555-5555-555555555552', '44444444-4444-4444-4444-444444444441', 'Santa Ana');
INSERT INTO public.cities (id, province_id, name) VALUES ('55555555-5555-5555-5555-555555555553', '44444444-4444-4444-4444-444444444442', 'Belen');
INSERT INTO public.cities (id, province_id, name) VALUES ('55555555-5555-5555-5555-555555555554', '44444444-4444-4444-4444-444444444443', 'La Guacima');
INSERT INTO public.cities (id, province_id, name) VALUES ('55555555-5555-5555-5555-555555555555', '44444444-4444-4444-4444-444444444444', 'La Union');


--
-- Data for Name: neighborhoods; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.neighborhoods (id, city_id, name, center) VALUES ('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551', 'San Rafael', NULL);
INSERT INTO public.neighborhoods (id, city_id, name, center) VALUES ('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555552', 'Pozos', NULL);
INSERT INTO public.neighborhoods (id, city_id, name, center) VALUES ('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555553', 'La Ribera', NULL);
INSERT INTO public.neighborhoods (id, city_id, name, center) VALUES ('66666666-6666-6666-6666-666666666664', '55555555-5555-5555-5555-555555555554', 'Hacienda Los Reyes', NULL);
INSERT INTO public.neighborhoods (id, city_id, name, center) VALUES ('66666666-6666-6666-6666-666666666665', '55555555-5555-5555-5555-555555555555', 'Tres Rios', NULL);


--
-- Data for Name: booking_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.booking_locations (id, label, address_line, province_id, city_id, neighborhood_id, point, notes, created_at) VALUES ('99999999-9999-9999-9999-999999999991', 'Casa principal Escazu', 'San Rafael de Escazu, 300m norte del parque', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555551', '66666666-6666-6666-6666-666666666661', NULL, NULL, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.booking_locations (id, label, address_line, province_id, city_id, neighborhood_id, point, notes, created_at) VALUES ('99999999-9999-9999-9999-999999999992', 'Casa principal Belen', 'La Ribera, casa azul frente al minisuper', '44444444-4444-4444-4444-444444444442', '55555555-5555-5555-5555-555555555553', '66666666-6666-6666-6666-666666666663', NULL, NULL, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.booking_locations (id, label, address_line, province_id, city_id, neighborhood_id, point, notes, created_at) VALUES ('99999999-9999-9999-9999-999999999993', 'Condominio Guacima', 'La Guacima, condominio Hacienda Los Reyes', '44444444-4444-4444-4444-444444444443', '55555555-5555-5555-5555-555555555554', '66666666-6666-6666-6666-666666666664', NULL, NULL, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.booking_locations (id, label, address_line, province_id, city_id, neighborhood_id, point, notes, created_at) VALUES ('99999999-9999-9999-9999-999999999994', 'Casa principal Tres Rios', 'Tres Rios centro, 100m oeste de la iglesia', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666665', NULL, NULL, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.booking_locations (id, label, address_line, province_id, city_id, neighborhood_id, point, notes, created_at) VALUES ('b2737398-c95f-4160-b65f-f59741f2663c', 'Nueva reserva', 'Prueba desde API', NULL, NULL, NULL, NULL, NULL, '2026-04-24 21:47:03.885482-06');


--
-- Data for Name: caregiver_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.caregiver_profiles (user_id, public_slug, headline, bio, years_experience, base_hourly_rate, night_shift_fee, weekend_fee, emergency_fee, languages, service_count, rank, rating_average, rating_count, profile_image_url, urgent_availability, available_now, available_today, night_shift_available, weekend_available, emergency_service, verified_status, can_work, created_at, updated_at) VALUES ('22222222-2222-2222-2222-222222222222', 'daniel-castro', 'Elder care and medication routines', 'Cuidador gerontologico enfocado en movilidad, compania activa y seguimiento de medicacion diaria.', 10, 20.00, 10.00, 7.00, 16.00, '{Espanol}', 89, 'Gold', 4.80, 92, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80', false, false, true, true, false, false, 'approved', true, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_profiles (user_id, public_slug, headline, bio, years_experience, base_hourly_rate, night_shift_fee, weekend_fee, emergency_fee, languages, service_count, rank, rating_average, rating_count, profile_image_url, urgent_availability, available_now, available_today, night_shift_available, weekend_available, emergency_service, verified_status, can_work, created_at, updated_at) VALUES ('22222222-2222-2222-2222-222222222223', 'monica-arias', 'Disability support and adaptive routines', 'Disena planes de acompanamiento inclusivo para ninos y adultos con necesidades funcionales diversas.', 9, 24.00, 12.00, 8.00, 18.00, '{Espanol,Ingles,LESCO}', 58, 'Gold', 5.00, 67, 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df2?auto=format&fit=crop&w=900&q=80', true, true, true, true, true, true, 'approved', true, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_profiles (user_id, public_slug, headline, bio, years_experience, base_hourly_rate, night_shift_fee, weekend_fee, emergency_fee, languages, service_count, rank, rating_average, rating_count, profile_image_url, urgent_availability, available_now, available_today, night_shift_available, weekend_available, emergency_service, verified_status, can_work, created_at, updated_at) VALUES ('22222222-2222-2222-2222-222222222221', 'valeria-rojas', 'Child care and learning support', 'Especialista en primera infancia, rutinas seguras y acompanamiento despues de clases con enfoque Montessori.', 7, 18.00, 8.00, 6.00, 12.00, '{Espanol,Ingles}', 146, 'Platinum', 4.90, 128, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80', true, true, true, true, true, true, 'approved', true, '2026-04-24 21:38:16.249589-06', '2026-04-24 22:10:13.025831-06');
INSERT INTO public.caregiver_profiles (user_id, public_slug, headline, bio, years_experience, base_hourly_rate, night_shift_fee, weekend_fee, emergency_fee, languages, service_count, rank, rating_average, rating_count, profile_image_url, urgent_availability, available_now, available_today, night_shift_available, weekend_available, emergency_service, verified_status, can_work, created_at, updated_at) VALUES ('22222222-2222-2222-2222-222222222224', 'sofia-meneses', 'Home assistance and overnight care', 'Combina soporte del hogar con acompanamiento delicado para rutinas nocturnas y cuidados prolongados.', 6, 19.00, 9.00, 7.00, 15.00, '{Espanol,Ingles}', 21, 'Silver', 4.70, 54, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80', true, false, true, true, true, true, 'approved', true, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: client_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.client_profiles (user_id, family_name, emergency_contact_name, emergency_contact_phone, preferred_language, created_at, updated_at) VALUES ('11111111-1111-1111-1111-111111111111', 'Familia Gutierrez', 'Laura Gutierrez', '+50688881110', 'es', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.client_profiles (user_id, family_name, emergency_contact_name, emergency_contact_phone, preferred_language, created_at, updated_at) VALUES ('11111111-1111-1111-1111-111111111112', 'Familia Robles', 'Miguel Robles', '+50688882220', 'es', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.client_profiles (user_id, family_name, emergency_contact_name, emergency_contact_phone, preferred_language, created_at, updated_at) VALUES ('3d21a1ea-9b3e-4953-bde0-af93196808e3', 'Brandon', NULL, NULL, 'es', '2026-04-24 22:07:25.661874-06', '2026-04-24 22:07:25.661874-06');


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bookings (id, client_id, caregiver_id, service_type, status, scheduled_date, start_time, end_time, total_hours, location_id, hourly_rate, night_fee, weekend_fee, emergency_fee, platform_fee, discount, total_amount, coupon_code, notes, created_at, updated_at) VALUES ('88888888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Child care', 'confirmed', '2026-04-22', '14:00:00', '18:00:00', 4.00, '99999999-9999-9999-9999-999999999991', 18.00, 0.00, 0.00, 0.00, 0.00, 0.00, 72.00, NULL, 'Rutina despues de clases.', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.bookings (id, client_id, caregiver_id, service_type, status, scheduled_date, start_time, end_time, total_hours, location_id, hourly_rate, night_fee, weekend_fee, emergency_fee, platform_fee, discount, total_amount, coupon_code, notes, created_at, updated_at) VALUES ('88888888-8888-8888-8888-888888888882', '11111111-1111-1111-1111-111111111112', '22222222-2222-2222-2222-222222222222', 'Elder care', 'requested', '2026-04-25', '08:00:00', '16:00:00', 8.00, '99999999-9999-9999-9999-999999999992', 20.00, 0.00, 0.00, 0.00, 0.00, 0.00, 160.00, NULL, 'Apoyo con movilidad y medicamentos.', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.bookings (id, client_id, caregiver_id, service_type, status, scheduled_date, start_time, end_time, total_hours, location_id, hourly_rate, night_fee, weekend_fee, emergency_fee, platform_fee, discount, total_amount, coupon_code, notes, created_at, updated_at) VALUES ('88888888-8888-8888-8888-888888888883', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', 'Disability support', 'completed', '2026-04-16', '10:00:00', '16:00:00', 6.00, '99999999-9999-9999-9999-999999999993', 24.00, 0.00, 0.00, 0.00, 0.00, 0.00, 144.00, NULL, 'Acompanamiento integral.', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.bookings (id, client_id, caregiver_id, service_type, status, scheduled_date, start_time, end_time, total_hours, location_id, hourly_rate, night_fee, weekend_fee, emergency_fee, platform_fee, discount, total_amount, coupon_code, notes, created_at, updated_at) VALUES ('88888888-8888-8888-8888-888888888884', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222224', 'Overnight care', 'confirmed', '2026-04-27', '20:00:00', '23:59:00', 10.00, '99999999-9999-9999-9999-999999999994', 19.00, 9.00, 7.00, 0.00, 20.00, 0.00, 235.00, NULL, 'Turno nocturno y acompanamiento.', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.bookings (id, client_id, caregiver_id, service_type, status, scheduled_date, start_time, end_time, total_hours, location_id, hourly_rate, night_fee, weekend_fee, emergency_fee, platform_fee, discount, total_amount, coupon_code, notes, created_at, updated_at) VALUES ('33a54475-3820-402f-bce5-c9e453d92b56', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 'Child care', 'requested', '2026-04-30', '09:00:00', '12:00:00', 3.00, 'b2737398-c95f-4160-b65f-f59741f2663c', 18.00, 0.00, 0.00, 0.00, 0.00, 0.00, 54.00, NULL, 'Reserva creada en prueba automatica', '2026-04-24 21:47:03.885482-06', '2026-04-24 21:47:03.885482-06');


--
-- Data for Name: booking_checkins; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: hourly_service_updates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.hourly_service_updates (id, booking_id, caregiver_id, hour_number, summary, status, submitted_at) VALUES ('a9a51356-6259-4c8c-a162-99e75738cc50', '88888888-8888-8888-8888-888888888881', '22222222-2222-2222-2222-222222222221', 1, 'Todo estable. Merienda completada y rutina tranquila.', 'on-track', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.hourly_service_updates (id, booking_id, caregiver_id, hour_number, summary, status, submitted_at) VALUES ('f965e92a-c103-441b-be9b-f1193c4f3596', '88888888-8888-8888-8888-888888888881', '22222222-2222-2222-2222-222222222221', 2, 'Se completo actividad sensorial y descanso programado.', 'completed', '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: booking_evidence_files; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: booking_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: caregiver_availability_labels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.caregiver_availability_labels (id, caregiver_id, label, sort_order, created_at) VALUES ('88cc9b89-520a-442a-8797-f9a87f8c7dc0', '22222222-2222-2222-2222-222222222221', 'Hoy 14:00-20:00', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_availability_labels (id, caregiver_id, label, sort_order, created_at) VALUES ('a93426d1-a56b-4adb-9239-3aadf34350ec', '22222222-2222-2222-2222-222222222221', 'Manana 08:00-18:00', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_availability_labels (id, caregiver_id, label, sort_order, created_at) VALUES ('6b7b7d13-932d-4a86-b7fd-f99f5465c17e', '22222222-2222-2222-2222-222222222221', 'Sabado 09:00-15:00', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_availability_labels (id, caregiver_id, label, sort_order, created_at) VALUES ('4dddee57-8f90-40eb-adbe-feb47c9f312b', '22222222-2222-2222-2222-222222222222', 'Lunes a Viernes 07:00-17:00', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_availability_labels (id, caregiver_id, label, sort_order, created_at) VALUES ('57f72d91-a587-4516-a8df-22cb7c155788', '22222222-2222-2222-2222-222222222223', 'Disponible 24 horas con reserva', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_availability_labels (id, caregiver_id, label, sort_order, created_at) VALUES ('61fd446c-7e26-4753-a5e4-8ace3500ad5f', '22222222-2222-2222-2222-222222222224', 'Hoy 18:00-23:00', 0, '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_availability_labels (id, caregiver_id, label, sort_order, created_at) VALUES ('85bf2651-996a-4a5a-9cfe-72dece5dce4a', '22222222-2222-2222-2222-222222222224', 'Domingo 08:00-20:00', 0, '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: caregiver_calendar_blocks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: caregiver_certifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('c7b49ab3-4049-412f-9fd8-33ff6db2891a', '22222222-2222-2222-2222-222222222221', 'Primeros auxilios', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);
INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('e176ec49-057c-47d6-a4b7-7de9b19cae81', '22222222-2222-2222-2222-222222222221', 'Psicologia infantil', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);
INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('6e11224c-27c5-405a-bd09-034a79d0fa72', '22222222-2222-2222-2222-222222222221', 'RCP', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);
INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('77fbec74-00e5-4359-8bca-004c5e059a39', '22222222-2222-2222-2222-222222222222', 'Asistente geriatrico', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);
INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('3e7b9aab-7eba-4b81-9a12-da3ea7e161f0', '22222222-2222-2222-2222-222222222222', 'Manejo de medicamentos', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);
INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('70047fc4-6680-4d4b-aafc-c4d52de8cd4b', '22222222-2222-2222-2222-222222222223', 'Terapia ocupacional', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);
INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('4ca5d49f-5a9f-40eb-89a5-89515443228e', '22222222-2222-2222-2222-222222222223', 'Comunicacion aumentativa', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);
INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('b93317d8-7e7c-4670-bb8e-0ba91498c6ce', '22222222-2222-2222-2222-222222222224', 'Cuidados paliativos basicos', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);
INSERT INTO public.caregiver_certifications (id, caregiver_id, certification_name, issued_by, issued_at, expires_at, created_at, file_id) VALUES ('7f71da14-24b7-42a1-8b29-ac406cf54ba0', '22222222-2222-2222-2222-222222222224', 'RCP', NULL, NULL, NULL, '2026-04-24 21:38:16.249589-06', NULL);


--
-- Data for Name: caregiver_search_events; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: service_zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.service_zones (id, province_id, city_id, neighborhood_id, name, demand_level, active_caregivers, boundary, active, created_at) VALUES ('77777777-7777-7777-7777-777777777771', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555551', '66666666-6666-6666-6666-666666666661', 'Escazu Centro', 'high', 38, NULL, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.service_zones (id, province_id, city_id, neighborhood_id, name, demand_level, active_caregivers, boundary, active, created_at) VALUES ('77777777-7777-7777-7777-777777777772', '44444444-4444-4444-4444-444444444441', '55555555-5555-5555-5555-555555555552', '66666666-6666-6666-6666-666666666662', 'Santa Ana - Pozos', 'high', 29, NULL, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.service_zones (id, province_id, city_id, neighborhood_id, name, demand_level, active_caregivers, boundary, active, created_at) VALUES ('77777777-7777-7777-7777-777777777773', '44444444-4444-4444-4444-444444444442', '55555555-5555-5555-5555-555555555553', '66666666-6666-6666-6666-666666666663', 'Belen - La Ribera', 'medium', 17, NULL, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.service_zones (id, province_id, city_id, neighborhood_id, name, demand_level, active_caregivers, boundary, active, created_at) VALUES ('77777777-7777-7777-7777-777777777774', '44444444-4444-4444-4444-444444444443', '55555555-5555-5555-5555-555555555554', '66666666-6666-6666-6666-666666666664', 'La Guacima', 'emerging', 12, NULL, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.service_zones (id, province_id, city_id, neighborhood_id, name, demand_level, active_caregivers, boundary, active, created_at) VALUES ('77777777-7777-7777-7777-777777777775', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666665', 'Tres Rios', 'medium', 14, NULL, true, '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: caregiver_service_zones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.caregiver_service_zones (caregiver_id, service_zone_id, is_primary, created_at) VALUES ('22222222-2222-2222-2222-222222222221', '77777777-7777-7777-7777-777777777771', true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.caregiver_service_zones (caregiver_id, service_zone_id, is_primary, created_at) VALUES ('22222222-2222-2222-2222-222222222222', '77777777-7777-7777-7777-777777777773', true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.caregiver_service_zones (caregiver_id, service_zone_id, is_primary, created_at) VALUES ('22222222-2222-2222-2222-222222222223', '77777777-7777-7777-7777-777777777774', true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.caregiver_service_zones (caregiver_id, service_zone_id, is_primary, created_at) VALUES ('22222222-2222-2222-2222-222222222224', '77777777-7777-7777-7777-777777777775', true, '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: caregiver_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('09cfa6dd-c18d-4869-9b6d-3561dd4e81fb', '22222222-2222-2222-2222-222222222221', 'Child care', 'Child care con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('fc187347-8460-4032-8e48-5c35a05c624e', '22222222-2222-2222-2222-222222222221', 'Overnight care', 'Overnight care con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('0e8fafe3-40eb-46b4-8a86-90361cfa130a', '22222222-2222-2222-2222-222222222221', 'Emergency care', 'Emergency care con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('b78f998a-7395-4231-95f1-684eaa997b9f', '22222222-2222-2222-2222-222222222222', 'Elder care', 'Elder care con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('8568850f-ff84-47a8-b645-6f0c4344a23d', '22222222-2222-2222-2222-222222222222', 'Home assistance', 'Home assistance con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('bfaa6768-f298-4513-ae27-675a9ba0c9cc', '22222222-2222-2222-2222-222222222223', 'Disability support', 'Disability support con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('21c1830a-1071-438c-a713-2a11393674e7', '22222222-2222-2222-2222-222222222223', 'Emergency care', 'Emergency care con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('8c60c437-dde6-421a-80d1-cf64ce5cd6be', '22222222-2222-2222-2222-222222222223', 'Home assistance', 'Home assistance con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('b5f58ecb-3a83-4bcc-85f1-64d7ab47fe8c', '22222222-2222-2222-2222-222222222224', 'Home assistance', 'Home assistance con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('2f1d16d4-37f5-4799-8fb9-8571691c1a06', '22222222-2222-2222-2222-222222222224', 'Overnight care', 'Overnight care con seguimiento personalizado.', true);
INSERT INTO public.caregiver_services (id, caregiver_id, service_type, description, active) VALUES ('115a0996-7d41-4803-bb8f-b4dccd9ea8e4', '22222222-2222-2222-2222-222222222224', 'Child care', 'Child care con seguimiento personalizado.', true);


--
-- Data for Name: caregiver_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.caregiver_verifications (id, caregiver_id, status, national_id_number, email_otp_verified, sms_otp_verified, face_photo_verified, submitted_at, reviewed_at, reviewed_by, rejection_reason, created_at, updated_at) VALUES ('bab76f6c-5dfe-49de-b1fb-67e281b64d4c', '22222222-2222-2222-2222-222222222222', 'approved', '1-1234-5678', true, true, true, '2026-04-24 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06', '33333333-3333-3333-3333-333333333331', NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_verifications (id, caregiver_id, status, national_id_number, email_otp_verified, sms_otp_verified, face_photo_verified, submitted_at, reviewed_at, reviewed_by, rejection_reason, created_at, updated_at) VALUES ('01e8b016-0508-4b71-9e94-d7a63934e0d9', '22222222-2222-2222-2222-222222222223', 'approved', '1-1234-5678', true, true, true, '2026-04-24 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06', '33333333-3333-3333-3333-333333333331', NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_verifications (id, caregiver_id, status, national_id_number, email_otp_verified, sms_otp_verified, face_photo_verified, submitted_at, reviewed_at, reviewed_by, rejection_reason, created_at, updated_at) VALUES ('d8592613-7c95-4150-a918-a9384cec08ac', '22222222-2222-2222-2222-222222222224', 'approved', '1-1234-5678', true, true, true, '2026-04-24 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06', '33333333-3333-3333-3333-333333333331', NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.caregiver_verifications (id, caregiver_id, status, national_id_number, email_otp_verified, sms_otp_verified, face_photo_verified, submitted_at, reviewed_at, reviewed_by, rejection_reason, created_at, updated_at) VALUES ('a9389812-9b4b-45e9-9d29-13ff4275c192', '22222222-2222-2222-2222-222222222221', 'approved', '1-1234-5678', true, true, true, '2026-04-24 21:52:27.741313-06', '2026-04-24 22:10:13.023679-06', '33333333-3333-3333-3333-333333333331', NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 22:10:13.023679-06');


--
-- Data for Name: caregiver_working_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.caregiver_working_hours (id, caregiver_id, day_of_week, start_time, end_time, active) VALUES ('797487ee-8eeb-4317-8cea-e65a1b846e0f', '22222222-2222-2222-2222-222222222221', 1, '07:00:00', '12:00:00', true);
INSERT INTO public.caregiver_working_hours (id, caregiver_id, day_of_week, start_time, end_time, active) VALUES ('552d2172-f59f-4afc-bbde-7ab8137aad1d', '22222222-2222-2222-2222-222222222221', 1, '14:00:00', '21:00:00', true);
INSERT INTO public.caregiver_working_hours (id, caregiver_id, day_of_week, start_time, end_time, active) VALUES ('c1584035-ae68-47ec-ba05-b91cf4baa21e', '22222222-2222-2222-2222-222222222221', 4, '14:00:00', '21:00:00', true);
INSERT INTO public.caregiver_working_hours (id, caregiver_id, day_of_week, start_time, end_time, active) VALUES ('b24ff459-4e6d-4c6a-9d65-c5b4fc00ef9b', '22222222-2222-2222-2222-222222222221', 6, '09:00:00', '15:00:00', true);
INSERT INTO public.caregiver_working_hours (id, caregiver_id, day_of_week, start_time, end_time, active) VALUES ('0002cbfe-9526-43b0-8623-79f2ae9ceae2', '22222222-2222-2222-2222-222222222222', 1, '07:00:00', '17:00:00', true);
INSERT INTO public.caregiver_working_hours (id, caregiver_id, day_of_week, start_time, end_time, active) VALUES ('6e7a398c-f99c-4da0-91a5-572e322ce588', '22222222-2222-2222-2222-222222222223', 1, '06:00:00', '22:00:00', true);
INSERT INTO public.caregiver_working_hours (id, caregiver_id, day_of_week, start_time, end_time, active) VALUES ('4063a1b1-127d-4906-a8a6-228f0b5baebf', '22222222-2222-2222-2222-222222222224', 0, '08:00:00', '20:00:00', true);


--
-- Data for Name: content_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.content_pages (id, slug, title, section, body, status, published_at, updated_at) VALUES ('e8ad54a5-f03d-4902-87f5-12dbc3fd4390', 'faq-onboarding-caregivers', 'FAQ onboarding caregivers', 'Help center', 'Contenido inicial para centro de ayuda.', 'published', '2026-04-24 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.content_pages (id, slug, title, section, body, status, published_at, updated_at) VALUES ('36fb0e10-cf50-426b-ba41-d726df806eee', 'safety-week-campaign', 'Campana safety week', 'Home banner', 'Banner promocional para home.', 'scheduled', '2026-04-26 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.content_pages (id, slug, title, section, body, status, published_at, updated_at) VALUES ('cb7544ae-1f54-4dcc-b920-dc0e01276042', 'blog-crisis-care-night', 'Blog crisis care at night', 'Blog', 'Borrador editorial.', 'draft', NULL, '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: conversations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.conversations (id, booking_id, created_at, updated_at) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '88888888-8888-8888-8888-888888888881', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.conversations (id, booking_id, created_at, updated_at) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', NULL, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: conversation_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.conversation_participants (conversation_id, user_id, last_read_at, muted) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', '2026-04-24 21:33:16.249589-06', false);
INSERT INTO public.conversation_participants (conversation_id, user_id, last_read_at, muted) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '22222222-2222-2222-2222-222222222221', '2026-04-24 21:38:16.249589-06', false);
INSERT INTO public.conversation_participants (conversation_id, user_id, last_read_at, muted) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111111', '2026-04-24 21:38:16.249589-06', false);
INSERT INTO public.conversation_participants (conversation_id, user_id, last_read_at, muted) VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:38:16.249589-06', false);


--
-- Data for Name: daily_backups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.daily_backups (id, generated_by, scope, storage_key, size_bytes, status, started_at, completed_at, created_at) VALUES ('ffe9283d-f298-45f8-84ac-435be94403dd', '33333333-3333-3333-3333-333333333331', 'Base completa', 'backups/red-cuidados-2026-04-24.sql.gz', 15728640, 'ready', '2026-04-24 19:38:16.249589-06', '2026-04-24 20:08:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.daily_backups (id, generated_by, scope, storage_key, size_bytes, status, started_at, completed_at, created_at) VALUES ('6c09e3b2-e8bb-446d-9d75-a553a6ca919a', '33333333-3333-3333-3333-333333333331', 'Base completa', 'backups/red-cuidados-2026-04-24.sql.gz', 15728640, 'ready', '2026-04-24 19:52:27.741313-06', '2026-04-24 20:22:27.741313-06', '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: dashboard_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('09305622-1920-46d3-87d5-dec74a49fa41', 'client', 'Reservas activas', '4', '+2 esta semana', 'sky', 1, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('90680876-a89c-4c6d-9532-afa4d5127cca', 'client', 'Pagos en revision', '1', '1 pendiente', 'amber', 2, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('4b42d9db-2586-4632-ada3-dbcd6af90ef9', 'client', 'Favoritos', '3', '+1 nuevo', 'emerald', 3, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('caeddb3c-6566-4dd0-9d61-0023699183d9', 'caregiver', 'Solicitudes nuevas', '6', '+3 hoy', 'sky', 1, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('56ae03df-f6a1-4300-9d04-6261971c291e', 'caregiver', 'Horas reservadas', '28h', '+8h', 'emerald', 2, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('b0c2d9b5-ecf1-41ef-9722-9082bb61aeab', 'caregiver', 'Resenas recientes', '12', '+2 esta semana', 'amber', 3, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('964a517a-d289-418a-a670-b3b6492a5fcf', 'admin', 'Verificaciones pendientes', '5', '-1 hoy', 'amber', 1, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('a5a76633-8a11-46a8-8417-b5d557912cbe', 'admin', 'Reportes abiertos', '2', 'sin cambios', 'rose', 2, true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.dashboard_metrics (id, role, label, value, change_label, accent, sort_order, active, updated_at) VALUES ('589164e0-d79c-4415-b830-21ce5f70f71e', 'admin', 'Backups listos', '1', 'ultimo hace 90m', 'emerald', 3, true, '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: email_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: faq_items; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.favorites (client_id, caregiver_id, created_at) VALUES ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.favorites (client_id, caregiver_id, created_at) VALUES ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.favorites (client_id, caregiver_id, created_at) VALUES ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: fraud_alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fraud_alerts (id, target_type, target_id, risk_level, title, location_label, detail, status, created_at) VALUES ('2a20c576-2ba0-4649-8a62-648ff6c071e9', 'payment_proof', '9d4ea6c0-4f33-4615-af11-0c26e35531b1', 'high', 'Referencia parcial en comprobante', 'Escazu', 'La imagen del recibo no muestra todos los datos bancarios.', 'reviewing', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.fraud_alerts (id, target_type, target_id, risk_level, title, location_label, detail, status, created_at) VALUES ('ebddfdf0-ee73-4446-9cbe-0c3dc27001d7', 'payment_proof', '9d4ea6c0-4f33-4615-af11-0c26e35531b1', 'high', 'Referencia parcial en comprobante', 'Escazu', 'La imagen del recibo no muestra todos los datos bancarios.', 'reviewing', '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: login_otps; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.messages (id, conversation_id, sender_id, body, sent_at, edited_at, deleted_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '22222222-2222-2222-2222-222222222221', 'Hola, confirme la reserva.', '2026-04-24 21:26:16.249589-06', NULL, NULL);
INSERT INTO public.messages (id, conversation_id, sender_id, body, sent_at, edited_at, deleted_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'Perfecto, te esperamos.', '2026-04-24 21:29:16.249589-06', NULL, NULL);
INSERT INTO public.messages (id, conversation_id, sender_id, body, sent_at, edited_at, deleted_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '22222222-2222-2222-2222-222222222221', 'Estoy saliendo hacia tu ubicacion.', '2026-04-24 21:37:16.249589-06', NULL, NULL);
INSERT INTO public.messages (id, conversation_id, sender_id, body, sent_at, edited_at, deleted_at) VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '33333333-3333-3333-3333-333333333331', 'Tu comprobante esta en revision manual.', '2026-04-23 21:38:16.249589-06', NULL, NULL);


--
-- Data for Name: message_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notification_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('b4158fbd-600b-4941-864a-2107690eb3c5', '22222222-2222-2222-2222-222222222221', 'alert', 'Urgencia en Escazu', 'Hay una nueva solicitud para servicio de emergencia en menos de 2 horas.', '{}', '2026-04-24 21:28:16.249589-06', '2026-04-24 21:06:16.249589-06');
INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('7ceaf155-4527-4d5b-b308-3fa3bc21507c', '22222222-2222-2222-2222-222222222223', 'chat', 'Nuevo mensaje', 'Monica envio instrucciones previas a la visita.', '{}', '2026-04-24 20:38:16.249589-06', '2026-04-24 18:38:16.249589-06');
INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('7ec8fdbe-fb3b-4ced-953b-ef1384f0a5f9', '22222222-2222-2222-2222-222222222221', 'booking', 'Nueva solicitud recibida', 'Tienes una nueva reserva para 2026-04-30 a las 09:00.', '{"bookingId": "33a54475-3820-402f-bce5-c9e453d92b56"}', NULL, '2026-04-24 21:47:03.885482-06');
INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('12b24a3e-2896-473a-b7eb-8f2a57d82979', '22222222-2222-2222-2222-222222222221', 'alert', 'Urgencia en Escazu', 'Hay una nueva solicitud para servicio de emergencia en menos de 2 horas.', '{}', '2026-04-24 21:42:27.741313-06', '2026-04-24 21:20:27.741313-06');
INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('7272662b-79fd-4b86-be6b-50ff425df550', '22222222-2222-2222-2222-222222222223', 'chat', 'Nuevo mensaje', 'Monica envio instrucciones previas a la visita.', '{}', '2026-04-24 20:52:27.741313-06', '2026-04-24 18:52:27.741313-06');
INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('5cbc46cc-a55b-4d20-a9f3-5866b14da65e', '11111111-1111-1111-1111-111111111111', 'booking', 'Nueva solicitud confirmada', 'Valeria acepto tu reserva para hoy a las 14:00.', '{"bookingId": "88888888-8888-8888-8888-888888888881"}', '2026-04-24 22:08:48.110392-06', '2026-04-24 21:50:27.741313-06');
INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('fd568eb6-1d67-47bc-a771-ee15f0fdf36e', '11111111-1111-1111-1111-111111111111', 'booking', 'Nueva solicitud confirmada', 'Valeria acepto tu reserva para hoy a las 14:00.', '{"bookingId": "88888888-8888-8888-8888-888888888881"}', '2026-04-24 22:08:48.110392-06', '2026-04-24 21:36:16.249589-06');
INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('117448f7-cdd1-4d2e-bc97-540a2bbd38ca', '11111111-1111-1111-1111-111111111111', 'payment', 'Comprobante recibido', 'Tu recibo de pago ingreso a revision automatizable por AI.', '{}', '2026-04-24 22:08:48.110392-06', '2026-04-24 21:34:27.741313-06');
INSERT INTO public.notifications (id, user_id, type, title, body, data, read_at, created_at) VALUES ('3e3516d2-18e4-4526-9eee-dbcd25b0724f', '11111111-1111-1111-1111-111111111111', 'payment', 'Comprobante recibido', 'Tu recibo de pago ingreso a revision automatizable por AI.', '{}', '2026-04-24 22:08:48.110392-06', '2026-04-24 21:20:16.249589-06');


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payment_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payment_history (id, booking_id, client_id, caregiver_id, amount, method, status, paid_at, reference_number, metadata, created_at) VALUES ('97d7b891-2650-4a8e-ae24-065190249b1b', '88888888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 72.00, 'Transferencia', 'pending-review', '2026-04-24 21:23:16.249589-06', 'TRX-88421', '{}', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.payment_history (id, booking_id, client_id, caregiver_id, amount, method, status, paid_at, reference_number, metadata, created_at) VALUES ('f5c04cc7-ffa0-4c9b-a29b-35bff8baacca', '88888888-8888-8888-8888-888888888884', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222224', 235.00, 'SINPE', 'paid', '2026-04-23 21:38:16.249589-06', 'SINPE-30112', '{}', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.payment_history (id, booking_id, client_id, caregiver_id, amount, method, status, paid_at, reference_number, metadata, created_at) VALUES ('0c8eb339-0bb5-4b3d-bae3-9edb233aee44', '88888888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222221', 72.00, 'Transferencia', 'pending-review', '2026-04-24 21:37:27.741313-06', 'TRX-88421', '{}', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.payment_history (id, booking_id, client_id, caregiver_id, amount, method, status, paid_at, reference_number, metadata, created_at) VALUES ('ac469637-20b6-4d0a-816f-c52faf540bd0', '88888888-8888-8888-8888-888888888884', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222224', 235.00, 'SINPE', 'paid', '2026-04-23 21:52:27.741313-06', 'SINPE-30112', '{}', '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: payment_proofs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payment_proofs (id, booking_id, client_id, status, amount, method, reference_number, uploaded_at, reviewed_by, reviewed_at, rejection_reason) VALUES ('9d4ea6c0-4f33-4615-af11-0c26e35531b1', '88888888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111', 'pending_review', 72.00, 'transferencia', 'TRX-88421', '2026-04-24 21:38:16.249589-06', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:28:16.249589-06', NULL);
INSERT INTO public.payment_proofs (id, booking_id, client_id, status, amount, method, reference_number, uploaded_at, reviewed_by, reviewed_at, rejection_reason) VALUES ('de1ec996-5d0b-4d34-b45a-1e2dd9654b8d', '88888888-8888-8888-8888-888888888884', '11111111-1111-1111-1111-111111111111', 'approved', 235.00, 'sinpe', 'SINPE-30112', '2026-04-24 21:38:16.249589-06', '33333333-3333-3333-3333-333333333331', '2026-04-23 21:38:16.249589-06', NULL);
INSERT INTO public.payment_proofs (id, booking_id, client_id, status, amount, method, reference_number, uploaded_at, reviewed_by, reviewed_at, rejection_reason) VALUES ('ad4c8f69-8013-4805-83ef-8684df9547cd', '88888888-8888-8888-8888-888888888881', '11111111-1111-1111-1111-111111111111', 'pending_review', 72.00, 'transferencia', 'TRX-88421', '2026-04-24 21:52:27.741313-06', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:42:27.741313-06', NULL);
INSERT INTO public.payment_proofs (id, booking_id, client_id, status, amount, method, reference_number, uploaded_at, reviewed_by, reviewed_at, rejection_reason) VALUES ('4412a272-bf8a-4b4d-bc06-182bdbfb808f', '88888888-8888-8888-8888-888888888884', '11111111-1111-1111-1111-111111111111', 'approved', 235.00, 'sinpe', 'SINPE-30112', '2026-04-24 21:52:27.741313-06', '33333333-3333-3333-3333-333333333331', '2026-04-23 21:52:27.741313-06', NULL);


--
-- Data for Name: payment_proof_files; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payment_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payment_reviews (id, payment_proof_id, reviewer_id, ai_review_id, decision, notes, created_at) VALUES ('629b62a6-4c8b-415e-9bb0-1c3f39835263', '9d4ea6c0-4f33-4615-af11-0c26e35531b1', '33333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'pending_review', 'Pendiente de revision manual.', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.payment_reviews (id, payment_proof_id, reviewer_id, ai_review_id, decision, notes, created_at) VALUES ('a378e755-a388-402a-bffb-5f1d254b98c6', 'de1ec996-5d0b-4d34-b45a-1e2dd9654b8d', '33333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'approved', 'Aprobado por validacion automatica.', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.payment_reviews (id, payment_proof_id, reviewer_id, ai_review_id, decision, notes, created_at) VALUES ('038b45ab-26cf-4600-96e2-1e19ea7c9c70', '9d4ea6c0-4f33-4615-af11-0c26e35531b1', '33333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'pending_review', 'Pendiente de revision manual.', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.payment_reviews (id, payment_proof_id, reviewer_id, ai_review_id, decision, notes, created_at) VALUES ('b56021c0-f482-4cb1-bdaf-b0a28284cd2f', 'de1ec996-5d0b-4d34-b45a-1e2dd9654b8d', '33333333-3333-3333-3333-333333333331', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'approved', 'Aprobado por validacion automatica.', '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pricing_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reports (id, reporter_id, booking_id, caregiver_id, report_type, category, urgency, priority, subject, description, status, public_status, assigned_to, created_at, updated_at) VALUES ('eada0eee-407f-4671-b573-933d829d8c4f', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888881', '22222222-2222-2222-2222-222222222221', 'servicio', 'cuidador', 'notice', 'medium', 'Retraso menor', 'La cuidadora llego 10 minutos tarde pero aviso.', 'in_transit', 'in_transit', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.reports (id, reporter_id, booking_id, caregiver_id, report_type, category, urgency, priority, subject, description, status, public_status, assigned_to, created_at, updated_at) VALUES ('ba20805f-ab6e-4839-9b7f-38d3bd89be38', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888884', '22222222-2222-2222-2222-222222222224', 'pago', 'pago', 'urgent', 'high', 'Revision de comprobante', 'Necesito confirmar el estado del pago cargado.', 'pending', 'pending', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.reports (id, reporter_id, booking_id, caregiver_id, report_type, category, urgency, priority, subject, description, status, public_status, assigned_to, created_at, updated_at) VALUES ('ee748ac2-37a0-42ba-8802-a52074ff23c8', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888881', '22222222-2222-2222-2222-222222222221', 'servicio', 'cuidador', 'notice', 'medium', 'Retraso menor', 'La cuidadora llego 10 minutos tarde pero aviso.', 'resolved', 'resolved', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:52:27.741313-06', '2026-04-24 22:05:22.479674-06');
INSERT INTO public.reports (id, reporter_id, booking_id, caregiver_id, report_type, category, urgency, priority, subject, description, status, public_status, assigned_to, created_at, updated_at) VALUES ('d0cf5794-7f57-42f0-9f84-a375ad96af95', '11111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888884', '22222222-2222-2222-2222-222222222224', 'pago', 'pago', 'urgent', 'high', 'Revision de comprobante', 'Necesito confirmar el estado del pago cargado.', 'resolved', 'resolved', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:52:27.741313-06', '2026-04-24 22:10:29.756068-06');


--
-- Data for Name: report_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.reviews (id, booking_id, client_id, caregiver_id, rating, comment, public, created_at) VALUES ('e2a7edf2-d5de-4698-869e-fe22f8c9f00c', '88888888-8888-8888-8888-888888888883', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222223', 5, 'Excelente acompanamiento y comunicacion clara.', true, '2026-04-24 21:38:16.249589-06');
INSERT INTO public.reviews (id, booking_id, client_id, caregiver_id, rating, comment, public, created_at) VALUES ('defcb513-9b7d-4260-97b2-59903ab181e8', '88888888-8888-8888-8888-888888888884', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222224', 2, 'buena', true, '2026-04-24 21:38:16.249589-06');


--
-- Data for Name: review_replies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: saved_searches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.saved_searches (id, client_id, name, filters, created_at) VALUES ('272ffd04-3073-4884-b40c-381d32ea151b', '11111111-1111-1111-1111-111111111111', 'Urgencias San Jose', '{"zone": "Escazu", "service": "Emergency care"}', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.saved_searches (id, client_id, name, filters, created_at) VALUES ('23172228-676a-401e-8e12-09e4260cd60f', '11111111-1111-1111-1111-111111111111', 'Nocturno fin de semana', '{"service": "Overnight care", "weekend": true}', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.saved_searches (id, client_id, name, filters, created_at) VALUES ('28be7072-01f2-49ce-b695-cc4f5de85c95', '11111111-1111-1111-1111-111111111111', 'Urgencias San Jose', '{"zone": "Escazu", "service": "Emergency care"}', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.saved_searches (id, client_id, name, filters, created_at) VALUES ('ef7909e3-6cb9-4c83-b36e-1ce600d51b93', '11111111-1111-1111-1111-111111111111', 'Nocturno fin de semana', '{"service": "Overnight care", "weekend": true}', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.saved_searches (id, client_id, name, filters, created_at) VALUES ('2cf0c944-f699-4142-9ae4-006c9d91251f', '11111111-1111-1111-1111-111111111111', 'Busqueda QA', '{"zone": "Escazu", "verifiedOnly": true}', '2026-04-24 22:05:22.387197-06');


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: social_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.social_posts (id, author_id, body, visibility, like_count, comment_count, created_at, updated_at) VALUES ('4123ab86-d285-42b8-90a8-0c3d035a8c71', '22222222-2222-2222-2222-222222222221', 'Terminamos una jornada hermosa de acompanamiento con actividades sensoriales y rutina tranquila.', 'community', 24, 6, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.social_posts (id, author_id, body, visibility, like_count, comment_count, created_at, updated_at) VALUES ('3e2ac392-d6c5-4572-96b3-917bf419e166', '33333333-3333-3333-3333-333333333331', 'Nueva guia de seguridad publicada para reservas de emergencia y turnos nocturnos.', 'public', 31, 4, '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.social_posts (id, author_id, body, visibility, like_count, comment_count, created_at, updated_at) VALUES ('518607a8-80bd-4de2-aaeb-b79edf25a6ba', '22222222-2222-2222-2222-222222222221', 'Terminamos una jornada hermosa de acompanamiento con actividades sensoriales y rutina tranquila.', 'community', 24, 6, '2026-04-24 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.social_posts (id, author_id, body, visibility, like_count, comment_count, created_at, updated_at) VALUES ('4cc695eb-6343-45e4-9c5e-a88aa8a8ad8d', '33333333-3333-3333-3333-333333333331', 'Nueva guia de seguridad publicada para reservas de emergencia y turnos nocturnos.', 'public', 31, 4, '2026-04-24 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: social_post_comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: social_post_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: social_post_media; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.support_tickets (id, requester_id, report_id, topic, channel, sla_label, sla_due_at, status, priority, assigned_to, created_at, updated_at) VALUES ('4df3666d-29c1-4156-8941-b225c1dc13be', '11111111-1111-1111-1111-111111111111', NULL, 'Comprobante en revision', 'Web', '4 horas', NULL, 'in-progress', 'high', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.support_tickets (id, requester_id, report_id, topic, channel, sla_label, sla_due_at, status, priority, assigned_to, created_at, updated_at) VALUES ('810b7208-6416-4433-bce9-11bd4fdad2b5', '11111111-1111-1111-1111-111111111111', NULL, 'Actualizar perfil familiar', 'Chat', '24 horas', NULL, 'waiting', 'medium', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:38:16.249589-06', '2026-04-24 21:38:16.249589-06');
INSERT INTO public.support_tickets (id, requester_id, report_id, topic, channel, sla_label, sla_due_at, status, priority, assigned_to, created_at, updated_at) VALUES ('398c5140-23ba-4b49-b552-8f35ddb89054', '11111111-1111-1111-1111-111111111111', NULL, 'Comprobante en revision', 'Web', '4 horas', NULL, 'in-progress', 'high', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06');
INSERT INTO public.support_tickets (id, requester_id, report_id, topic, channel, sla_label, sla_due_at, status, priority, assigned_to, created_at, updated_at) VALUES ('67202869-bb5d-44c7-a3f0-2bcf4197c707', '11111111-1111-1111-1111-111111111111', NULL, 'Actualizar perfil familiar', 'Chat', '24 horas', NULL, 'waiting', 'medium', '33333333-3333-3333-3333-333333333331', '2026-04-24 21:52:27.741313-06', '2026-04-24 21:52:27.741313-06');


--
-- Data for Name: support_ticket_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: verification_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: zone_heatmap_events; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--


