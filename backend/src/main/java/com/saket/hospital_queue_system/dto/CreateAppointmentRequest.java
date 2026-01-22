package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.AppointmentType;
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
    private String appointmentTime;
    private AppointmentType appointmentType;
    private String bookingFor;
    private String paymentMode;
    private PatientDetailsDto patientDetails;
    private String notes;
}
