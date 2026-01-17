package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.PatientDashboardResponse;
import com.saket.hospital_queue_system.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

  @Autowired
  private PatientService patientService;

  @GetMapping("/dashboard")
  public ResponseEntity<PatientDashboardResponse> getPatientDashboard() {
    System.out.println("PatientController: GET /api/patient/dashboard");
    try {
      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
      Object principal = authentication.getPrincipal();
      System.out.println("PatientController: Authenticated principal: " + principal);
      if (!(principal instanceof UserDetails userDetails)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
      }

      String email = userDetails.getUsername();
      PatientDashboardResponse response = patientService.getPatientDashboard(email);

      System.out.println("PatientController: Dashboard retrieved for email: " + email);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("PatientController: Error retrieving dashboard: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }
}
