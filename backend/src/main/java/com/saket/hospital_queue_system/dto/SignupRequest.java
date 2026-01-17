package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignupRequest {
  private String email;
  private String phone;
  private String password;
  private String profileImage;
  private Role role; // PATIENT, DOCTOR, STAFF
  private String fullName;
  private String specialization; // For doctors
  private String department; // For staff
}
