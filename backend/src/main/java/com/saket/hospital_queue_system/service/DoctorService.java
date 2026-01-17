package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AppointmentDto;
import com.saket.hospital_queue_system.dto.DoctorDashboardResponse;
import com.saket.hospital_queue_system.entity.Appointment;
import com.saket.hospital_queue_system.entity.Doctor;
import com.saket.hospital_queue_system.entity.User;
import com.saket.hospital_queue_system.repository.AppointmentRepository;
import com.saket.hospital_queue_system.repository.DoctorRepository;
import com.saket.hospital_queue_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

  private static final Logger logger = LoggerFactory.getLogger(DoctorService.class);

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private AppointmentRepository appointmentRepository;

  public DoctorDashboardResponse getDoctorDashboard(String email) {
    logger.info("Getting dashboard for email: {}", email);

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Doctor doctor = doctorRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

    // Get all appointments for this doctor
    List<Appointment> allAppointments = appointmentRepository.findByDoctorId(doctor.getId());

    // Count statistics
    int totalAppointments = allAppointments.size();
    int completedAppointments = (int) allAppointments.stream()
        .filter(a -> "COMPLETED".equals(a.getStatus()))
        .count();

    // Get today's appointments
    LocalDate today = LocalDate.now();
    List<AppointmentDto> todayAppointmentsList = allAppointments.stream()
        .filter(a -> a.getAppointmentDate().equals(today))
        .map(appointment -> new AppointmentDto(
            appointment.getId(),
            appointment.getPatient().getUser().getName(),
            appointment.getPatient().getGender(),
            appointment.getAppointmentDate().toString(),
            appointment.getAppointmentTime().toString(),
            appointment.getStatus(),
            appointment.getNotes()))
        .collect(Collectors.toList());

    int todayAppointments = todayAppointmentsList.size();

    DoctorDashboardResponse response = new DoctorDashboardResponse();
    response.setDoctorName(user.getName());
    response.setEmail(user.getEmail());
    response.setSpecialization(doctor.getSpecialization());
    response.setLicenseNumber(doctor.getLicenseNumber());
    response.setBio(doctor.getBio());
    response.setConsultationFee(doctor.getConsultationFee());
    response.setAvailableSlots(doctor.getAvailableSlots());
    response.setIsAvailable(doctor.getIsAvailable());
    response.setTotalAppointments(totalAppointments);
    response.setCompletedAppointments(completedAppointments);
    response.setTodayAppointments(todayAppointments);
    response.setTodayAppointmentsList(todayAppointmentsList);

    logger.info("Dashboard retrieved successfully");
    return response;
  }

  public List<Doctor> getAvailableDoctors() {
    logger.debug("Fetching available doctors");
    return doctorRepository.findByIsAvailableTrue();
  }
}
