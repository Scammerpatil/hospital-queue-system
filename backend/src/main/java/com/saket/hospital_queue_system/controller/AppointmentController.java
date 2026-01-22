package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.*;
import com.saket.hospital_queue_system.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    // Create appointment (JWT patient)
    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(
            @RequestBody CreateAppointmentRequest request
    ) {
        try {
            String email = SecurityContextHolder
                    .getContext().getAuthentication().getName();

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(appointmentService.createAppointment(email, request));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // Clinic dashboard
    @GetMapping("/all-clinic")
    public ResponseEntity<?> getAppointmentsByClinic(
            @RequestParam Long clinicId
    ) {
        try {
            return ResponseEntity.ok(
                    appointmentService.getAppointmentsByClinic(clinicId)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // Doctor dashboard
    @GetMapping("/doctor/list")
    public ResponseEntity<?> getDoctorAppointments() {
        try {
            String email = SecurityContextHolder
                    .getContext().getAuthentication().getName();

            return ResponseEntity.ok(
                    appointmentService.getDoctorAppointments(email)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // Patient dashboard - list own appointments
    @GetMapping("/patient/list")
    public ResponseEntity<?> getPatientAppointments() {
        try {
            String email = SecurityContextHolder
                    .getContext().getAuthentication().getName();

            return ResponseEntity.ok(
                    appointmentService.getPatientAppointments(email)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }

    // Single appointment
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    appointmentService.getAppointmentById(id)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // Cancel appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(
                    appointmentService.cancelAppointment(id)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // Update status (doctor / staff)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateAppointmentStatusRequest request
    ) {
        try {
            return ResponseEntity.ok(
                    appointmentService.updateAppointmentStatus(id, request)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // Add meeting link
    @PutMapping("/{id}/meeting-link")
    public ResponseEntity<?> addMeetingLink(
            @PathVariable Long id,
            @RequestBody UpdateMeetingLinkRequest request
    ) {
        try {
            String email = SecurityContextHolder
                    .getContext().getAuthentication().getName();

            return ResponseEntity.ok(
                    appointmentService.addMeetingLink(id, email, request)
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(e.getMessage());
        }
    }
}
