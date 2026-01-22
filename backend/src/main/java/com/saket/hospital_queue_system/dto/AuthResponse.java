package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuthResponse {
  private String token;
  private String email;
  private Role role;
  private Long userId;
  private Long clinicId;
  private String message;
}
