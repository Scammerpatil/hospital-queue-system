package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.Doctor;
import com.saket.hospital_queue_system.entity.User;
import lombok.Data;

@Data
public class DoctorCreateDTO {
    private Doctor doctor;
    private Long clinicId;
    private User user;
}
