package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {

    private Long id;

    private Long clinicId;
    private String clinicName;

    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;

    private Long patientId;
    private String patientName;
    private Integer patientAge;
    private String patientGender;
    private String patientPhoneNumber;

    private String appointmentDate;
    private String appointmentTime;

    private AppointmentType appointmentType;
    private AppointmentStatus status;

    private Integer queueNumber;
    private String meetingLink;
    private PaymentStatus paymentStatus;
    private String notes;

    public static AppointmentResponseDto from(Appointment a) {
        return AppointmentResponseDto.builder()
                .id(a.getId())
                .clinicId(a.getClinic().getId())
                .clinicName(a.getClinic().getName())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getUser().getName())
                .doctorSpecialization(a.getDoctor().getSpecialization())
                .patientId(a.getPatient().getId())
                .patientName(
                        a.getPatient().getPatientName() != null
                                ? a.getPatient().getPatientName()
                                : a.getPatient().getUser().getName()
                )
                .patientAge(a.getPatient().getAge())
                .patientGender(a.getPatient().getGender())
                .patientPhoneNumber(a.getPatient().getPhoneNumber())
                .appointmentDate(a.getAppointmentDate().toString())
                .appointmentTime(a.getAppointmentTime().toString())
                .appointmentType(a.getAppointmentType())
                .status(a.getStatus())
                .queueNumber(a.getQueueNumber())
                .meetingLink(a.getMeetingLink())
                .paymentStatus(a.getPaymentStatus())
                .notes(a.getNotes())
                .build();
    }
}
