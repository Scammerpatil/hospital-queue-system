"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { appointmentService } from "@/services/appointmentService";
import MeetingLinkDisplay from "@/components/MeetingLinkDisplay";
import Loading from "@/components/Loading";
import {
  IconArrowLeft,
  IconCalendar,
  IconClock,
  IconStethoscope,
  IconUser,
  IconPhone,
  IconMap,
  IconNotes,
  IconCircle,
  IconAlertCircle,
} from "@tabler/icons-react";

interface AppointmentDetail {
  id: number;
  doctorName: string;
  doctorSpecialization: string;
  doctorPhone: string;
  doctorEmail: string;
  clinicName: string;
  clinicAddress: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  status: string;
  notes: string;
  meetingLink?: string;
  meetingPlatform?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentDetail() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getAppointmentById(
          parseInt(appointmentId),
        );
        setAppointment(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load appointment details");
        console.error("Error fetching appointment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "bg-success/10 border-success/30",
          textColor: "text-success",
          icon: <IconCircle size={24} />,
          label: "Completed",
        };
      case "BOOKED":
        return {
          color: "bg-info/10 border-info/30",
          textColor: "text-info",
          icon: <IconAlertCircle size={24} />,
          label: "Scheduled",
        };
      case "IN_PROGRESS":
        return {
          color: "bg-warning/10 border-warning/30",
          textColor: "text-warning",
          icon: <IconAlertCircle size={24} />,
          label: "In Progress",
        };
      case "CANCELLED":
        return {
          color: "bg-error/10 border-error/30",
          textColor: "text-error",
          icon: <IconAlertCircle size={24} />,
          label: "Cancelled",
        };
      default:
        return {
          color:
            "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
          textColor: "text-gray-700 dark:text-gray-300",
          icon: <IconAlertCircle size={24} />,
          label: status,
        };
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost gap-2 mb-6"
          >
            <IconArrowLeft size={20} />
            Back
          </button>
          <div className="alert alert-error">
            <IconAlertCircle />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost gap-2 mb-6"
          >
            <IconArrowLeft size={20} />
            Back
          </button>
          <div className="alert">
            <span>Appointment not found</span>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(appointment.status);
  const appointmentDateTime = new Date(
    `${appointment.appointmentDate}T${appointment.appointmentTime}`,
  );
  const now = new Date();
  const isUpcoming = appointmentDateTime > now;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="btn btn-ghost gap-2 mb-6"
        >
          <IconArrowLeft size={20} />
          Back to Appointments
        </button>

        {/* Status Badge & Title */}
        <div className="mb-8">
          <div
            className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg border mb-4 ${statusConfig.color}`}
          >
            <span className={statusConfig.textColor}>{statusConfig.icon}</span>
            <span className={`font-bold ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
          <h1 className="text-4xl font-black text-base-content mb-2">
            Appointment Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Doctor Information Card */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2 mb-4">
                  <IconStethoscope size={24} className="text-primary" />
                  Doctor Information
                </h2>

                <div className="space-y-4">
                  <div className="divider my-0"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm opacity-60 font-medium mb-1">
                        Doctor Name
                      </p>
                      <p className="text-lg font-bold">
                        {appointment.doctorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-60 font-medium mb-1">
                        Specialization
                      </p>
                      <p className="text-lg font-bold">
                        {appointment.doctorSpecialization}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-60 font-medium mb-1">
                        Phone
                      </p>
                      <div className="flex items-center gap-2">
                        <IconPhone size={18} className="text-primary" />
                        <p className="text-lg font-bold">
                          {appointment.doctorPhone}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm opacity-60 font-medium mb-1">
                        Email
                      </p>
                      <p className="text-lg font-bold break-all">
                        {appointment.doctorEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Clinic Information Card */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2 mb-4">
                  <IconMap size={24} className="text-success" />
                  Clinic Information
                </h2>

                <div className="space-y-4">
                  <div className="divider my-0"></div>

                  <div>
                    <p className="text-sm opacity-60 font-medium mb-2">
                      Clinic Name
                    </p>
                    <p className="text-lg font-bold mb-3">
                      {appointment.clinicName}
                    </p>

                    <p className="text-sm opacity-60 font-medium mb-2">
                      Address
                    </p>
                    <div className="flex gap-2">
                      <IconMap
                        size={18}
                        className="text-success flex-shrink-0 mt-0.5"
                      />
                      <p className="text-base">{appointment.clinicAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Timing Card */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2 mb-4">
                  <IconCalendar size={24} className="text-warning" />
                  Appointment Timing
                </h2>

                <div className="space-y-4">
                  <div className="divider my-0"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm opacity-60 font-medium mb-1">
                        Date
                      </p>
                      <p className="text-lg font-bold">
                        {appointment.appointmentDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-60 font-medium mb-1">
                        Time
                      </p>
                      <div className="flex items-center gap-2">
                        <IconClock size={18} className="text-warning" />
                        <p className="text-lg font-bold">
                          {appointment.appointmentTime}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm opacity-60 font-medium mb-1">
                        Type
                      </p>
                      <p className="text-lg font-bold">
                        {appointment.appointmentType === "ONLINE"
                          ? "Virtual Consultation"
                          : "In-Person Visit"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Link Section (for ONLINE appointments) */}
            {appointment.appointmentType === "ONLINE" && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title flex items-center gap-2 mb-4">
                    Video Consultation Link
                  </h2>
                  <MeetingLinkDisplay
                    meetingLink={appointment.meetingLink}
                    meetingPlatform={appointment.meetingPlatform}
                    appointmentStatus={appointment.status}
                    appointmentTime={appointment.appointmentTime}
                  />
                </div>
              </div>
            )}

            {/* Notes Section */}
            {appointment.notes && (
              <div className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h2 className="card-title flex items-center gap-2 mb-4">
                    <IconNotes size={24} className="text-info" />
                    Notes
                  </h2>

                  <div className="divider my-0"></div>

                  <div className="bg-info/5 p-4 rounded-lg border border-info/20 mt-4">
                    <p className="text-base leading-relaxed">
                      {appointment.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title flex items-center gap-2 mb-4">
                  <IconUser size={24} className="text-secondary" />
                  You
                </h2>

                <div className="divider my-0"></div>

                <div className="mt-4">
                  <p className="text-sm opacity-60 font-medium mb-1">Name</p>
                  <p className="text-base font-bold">
                    {appointment.patientName}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Quick Info</h2>

                <div className="divider my-0"></div>

                <div className="space-y-3 mt-4 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-60">Booked on</span>
                    <span className="font-semibold">
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Last updated</span>
                    <span className="font-semibold">
                      {new Date(appointment.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Status</span>
                    <span className="font-semibold">{appointment.status}</span>
                  </div>
                </div>

                {isUpcoming && appointment.status === "BOOKED" && (
                  <button className="btn btn-error btn-outline btn-block mt-4">
                    Cancel Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
