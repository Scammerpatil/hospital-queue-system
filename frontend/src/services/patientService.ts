import { api } from "./api";

export const patientService = {
  async getPatientDashboard() {
    return await api.get("/patient/dashboard");
  },
};
