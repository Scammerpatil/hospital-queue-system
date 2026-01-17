package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAppointmentRequest {
  private Long doctorId;
  private LocalDate appointmentDate;
  private LocalTime appointmentTime;
  private String notes;
}
