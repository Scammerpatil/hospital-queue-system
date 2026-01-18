"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IconCalendarPlus, IconLoader, IconCheck } from "@tabler/icons-react";
import Loading from "@/components/Loading";
import { doctorService } from "@/services/doctorService";
import { appointmentService } from "@/services/appointmentService";
import { useAuth } from "@/context/AuthContext";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  consultationFee?: number;
  clinicName: string;
}

interface Clinic {
  clinicName: string;
  district: string;
  taluka: string;
  doctors: Doctor[];
  specializations: string[];
  totalDoctors: number;
}

export default function BookAppointment() {
  const router = useRouter();
  const { user } = useAuth() as any;

  // Form state
  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<"IN_PERSON" | "ONLINE">(
    "IN_PERSON"
  );
  const [notes, setNotes] = useState<string>("");

  // UI state
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch clinics on mount
  useEffect(() => {
    const loadClinics = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getClinics();
        setClinics(data || []);
      } catch (error: any) {
        console.error("Error loading clinics:", error);
        toast.error("Failed to load clinics");
      } finally {
        setLoading(false);
      }
    };

    loadClinics();
  }, []);

  // Update doctors when clinic is selected
  useEffect(() => {
    if (selectedClinic) {
      const clinic = clinics.find((c) => c.clinicName === selectedClinic);
      if (clinic) {
        setDoctors(clinic.doctors || []);
        setSelectedDoctor(null);
      }
    } else {
      setDoctors([]);
      setSelectedDoctor(null);
    }
  }, [selectedClinic, clinics]);

  // Validation
  const isStep1Valid =
    selectedClinic && selectedDoctor && appointmentDate && appointmentTime;
  const isStep2Valid = appointmentType;

  const handleSubmit = async () => {
    if (!isStep1Valid || !isStep2Valid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const bookingData = {
        doctorId: selectedDoctor.id,
        appointmentDate,
        appointmentTime,
        appointmentType,
        notes,
      };

      const response = await appointmentService.createAppointment(bookingData);

      if (response) {
        toast.success("Appointment booked successfully!");

        // Show confirmation screen
        setCurrentStep(4);

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/patient/appointments");
        }, 3000);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to book appointment";
      toast.error(errorMsg);
      console.error("Booking error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconCalendarPlus size={32} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Book an Appointment
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Quick and easy appointment booking in 3 steps
          </p>
        </div>

        {/* Steps */}
        {currentStep !== 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                      step < currentStep
                        ? "bg-green-500 text-white"
                        : step === currentStep
                        ? "bg-blue-600 text-white ring-4 ring-blue-200 dark:ring-blue-800"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {step < currentStep ? (
                      <IconCheck size={20} />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all ${
                        step < currentStep
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              <span>Select Clinic & Doctor</span>
              <span>Appointment Type</span>
              <span>Confirm</span>
            </div>
          </div>
        )}

        {/* Step 1: Select Clinic and Doctor */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            {/* Clinic Selection */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
                1. Select Clinic
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clinics.map((clinic) => (
                  <button
                    key={clinic.clinicName}
                    onClick={() => setSelectedClinic(clinic.clinicName)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedClinic === clinic.clinicName
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                        : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                    }`}
                  >
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {clinic.clinicName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {clinic.taluka}, {clinic.district}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {clinic.totalDoctors} doctors • {clinic.specializations.length} specializations
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Doctor Selection */}
            {selectedClinic && (
              <div>
                <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
                  2. Select Doctor
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedDoctor?.id === doctor.id
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                          : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
                      }`}
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {doctor.specialization}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Date and Time Selection */}
            {selectedDoctor && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-lg font-bold text-gray-900 dark:text-white mb-4">
                  3. Select Date & Time
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!isStep1Valid}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Appointment Type
            </button>
          </div>
        )}

        {/* Step 2: Appointment Type */}
        {currentStep === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Appointment Type
            </h2>

            <div className="space-y-4 mb-8">
              <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                appointmentType === "IN_PERSON"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="IN_PERSON"
                  checked={appointmentType === "IN_PERSON"}
                  onChange={(e) =>
                    setAppointmentType(e.target.value as "IN_PERSON" | "ONLINE")
                  }
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-bold text-gray-900 dark:text-white">
                    In-Person Consultation
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Visit the clinic for a face-to-face consultation
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Payment: Optional (Pay at clinic or now)
                  </p>
                </div>
              </label>

              <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                appointmentType === "ONLINE"
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-300"
              }`}>
                <input
                  type="radio"
                  name="type"
                  value="ONLINE"
                  checked={appointmentType === "ONLINE"}
                  onChange={(e) =>
                    setAppointmentType(e.target.value as "IN_PERSON" | "ONLINE")
                  }
                  className="w-4 h-4"
                />
                <div className="ml-4">
                  <p className="font-bold text-gray-900 dark:text-white">
                    Online Consultation
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Video call with the doctor
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    Payment: Mandatory (Non-refundable)
                  </p>
                </div>
              </label>
            </div>

            {/* Notes for online appointments */}
            {appointmentType === "ONLINE" && (
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  Add Notes for Doctor (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any symptoms, allergies, or concerns?"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Review Appointment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Confirm Appointment
            </h2>

            {/* Booking Summary */}
            <div className="space-y-4 mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-300">Clinic</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {selectedClinic}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-300">Doctor</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {selectedDoctor?.name}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-300">Specialization</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {selectedDoctor?.specialization}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-300">Date & Time</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {appointmentDate} at {appointmentTime}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-300">Type</span>
                <span className={`font-bold ${
                  appointmentType === "ONLINE"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}>
                  {appointmentType}
                </span>
              </div>
              {appointmentType === "ONLINE" && (
                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-gray-600 dark:text-gray-300">Payment</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    Required (Mandatory)
                  </span>
                </div>
              )}
            </div>

            {/* Notes Display */}
            {notes && appointmentType === "ONLINE" && (
              <div className="mb-8 bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Notes for Doctor:
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">{notes}</p>
              </div>
            )}

            {/* Important Notice */}
            <div className="mb-8 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 p-4 rounded-lg">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                ⚠️ Important:
              </p>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 mt-2 list-disc list-inside space-y-1">
                {appointmentType === "ONLINE" ? (
                  <>
                    <li>Payment is mandatory and non-refundable</li>
                    <li>You will receive a meeting link via email</li>
                    <li>Appointment is 30 minutes long</li>
                  </>
                ) : (
                  <>
                    <li>Please arrive 10 minutes early</li>
                    <li>Bring your ID and health insurance card if available</li>
                    <li>Payment can be made at the clinic</li>
                  </>
                )}
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <IconLoader className="animate-spin" size={20} />
                    Booking...
                  </>
                ) : (
                  "Confirm & Book"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-green-200 dark:border-green-700 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <IconCheck size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Appointment Confirmed!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your appointment has been successfully booked. You will be redirected to your appointments in a moment.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg mb-8">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-bold">Appointment Details:</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedDoctor?.name} on {appointmentDate} at {appointmentTime}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Check your email for confirmation details
              </p>
            </div>

            <button
              onClick={() => router.push("/patient/appointments")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              View All Appointments
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
