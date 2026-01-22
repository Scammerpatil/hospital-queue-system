"use client";

import { useEffect, useState } from "react";
import { staffDashboardService } from "@/services/staffDashboardService";
import Link from "next/link";

interface AppointmentDto {
  id: number;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
}

interface StaffDashboardData {
  staffName: string;
  email: string;
  department: string;
  isActive: boolean;
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  todayAppointments: number;
  recentAppointments: AppointmentDto[];
}

export default function StaffDashboardPage() {
  const [data, setData] = useState<StaffDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await staffDashboardService.getStaffDashboard();
        console.log("Staff Dashboard data fetched:", response);
        setData(response);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-warning">
          <span>No data available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content">
          Welcome, {data.staffName}! 👋
        </h1>
        <p className="text-base-content/70 mt-2">{data.email}</p>
        <div className="mt-2">
          <span
            className={`badge ${
              data.isActive ? "badge-success" : "badge-warning"
            }`}
          >
            {data.isActive ? "Active" : "Inactive"}
          </span>
          <span className="badge badge-neutral ml-2">{data.department}</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Patients */}
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M13 16H3v-2a6 6 0 0112 0v2z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Patients</div>
          <div className="stat-value text-primary text-3xl">
            {data.totalPatients}
          </div>
        </div>

        {/* Total Doctors */}
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-figure text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Doctors</div>
          <div className="stat-value text-success text-3xl">
            {data.totalDoctors}
          </div>
        </div>

        {/* Total Appointments */}
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-figure text-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Total Appointments</div>
          <div className="stat-value text-info text-3xl">
            {data.totalAppointments}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="stat bg-base-200 rounded-lg shadow">
          <div className="stat-figure text-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-8 h-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Today's Appointments</div>
          <div className="stat-value text-warning text-3xl">
            {data.todayAppointments}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link
          href="/staff/patients"
          className="card bg-base-200 shadow hover:shadow-lg transition"
        >
          <div className="card-body items-center text-center">
            <h3 className="card-title text-lg">Patients</h3>
            <p className="text-sm text-base-content/70">
              Manage patient records
            </p>
          </div>
        </Link>
        <Link
          href="/staff/doctors"
          className="card bg-base-200 shadow hover:shadow-lg transition"
        >
          <div className="card-body items-center text-center">
            <h3 className="card-title text-lg">Doctors</h3>
            <p className="text-sm text-base-content/70">
              Manage doctor profiles
            </p>
          </div>
        </Link>
        <Link
          href="/staff/appointments"
          className="card bg-base-200 shadow hover:shadow-lg transition"
        >
          <div className="card-body items-center text-center">
            <h3 className="card-title text-lg">Appointments</h3>
            <p className="text-sm text-base-content/70">
              View all appointments
            </p>
          </div>
        </Link>
        <Link
          href="/staff/settings"
          className="card bg-base-200 shadow hover:shadow-lg transition"
        >
          <div className="card-body items-center text-center">
            <h3 className="card-title text-lg">Settings</h3>
            <p className="text-sm text-base-content/70">System configuration</p>
          </div>
        </Link>
      </div>

      {/* Recent Appointments Section */}
      <div className="card bg-base-200 shadow">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <h2 className="card-title">Today's Appointments</h2>
            <Link href="/staff/appointments" className="btn btn-primary btn-sm">
              View All
            </Link>
          </div>

          {data.recentAppointments.length === 0 ? (
            <div className="alert">
              <span>No appointments scheduled for today.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td className="font-semibold">{apt.patientName}</td>
                      <td>{apt.appointmentTime}</td>
                      <td>
                        <div
                          className={`badge ${
                            apt.status === "COMPLETED"
                              ? "badge-success"
                              : apt.status === "BOOKED"
                                ? "badge-info"
                                : "badge-warning"
                          }`}
                        >
                          {apt.status}
                        </div>
                      </td>
                      <td className="text-xs">{apt.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
