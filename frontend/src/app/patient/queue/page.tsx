"use client";

import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import { queueService, QueueStatusResponse } from "@/services/queueService";
import {
  IconClipboardList,
  IconClock,
  IconUser,
  IconStethoscope,
  IconMapPin,
  IconAlertCircle,
  IconCircle,
  IconHourglass,
  IconRefresh,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";

interface Appointment {
  id: number;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
}

export default function PatientQueueStatus() {
  const [queueStatus, setQueueStatus] = useState<QueueStatusResponse | null>(
    null
  );
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getPatientAppointments();
        const appointments = response.data || response;

        const today = new Date().toISOString().split("T")[0];
        const todaysAppointment = (appointments as Appointment[]).find(
          (apt) =>
            (apt.appointmentDate === today && apt.status === "BOOKED") ||
            "IN_PROGRESS"
        );

        if (todaysAppointment) {
          setAppointment(todaysAppointment);
        } else {
          setError("No appointment scheduled for today");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load appointments");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch queue status
  const fetchQueueStatus = async () => {
    if (!appointment) return;

    try {
      const response = await queueService.getMyQueueStatus();
      const data = response.data || response;
      setQueueStatus(data as QueueStatusResponse);
      setError(null);
    } catch (err: any) {
      // Queue status might not exist until check-in
      console.log("Queue status not available yet");
    }
  };

  useEffect(() => {
    if (appointment) {
      fetchQueueStatus();
    }
  }, [appointment]);

  // Auto-refresh queue status
  useEffect(() => {
    if (!autoRefreshEnabled || !appointment) return;

    const interval = setInterval(() => {
      fetchQueueStatus();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, appointment]);

  const handleCheckIn = async () => {
    if (!appointment) {
      setError("No appointment found");
      return;
    }

    try {
      setCheckingIn(true);
      const response = await queueService.checkIn(appointment.id);
      const data = response.data || response;
      setQueueStatus(data as QueueStatusResponse);
      setError(null);
      // Start auto-refresh after check-in
      setAutoRefreshEnabled(true);
    } catch (err: any) {
      setError(err.message || "Failed to check in");
      console.error("Error checking in:", err);
    } finally {
      setCheckingIn(false);
    }
  };

  const handleRefresh = async () => {
    await fetchQueueStatus();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "WAITING":
        return "badge-warning";
      case "IN_PROGRESS":
        return "badge-info";
      case "COMPLETED":
        return "badge-success";
      case "CANCELLED":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "WAITING":
        return <IconHourglass size={20} />;
      case "IN_PROGRESS":
        return <IconClipboardList size={20} />;
      case "COMPLETED":
        return <IconCircle size={20} />;
      case "CANCELLED":
        return <IconAlertCircle size={20} />;
      default:
        return null;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Queue Status</h1>
            <p className="text-base-content/60 mt-2">
              Monitor your position and estimated wait time
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="btn btn-circle btn-outline"
            title="Refresh queue status"
          >
            <IconRefresh size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && !queueStatus && appointment && (
          <div className="alert alert-warning mb-6" role="alert">
            <IconAlertCircle />
            <span>{error}</span>
          </div>
        )}

        {/* Appointment Card */}
        {appointment && (
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <IconMapPin size={24} className="text-primary" />
                Your Appointment
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Doctor Info */}
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconStethoscope size={32} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm opacity-60">Doctor</p>
                    <p className="font-bold text-lg">
                      {appointment.doctorName}
                    </p>
                    <p className="text-sm opacity-60">
                      {appointment.doctorSpecialization}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-sm opacity-60">Scheduled Time</p>
                  <p className="font-bold text-lg flex items-center gap-2">
                    <IconClock size={20} />
                    {appointment.appointmentTime}
                  </p>
                  <p className="text-sm opacity-60 mt-2">
                    {appointment.appointmentDate}
                  </p>
                </div>
              </div>

              {/* Check-in Button */}
              {!queueStatus && (
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="btn btn-primary mt-4 gap-2"
                >
                  {checkingIn ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Checking In...
                    </>
                  ) : (
                    <>
                      <IconCircle size={20} />
                      Check In
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Queue Status Card */}
        {queueStatus && (
          <div className="card bg-gradient-to-br from-primary to-primary/80 text-primary-content shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start mb-6">
                <h2 className="card-title text-2xl">Queue Status</h2>
                <div
                  className={`badge badge-lg gap-2 ${getStatusColor(
                    queueStatus.status
                  )}`}
                >
                  {getStatusIcon(queueStatus.status)}
                  {queueStatus.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Position */}
                <div className="stat bg-white/10 rounded-lg p-4">
                  <div className="stat-title text-white/70">Your Position</div>
                  <div className="stat-value text-3xl font-black text-white">
                    #{queueStatus.position}
                  </div>
                  <div className="stat-desc text-white/60 mt-2">in queue</div>
                </div>

                {/* Estimated Wait */}
                <div className="stat bg-white/10 rounded-lg p-4">
                  <div className="stat-title text-white/70">Estimated Wait</div>
                  <div className="stat-value text-3xl font-black text-white">
                    {queueStatus.estimatedWaitMinutes}
                  </div>
                  <div className="stat-desc text-white/60 mt-2">minutes</div>
                </div>

                {/* Status Detail */}
                <div className="stat bg-white/10 rounded-lg p-4">
                  <div className="stat-title text-white/70">Check-in Time</div>
                  <div className="stat-value text-lg font-bold text-white">
                    {new Date(queueStatus.checkInTime).toLocaleTimeString()}
                  </div>
                  <div className="stat-desc text-white/60 mt-2">
                    {queueStatus.calledTime
                      ? `Called at ${new Date(
                          queueStatus.calledTime
                        ).toLocaleTimeString()}`
                      : "Waiting..."}
                  </div>
                </div>
              </div>

              {/* Auto-refresh Toggle */}
              <div className="mt-6 flex items-center gap-4 justify-between">
                <label className="label cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    checked={autoRefreshEnabled}
                    onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                    className="checkbox checkbox-white"
                  />
                  <span className="text-white">Auto-refresh (every 30s)</span>
                </label>
                <button
                  onClick={handleRefresh}
                  className="btn btn-sm btn-ghost text-white hover:bg-white/20 gap-2"
                >
                  <IconRefresh size={16} />
                  Refresh Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status Timeline */}
        {queueStatus && (
          <div className="card bg-base-100 shadow-xl mt-6">
            <div className="card-body">
              <h3 className="card-title mb-4">Timeline</h3>
              <div className="timeline timeline-vertical">
                {/* Check-in */}
                <div className="timeline-item">
                  <div className="timeline-marker bg-success text-white">
                    <IconCircle size={20} />
                  </div>
                  <div className="timeline-start md:text-end mb-10">
                    <div className="text-lg font-bold">Checked In</div>
                    <time className="font-mono text-sm opacity-60">
                      {new Date(queueStatus.checkInTime).toLocaleTimeString()}
                    </time>
                  </div>
                </div>

                {/* Called */}
                {queueStatus.calledTime && (
                  <div className="timeline-item">
                    <div className="timeline-marker bg-info text-white">
                      <IconClipboardList size={20} />
                    </div>
                    <div className="timeline-end mb-10">
                      <div className="text-lg font-bold">Doctor Called</div>
                      <time className="font-mono text-sm opacity-60">
                        {new Date(queueStatus.calledTime).toLocaleTimeString()}
                      </time>
                    </div>
                  </div>
                )}

                {/* Completed */}
                {queueStatus.completedTime && (
                  <div className="timeline-item">
                    <div className="timeline-marker bg-success text-white">
                      <IconCircle size={20} />
                    </div>
                    <div className="timeline-start md:text-end">
                      <div className="text-lg font-bold">Completed</div>
                      <time className="font-mono text-sm opacity-60">
                        {new Date(
                          queueStatus.completedTime
                        ).toLocaleTimeString()}
                      </time>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Queue Status Message */}
        {!queueStatus && appointment && !checkingIn && !error && (
          <div className="alert">
            <IconAlertCircle />
            <div>
              <p className="font-bold">Ready to check in?</p>
              <p className="text-sm">
                Click the "Check In" button above to join the queue for your
                appointment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
