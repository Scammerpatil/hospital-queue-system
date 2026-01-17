package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.AppointmentResponseDto;
import com.saket.hospital_queue_system.dto.CreateAppointmentRequest;
import com.saket.hospital_queue_system.dto.UpdateAppointmentStatusRequest;
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
  public ResponseEntity<?> createAppointment(@RequestBody CreateAppointmentRequest request) {
    System.out.println("AppointmentController: POST /api/appointment/create");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
        System.out.println("AppointmentController: Authenticated principal: " + principal);
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
      }

      String email = userDetails.getUsername();
      AppointmentResponseDto response = appointmentService.createAppointment(email, request);

      System.out.println("AppointmentController: Appointment created successfully");
      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (Exception e) {
      System.out.println("AppointmentController: Error creating appointment: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Failed to create appointment: " + e.getMessage());
    }
  }

  /**
   * Get appointment by ID
   */
  @GetMapping("/{id}")
  public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
    System.out.println("AppointmentController: GET /api/appointment/{id}");
    try {
      AppointmentResponseDto response = appointmentService.getAppointmentById(id);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("AppointmentController: Error fetching appointment: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body("Appointment not found");
    }
  }

  /**
   * Get all appointments for current patient
   */
  @GetMapping("/patient/list")
  public ResponseEntity<?> getPatientAppointments() {
    System.out.println("AppointmentController: GET /api/appointment/patient/list");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
      }

      String email = userDetails.getUsername();
      List<AppointmentResponseDto> appointments = appointmentService.getPatientAppointments(email);

      return ResponseEntity.ok(appointments);
    } catch (Exception e) {
      System.out.println("AppointmentController: Error fetching patient appointments: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to fetch appointments");
    }
  }

  /**
   * Get all appointments for current doctor
   */
  @GetMapping("/doctor/list")
  public ResponseEntity<?> getDoctorAppointments() {
    System.out.println("AppointmentController: GET /api/appointment/doctor/list");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
      }

      String email = userDetails.getUsername();
      List<AppointmentResponseDto> appointments = appointmentService.getDoctorAppointments(email);

      return ResponseEntity.ok(appointments);
    } catch (Exception e) {
      System.out.println("AppointmentController: Error fetching doctor appointments: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to fetch appointments");
    }
  }

  /**
   * Get all appointments (Staff only)
   */
  @GetMapping("/all")
  public ResponseEntity<?> getAllAppointments() {
    System.out.println("AppointmentController: GET /api/appointment/all");
    try {
      List<AppointmentResponseDto> appointments = appointmentService.getAllAppointments();
      return ResponseEntity.ok(appointments);
    } catch (Exception e) {
      System.out.println("AppointmentController: Error fetching all appointments: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Failed to fetch appointments");
    }
  }

  /**
   * Update appointment status (Doctor/Staff)
   */
  @PutMapping("/{id}/status")
  public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id,
      @RequestBody UpdateAppointmentStatusRequest request) {
    System.out.println("AppointmentController: PUT /api/appointment/{id}/status");
    try {
      AppointmentResponseDto response = appointmentService.updateAppointmentStatus(id, request);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("AppointmentController: Error updating appointment: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Failed to update appointment: " + e.getMessage());
    }
  }

  /**
   * Cancel appointment
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
    System.out.println("AppointmentController: DELETE /api/appointment/{id}");
    try {
      AppointmentResponseDto response = appointmentService.cancelAppointment(id);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("AppointmentController: Error cancelling appointment: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Failed to cancel appointment: " + e.getMessage());
    }
  }
}
