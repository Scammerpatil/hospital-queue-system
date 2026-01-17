package com.saket.hospital_queue_system.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {
  private Long id;
  private Long patientId;
  private String patientName;
  private String patientGender;
  private Long doctorId;
  private String doctorName;
  private String doctorSpecialization;
  private String appointmentDate;
  private String appointmentTime;
  private String status;
  private String notes;
  private String createdAt;
}
