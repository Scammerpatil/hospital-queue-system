package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.DoctorDashboardResponse;
import com.saket.hospital_queue_system.dto.DoctorProfileResponse;
import com.saket.hospital_queue_system.dto.UpdateDoctorProfileRequest;
import com.saket.hospital_queue_system.entity.Doctor;
import com.saket.hospital_queue_system.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class DoctorController {

  @Autowired
  private DoctorService doctorService;

  @GetMapping("/dashboard")
  public ResponseEntity<DoctorDashboardResponse> getDoctorDashboard() {
    System.out.println("DoctorController: GET /api/doctor/dashboard");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      DoctorDashboardResponse response = doctorService.getDoctorDashboard(email);

      System.out.println("DoctorController: Dashboard retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("DoctorController: Error retrieving dashboard: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/available")
  public ResponseEntity<List<Doctor>> getAvailableDoctors() {
    System.out.println("DoctorController: GET /api/doctor/available");
    try {
      List<Doctor> doctors = doctorService.getAvailableDoctors();
      return ResponseEntity.ok(doctors);
    } catch (Exception e) {
      System.out.println("DoctorController: Error retrieving available doctors: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/profile")
  public ResponseEntity<DoctorProfileResponse> getDoctorProfile() {
    System.out.println("DoctorController: GET /api/doctor/profile");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      DoctorProfileResponse response = doctorService.getDoctorProfile(email);

      System.out.println("DoctorController: Profile retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("DoctorController: Error retrieving profile: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/profile")
  public ResponseEntity<DoctorProfileResponse> updateDoctorProfile(
      @Valid @RequestBody UpdateDoctorProfileRequest request) {
    System.out.println("DoctorController: PUT /api/doctor/profile");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();

      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      DoctorProfileResponse response = doctorService.updateDoctorProfile(email, request);

      System.out.println("DoctorController: Profile updated for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("DoctorController: Error updating profile: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
