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

      @Autowired
      private ClinicRepository clinicRepository;

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

        if (request.getRole() == Role.STAFF) {
             if (request.getClinic() == null) {
                  throw new RuntimeException("Clinic details are required for staff signup");
             }
        }
        // Create user
        User user = new User();
        user.setName(request.getName());
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
            patient.setPhoneNumber(savedUser.getPhone());
            patient.setPatientName(savedUser.getName());
            patient.setIsActive(true);
            patientRepository.save(patient);
            logger.info("Patient profile created");
            break;

          case STAFF:
              Clinic clinic = new Clinic();
              clinic.setName(request.getClinic().getName());
              clinic.setDistrict(request.getClinic().getDistrict());
              clinic.setTaluka(request.getClinic().getTaluka());
              clinic.setState(request.getClinic().getState());
              clinic.setAddress(request.getClinic().getAddress());
              clinic.setActive(true);

              Clinic savedClinic = clinicRepository.save(clinic);
              logger.info("Clinic created with ID: {}", savedClinic.getId());

              // ✅ Create Staff (Clinic Admin)
              Staff staff = new Staff();
              staff.setUser(savedUser);
              staff.setClinic(savedClinic);
              staff.setDepartment("Administration");
              staff.setIsActive(true);

              staffRepository.save(staff);
              logger.info("Staff profile created as clinic admin");
            break;
        }
        return true;
      }

      public AuthResponse login(LoginRequest request) {
        logger.info("Login attempt for email: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.generateToken(user);
        logger.info("Token generated for user: {}", request.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setUserId(user.getId());
        response.setClinicId(
            user.getRole() == Role.STAFF
                ? staffRepository.findByUserId(user.getId())
                    .map(staff -> staff.getClinic().getId())
                    .orElse(null)
                : null
        );
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
        response.setClinicId(
            user.getRole() == Role.STAFF
                ? staffRepository.findByUserId(user.getId())
                    .map(staff -> staff.getClinic().getId())
                    .orElse(null)
                : null
        );
        response.setProfileImage(user.getProfileImage());
        response.setIsActive(user.getIsActive());

        return response;
      }
    }
