package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserResponse {
  private Long id;
  private String name;
  private String email;
  private String phone;
  private String profileImage;
  private Role role;
  private Boolean isActive;
}
