package com.saket.hospital_queue_system.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDetailsDto {
    private String name;
    private Integer age;
    private String gender;
    private String phone;
}
