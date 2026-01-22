package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AppointmentResponseDto;
import com.saket.hospital_queue_system.dto.CreateAppointmentRequest;
import com.saket.hospital_queue_system.dto.PatientDetailsDto;
import com.saket.hospital_queue_system.dto.UpdateAppointmentStatusRequest;
import com.saket.hospital_queue_system.entity.*;
import com.saket.hospital_queue_system.repository.AppointmentRepository;
import com.saket.hospital_queue_system.repository.DoctorRepository;
import com.saket.hospital_queue_system.repository.PatientRepository;
import com.saket.hospital_queue_system.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

  private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private PatientRepository patientRepository;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private QueueService queueService;

  /**
   * Create a new appointment by patient
   */
  @Transactional
  public AppointmentResponseDto createAppointment(
          String email,
          CreateAppointmentRequest request
  ) {
        System.out.println("AppointmentService: createAppointment called by " + email);
      User bookedBy = userRepository.findByEmail(email)
              .orElseThrow(() -> new RuntimeException("User not found"));

      if (bookedBy.getRole() != Role.PATIENT) {
          throw new RuntimeException("Only patients can book appointments");
      }

      Doctor doctor = doctorRepository.findById(request.getDoctorId())
              .orElseThrow(() -> new RuntimeException("Doctor not found"));

      Patient actualPatient;

      if ("SELF".equalsIgnoreCase(request.getBookingFor())) {

          actualPatient = patientRepository.findByUserId(bookedBy.getId())
                  .orElseThrow(() -> new RuntimeException("Patient profile not found"));

      } else if ("OTHER".equalsIgnoreCase(request.getBookingFor())) {

          PatientDetailsDto details = request.getPatientDetails();
          if (details == null) {
              throw new RuntimeException("Patient details required");
          }

          Patient patient = new Patient();
          patient.setPatientName(details.getName());
          patient.setAge(details.getAge());
          patient.setGender(details.getGender());
          patient.setPhoneNumber(details.getPhone());
          patient.setIsActive(true);

          actualPatient = patientRepository.save(patient);

      } else {
          throw new RuntimeException("Invalid bookingFor value");
      }

      if (request.getAppointmentType() == AppointmentType.ONLINE &&
              !"ONLINE".equalsIgnoreCase(request.getPaymentMode())) {
          throw new RuntimeException("Online appointment requires online payment");
      }

      int queueNumber =
              appointmentRepository.countActiveAppointmentsForDoctor(
                      doctor.getId(),
                      request.getAppointmentDate()
              ) + 1;

      Appointment appointment = new Appointment();
      appointment.setDoctor(doctor);
      appointment.setClinic(doctor.getClinic());
      appointment.setPatient(actualPatient);
      appointment.setBookedByUser(bookedBy);
      appointment.setAppointmentDate(request.getAppointmentDate());
      appointment.setAppointmentTime(request.getAppointmentTime());
      appointment.setAppointmentType(request.getAppointmentType());
      appointment.setStatus("BOOKED");

      appointment.setQueueNumber(queueNumber);
      appointment.setNotes(request.getNotes());

      appointmentRepository.save(appointment);

      return AppointmentResponseDto.from(appointment);
  }


    /**
   * Get appointment by ID
   */
  public AppointmentResponseDto getAppointmentById(Long appointmentId) {
    Appointment appointment = appointmentRepository.findById(appointmentId)
        .orElseThrow(() -> new RuntimeException("ERROR: Appointment with ID " + appointmentId + " not found"));
    return convertToResponseDto(appointment);
  }

  /**
   * Get all appointments for a patient
   */
  public List<AppointmentResponseDto> getPatientAppointments(String patientEmail) {
    logger.debug("Getting appointments for patient: {}", patientEmail);

    User user = userRepository.findByEmail(patientEmail)
        .orElseThrow(() -> new RuntimeException("ERROR: User not found with email: " + patientEmail));

    Patient patient = patientRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("ERROR: Patient profile not found for user: " + patientEmail));

    return appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient)
        .stream()
        .map(this::convertToResponseDto)
        .collect(Collectors.toList());
  }

  /**
   * Get all appointments for a doctor
   */
  public List<AppointmentResponseDto> getDoctorAppointments(String doctorEmail) {
    logger.debug("Getting appointments for doctor: {}", doctorEmail);

    User user = userRepository.findByEmail(doctorEmail)
        .orElseThrow(() -> new RuntimeException("ERROR: User not found with email: " + doctorEmail));

    Doctor doctor = doctorRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("ERROR: Doctor profile not found for user: " + doctorEmail));

    return appointmentRepository.findByDoctorId(doctor.getId())
        .stream()
        .sorted((a, b) -> {
          int dateComp = b.getAppointmentDate().compareTo(a.getAppointmentDate());
          return dateComp != 0 ? dateComp : b.getAppointmentTime().compareTo(a.getAppointmentTime());
        })
        .map(this::convertToResponseDto)
        .collect(Collectors.toList());
  }

  /**
   * Get all appointments (for staff)
   */
  public List<AppointmentResponseDto> getAllAppointments() {
    logger.debug("Getting all appointments");

    return appointmentRepository.findAll()
        .stream()
        .sorted((a, b) -> {
          int dateComp = b.getAppointmentDate().compareTo(a.getAppointmentDate());
          return dateComp != 0 ? dateComp : b.getAppointmentTime().compareTo(a.getAppointmentTime());
        })
        .map(this::convertToResponseDto)
        .collect(Collectors.toList());
  }

  /**
   * Update appointment status (Doctor/Staff only)
   */
  public AppointmentResponseDto updateAppointmentStatus(Long appointmentId,
      UpdateAppointmentStatusRequest request) {
    logger.info("Updating appointment {} to status: {}", appointmentId, request.getStatus());

    Appointment appointment = appointmentRepository.findById(appointmentId)
        .orElseThrow(() -> new RuntimeException("ERROR: Appointment with ID " + appointmentId + " not found"));

    // Validate status transition
    String currentStatus = appointment.getStatus();
    String newStatus = request.getStatus();

    validateStatusTransition(currentStatus, newStatus);

    appointment.setStatus(newStatus);
    if (request.getNotes() != null) {
      appointment.setNotes(request.getNotes());
    }

    Appointment updatedAppointment = appointmentRepository.save(appointment);
    logger.info("Appointment updated successfully");

    return convertToResponseDto(updatedAppointment);
  }

  /**
   * Cancel appointment
   */
  public AppointmentResponseDto cancelAppointment(Long appointmentId) {
    logger.info("Cancelling appointment: {}", appointmentId);

    Appointment appointment = appointmentRepository.findById(appointmentId)
        .orElseThrow(() -> new RuntimeException("ERROR: Appointment with ID " + appointmentId + " not found"));

    if ("COMPLETED".equals(appointment.getStatus())) {
      throw new RuntimeException("ERROR: Cannot cancel a completed appointment");
    }

    if ("CANCELLED".equals(appointment.getStatus())) {
      throw new RuntimeException("ERROR: Appointment is already cancelled");
    }

    appointment.setStatus("CANCELLED");
    Appointment updatedAppointment = appointmentRepository.save(appointment);

    return convertToResponseDto(updatedAppointment);
  }

  /**
   * Validate status transitions
   */
  private void validateStatusTransition(String currentStatus, String newStatus) {
    // BOOKED -> IN_PROGRESS, CANCELLED
    // IN_PROGRESS -> COMPLETED, CANCELLED
    // COMPLETED -> (no transitions allowed)
    // CANCELLED -> (no transitions allowed)

    if ("COMPLETED".equals(currentStatus)) {
      throw new RuntimeException("ERROR: Cannot update a completed appointment. Final status cannot be changed.");
    }

    if ("CANCELLED".equals(currentStatus)) {
      throw new RuntimeException("ERROR: Cannot update a cancelled appointment. Cancelled appointments are immutable.");
    }

    if ("BOOKED".equals(currentStatus)) {
      if (!("IN_PROGRESS".equals(newStatus) || "CANCELLED".equals(newStatus))) {
        throw new RuntimeException(
            "ERROR: Appointment in BOOKED status can only transition to IN_PROGRESS or CANCELLED, not " + newStatus);
      }
    } else if ("IN_PROGRESS".equals(currentStatus)) {
      if (!("COMPLETED".equals(newStatus) || "CANCELLED".equals(newStatus))) {
        throw new RuntimeException(
            "ERROR: Appointment in IN_PROGRESS status can only transition to COMPLETED or CANCELLED, not " + newStatus);
      }
    } else {
      throw new RuntimeException("ERROR: Unknown appointment status: " + currentStatus);
    }
  }

  /**
   * Convert Appointment entity to DTO
   */
  /**
   * Add or update meeting link for online appointments
   */
  public AppointmentResponseDto addMeetingLink(Long appointmentId, String doctorEmail,
      com.saket.hospital_queue_system.dto.UpdateMeetingLinkRequest request) {
    logger.info("Adding meeting link for appointment ID: {}", appointmentId);

    Appointment appointment = appointmentRepository.findById(appointmentId)
        .orElseThrow(() -> new RuntimeException("Appointment not found"));

    // Verify only doctor/staff can add meeting links
    User user = userRepository.findByEmail(doctorEmail)
        .orElseThrow(() -> new RuntimeException("User not found"));

    // Verify appointment is for this doctor or allow staff
    if (!appointment.getDoctor().getUser().getEmail().equals(doctorEmail) && !user.getRole().equals("STAFF")) {
      throw new RuntimeException("Only the assigned doctor or staff can add meeting links");
    }

    // Verify appointment is ONLINE type
    if (appointment.getAppointmentType() == null || !appointment.getAppointmentType().name().equals("ONLINE")) {
      throw new RuntimeException("Meeting links can only be added for ONLINE appointments");
    }

    // Validate meeting link format
    if (request.getMeetingLink() == null || request.getMeetingLink().trim().isEmpty()) {
      throw new RuntimeException("Meeting link cannot be empty");
    }

    // Validate URL format (basic validation)
    if (!request.getMeetingLink().startsWith("http://") && !request.getMeetingLink().startsWith("https://")) {
      throw new RuntimeException("Meeting link must be a valid URL");
    }

    // Update appointment with meeting link
    appointment.setMeetingLink(request.getMeetingLink());
    appointment.setUpdatedAt(java.time.LocalDateTime.now());

    Appointment updatedAppointment = appointmentRepository.save(appointment);
    logger.info("Meeting link added for appointment ID: {}", appointmentId);

    return convertToResponseDto(updatedAppointment);
  }

    public List<AppointmentResponseDto> getAppointmentsByClinic(Long clinicId) {

        List<Appointment> appointments =
                appointmentRepository.findByClinicId(clinicId);

        return appointments.stream()
                .map(AppointmentResponseDto::from)
                .toList();
    }

  private AppointmentResponseDto convertToResponseDto(Appointment appointment) {
    AppointmentResponseDto dto = new AppointmentResponseDto();
    dto.setId(appointment.getId());
    dto.setPatientId(appointment.getPatient().getId());
    dto.setPatientName(appointment.getPatient().getUser().getName());
    dto.setPatientGender(appointment.getPatient().getGender());
    dto.setDoctorId(appointment.getDoctor().getId());
    dto.setDoctorName(appointment.getDoctor().getUser().getName());
    dto.setDoctorSpecialization(appointment.getDoctor().getSpecialization());
    dto.setAppointmentDate(appointment.getAppointmentDate().toString());
    dto.setAppointmentTime(appointment.getAppointmentTime().toString());
    dto.setAppointmentType(appointment.getAppointmentType());
    dto.setStatus(appointment.getStatus());
    dto.setQueueNumber(appointment.getQueueNumber());
    dto.setMeetingLink(appointment.getMeetingLink());
    dto.setPaymentStatus(appointment.getPaymentStatus());
    dto.setNotes(appointment.getNotes());
    dto.setCreatedAt(appointment.getCreatedAt().toString());
    return dto;
  }
}
