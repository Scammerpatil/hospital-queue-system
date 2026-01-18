package com.saket.hospital_queue_system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Appointment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "patient_id", nullable = false)
  private Patient patient;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "doctor_id", nullable = false)
  private Doctor doctor;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "booked_by_user_id", nullable = false)
  private User bookedByUser; // User who booked (may differ from patient)

  @Column(nullable = false)
  private LocalDate appointmentDate;

  @Column(nullable = false)
  private LocalTime appointmentTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AppointmentType appointmentType; // IN_PERSON or ONLINE

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AppointmentStatus status; // BOOKED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW

  @Column(nullable = false)
  private Integer queueNumber; // Assigned queue position

  @Column(length = 250)
  private String meetingLink; // For online appointments

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentStatus paymentStatus; // PENDING, COMPLETED, FAILED, REFUNDED

  @Column(length = 250)
  private String notes;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
