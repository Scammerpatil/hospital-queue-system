"use client";

import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";

interface Appointment {
  id: number;
  patientName: string;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
  createdAt: string;
}

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getDoctorAppointments();
        console.log("Doctor appointments fetched:", response);
        setAppointments(response);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching appointments:", err);
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (
    appointmentId: number,
    newStatus: string
  ) => {
    try {
      setUpdating(appointmentId);
      await appointmentService.updateAppointmentStatus(appointmentId, {
        status: newStatus,
      });
      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
    } catch (err: any) {
      console.error("Error updating appointment:", err);
      setError(err.message || "Failed to update appointment");
    } finally {
      setUpdating(null);
    }
  };

  const filteredAppointments =
    filterStatus === "ALL"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content">
            Manage Appointments
          </h1>
          <p className="text-base-content/70 mt-2">
            Total: {appointments.length} appointments
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-8">
            <span>{error}</span>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="tabs tabs-bordered mb-6">
          {["ALL", "BOOKED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                className={`tab ${filterStatus === status ? "tab-active" : ""}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Appointments Table */}
        {filteredAppointments.length === 0 ? (
          <div className="alert">
            <span>
              No {filterStatus === "ALL" ? "" : filterStatus.toLowerCase()}{" "}
              appointments found
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Gender</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td className="font-semibold">{apt.patientName}</td>
                    <td>{apt.patientGender}</td>
                    <td>{apt.appointmentDate}</td>
                    <td>{apt.appointmentTime}</td>
                    <td>
                      <span
                        className={`badge ${
                          apt.status === "COMPLETED"
                            ? "badge-success"
                            : apt.status === "BOOKED"
                            ? "badge-info"
                            : apt.status === "IN_PROGRESS"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="text-xs">{apt.notes || "-"}</td>
                    <td>
                      <div className="flex gap-2">
                        {apt.status === "BOOKED" && (
                          <button
                            className="btn btn-xs btn-warning"
                            onClick={() =>
                              handleStatusUpdate(apt.id, "IN_PROGRESS")
                            }
                            disabled={updating === apt.id}
                          >
                            {updating === apt.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Start"
                            )}
                          </button>
                        )}
                        {apt.status === "IN_PROGRESS" && (
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() =>
                              handleStatusUpdate(apt.id, "COMPLETED")
                            }
                            disabled={updating === apt.id}
                          >
                            {updating === apt.id ? (
                              <span className="loading loading-spinner loading-xs"></span>
                            ) : (
                              "Complete"
                            )}
                          </button>
                        )}
                        {(apt.status === "BOOKED" ||
                          apt.status === "IN_PROGRESS") && (
                          <button
                            className="btn btn-xs btn-error"
                            onClick={() =>
                              handleStatusUpdate(apt.id, "CANCELLED")
                            }
                            disabled={updating === apt.id}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
