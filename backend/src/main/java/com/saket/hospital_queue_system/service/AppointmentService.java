package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AppointmentResponseDto;
import com.saket.hospital_queue_system.dto.CreateAppointmentRequest;
import com.saket.hospital_queue_system.dto.UpdateAppointmentStatusRequest;
import com.saket.hospital_queue_system.entity.Appointment;
import com.saket.hospital_queue_system.entity.Doctor;
import com.saket.hospital_queue_system.entity.Patient;
import com.saket.hospital_queue_system.entity.User;
import com.saket.hospital_queue_system.entity.AppointmentStatus;
import com.saket.hospital_queue_system.entity.PaymentStatus;
import com.saket.hospital_queue_system.repository.AppointmentRepository;
import com.saket.hospital_queue_system.repository.DoctorRepository;
import com.saket.hospital_queue_system.repository.PatientRepository;
import com.saket.hospital_queue_system.repository.UserRepository;
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

  /**
   * Create a new appointment by patient
   */
  public AppointmentResponseDto createAppointment(String patientEmail, CreateAppointmentRequest request) {
    logger.info("Creating appointment for patient: {}", patientEmail);

    // Validate patient exists
    User patientUser = userRepository.findByEmail(patientEmail)
        .orElseThrow(() -> new RuntimeException("ERROR: User account not found with email: " + patientEmail));

    Patient patient = patientRepository.findByUserId(patientUser.getId())
        .orElseThrow(() -> new RuntimeException("ERROR: Patient profile not initialized for user: " + patientEmail));

    // Validate doctor exists and is available
    Doctor doctor = doctorRepository.findById(request.getDoctorId())
        .orElseThrow(() -> new RuntimeException("ERROR: Doctor with ID " + request.getDoctorId() + " not found"));

    if (!doctor.getIsAvailable()) {
      throw new RuntimeException("ERROR: Doctor " + doctor.getUser().getName() + " (" + doctor.getSpecialization()
          + ") is currently unavailable for bookings");
    }

    // Validate appointment date is not in the past
    if (request.getAppointmentDate().isBefore(LocalDate.now())) {
      throw new RuntimeException(
          "ERROR: Appointment date cannot be in the past. Selected date: " + request.getAppointmentDate());
    }

    // Check for conflicting appointments
    List<Appointment> existingAppointments = appointmentRepository
        .findByDoctorIdAndAppointmentDate(doctor.getId(), request.getAppointmentDate());

    boolean conflictExists = existingAppointments.stream()
        .anyMatch(a -> a.getAppointmentTime().equals(request.getAppointmentTime())
            && !a.getStatus().equals(AppointmentStatus.CANCELLED));

    if (conflictExists) {
      throw new RuntimeException("ERROR: Dr. " + doctor.getUser().getName() + " is already booked at "
          + request.getAppointmentTime() + " on " + request.getAppointmentDate() + ". Please choose another time.");
    }

    // Create appointment
    Appointment appointment = new Appointment();
    appointment.setPatient(patient);
    appointment.setDoctor(doctor);
    appointment.setBookedByUser(patientUser);
    appointment.setAppointmentDate(request.getAppointmentDate());
    appointment.setAppointmentTime(request.getAppointmentTime());
    appointment.setAppointmentType(request.getAppointmentType());
    appointment.setStatus(AppointmentStatus.BOOKED);
    appointment.setQueueNumber(0); // Will be assigned by queue service
    appointment.setPaymentStatus(PaymentStatus.PENDING);
    appointment.setNotes(request.getNotes());

    Appointment savedAppointment = appointmentRepository.save(appointment);
    logger.info("Appointment created with ID: {}", savedAppointment.getId());

    return convertToResponseDto(savedAppointment);
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
    AppointmentStatus currentStatus = appointment.getStatus();
    AppointmentStatus newStatus = request.getStatus();

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

    if (AppointmentStatus.COMPLETED.equals(appointment.getStatus())) {
      throw new RuntimeException("ERROR: Cannot cancel a completed appointment");
    }

    if (AppointmentStatus.CANCELLED.equals(appointment.getStatus())) {
      throw new RuntimeException("ERROR: Appointment is already cancelled");
    }

    appointment.setStatus(AppointmentStatus.CANCELLED);
    Appointment updatedAppointment = appointmentRepository.save(appointment);

    return convertToResponseDto(updatedAppointment);
  }

  /**
   * Validate status transitions
   */
  private void validateStatusTransition(AppointmentStatus currentStatus, AppointmentStatus newStatus) {
    // BOOKED -> IN_PROGRESS, CANCELLED
    // IN_PROGRESS -> COMPLETED, CANCELLED
    // COMPLETED -> (no transitions allowed)
    // CANCELLED -> (no transitions allowed)

    if (AppointmentStatus.COMPLETED.equals(currentStatus)) {
      throw new RuntimeException("ERROR: Cannot update a completed appointment. Final status cannot be changed.");
    }

    if (AppointmentStatus.CANCELLED.equals(currentStatus)) {
      throw new RuntimeException("ERROR: Cannot update a cancelled appointment. Cancelled appointments are immutable.");
    }

    if (AppointmentStatus.BOOKED.equals(currentStatus)) {
      if (!(AppointmentStatus.IN_PROGRESS.equals(newStatus) || AppointmentStatus.CANCELLED.equals(newStatus))) {
        throw new RuntimeException(
            "ERROR: Appointment in BOOKED status can only transition to IN_PROGRESS or CANCELLED, not " + newStatus);
      }
    } else if (AppointmentStatus.IN_PROGRESS.equals(currentStatus)) {
      if (!(AppointmentStatus.COMPLETED.equals(newStatus) || AppointmentStatus.CANCELLED.equals(newStatus))) {
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
