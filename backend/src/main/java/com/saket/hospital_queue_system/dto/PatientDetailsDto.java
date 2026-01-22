package com.saket.hospital_queue_system.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatientDetailsDto {
    private String name;
    private Integer age;
    private String gender;
    private String phone;
}
