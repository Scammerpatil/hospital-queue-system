package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.entity.Clinic;
import com.saket.hospital_queue_system.repository.ClinicRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ClinicService {

    private final ClinicRepository clinicRepository;

    public ClinicService(ClinicRepository clinicRepository) {
        this.clinicRepository = clinicRepository;
    }

    public Clinic getClinicById(Long id) {
        return clinicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clinic not found with id: " + id));
    }

    public Clinic save(Clinic clinic) {
        return clinicRepository.save(clinic);
    }

    public Optional<Clinic> findById(Long id) {
        return clinicRepository.findById(id);
    }
}
