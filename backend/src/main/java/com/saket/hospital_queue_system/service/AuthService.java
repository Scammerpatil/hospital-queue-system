package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.AuthResponse;
import com.saket.hospital_queue_system.dto.LoginRequest;
import com.saket.hospital_queue_system.dto.SignupRequest;
import com.saket.hospital_queue_system.dto.UserResponse;
import com.saket.hospital_queue_system.entity.*;
import com.saket.hospital_queue_system.repository.*;
import com.saket.hospital_queue_system.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {

  private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PatientRepository patientRepository;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private StaffRepository staffRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private JwtTokenProvider jwtTokenProvider;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Transactional
  public Boolean signup(SignupRequest request) {
    logger.info("Signup request for email: {}, role: {}", request.getEmail(), request.getRole());

    // Check if user already exists
    if (userRepository.existsByEmail(request.getEmail())) {
      throw new RuntimeException("Email already registered");
    }

    if (userRepository.existsByPhone(request.getPhone())) {
      throw new RuntimeException("Phone number already registered");
    }

    // Create user
    User user = new User();
    user.setName(request.getFullName());
    user.setEmail(request.getEmail());
    user.setPhone(request.getPhone());
    user.setProfileImage(request.getProfileImage());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setRole(request.getRole());
    user.setIsActive(true);
    User savedUser = userRepository.save(user);
    logger.info("User created with ID: {}", savedUser.getId());

    // Create role-specific profile
    switch (request.getRole()) {
      case PATIENT:
        Patient patient = new Patient();
        patient.setUser(savedUser);
        patient.setIsActive(true);
        patientRepository.save(patient);
        logger.info("Patient profile created");
        break;

      case DOCTOR:
        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        doctor.setSpecialization(request.getSpecialization() != null ? request.getSpecialization() : "General");
        doctor.setIsAvailable(true);
        doctorRepository.save(doctor);
        logger.info("Doctor profile created");
        break;

      case STAFF:
        Staff staff = new Staff();
        staff.setUser(savedUser);
        staff.setDepartment(request.getDepartment() != null ? request.getDepartment() : "Administration");
        staff.setIsActive(true);
        staffRepository.save(staff);
        logger.info("Staff profile created");
        break;
    }
    return true;
  }

  public AuthResponse login(LoginRequest request) {
    logger.info("Login attempt for email: {}", request.getEmail());

    // Authenticate user
    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("User not found"));

    // Generate token
    String token = jwtTokenProvider.generateToken(user);
    logger.info("Token generated for user: {}", request.getEmail());

    AuthResponse response = new AuthResponse();
    response.setToken(token);
    response.setEmail(user.getEmail());
    response.setRole(user.getRole());
    response.setUserId(user.getId());
    response.setMessage("Login successful");

    return response;
  }

  public UserResponse getCurrentUserByEmail(String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
    logger.debug("Getting current user info: {}", user.getEmail());

    UserResponse response = new UserResponse();
    response.setId(user.getId());
    response.setEmail(user.getEmail());
    response.setPhone(user.getPhone());
    response.setRole(user.getRole());
    response.setName(user.getName());
    response.setProfileImage(user.getProfileImage());
    response.setIsActive(user.getIsActive());

    return response;
  }
}
