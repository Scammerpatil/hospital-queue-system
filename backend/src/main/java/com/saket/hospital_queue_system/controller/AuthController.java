package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.AuthResponse;
import com.saket.hospital_queue_system.dto.LoginRequest;
import com.saket.hospital_queue_system.dto.SignupRequest;
import com.saket.hospital_queue_system.dto.UserResponse;
import com.saket.hospital_queue_system.entity.User;
import com.saket.hospital_queue_system.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private AuthService authService;

  @PostMapping("/signup")
  public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
    System.out.println("AuthController: POST /api/auth/signup");
    try {
        Boolean signupSuccess = authService.signup(request);
        if (signupSuccess) {
            return ResponseEntity.status(HttpStatus.CREATED)
                .body("Signup successful");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Signup failed");
        }
    } catch (Exception e) {
      System.out.println("AuthController: Signup error: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST)
          .body("Signup failed: " + e.getMessage());
    }
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
    System.out.println("AuthController: POST /api/auth/login");
    try {
      AuthResponse response = authService.login(request);
      String token = response.getToken();
        ResponseCookie cookie = ResponseCookie.from("authToken", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(60 * 60)
                .build();
        response.setToken(null);
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    } catch (Exception e) {
      System.out.println("AuthController: Login error: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new AuthResponse(null, null, null, null, "Login failed: " + e.getMessage()));
    }
  }

  @GetMapping("/me")
  public ResponseEntity<UserResponse> getCurrentUser() {
    System.out.println("AuthController: GET /api/auth/me");
    try {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        System.out.println("AuthController: Principal class: " + principal);
        if (!(principal instanceof UserDetails userDetails)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = userDetails.getUsername();
        UserResponse response = authService.getCurrentUserByEmail(email);
        System.out.println("AuthController: Current user retrieved: " + email);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
      System.out.println("AuthController: Get current user error: " + e.getMessage());
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
  }
}
