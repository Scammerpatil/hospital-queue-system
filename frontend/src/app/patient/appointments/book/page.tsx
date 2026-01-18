"use client";

import { useEffect, useState } from "react";
import { doctorListService } from "@/services/doctorListService";
import { appointmentService } from "@/services/appointmentService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconStethoscope,
  IconCalendarEvent,
  IconClock,
  IconNotes,
  IconCircleCheck,
  IconAlertCircle,
  IconCurrencyDollar,
  IconId,
  IconCurrencyRupee,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

interface Doctor {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  specialization: string;
  licenseNumber: string;
  bio: string;
  consultationFee: number;
  availableSlots: string;
  isAvailable: boolean;
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDoctorId, setSelectedDoctorId] = useState<number | "">("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await doctorListService.getAvailableDoctors();
        setDoctors(response);
      } catch (err: any) {
        toast.error(err.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorId || !appointmentDate || !appointmentTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await appointmentService.createAppointment({
        doctorId: Number(selectedDoctorId),
        appointmentDate,
        appointmentTime,
        notes: notes || undefined,
      });
      toast.success("Appointment Booked Successfully");
      setTimeout(() => router.push("/patient/appointments"), 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black text-base-content tracking-tight">
            Schedule a{" "}
            <span className="text-primary underline decoration-primary/20 underline-offset-8">
              Consultation
            </span>
          </h1>
          <p className="text-base-content/60 mt-3 max-w-2xl font-medium">
            Find the right specialist and secure your slot in minutes. Your
            health journey starts here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: DOCTOR GRID (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <IconStethoscope className="text-primary" />
                Select Your Specialist
              </h2>
              <span className="badge badge-outline opacity-50">
                {doctors.length} Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => {
                const isSelected = selectedDoctorId === doctor.id;
                return (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctorId(doctor.id)}
                    className={`group relative card bg-base-200 transition-all duration-300 cursor-pointer overflow-hidden border-2 
                      ${
                        isSelected
                          ? "border-primary ring-4 ring-primary/10 shadow-2xl"
                          : "border-transparent hover:border-primary/30 shadow-md"
                      }`}
                  >
                    <div className="card-body p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div
                            className={`p-3 rounded-2xl transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-content"
                                : "bg-base-100 text-base-content/50 group-hover:bg-primary/10 group-hover:text-primary"
                            }`}
                          >
                            <IconStethoscope size={28} stroke={1.5} />
                          </div>
                          <div>
                            <h3 className="font-black text-lg group-hover:text-primary transition-colors">
                              {doctor.user.name}
                            </h3>
                            <p className="text-sm font-bold opacity-60 uppercase tracking-tight">
                              {doctor.specialization}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <IconCircleCheck
                            className="text-primary animate-pulse"
                            size={24}
                          />
                        )}
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <IconId size={16} className="opacity-40" />
                          <span className="opacity-70 italic font-medium">
                            License: {doctor.licenseNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <IconCurrencyRupee
                            size={16}
                            className="text-success"
                          />
                          <span className="font-bold text-success">
                            {doctor.consultationFee}
                          </span>
                          <span className="opacity-40 text-xs text-base-content font-bold">
                            per session
                          </span>
                        </div>
                      </div>

                      <div
                        className={`mt-4 pt-4 border-t border-base-content transition-all ${
                          isSelected ? "opacity-100" : "opacity-0 h-0"
                        }`}
                      >
                        <p className="text-xs leading-relaxed font-medium opacity-60">
                          {doctor.bio ||
                            "No biography provided for this specialist."}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: BOOKING FORM (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="card bg-base-200/90 shadow-2xl border border-base-300">
              <form onSubmit={handleSubmit} className="card-body gap-6">
                <div className="flex items-center gap-2 border-b border-base-200 pb-4">
                  <IconCalendarEvent className="text-primary" />
                  <h2 className="card-title text-xl font-black">
                    Booking Details
                  </h2>
                </div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    <IconCalendarEvent size={16} /> Date of Visit
                  </legend>
                  <input
                    type="date"
                    className="input input-primary w-full font-semibold"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    <IconClock size={16} /> Preferred Time
                  </legend>
                  <input
                    type="time"
                    className="input input-primary w-full font-semibold"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    <IconNotes size={16} /> Medical Notes
                  </legend>
                  <textarea
                    className="textarea textarea-primary w-full font-medium"
                    placeholder="Describe symptoms or reasons for visit..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  ></textarea>
                </fieldset>

                {/* Selection Preview */}
                <div
                  className={`p-4 rounded-xl transition-all ${
                    selectedDoctorId
                      ? "bg-primary/5 border border-primary/20"
                      : "bg-base-200 opacity-50"
                  }`}
                >
                  <p className="text-xs font-black uppercase opacity-40 mb-1">
                    Target Specialist
                  </p>
                  <p className="text-sm font-bold truncate">
                    {selectedDoctorId
                      ? doctors.find((d) => d.id === selectedDoctorId)?.user
                          .name
                      : "No doctor selected"}
                  </p>
                </div>

                <div className="card-actions flex-col gap-3 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block shadow-lg"
                    disabled={
                      !selectedDoctorId ||
                      !appointmentDate ||
                      !appointmentTime ||
                      submitting
                    }
                  >
                    {submitting ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                  <Link
                    href="/patient/appointments"
                    className="btn btn-neutral btn-block btn-sm opacity-60"
                  >
                    Cancel & View Appointments
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
