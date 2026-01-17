package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AppointmentDto;
import com.saket.hospital_queue_system.dto.StaffDashboardResponse;
import com.saket.hospital_queue_system.entity.Appointment;
import com.saket.hospital_queue_system.entity.Staff;
import com.saket.hospital_queue_system.entity.User;
import com.saket.hospital_queue_system.repository.AppointmentRepository;
import com.saket.hospital_queue_system.repository.DoctorRepository;
import com.saket.hospital_queue_system.repository.PatientRepository;
import com.saket.hospital_queue_system.repository.StaffRepository;
import com.saket.hospital_queue_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffService {

  private static final Logger logger = LoggerFactory.getLogger(StaffService.class);

  @Autowired
  private StaffRepository staffRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PatientRepository patientRepository;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private AppointmentRepository appointmentRepository;

  public StaffDashboardResponse getStaffDashboard(String email) {
    logger.info("Getting dashboard for email: {}", email);

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Staff staff = staffRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("Staff profile not found"));

    // Get statistics
    long totalPatients = patientRepository.count();
    long totalDoctors = doctorRepository.count();

    // Get all appointments
    List<Appointment> allAppointments = appointmentRepository.findAll();
    int totalAppointments = allAppointments.size();

    // Get today's appointments
    LocalDate today = LocalDate.now();
    List<AppointmentDto> todayAppointmentsList = allAppointments.stream()
        .filter(a -> a.getAppointmentDate().equals(today))
        .limit(5)
        .map(appointment -> new AppointmentDto(
            appointment.getId(),
            appointment.getPatient().getUser().getName(),
            appointment.getDoctor().getUser().getName(),
            appointment.getAppointmentDate().toString(),
            appointment.getAppointmentTime().toString(),
            appointment.getStatus(),
            appointment.getNotes()))
        .collect(Collectors.toList());

    int todayAppointments = todayAppointmentsList.size();

    StaffDashboardResponse response = new StaffDashboardResponse();
    response.setStaffName(user.getName());
    response.setEmail(user.getEmail());
    response.setDepartment(staff.getDepartment());
    response.setIsActive(staff.getIsActive());
    response.setTotalPatients((int) totalPatients);
    response.setTotalDoctors((int) totalDoctors);
    response.setTotalAppointments(totalAppointments);
    response.setTodayAppointments(todayAppointments);
    response.setRecentAppointments(todayAppointmentsList);

    logger.info("Dashboard retrieved successfully");
    return response;
  }
}
