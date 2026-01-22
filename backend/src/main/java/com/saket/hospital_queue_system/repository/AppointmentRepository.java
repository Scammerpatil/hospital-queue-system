package com.saket.hospital_queue_system.repository;

import com.saket.hospital_queue_system.entity.Appointment;
import com.saket.hospital_queue_system.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("""
        SELECT COUNT(a)
        FROM Appointment a
        WHERE a.doctor.id = :doctorId
          AND a.appointmentDate = :date
          AND a.status IN ('WAITING', 'IN_PROGRESS')
    """)
    int countActiveAppointmentsForDoctor(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date
    );

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);

  List<Appointment> findByPatientId(Long patientId);

  List<Appointment> findByPatientOrderByAppointmentDateDesc(Patient patient);

  List<Appointment> findByPatientAndStatusOrderByAppointmentDateDesc(Patient patient, String status);

  List<Appointment> findByDoctorId(Long doctorId);

  // Dashboard queries
  @Query("SELECT a FROM Appointment a WHERE a.patient.user.email = :email")
  List<Appointment> findByPatientUserEmail(@Param("email") String email);

  @Query("SELECT a FROM Appointment a WHERE a.patient.user.email = :email AND DATE(a.appointmentDate) BETWEEN :startDate AND :endDate ORDER BY a.appointmentDate ASC")
  List<Appointment> findByPatientUserEmailAndAppointmentDateBetweenOrderByAppointmentDateAsc(
      @Param("email") String email, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

  @Query("SELECT a FROM Appointment a WHERE a.doctor.user.email = :email")
  List<Appointment> findByDoctorUserEmail(@Param("email") String email);

    @Query("""
    SELECT a
    FROM Appointment a
    WHERE a.clinic.id = :clinicId
    ORDER BY a.appointmentDate DESC, a.queueNumber ASC
    """)
    List<Appointment> findByClinicId(@Param("clinicId") Long clinicId);
}
