package com.saket.hospital_queue_system.dto;

import lombok.*;
import com.saket.hospital_queue_system.entity.AppointmentStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAppointmentStatusRequest {
  private String status; // BOOKED, IN_PROGRESS, COMPLETED, CANCELLED
  private String notes;
}
