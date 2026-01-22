package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.Clinic;
import com.saket.hospital_queue_system.entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignupRequest {
  private String email;
  private String phone;
  private String password;
  private String profileImage;
  private Role role;
  private String name;
  private Clinic clinic;
}
