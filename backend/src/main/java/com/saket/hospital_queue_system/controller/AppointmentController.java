package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.*;
import com.saket.hospital_queue_system.entity.*;
import com.saket.hospital_queue_system.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/create")
    public ResponseEntity<?> createAppointment(
            @RequestBody CreateAppointmentRequest request
    ) {
        try {
            System.out.println("AppointmentController: POST /api/appointment/create");
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof UserDetails userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String email = authentication.getName(); // ✅ from JWT

            AppointmentResponseDto response =
                    appointmentService.createAppointment(email, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Failed to create appointment: " + e.getMessage());
        }
    }

    @GetMapping("/patient/list")
    public ResponseEntity<?> getPatientAppointments() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return ResponseEntity.ok(
                appointmentService.getPatientAppointments(email)
        );
    }

    @GetMapping("/doctor/list")
    public ResponseEntity<?> getDoctorAppointments() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return ResponseEntity.ok(
                appointmentService.getDoctorAppointments(email)
        );
    }

    @GetMapping("/all-clinic")
    public ResponseEntity<?> getAppointmentsByClinic(
            @RequestParam Long clinicId
    ) {
        try {
            List<AppointmentResponseDto> appointments =
                    appointmentService.getAppointmentsByClinic(clinicId);

            return ResponseEntity.ok(appointments);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Failed to fetch clinic appointments: " + e.getMessage());
        }
    }
}
