package com.saket.hospital_queue_system.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import com.saket.hospital_queue_system.entity.AppointmentType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAppointmentRequest {
  private Long doctorId;
  private Long patientId; // Actual visitor (may differ from logged-in user)
  private LocalDate appointmentDate;
  private LocalTime appointmentTime;
  private AppointmentType appointmentType; // IN_PERSON or ONLINE
  private String notes;
}
