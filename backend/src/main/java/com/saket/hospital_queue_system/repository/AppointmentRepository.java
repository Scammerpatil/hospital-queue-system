package com.saket.hospital_queue_system.repository;

import com.saket.hospital_queue_system.entity.Appointment;
import com.saket.hospital_queue_system.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
  List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);

  List<Appointment> findByPatientId(Long patientId);

  List<Appointment> findByPatientOrderByAppointmentDateDesc(Patient patient);

  List<Appointment> findByPatientAndStatusOrderByAppointmentDateDesc(Patient patient, String status);

  List<Appointment> findByDoctorId(Long doctorId);
}
