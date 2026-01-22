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

    private String bookingFor; // SELF | OTHER

    private PatientDetailsDto patientDetails; // Required if OTHER

    private LocalDate appointmentDate;
    private LocalTime appointmentTime;

    private AppointmentType appointmentType; // ONLINE | IN_PERSON

    private String paymentMode; // ONLINE | IN_PERSON

    private String notes;
}
