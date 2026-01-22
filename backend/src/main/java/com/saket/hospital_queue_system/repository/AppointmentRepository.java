package com.saket.hospital_queue_system.repository;

import com.saket.hospital_queue_system.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    int countByDoctorIdAndAppointmentDateAndStatusIn(
            Long doctorId,
            LocalDate date,
            List<AppointmentStatus> statuses
    );

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByClinicId(Long clinicId);

    List <Appointment> findByPatientOrderByAppointmentDateDesc(Patient patient);

    // ✅ Clinic dashboard
    List<Appointment> findByClinicIdOrderByAppointmentDateAscAppointmentTimeAsc(
            Long clinicId
    );
}
