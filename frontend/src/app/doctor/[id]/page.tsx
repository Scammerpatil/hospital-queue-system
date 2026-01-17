"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import doctorService from "@/services/doctorService";
import appointmentService from "@/services/appointmentService";
import BookingForm from "@/components/BookingForm";
import QueueDisplay from "@/components/QueueDisplay";
import toast from "react-hot-toast";

export default function DoctorPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<any>(null);
  const [queue, setQueue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "queue" | "book">(
    "queue"
  );
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();

    // Set up polling for queue updates
    const startPolling = () => {
      pollingInterval.current = setInterval(() => {
        fetchQueue();
      }, 30000); // Poll every 30 seconds
    };

    startPolling();

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [doctorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      await fetchDoctor();
      await fetchQueue();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading doctor details");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctor = async () => {
    const doctorData = await doctorService.getDoctorById(parseInt(doctorId));
    setDoctor(doctorData);
    console.log("Doctor data:", doctorData);
  };

  const fetchQueue = async () => {
    const queueData = await appointmentService.getQueueSnapshot(
      parseInt(doctorId)
    );
    setQueue(queueData);
    console.log("Queue data:", queueData);
  };

  const handleBook = async (bookingData: any) => {
    setBookingLoading(true);
    try {
      const response = await appointmentService.bookAppointment(bookingData);
      toast.success(`Appointment booked! Your token: #${response.tokenNo}`);
      console.log("Booking response:", response);

      // Reset form and refresh queue
      setShowBookingForm(false);
      await fetchQueue();
      setActiveTab("queue");
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button className="btn btn-ghost mb-4" onClick={() => router.back()}>
          ← Back
        </button>

        {/* Doctor Header */}
        {doctor && (
          <div className="card bg-base-100 shadow-lg mb-8">
            <div className="card-body">
              <h1 className="card-title text-4xl mb-2">
                Dr. {doctor.fullName}
              </h1>
              <p className="text-lg text-gray-600">{doctor.specialization}</p>
              <p className="text-sm">{doctor.clinic?.name}</p>

              <div className="flex gap-4 mt-4">
                {doctor.consultationFee && (
                  <div>
                    <span className="font-semibold">Consultation Fee:</span> ₹
                    {doctor.consultationFee}
                  </div>
                )}
                <div
                  className="badge badge-lg"
                  style={{
                    backgroundColor: doctor.isArrived ? "green" : "gray",
                    color: "white",
                  }}
                >
                  {doctor.isArrived ? "Arrived" : "Not Arrived"}
                </div>
                {doctor.onlineConsultationAvailable && (
                  <div className="badge badge-lg badge-info">
                    Online Consultation Available
                  </div>
                )}
              </div>

              {doctor.bio && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm">
                    <span className="font-semibold">Bio:</span> {doctor.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs tabs-bordered mb-6">
          <button
            className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`tab ${activeTab === "queue" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("queue")}
          >
            Queue Status
          </button>
          <button
            className={`tab ${activeTab === "book" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("book")}
          >
            Book Appointment
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && doctor && (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-2xl">Doctor Details</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold">License Number:</span>{" "}
                  {doctor.licenseNumber || "N/A"}
                </div>
                <div>
                  <span className="font-semibold">Specialization:</span>{" "}
                  {doctor.specialization}
                </div>
                <div>
                  <span className="font-semibold">Clinic:</span>{" "}
                  {doctor.clinic?.name}
                </div>
                <div>
                  <span className="font-semibold">Clinic Address:</span>{" "}
                  {doctor.clinic?.address}
                </div>
                <div>
                  <span className="font-semibold">Clinic Phone:</span>{" "}
                  {doctor.clinic?.phone}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "queue" && queue && (
          <QueueDisplay
            doctorName={queue.doctorName}
            clinicName={queue.clinicName}
            totalQueue={queue.totalQueue}
            completed={queue.completed}
            inProgress={queue.inProgress}
            pending={queue.pending}
            currentTokenServing={queue.currentTokenServing}
            queue={queue.queue || []}
          />
        )}

        {activeTab === "book" && doctor && (
          <BookingForm
            doctorId={parseInt(doctorId)}
            doctorName={doctor.fullName}
            onBook={handleBook}
            isLoading={bookingLoading}
          />
        )}
      </div>
    </div>
  );
}
