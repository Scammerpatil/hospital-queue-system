import { api } from "./api";

export interface CreateAppointmentPayload {
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface UpdateAppointmentStatusPayload {
  status: string;
  notes?: string;
}

export const appointmentService = {
  async createAppointment(payload: CreateAppointmentPayload) {
    console.log("AppointmentService: Creating appointment", payload);
    return await api.post("/appointment/create", payload);
  },

  async getAppointmentById(id: number) {
    console.log("AppointmentService: Fetching appointment with id:", id);
    return await api.get(`/appointment/${id}`);
  },

  async getPatientAppointments() {
    console.log("AppointmentService: Fetching patient appointments");
    return await api.get("/appointment/patient/list");
  },

  async getDoctorAppointments() {
    console.log("AppointmentService: Fetching doctor appointments");
    return await api.get("/appointment/doctor/list");
  },

  async getAllAppointments() {
    console.log("AppointmentService: Fetching all appointments");
    return await api.get("/appointment/all");
  },

  async updateAppointmentStatus(
    id: number,
    payload: UpdateAppointmentStatusPayload
  ) {
    console.log("AppointmentService: Updating appointment status", id, payload);
    return await api.put(`/appointment/${id}/status`, payload);
  },

  async cancelAppointment(id: number) {
    console.log("AppointmentService: Cancelling appointment", id);
    return await api.delete(`/appointment/${id}`);
  },
};

export default appointmentService;
