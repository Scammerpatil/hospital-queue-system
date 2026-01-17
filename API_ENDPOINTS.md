# Hospital Queue System - Complete API Endpoints

## Base URL

```
http://localhost:8080
```

## Authentication (PUBLIC)

### 1. Register New User

```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "PATIENT"  // or DOCTOR, STAFF
}

Response:
{
  "id": 1,
  "email": "john@example.com",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

### 2. Login

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "id": 1,
  "email": "john@example.com",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzUxMiJ9..."
}
```

### 3. Get Current User

```
GET /api/auth/me
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "PATIENT"
}
```

### 4. Health Check

```
GET /api/health

Response: "OK"
```

---

## Patient Endpoints (PATIENT ROLE)

### 5. Get Patient Dashboard

```
GET /api/patient/dashboard
Authorization: Bearer <patient_token>

Response:
{
  "patientName": "John Doe",
  "totalAppointments": 5,
  "completedAppointments": 2,
  "upcomingAppointments": 3,
  "recentAppointments": [
    {
      "id": 1,
      "doctorName": "Dr. Smith",
      "doctorSpecialization": "Cardiology",
      "appointmentDate": "2024-03-25",
      "appointmentTime": "10:30",
      "status": "BOOKED",
      "notes": "Regular checkup"
    }
  ]
}
```

---

## Doctor Endpoints (DOCTOR ROLE)

### 6. Get Doctor Dashboard

```
GET /api/doctor/dashboard
Authorization: Bearer <doctor_token>

Response:
{
  "doctorName": "Dr. Smith",
  "specialization": "Cardiology",
  "totalAppointments": 15,
  "completedAppointments": 12,
  "todayAppointments": 3,
  "todayAppointmentsList": [
    {
      "id": 5,
      "patientName": "John Doe",
      "appointmentTime": "10:30",
      "status": "BOOKED"
    }
  ]
}
```

### 7. Get Available Doctors

```
GET /api/doctor/available
(PUBLIC - no auth required)

Response:
[
  {
    "id": 1,
    "name": "Dr. Smith",
    "specialization": "Cardiology",
    "isAvailable": true
  },
  {
    "id": 2,
    "name": "Dr. Johnson",
    "specialization": "Orthopedics",
    "isAvailable": true
  }
]
```

---

## Staff Endpoints (STAFF ROLE)

### 8. Get Staff Dashboard

```
GET /api/staff/dashboard
Authorization: Bearer <staff_token>

Response:
{
  "totalPatients": 45,
  "totalDoctors": 8,
  "totalAppointments": 120,
  "appointmentsToday": 12,
  "recentAppointments": [...]
}
```

---

## Appointment Endpoints

### 9. Create Appointment

```
POST /api/appointment/create
Authorization: Bearer <patient_token>
Content-Type: application/json

{
  "doctorId": 1,
  "appointmentDate": "2024-03-25",
  "appointmentTime": "10:30",
  "notes": "Regular checkup"
}

Response:
{
  "id": 1,
  "patientName": "John Doe",
  "patientGender": "Male",
  "doctorName": "Dr. Smith",
  "doctorSpecialization": "Cardiology",
  "appointmentDate": "2024-03-25",
  "appointmentTime": "10:30",
  "status": "BOOKED",
  "notes": "Regular checkup",
  "createdAt": "2024-03-15T14:30:00"
}
```

### 10. Get Appointment by ID

```
GET /api/appointment/{id}
Authorization: Bearer <token>

Response: (same as above)
```

### 11. Get Patient's Appointments

```
GET /api/appointment/patient/list
Authorization: Bearer <patient_token>

Response:
[
  {
    "id": 1,
    "patientName": "John Doe",
    "doctorName": "Dr. Smith",
    "appointmentDate": "2024-03-25",
    "appointmentTime": "10:30",
    "status": "BOOKED"
  },
  ...
]
```

### 12. Get Doctor's Appointments

```
GET /api/appointment/doctor/list
Authorization: Bearer <doctor_token>

Response:
[
  {
    "id": 1,
    "patientName": "John Doe",
    "appointmentDate": "2024-03-25",
    "appointmentTime": "10:30",
    "status": "BOOKED"
  },
  ...
]
```

### 13. Get All Appointments (Staff Only)

```
GET /api/appointment/all
Authorization: Bearer <staff_token>

Response: (array of all appointments)
```

### 14. Update Appointment Status

```
PUT /api/appointment/{id}/status
Authorization: Bearer <doctor_or_staff_token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "notes": "Patient arrived"
}

Valid Status Transitions:
- BOOKED → IN_PROGRESS, CANCELLED
- IN_PROGRESS → COMPLETED, CANCELLED
- COMPLETED → (immutable)
- CANCELLED → (immutable)

Response: (updated appointment)
```

### 15. Cancel Appointment

```
DELETE /api/appointment/{id}
Authorization: Bearer <token>

Response:
{
  "id": 1,
  "status": "CANCELLED",
  ...
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "message": "ERROR: Doctor is already booked at 10:30 on 2024-03-25. Please choose another time."
}
```

### 401 Unauthorized

```json
{
  "message": "Unauthorized: Invalid or missing token"
}
```

### 403 Forbidden

```json
{
  "message": "Access Denied: User does not have required role"
}
```

### 404 Not Found

```json
{
  "message": "ERROR: Appointment with ID 999 not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "An internal error occurred"
}
```

---

## HTTP Status Codes

| Code | Meaning                              |
| ---- | ------------------------------------ |
| 200  | OK - Request successful              |
| 201  | Created - Resource created           |
| 400  | Bad Request - Invalid input          |
| 401  | Unauthorized - Missing/invalid token |
| 403  | Forbidden - Insufficient permissions |
| 404  | Not Found - Resource not found       |
| 500  | Internal Server Error                |

---

## Authentication Headers

All protected endpoints require:

```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

Token format: `Bearer <JWT_TOKEN>`

The token is returned from login/signup endpoints and should be stored in:

- localStorage (key: "authToken")
- Secure HttpOnly cookie (for additional security)

---

## Role-Based Access Control

| Endpoint                      | PATIENT | DOCTOR | STAFF | PUBLIC |
| ----------------------------- | ------- | ------ | ----- | ------ |
| POST /auth/signup             | ✓       | ✓      | ✓     | ✓      |
| POST /auth/login              | ✓       | ✓      | ✓     | ✓      |
| GET /auth/me                  | ✓       | ✓      | ✓     | ✗      |
| GET /patient/dashboard        | ✓       | ✗      | ✗     | ✗      |
| GET /doctor/dashboard         | ✗       | ✓      | ✗     | ✗      |
| GET /doctor/available         | ✓       | ✓      | ✓     | ✓      |
| GET /staff/dashboard          | ✗       | ✗      | ✓     | ✗      |
| POST /appointment/create      | ✓       | ✗      | ✗     | ✗      |
| GET /appointment/patient/list | ✓       | ✗      | ✗     | ✗      |
| GET /appointment/doctor/list  | ✗       | ✓      | ✗     | ✗      |
| GET /appointment/all          | ✗       | ✗      | ✓     | ✗      |
| PUT /appointment/{id}/status  | ✗       | ✓      | ✓     | ✗      |
| DELETE /appointment/{id}      | ✓       | ✓      | ✓     | ✗      |

---

## Testing Quick Commands

```bash
# Register as Patient
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123","role":"PATIENT"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'

# Get Patient Dashboard (replace TOKEN)
curl -X GET http://localhost:8080/api/patient/dashboard \
  -H "Authorization: Bearer TOKEN"

# Get Available Doctors
curl -X GET http://localhost:8080/api/doctor/available
```
