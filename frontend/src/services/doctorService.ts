import { api } from "./api";

export const doctorService = {
  async getAllDoctors() {
    console.log("DoctorService: fetching all doctors");
    return await api.get("/api/doctor");
  },

  async getAvailableDoctors() {
    console.log("DoctorService: fetching available doctors");
    return await api.get("/api/doctor/available");
  },

  async getDoctorsByClinic(clinicName: string) {
    console.log("DoctorService: fetching doctors for clinic:", clinicName);
    const response = await api.get("/api/doctor");
    return response.data.filter((doctor: any) => doctor.clinicName === clinicName);
  },

  async getDoctorsByLocation(district: string, taluka?: string) {
    console.log("DoctorService: fetching doctors for district:", district, "taluka:", taluka);
    const response = await api.get("/api/doctor");
    let filtered = response.data.filter((doctor: any) => doctor.district === district);
    if (taluka) {
      filtered = filtered.filter((doctor: any) => doctor.taluka === taluka);
    }
    return filtered;
  },

  async getDoctorById(id: number) {
    console.log("DoctorService: fetching doctor with id:", id);
    return await api.get(`/api/doctor/${id}`);
  },

  /**
   * Get unique clinics aggregated from doctors
   */
  async getClinics() {
    console.log("DoctorService: aggregating clinics from doctors");
    const response = await api.get("/api/doctor");
    const doctors = response.data;

    // Group doctors by clinic
    const clinicMap = new Map<string, any>();
    doctors.forEach((doctor: any) => {
      if (doctor.clinicName) {
        if (!clinicMap.has(doctor.clinicName)) {
          clinicMap.set(doctor.clinicName, {
            clinicName: doctor.clinicName,
            district: doctor.district,
            taluka: doctor.taluka,
            doctors: [],
            specializations: new Set<string>(),
          });
        }
        const clinic = clinicMap.get(doctor.clinicName);
        clinic.doctors.push({
          id: doctor.id,
          name: doctor.user?.name || "Unknown",
          specialization: doctor.specialization,
        });
        if (doctor.specialization) {
          clinic.specializations.add(doctor.specialization);
        }
      }
    });

    // Convert Map to array and convert Set to array
    return Array.from(clinicMap.values()).map((clinic: any) => ({
      ...clinic,
      specializations: Array.from(clinic.specializations),
      totalDoctors: clinic.doctors.length,
    }));
  },

  /**
   * Get unique districts from all doctors
   */
  async getDistricts() {
    console.log("DoctorService: getting all districts");
    const response = await api.get("/api/doctor");
    const districts = new Set<string>();
    response.data.forEach((doctor: any) => {
      if (doctor.district) {
        districts.add(doctor.district);
      }
    });
    return Array.from(districts).sort();
  },

  /**
   * Get unique talukas for a specific district
   */
  async getTalukasByDistrict(district: string) {
    console.log("DoctorService: getting talukas for district:", district);
    const response = await api.get("/api/doctor");
    const talukas = new Set<string>();
    response.data.forEach((doctor: any) => {
      if (doctor.district === district && doctor.taluka) {
        talukas.add(doctor.taluka);
      }
    });
    return Array.from(talukas).sort();
  },

  /**
   * Get clinics for a specific district and optionally taluka
   */
  async getClinicsByLocation(district: string, taluka?: string) {
    console.log("DoctorService: getting clinics for location", { district, taluka });
    const response = await api.get("/api/doctor");
    const doctors = response.data.filter((doctor: any) => doctor.district === district);
    
    const filteredDoctors = taluka
      ? doctors.filter((doctor: any) => doctor.taluka === taluka)
      : doctors;

    // Group by clinic
    const clinicMap = new Map<string, any>();
    filteredDoctors.forEach((doctor: any) => {
      if (doctor.clinicName) {
        if (!clinicMap.has(doctor.clinicName)) {
          clinicMap.set(doctor.clinicName, {
            clinicName: doctor.clinicName,
            district: doctor.district,
            taluka: doctor.taluka,
            doctors: [],
            specializations: new Set<string>(),
          });
        }
        const clinic = clinicMap.get(doctor.clinicName);
        clinic.doctors.push({
          id: doctor.id,
          name: doctor.user?.name || "Unknown",
          specialization: doctor.specialization,
        });
        if (doctor.specialization) {
          clinic.specializations.add(doctor.specialization);
        }
      }
    });

    return Array.from(clinicMap.values()).map((clinic: any) => ({
      ...clinic,
      specializations: Array.from(clinic.specializations),
      totalDoctors: clinic.doctors.length,
    }));
  },
};

export default doctorService;
