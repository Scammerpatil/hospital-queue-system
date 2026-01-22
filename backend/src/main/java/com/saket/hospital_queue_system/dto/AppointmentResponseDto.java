package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.Appointment;
import lombok.*;
import com.saket.hospital_queue_system.entity.AppointmentType;
import com.saket.hospital_queue_system.entity.PaymentStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {
  private Long id;
  private Long patientId;
  private String patientPhoneNumber;
  private Integer patientAge;
  private Long clinicId;
  private String patientName;
  private String clinicName;
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
    public static AppointmentResponseDto from(Appointment appointment) {
        return AppointmentResponseDto.builder()
                .id(appointment.getId())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getUser().getName())
                .clinicId(appointment.getClinic().getId())
                .clinicName(appointment.getClinic().getName())
                .patientId(appointment.getPatient().getId())
                .patientName(
                        appointment.getPatient().getPatientName() != null
                                ? appointment.getPatient().getPatientName()
                                : appointment.getPatient().getUser().getName()
                )
                .patientPhoneNumber(
                        appointment.getPatient().getPhoneNumber() != null
                                ? appointment.getPatient().getPhoneNumber()
                                : appointment.getPatient().getUser().getPhone()
                )
                .patientGender(appointment.getPatient().getGender())
                .patientAge(appointment.getPatient().getAge())
                .appointmentType(appointment.getAppointmentType())
                .status(appointment.getStatus())
                .appointmentDate(String.valueOf(appointment.getAppointmentDate()))
                .appointmentTime(String.valueOf(appointment.getAppointmentTime()))
                .queueNumber(appointment.getQueueNumber())
                .meetingLink(appointment.getMeetingLink())
                .notes(appointment.getNotes())
                .build();
    }
}
