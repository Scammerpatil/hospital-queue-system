🏥 Hospital Queue Management System
Phase-wise Development Plan (AI Execution Blueprint)
🔵 PHASE 0 — SYSTEM AUDIT & CORRECTION (MANDATORY)
🎯 Goal

Understand what already exists, fix inconsistencies, and freeze architectural rules before writing new code.

0.1 Backend Audit Checklist

AI must verify:

Entities:

User

Patient

Doctor

Staff

Appointment

Queue

Payment

Roles:

PATIENT

DOCTOR

STAFF

Check:

No circular relationships

No unnecessary @OneToMany explosions

Appointment is the central join entity

Queue is derived from appointments, not standalone logic-heavy entity

❗ Correction Rules

QueueStatus enum should be reused everywhere

Appointment status should be single source of truth

Payment should be linked only to Appointment

0.2 Frontend Audit Checklist

AI must check:

App Router usage (/app)

Role-based routing exists:

/patient/\*

/doctor/\*

/staff/\*

No duplicate interfaces scattered across files

❗ Mandatory Fixes

Create single Types.d.ts

Remove all inline interfaces

No apiService.ts abstraction

Axios calls must live inside page or component file

0.3 Security & Config Audit

JWT auth working

Role-based access enforced

CORS config verified

Health endpoint available

✅ Phase 0 Verification

Backend runs without errors

Login works for all roles

Frontend builds successfully

No unused entities / DTOs

🔵 PHASE 1 — CORE DOMAIN STABILIZATION
🎯 Goal

Freeze domain model so future features don’t break structure.

1.1 Entity Rules (DO NOT EXPAND)
User (Base)

id

email

password

role

isVerified

Patient

userId

name

phone

age

gender

Doctor

userId

specialization

consultationFee

clinicName

district

taluka

active

Staff

userId

clinicName

district

taluka

Appointment (MOST IMPORTANT)

id

doctorId

patientId (actual visitor)

bookedByUserId

appointmentType (IN_PERSON / ONLINE)

status

scheduledTime

queueNumber

meetingLink (nullable)

paymentStatus

⚠️ No extra entities unless justified.

1.2 DTO Rules

DTOs are shared

No role-specific DTO explosion

One request, one response per use case

1.3 Repository Rules

No custom queries unless required

Use indexes later (migration-ready)

✅ Phase 1 Verification

All entities compile

DB migration runs

Sample appointment insert works

No lazy-loading runtime errors

🔵 PHASE 2 — AUTH & ROLE-BASED ACCESS
🎯 Goal

Ensure system trust boundary is correct.

2.1 Auth Flow

Signup

Login

JWT issued

Role injected into token

2.2 Authorization Rules

Patient cannot access doctor/staff routes

Doctor cannot manage staff data

Staff can manage clinic-level operations

2.3 Frontend

AuthContext finalized

Protected routes implemented

Role-based redirect after login

✅ Phase 2 Verification

Invalid role access blocked

Token expiry handled

UI reacts correctly on logout

🔵 PHASE 3 — CLINIC DISCOVERY (PATIENT SIDE)
🎯 Goal

Enable location-based clinic discovery.

3.1 Backend

Endpoint:

GET /api/clinics?district=&taluka=

Response:

Clinic name

Doctors list summary

Specializations

3.2 Frontend

District → Taluka selector

Clinic cards

Doctor preview

Axios:

Direct calls in page

Use react-hot-toast for errors

✅ Phase 3 Verification

Empty states handled

Filters work correctly

No over-fetching

🔵 PHASE 4 — APPOINTMENT BOOKING
🎯 Goal

Book appointments for self or others, safely.

4.1 Booking Rules

Patient details may differ from logged-in user

Appointment type:

IN_PERSON

ONLINE

4.2 Payment Rules

ONLINE:

Mandatory

Non-refundable

IN_PERSON:

Optional / Pay later

4.3 Backend

Create appointment

Assign queue number

Lock slot if ONLINE

4.4 Frontend

Booking form

Confirmation page

Toast feedback

✅ Phase 4 Verification

Double booking prevented

Queue numbers correct

Payment flag respected

🔵 PHASE 5 — QUEUE MANAGEMENT (CORE FEATURE)
🎯 Goal

Real-time, clinic-controlled queue.

5.1 Queue Logic

Derived from appointments

FIFO

Status-driven:

WAITING

IN_PROGRESS

COMPLETED

NO_SHOW

5.2 Staff Dashboard

View queues per doctor

Move queue forward

Override priority

5.3 Doctor Dashboard

See current patient

Mark completed

✅ Phase 5 Verification

Queue updates reflect everywhere

Race conditions tested

Refresh-safe behavior

🔵 PHASE 6 — ONLINE CONSULTATION
🎯 Goal

Enable online appointments safely.

6.1 Phase 6A (Manual – MVP)

Staff/Doctor adds meeting link manually

Stored in appointment

Shown to patient

6.2 Phase 6B (Optional Automation)

Integrate Google Meet API

Auto-create meeting

Store link securely

✅ Phase 6 Verification

Link visibility role-checked

No leakage

Session completion updates status

🔵 PHASE 7 — DASHBOARDS & REPORTING
🎯 Goal

Operational clarity.

Dashboards

Patient: upcoming appointments, queue status

Doctor: today’s schedule

Staff: clinic overview

✅ Phase 7 Verification

Correct counts

No N+1 queries

Fast load times

🔵 PHASE 8 — FINAL HARDENING
🎯 Goal

Production readiness.

Tasks

Input validation

Error handling

Logging

Cleanup unused DTOs

Remove debug logs

✅ Final Verification

All flows tested end-to-end

Roles isolated

Data integrity intact

No architectural violations

📌 GLOBAL RULES (NON-NEGOTIABLE)

❌ No frontend API service layer

✅ Axios inside component/page

✅ One global Types.d.ts

❌ No duplicate interfaces

❌ No speculative features

✅ Migrations over schema edits

✅ Verification at every phase
