import { api } from "./api";

export const doctorService = {
  async getAllDoctors() {
    console.log("DoctorService: fetching all doctors");
    return await api.get("/api/doctors");
  },

  async getDoctorsByClinic(clinicId: number) {
    console.log("DoctorService: fetching doctors for clinic:", clinicId);
    return await api.get(`/api/doctors/by-clinic?clinicId=${clinicId}`);
  },

  async getDoctorById(id: number) {
    console.log("DoctorService: fetching doctor with id:", id);
    return await api.get(`/api/doctors/${id}`);
  },
};

export default doctorService;
