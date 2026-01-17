package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AuthResponse {
  private String token;
  private String email;
  private Role role;
  private Long userId;
  private String message;
}
