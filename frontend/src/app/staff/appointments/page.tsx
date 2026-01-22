"use client";

import { useEffect, useState } from "react";
import { appointmentService } from "@/services/appointmentService";
import { useAuth } from "@/context/AuthContext";
import {
  IconUser,
  IconCalendar,
  IconClock,
  IconStethoscope,
  IconFilter,
  IconCircleCheck,
  IconCircleDashed,
  IconCircleX,
  IconPlayerPlay,
  IconNotes,
  IconGenderMale,
  IconGenderFemale,
  IconSearch,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  patientGender: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
  createdAt: string;
}

export default function ManageAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const response = await appointmentService.getAllAppointments(
          user?.clinicId!,
        );
        setAppointments(response);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user?.clinicId]);

  const handleStatusUpdate = async (
    appointmentId: number,
    newStatus: string,
  ) => {
    try {
      setUpdating(appointmentId);
      await appointmentService.updateAppointmentStatus(appointmentId, {
        status: newStatus as
          | "BOOKED"
          | "CHECKED_IN"
          | "IN_PROGRESS"
          | "COMPLETED"
          | "CANCELLED",
      });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt,
        ),
      );
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "badge-success",
          icon: <IconCircleCheck size={14} />,
          label: "Completed",
        };
      case "BOOKED":
        return {
          color: "badge-info",
          icon: <IconCircleDashed size={14} />,
          label: "Scheduled",
        };
      case "IN_PROGRESS":
        return {
          color: "badge-warning",
          icon: <IconPlayerPlay size={14} />,
          label: "In Progress",
        };
      case "CANCELLED":
        return {
          color: "badge-error",
          icon: <IconCircleX size={14} />,
          label: "Cancelled",
        };
      default:
        return {
          color: "badge-ghost",
          icon: <IconCircleDashed size={14} />,
          label: status,
        };
    }
  };

  const filteredAppointments =
    filterStatus === "ALL"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content uppercase">
            Clinic <span className="text-primary">Schedule</span>
          </h1>
          <p className="text-base-content/60 font-bold mt-1 uppercase text-xs tracking-widest">
            {appointments.length} Total Patient Encounters
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 mr-2 opacity-50">
          <IconFilter size={18} />
          <span className="text-xs font-black uppercase">Filter View</span>
        </div>
        <div className="join bg-base-200 p-1 rounded-xl shadow-inner border border-base-300">
          {["ALL", "BOOKED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`join-item btn btn-sm border-none px-5 font-black text-[10px] ${
                  filterStatus === status
                    ? "btn-primary shadow-md"
                    : "btn-ghost hover:bg-base-300"
                }`}
              >
                {status === "ALL" ? "Everything" : status.replace("_", " ")}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="alert alert-error shadow-lg mb-8 rounded-2xl border-2 border-error/20">
          <IconCircleX stroke={3} />
          <span className="font-black uppercase text-xs">{error}</span>
        </div>
      )}

      {/* Main Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="hero bg-base-200 rounded-3xl py-24 border-2 border-dashed border-base-300">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <IconSearch size={48} className="mx-auto mb-4 opacity-20" />
              <h2 className="text-xl font-black opacity-40 uppercase tracking-widest">
                No matching records
              </h2>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAppointments.map((apt) => {
            const config = getStatusConfig(apt.status);
            return (
              <div
                key={apt.id}
                className="group card bg-base-200 border border-base-300 hover:border-primary/40 transition-all duration-300"
              >
                <div className="card-body p-6">
                  {/* Patient Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="avatar placeholder">
                        <div className="bg-base-300 text-base-content rounded-xl w-12 border border-base-content/10 flex justify-center items-center">
                          <IconUser size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-black text-lg group-hover:text-primary transition-colors">
                          {apt.patientName}
                        </h3>
                        <div className="flex items-center gap-1 opacity-50">
                          {apt.patientGender?.toLowerCase() === "male" ? (
                            <IconGenderMale size={14} />
                          ) : (
                            <IconGenderFemale size={14} />
                          )}
                          <p className="text-[10px] font-black uppercase tracking-tighter">
                            {apt.patientGender}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`badge ${config.color} gap-1.5 font-black py-3 px-3 text-[10px] uppercase`}
                    >
                      {config.icon}
                      {config.label}
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="bg-base-100/50 rounded-2xl p-4 space-y-3 border border-base-300">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 opacity-40 font-black text-[10px] uppercase">
                        <IconCalendar size={14} /> Date
                      </span>
                      <span className="font-bold text-xs">
                        {apt.appointmentDate}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2 opacity-40 font-black text-[10px] uppercase">
                        <IconClock size={14} /> Slot
                      </span>
                      <span className="font-bold text-xs">
                        {apt.appointmentTime}
                      </span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="flex gap-2 min-h-10">
                    <IconNotes size={14} className="mt-1 opacity-30 shrink-0" />
                    <p className="text-[11px] opacity-60 font-medium italic line-clamp-2 leading-relaxed">
                      {apt.notes || "No clinical notes provided by patient."}
                    </p>
                  </div>

                  {/* Admin Actions */}
                  <div className="card-actions justify-stretch mt-4 pt-4 border-t border-base-300 gap-2">
                    {apt.status === "BOOKED" && (
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "CHECKED_IN")}
                        className="btn btn-info btn-sm font-black flex-1 text-[10px] uppercase"
                      >
                        Check In
                      </button>
                    )}

                    {apt.status === "CHECKED_IN" && (
                      <button
                        onClick={() =>
                          handleStatusUpdate(apt.id, "IN_PROGRESS")
                        }
                        className="btn btn-warning btn-sm font-black flex-1 text-[10px] uppercase"
                      >
                        Start Visit
                      </button>
                    )}

                    {apt.status === "IN_PROGRESS" && (
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "COMPLETED")}
                        className="btn btn-success btn-sm font-black flex-1 text-[10px] uppercase"
                      >
                        Complete
                      </button>
                    )}

                    {(apt.status === "BOOKED" ||
                      apt.status === "IN_PROGRESS") && (
                      <button
                        onClick={() => handleStatusUpdate(apt.id, "CANCELLED")}
                        disabled={updating === apt.id}
                        className="btn btn-ghost btn-outline btn-sm font-black text-[10px] uppercase hover:btn-error"
                      >
                        Cancel
                      </button>
                    )}

                    {(apt.status === "COMPLETED" ||
                      apt.status === "CANCELLED") && (
                      <button className="btn btn-disabled btn-sm font-black flex-1 text-[10px] uppercase">
                        Closed Case
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
