# Project Execution Plan (Copilot)

This document defines how the AI assistant must proceed while implementing the next parts of the project.
The AI MUST strictly follow the phases in order.
Skipping phases or auto-implementing without confirmation is NOT allowed.

---

## Phase 0 — Read-Only Project Audit (NO CODE CHANGES)

### Objective

Understand the current state of the project before making any modifications.

### Instructions

- Scan **all frontend files** (excluding `node_modules`)
- Scan **entire backend codebase**
- Identify what is already implemented

### Expected Findings (Non-Exhaustive)

- Landing page: completed
- Authentication: completed
- RBAC: completed
- Models: finalized
- Core project structure: present

### Mandatory Rules

- ❌ DO NOT modify any file
- ❌ DO NOT add new code
- ❌ DO NOT refactor existing code
- ❌ DO NOT assume missing functionality

### Output Required

After scanning, the AI MUST respond with:

1. A list of detected features already implemented
2. A list of missing or incomplete features (if any)
3. A confirmation question:

> “I can see the above implementations. Is anything missing or incorrect?  
> Please confirm or correct before I proceed.”

### Blocking Condition

🚫 **Do NOT proceed to Phase 1 until the user explicitly confirms.**

---

## Phase 1 — Role & Route Discovery (Read-Only)

### Objective

Understand role-based routing and page structure.

### Instructions

- Inspect role folders:
  - `/patient`
  - `/doctor`
  - `/staff`
- Inspect all `constants` files related to routing or navigation
- Identify:
  - Which routes exist
  - Which pages are implemented
  - Which pages are missing or incomplete

### Examples

- If `/patient/dashboard/page.tsx` exists → mark as **implemented but incomplete**
- If `/doctor/appointments/page.tsx` does not exist → mark as **missing** and create the folder along with it's page.tsx and put some dummy function init.
- For eg. The Doctors appointment page is not avaibale you created it and add a function init like
  export default function ManageAppointments(){
  return <>Hello from this page</>
  }

### Mandatory Rules

- ❌ NO UI creation
- ❌ NO backend changes
- ❌ NO assumptions

### Output Required

Provide a table per role:

- Route path
- Page exists (Yes/No)
- Status (Complete / Incomplete / Missing)

Then ask:

> “Please confirm the priority order for page completion, or approve starting from dashboards.”

🚫 **Wait for user confirmation before proceeding.**

---

## Phase 2 — Page-by-Page Parallel Implementation (UI + API)

### Objective

Implement pages one at a time with **frontend and backend in parallel**.

### Execution Rules

- Work on **ONE page at a time**
- Complete UI + API + data flow before moving to the next page
- No partial implementations

---

### Page Completion Contract

For each page (example: `/patient/dashboard`):

#### Step 1 — Frontend

- Build UI using **DaisyUI**
- Use:
  - Stat cards
  - Tables
  - Charts (Chart.js)
- No dummy data
- UI must clearly define required API data

#### Step 2 — API Definition

- Define required backend endpoints (example):
  GET /spring-server/patient/dashboard
- Specify request & response structure

#### Step 3 — Backend Implementation

- Create API endpoints
- Fetch real data
- Apply RBAC
- Validate inputs
- Return structured responses

#### Step 4 — Frontend Integration

- Connect UI to API
- Handle loading, empty, and error states

#### Step 5 — Verification

- Log API calls
- Verify data correctness
- Confirm UI rendering

Only after **all 5 steps** are complete may the AI move to the next page.

---

## Phase 3 — Appointments Module (Core Feature)

### Objective

Implement appointment creation and management.

### Scope

- Patient:
- Create appointment
- View appointment history
- Doctor:
- View assigned appointments
- Accept / Reject / Complete appointments
- Staff:
- View all appointments
- Manage scheduling conflicts

### Rules

- RBAC enforcement is mandatory
- Status transitions must be validated
- Backend logic first, UI second

---

## Phase 4 — Final Review & Hardening

### Objective

Ensure production readiness.

### Checklist

- No unused routes
- No orphan APIs
- All role dashboards functional
- Error handling present
- No hardcoded data
- Logs present (temporary)

---

## Global Rules (MANDATORY)

- ❌ No hallucination
- ❌ No skipping phases
- ❌ No silent assumptions
- ❌ No bulk coding without checkpoints
- ✅ Ask for confirmation at phase boundaries
- ✅ One page at a time
- ✅ UI and API evolve together

---

## Confirmation Required

The AI must explicitly ask for permission before:

- Leaving Phase 0
- Leaving Phase 1
- Moving to a new page
