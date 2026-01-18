package com.saket.hospital_queue_system.dto;

import lombok.*;
import com.saket.hospital_queue_system.entity.AppointmentType;
import com.saket.hospital_queue_system.entity.PaymentStatus;

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
  private AppointmentType appointmentType;
  private String status;
  private Integer queueNumber;
  private String meetingLink;
  private PaymentStatus paymentStatus;
  private String notes;
  private String createdAt;
}
